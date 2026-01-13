import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  getrecentCvsCreated,
  updateResumeName,
  delCreatedCv
} from '../../features/resume/resumeSlice';
import RecentCVsTable from '../CvBuilder/RecentCVsTable';
import { Card } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function ControlComponents() {
  const dispatch = useDispatch();
  const { recentCVs, delResumeLoader } = useSelector((state) => state.resume);
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
      <div className="col-12 col-md-6 col-xl-3">
        <div className="card h-100 w-100 overflow-hidden position-relative">
          <div className="card-body px-4 position-relative">
            <div className="icon-item icon-item-md rounded-1 shadow-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-library"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 5.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666" /><path d="M4.012 7.26a2.005 2.005 0 0 0 -1.012 1.737v10c0 1.1 .9 2 2 2h10c.75 0 1.158 -.385 1.5 -1" /><path d="M11 7h5" /><path d="M11 10h6" /><path d="M11 13h3" /></svg>
            </div>
            <h3 className="my-3">Smart CV Builder</h3>
            <p className="fs-8">Tailor your CV to any job in seconds. Just upload and optimise.</p>
            <div className="d-flex w-100 justify-content-end">
              <Link to="/cv-builder" className="btn btn-primary">
                Launch CV Builder
              </Link>
            </div>
          </div>
        </div>
      </div>

      {Array.isArray(recentCVs?.data) && recentCVs?.data?.length > 0 && (

        <>
          {/* Recent CVs Section */}
          {recentCVs?.data?.length > 0 ? (
            < div className="col-12 col-xl-6">
              <Card className="border h-100 w-100 position-relative">
                <Card.Body className="position-relative">
                  <div className="d-flex justify-content-between align-items-center mb-3">
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
