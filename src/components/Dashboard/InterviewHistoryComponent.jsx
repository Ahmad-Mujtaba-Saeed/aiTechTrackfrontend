import React from 'react'
import { Link } from "react-router-dom";

export default function InterviewHistory({ interviewHistory, handleRetry, handleViewDetails }) {
    const formatDate = (value) => {
        try {
            const d = new Date(value);
            return d.toLocaleDateString(undefined, { day: '2-digit', month: 'long', year: 'numeric' });
        } catch {
            return value ?? '';
        }
    };

    const formatTime = (value) => {
        try {
            const d = new Date(value);
            return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
        } catch {
            return '';
        }
    };
    return (
        <div className="card border todo-list h-100">
            <div className="card-header border-bottom-0 pb-0">
                <div className="row justify-content-between align-items-center mb-4">
                    <div className="col-auto">
                        <h3>Interview History</h3>
                    </div>
                </div>
            </div>
            <div className="card-body py-0 scrollbar to-do-list-body">
                {interviewHistory?.map((item) => {
                    return (
                        <div key={`interview-${item.id}`} onClick={() => { handleViewDetails(item) }} className="d-flex hover-actions-trigger py-3 border-translucent border-top">
                            <div className="row justify-content-between align-items-md-center btn-reveal-trigger border-translucent gx-0 flex-1 cursor-pointer">
                                <div className="col-12">
                                    <div className="mb-1 mb-md-0 d-flex align-items-center lh-1">
                                        <label className="form-check-label mb-1 mb-md-0 mb-xl-1 mb-xxl-0 fs-8 me-2 line-clamp-1 text-body cursor-pointer fs-9"><strong>{item.question?.speech}</strong></label>

                                        {item?.status === "FAIL" ? (
                                            <span className="badge badge-phoenix ms-auto fs-10 bg-danger-subtle text-danger-dark border ">{item?.evaluation?.breakdown?.total?.score}% Fail <svg xmlns="http://www.w3.org/2000/svg" width="1.7em" height="16px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x ms-1 small"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>
                                        ) : (
                                            <span className="badge badge-phoenix ms-auto fs-10 bg-success-subtle text-success-dark border ">{item?.status}: {item?.evaluation?.breakdown?.total?.score}% <svg xmlns="http://www.w3.org/2000/svg" width="1.7em" height="16px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check ms-1 small"><polyline points="20 6 9 17 4 12"></polyline></svg></span>

                                        )}
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="d-flex lh-1 align-items-center">
                                        <p className="text-body-tertiary fs-10 mb-md-0 me-2 me-md-3 me-xl-2 me-xxl-3 mb-0">{formatDate(item.created_at)}</p>
                                        <div className="">
                                            <p className="text-body-tertiary fs-10 fw-bold mb-md-0 mb-0 ps-md-3 ps-xl-0 ps-xxl-3 border-start-md border-xl-0 border-start-xxl">{formatTime(item.created_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    );
                })}

            </div>
            <div className="card-footer border-0"></div>
        </div>
    )
}
