import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllCompletedSteps } from "../../features/user/userSlice";

export default function GettingStarted({completedSteps}) {


  // Step configuration (map API keys to labels)
  const steps = [
    { key: "sign_up", label: "Signed up to the MyPathfinder platform" },
    { key: "first_cv", label: "Created your first CV using our smart builder" },
    { key: "first_interview", label: "Practised your first interview using our simulator" },
    { key: "applied_job", label: "Applied for a vacancy using our smart job search" },
    { key: "progress_tracker", label: "Used our in-built application progress tracker" },
  ];

  const navigate = useNavigate();


  const manageRedirect = (step) => {
    if(step?.key == "first_cv"){
        navigate("/cv-builder");
    }else if(step?.key == "first_interview"){
        navigate("/interview");
    }else if(step?.key == "progress_tracker"){
        navigate('/application-tracker')
    }else if(step?.key == "applied_job"){
        navigate('/job-search')
    }
  }


  const renderBadge = (isComplete ,step) => {
    if (isComplete) {
      return (
        <span className="badge badge-phoenix ms-auto fs-10 bg-success-subtle text-success-dark border">
          COMPLETE
          <svg xmlns="http://www.w3.org/2000/svg" width="1.7em" height="16px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check ms-1 small">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </span>
      );
    }
    return (
      <span
        className="badge badge-phoenix ms-auto fs-10 bg-secondary-subtle text-secondary-dark border cursor-pointer"
        // onClick={() => manageRedirect(step)} // you can link to step-specific routes
      >
        TAKE ME THERE
        <svg xmlns="http://www.w3.org/2000/svg" width="1.7em" height="16px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right ms-1 small">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </span>
    );
  };

  return (
    <div className="card border todo-list h-100 overflow-hidden">
      <div className="card-header border-bottom-0 pb-0 pt-5">
        <div className="row justify-content-between align-items-center mb-4">
          <div className="col-auto">
            <h3>Getting Started</h3>
          </div>
        </div>
      </div>
      <div className="card-body py-0 scrollbar to-do-list-body">
        {steps.map((step, index) => {
          const isComplete = completedSteps?.[step.key];
          return (
            <div key={step.key} className="d-flex py-3 border-translucent border-top cursor-pointer" onClick={() => manageRedirect(step)}>
              <div className="row justify-content-between align-items-md-center btn-reveal-trigger border-translucent gx-0 flex-1">
                <div className="col-12 col-md-auto col-xl-12 col-xxl-auto">
                  <div className="mb-1 mb-md-0 d-flex align-items-center lh-1">
                    <p className="form-check-label mb-1 mb-md-0 mb-xl-1 mb-xxl-0 fs-8 me-2 text-body cursor-pointer fs-7">
                      {isComplete ? <del><strong>Step {index + 1}:</strong> {step.label}</del> : <><strong>Step {index + 1}:</strong> {step.label}</>}
                    </p>
                  </div>
                </div>
                <div className="col-12 col-md-auto col-xl-12 col-xxl-auto">
                  <div className="d-flex lh-1 align-items-center">
                    {renderBadge(isComplete,step)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
