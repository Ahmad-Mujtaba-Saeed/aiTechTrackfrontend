import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  getrecentCvsCreated,
  updateResumeName,
  delCreatedCv
} from '../../../features/resume/resumeSlice';
import RecentCVsTable from '../../../components/CvBuilder/RecentCVsTable';
import { Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import PaymentAnalyticsGraph from './PaymentAnalyticsGraph';
import RecentSubscriptionsTable from './RecentSubscriptionsTable';
import RecentActivitiesPlatform from './RecentActivitiesPlatform';
import { hasPermission } from '../../../utils/permissions';
import Dropdown from 'react-bootstrap/Dropdown';

export default function ControlComponents() {
    console.log("ControlComponents rendered");
  const dispatch = useDispatch();
  const { recentCVs, delResumeLoader } = useSelector((state) => state.resume);
  const { data } = useSelector((state) => state.user);

  const hasSystemInternalPermission = () => hasPermission(data, 'view-dashboard');
  // Initialize component
  useEffect(() => {
    dispatch(getrecentCvsCreated());
  }, [dispatch]);


  const handleRenameCv = async (resumeId, title) => {
    const newName = prompt('Enter new name for CV:', title);
    if (newName && newName.trim() && newName !== title) {
      try {
        const updateResult = await dispatch(updateResumeName({ id: resumeId, name: newName })).unwrap();
        console.log(updateResult);
        if (updateResult?.data) {
          dispatch(getrecentCvsCreated({}));
          toast.success('CV renamed successfully');
        }
      } catch (error) {
        toast.error(error.message || 'Failed to rename CV');
      }
    }
  };

  // Delete CV handler
  const handleDeleteCv = (resumeId) => {
    dispatch(delCreatedCv(resumeId))
      .unwrap()
      .then(() => {
        toast.success('CV deleted successfully');
        dispatch(getrecentCvsCreated());
      })
      .catch((error) => {
        toast.error(error.message || 'Failed to delete CV');
      });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default items per page


  useEffect(() => {
    dispatch(getrecentCvsCreated({ page: currentPage, perPage: itemsPerPage }));
  }, [dispatch, currentPage, itemsPerPage]);

const hasRecentCVs =
  Array.isArray(recentCVs?.data) && recentCVs.data.length > 0;

const showNoData =
  !hasRecentCVs && !hasSystemInternalPermission();
  
  return (
    <div className="row mb-4 g-3 feature-cards" style={{ translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>

  {showNoData && (
    <div className="col-12">
      <Card>
        <Card.Body className="text-center py-5">
           <Icon
                                                              icon="tabler:receipt-off"
                                                              width={48}
                                                              height={48}
                                                              className="text-muted mb-2"
                                                          />
          <h4 className="text-muted">No data found.</h4>
        </Card.Body>
      </Card>
    </div>
  )}

      {Array.isArray(recentCVs?.data) && recentCVs?.data?.length > 0 && (

        <>
          {recentCVs?.data?.length > 0 ? (
            < div className="col-12">
              <Card className="h-100 w-100 position-relative z-index-99 recent-cvs-card">
                <Card.Body className="position-relative p-0 pb-3">
                  <div className="d-flex justify-content-between align-items-center p-4">
                    <h5 className="mb-0">Recent CVs</h5>

                  </div>

                  <RecentCVsTable
                    data={recentCVs.data}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    lastPage={recentCVs.last_page}
                    delResumeLoader={delResumeLoader}
                    handleRenameCv={handleRenameCv}
                    handleDeleteCv={handleDeleteCv}
                    compact={true}
                  />
                </Card.Body>
              </Card>
            </div>
          ) : null}
        </>
      )}


      {hasSystemInternalPermission() && (
        <>
          <div className="col-12 col-xl-6">
            <PaymentAnalyticsGraph />
          </div>

          <div className="col-12 col-xl-6">
            <RecentSubscriptionsTable />
          </div>
          {/* Recent Activities Dropdown */}
          <div className="col-12 d-flex justify-content-center align-items-center">
            <div className="position-relative">
              <Dropdown drop="up" className="col-12 col-md-6 col-lg-12">
                <Dropdown.Toggle variant="primary" className="w-100">
                  <Icon icon="mdi:history" className="me-2" />
                  Recent Activities
                   </Dropdown.Toggle>
                <Dropdown.Menu className="w-100 p-0" style={{ overflow: 'auto' }}>
                  <div className="p-0">
                    <RecentActivitiesPlatform />
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
