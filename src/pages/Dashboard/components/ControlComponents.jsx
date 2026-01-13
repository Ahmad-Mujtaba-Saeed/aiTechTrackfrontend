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
import { hasPermission } from '../../../utils/permissions';

export default function ControlComponents() {
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

  // Add these states at the top of your component
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default items per page

  // Update your useEffect that fetches the data
  useEffect(() => {
    dispatch(getrecentCvsCreated({ page: currentPage, perPage: itemsPerPage }));
  }, [dispatch, currentPage, itemsPerPage]);


  return (
    <div className="row mb-4 g-3 feature-cards" style={{ translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>

      {Array.isArray(recentCVs?.data) && recentCVs?.data?.length > 0 && (

        <>
          {/* Recent CVs Section */}
          {recentCVs?.data?.length > 0 ? (
            < div className="col-12">
              <Card className="h-100 w-100 position-relative z-index-99">
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
        </>
      )}

      {/* <div className="col-12 col-xl-4">
                <div className="card border h-100 w-100 overflow-hidden">
                    <div className="bg-holder d-block bg-card" style={{backgroundImage: 'url(../assets/img/spot-illustrations/32.png)', backgroundPosition: 'top right'}}>
                    </div>
                    <div className="card-body px-4 position-relative">
                        <h4 className="mb-4">AI-Based Interview Coaching Sessions and Feedback Tools.</h4>
                        <p className="text-body-tertiary fw-semibold">When it’s time to prep for interviews, our AI-powered coach gives you real-time feedback, helping you nail every question like a pro.</p>
                        <Button className="btn btn-primary w-100" type="submit">Practise for an Interview</Button>
                    </div>
                </div>
            </div>
            <div className="col-12 col-xl-4">
                <div className="card border h-100 w-100 overflow-hidden">
                    <div className="bg-holder d-block bg-card" style={{backgroundImage: 'url(../assets/img/spot-illustrations/32.png)', backgroundPosition: 'top right'}}>
                    </div>
                    <div className="card-body px-4 position-relative">
                        <h4 className="mb-4">AI-Based Interview Coaching Sessions and Feedback Tools.</h4>
                        <p className="text-body-tertiary fw-semibold">When it’s time to prep for interviews, our AI-powered coach gives you real-time feedback, helping you nail every question like a pro.</p>
                        <Button className="btn btn-primary w-100" type="submit">Search for a job</Button>
                    </div>
                </div>
            </div> */}
    </div>
  )
}
