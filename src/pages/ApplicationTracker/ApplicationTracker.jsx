import React , {useEffect, useState} from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import BreadCrum  from "../../components/BreadCrum";
import ApplicationTracking from '../../components/ApplicationTracking'

import { useDispatch, useSelector } from "react-redux";
import { fetchAppliedJobs, updateAppliedJob, setAppliedJobs, deleteAppliedJob, JobAppliedCreate } from "../../features/job/jobSlice";


const ApplicationTracker = () => {

  const statusOptions = [
    { value: 'prep', label: 'Preparing Application' },
    { value: 'appSent', label: 'Application Sent' },
    { value: 'shortListed', label: 'Shortlisted' },
    { value: '1stInterview', label: '1st Stage Interview' },
    { value: '2ndInterview', label: '2nd Stage Interview' },
    { value: 'finalInterview', label: 'Final Interview' },
    { value: 'onHold', label: 'On Hold' },
    { value: 'OfferAcctepted', label: 'Offer Accepted' },
    { value: 'UnSuccessful', label: 'Unsuccessful' }
];


  const dispatch = useDispatch();

  const [showAddModal, setShowAddModal] = useState(false);
      const [newApplication, setNewApplication] = useState({
          title: '',
          company: '',
          location: '',
          jobUrl: '',
          status: 'prep',
          notes: ''
      });
  
      const handleInputChange = (e) => {
          const { name, value } = e.target;
          setNewApplication(prev => ({
              ...prev,
              [name]: value
          }));
      };
  
      const handleSubmit = async (e) => {
          e.preventDefault();
          try {
              const jobData = {
                  job: {
                      job_title: newApplication.title,
                      employer_name: newApplication.company,
                      job_city: newApplication.location,
                      job_apply_link: newApplication.jobUrl
                  },
                  title: newApplication.title,
                  company: newApplication.company,
                  status: newApplication.status,
                  notes: newApplication.notes
              };
              
              await dispatch(JobAppliedCreate(jobData)).unwrap();
              setShowAddModal(false);
              setNewApplication({
                  title: '',
                  company: '',
                  location: '',
                  jobUrl: '',
                  status: 'prep',
                  notes: ''
              });
              // Refresh the jobs list
              await dispatch(fetchAppliedJobs()).unwrap();
          } catch (error) {
              console.error('Failed to add job application:', error);
          }
      };
  
  return (
    <>
      <MasterLayout>

        <BreadCrum title='Application Tracker' subTitle='Track your progress, stay organised, and see where you can improve.' />
        {showAddModal && (
                    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add New Job Application</h5>
                                    <button 
                                        type="button" 
                                        className="btn-close" 
                                        onClick={() => setShowAddModal(false)}
                                    ></button>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label">Job Title *</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                name="title"
                                                value={newApplication.title}
                                                onChange={handleInputChange}
                                                required 
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Company *</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                name="company"
                                                value={newApplication.company}
                                                onChange={handleInputChange}
                                                required 
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Location</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                name="location"
                                                value={newApplication.location}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Job URL</label>
                                            <input 
                                                type="url" 
                                                className="form-control" 
                                                name="jobUrl"
                                                value={newApplication.jobUrl}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Status</label>
                                            <select 
                                                className="form-select" 
                                                name="status"
                                                value={newApplication.status}
                                                onChange={handleInputChange}
                                            >
                                                {statusOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Notes</label>
                                            <textarea 
                                                className="form-control" 
                                                rows="3"
                                                name="notes"
                                                value={newApplication.notes}
                                                onChange={handleInputChange}
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary" 
                                            onClick={() => setShowAddModal(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            Save Application
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
              <div className="card-header d-flex justify-content-between align-items-center pb-0 mb-3">
                <h5 className="mb-0">Application Tracking</h5>
                <button 
                    className="btn btn-primary"
                    onClick={() => setShowAddModal(true)}
                >
                    + Add New Application
                </button>
            </div>
        <ApplicationTracking />
      </MasterLayout>
    </>
  );
};

export default ApplicationTracker;
