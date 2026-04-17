import React from 'react'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setParsedFeedback, fetchInterviewHistory } from "../../features/interview/interviewSlice";


export default function Activity({ recentActivities }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();


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

    const handleViewDetails = (item) => {
        console.log('Viewing details for interview:', item.id);
        dispatch(setParsedFeedback(item));
        navigate(`/question-feedback`);
        window.location.href = "/question-feedback";
    };

    return (
        <div className="card border h-100">
            <div className="card-body">
                <div className="card-title mb-4">
                    <h3>Activity</h3>
                </div>
                <div className="timeline-vertical timeline-with-details">
                    {recentActivities?.map((item) => {
                        return (
                            <div className="timeline-item position-relative">
                                <div className="row g-md-3">
                                    <div className="col-12 col-md-3 d-flex justify-content-start justify-content-md-end">
                                        <div className="timeline-item-date order-1 order-md-0 me-md-3">
                                            <p className="fs-10 fw-semibold text-body-tertiary text-opacity-85 text-end">{formatDate(item.created_at)}<br className="d-none d-md-block" /> {formatTime(item.created_at)}</p>
                                        </div>
                                        <div className="timeline-item-bar position-md-relative me-3 me-md-0 text-center">
                                            <div className="icon-item icon-item-sm rounded-7 shadow-none bg-success-subtle"><svg width={10} className="svg-inline--fa fa-check fs-10 text-success-dark" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"></path></svg></div><span className="timeline-bar border-end border-dashed"></span>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="timeline-item-content ps-6 ps-md-3">
                                            {item.type != "interview" ? <> <h5 className="fs-9 lh-sm">
                                                Created a new CV for ‘{
                                                    (item?.resume?.cv_resumejson?.candidateName?.[0]?.firstName || '') +
                                                    (item?.resume?.cv_resumejson?.candidateName?.[0]?.familyName ? ' ' + item.resume.cv_resumejson.candidateName[0].familyName : '')
                                                }’
                                            </h5>
                                                <p className="fs-9"><Link className="fw-semibold" onClick={() => { window.location.href = `/cv-generate/${item?.resume?.id}` }}>View in CV Builder</Link></p>
                                                <p className="fs-9 text-body-secondary mb-5">
                                                    {item?.resume?.cv_resumejson?.headline
                                                        ? item.resume.cv_resumejson.headline.split(' ').length > 10
                                                            ? `${item.resume.cv_resumejson.headline.split(' ').slice(0, 10).join(' ')}...`
                                                            : item.resume.cv_resumejson.headline
                                                        : ''}
                                                </p>
                                            </>
                                                :
                                                <>
                                                    <h5 className="fs-9 lh-sm">Achieved a score of <span className="text-primary">{item?.interview?.evaluation?.breakdown?.total?.score}%</span> : {item?.message}</h5>
                                                    <p className="fs-9"><Link className="fw-semibold" onClick={() => { handleViewDetails(item?.interview) }}>View Feedback</Link></p>
                                                    <p className="fs-9 text-body-secondary mb-5">{item?.interview?.evaluation?.breakdown?.total?.feedback?.split(' ').length > 10 ? `${item?.interview?.evaluation?.breakdown?.total?.feedback?.split(' ').slice(0, 10).join(' ')}...` : item?.interview?.evaluation?.breakdown?.total?.feedback}</p>
                                                </>
                                            }


                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    
                </div>
            </div>
        </div>
    )
}
