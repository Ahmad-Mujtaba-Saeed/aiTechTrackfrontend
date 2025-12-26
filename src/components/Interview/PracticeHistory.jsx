import React from 'react'
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function PracticeHistory({history , handleViewDetails}) {

    // const questions = [
    //     {
    //         title: "Tell me about yourself",
    //         description: "Master the art of introduction",
    //         yourScore: 20,
    //         avgScore: 75,
    //         yourColor: "red",
    //         avgColor: "green",
    //         path: "/prepration",
    //     },
    //     {
    //         title: "What are your strengths and weaknesses",
    //         description: "Show self-awareness and balance",
    //         yourScore: 56,
    //         avgScore: 61,
    //         yourColor: "orange",
    //         avgColor: "orange",
    //         path: "/prepration",
    //     },
    //     {
    //         title: "Why do you want to work here?",
    //         description: "Align your goals with the company",
    //         yourScore: 87,
    //         avgScore: 75,
    //         yourColor: "green",
    //         avgColor: "green",
    //         path: "/prepration",
    //     },
    // ];


    return (
        <>
            <div className="row g-3 justify-content-between mt-4">
                <div className="col-12">
                    <div className="d-md-flex justify-content-between">
                        <div className="mb-3">
                            <h3>Practise History</h3>
                        </div>
                        <div className="d-flex mb-3">
                            <div className="search-box me-2">
                                <form className="position-relative">
                                    <input className="form-control search-input search" type="search" placeholder="Search by name"
                                        aria-label="Search" />
                                    <svg width={13} className="svg-inline--fa fa-magnifying-glass search-box-icon" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="magnifying-glass" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path></svg>

                                </form>
                            </div>
                            <button className="btn px-3 btn-phoenix-secondary" type="button" aria-haspopup="true" aria-expanded="false"
                                data-bs-reference="parent">
                                <svg width={13} height={16} className="svg-inline--fa fa-filter" data-fa-transform="down-3" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="filter" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="" style={{ transformOrigin: '0.5em 0.6875em' }}><g transform="translate(256 256)"><g transform="translate(0, 96)  scale(1, 1)  rotate(0 0 0)"><path fill="currentColor" d="M3.9 54.9C10.5 40.9 24.5 32 40 32l432 0c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9 320 448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6l0-79.1L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z" transform="translate(-256 -256)"></path></g></g></svg>
                            </button>

                        </div>
                    </div>
                </div>
            </div>
            <div className="row g-3 list feature-cards mb-4">
                {history?.map((q, index) => (
                    <div className="col-12 col-xl-4" key={index}>
                        <div className="card h-100">
                            <div className="card-body">
                                <div className="border-bottom border-translucent">
                                    <div className="d-flex align-items-start mb-1">
                                        <div className="d-sm-flex align-items-center">
                                            <a
                                                className="fw-bold fs-8 lh-sm title line-clamp-1"
                                                onClick={() => handleViewDetails(q)}
                                                title={q?.question?.title}
                                            >
                                                {q?.question?.title}
                                            </a>
                                        </div>
                                    </div>
                                    {/* <p className="fs-9 fw-semibold text-body text mb-4">
                                        {q.question?.description}
                                    </p> */}
                                </div>

                                <div className="row g-1 g-sm-3 mt-2 lh-1">
                                    {/* Your Score */}
                                    <div className="col-12 col-sm-auto flex-1 text-truncate hover-card"
                                    onClick={() => handleViewDetails(q)}
                                    title='view feedback'
                                    >
                                        <h6>Your Score</h6>
                                        <div className="d-flex align-items-center gap-1">
                                            <div style={{ "--phoenix-circle-progress-bar": q?.evaluation?.breakdown?.total?.score }}>
                                                <svg
                                                    className="circle-progress-svg"
                                                    width="38"
                                                    height="38"
                                                    viewBox="0 0 125 125"
                                                >
                                                    <circle
                                                        className="progress-bar-rail"
                                                        cx="65"
                                                        cy="45"
                                                        r="54"
                                                        fill="none"
                                                        strokeLinecap="round"
                                                        strokeWidth="15"
                                                    ></circle>
                                                    <circle
                                                        className="progress-bar-top"
                                                        cx="65"
                                                        cy="45"
                                                        r="54"
                                                        fill="none"
                                                        strokeLinecap="round"
                                                        stroke={q?.evaluation?.breakdown?.total?.score <= 20 ? "red" : q?.evaluation?.breakdown?.total?.score <= 60 ? "orange" : "green"}
                                                        strokeWidth="12"
                                                    ></circle>
                                                </svg>
                                            </div>
                                            <h6 className="mb-0 text-body">{q?.evaluation?.breakdown?.total?.score}%</h6>
                                        </div>
                                    </div>


                                    <div className="col-12 col-sm-auto flex-1 text-truncate hover-card"
                                    onClick={() => handleViewDetails(q?.min_history[0])}
                                    title='view feedback'
                                    >
                                        <h6>Worst Score</h6>
                                        <div className="d-flex align-items-center gap-1">
                                            <div style={{ "--phoenix-circle-progress-bar": q?.min_score }}>
                                                <svg
                                                    className="circle-progress-svg"
                                                    width="38"
                                                    height="38"
                                                    viewBox="0 0 125 125"
                                                >
                                                    <circle
                                                        className="progress-bar-rail"
                                                        cx="65"
                                                        cy="45"
                                                        r="54"
                                                        fill="none"
                                                        strokeLinecap="round"
                                                        strokeWidth="15"
                                                    ></circle>
                                                    <circle
                                                        className="progress-bar-top"
                                                        cx="65"
                                                        cy="45"
                                                        r="54"
                                                        fill="none"
                                                        strokeLinecap="round"
                                                        stroke={q?.min_score <= 20 ? "red" : q?.min_score <= 60 ? "orange" : "green"}
                                                        strokeWidth="12"
                                                    ></circle>
                                                </svg>
                                            </div>
                                            <h6 className="mb-0 text-body">{q?.min_score}%</h6>
                                        </div>
                                    </div>


                                    <div className="col-12 col-sm-auto flex-1 text-truncate hover-card"
                                    onClick={() => handleViewDetails(q?.max_history[0])}
                                    title='view feedback'
                                    >
                                        <h6>Best Score</h6>
                                        <div className="d-flex align-items-center gap-1">
                                            <div style={{ "--phoenix-circle-progress-bar": q?.max_score }}>
                                                <svg
                                                    className="circle-progress-svg"
                                                    width="38"
                                                    height="38"
                                                    viewBox="0 0 125 125"
                                                >
                                                    <circle
                                                        className="progress-bar-rail"
                                                        cx="65"
                                                        cy="45"
                                                        r="54"
                                                        fill="none"
                                                        strokeLinecap="round"
                                                        strokeWidth="15"
                                                    ></circle>
                                                    <circle
                                                        className="progress-bar-top"
                                                        cx="65"
                                                        cy="45"
                                                        r="54"
                                                        fill="none"
                                                        strokeLinecap="round"
                                                        stroke={q?.max_score <= 20 ? "red" : q?.max_score <= 60 ? "orange" : "green"}
                                                        strokeWidth="12"
                                                    ></circle>
                                                </svg>
                                            </div>
                                            <h6 className="mb-0 text-body">{q?.max_score}%</h6>
                                        </div>
                                    </div>

                                    {/* Average Score */}
                                    {/* <div className="col-12 col-sm-auto flex-1 text-truncate">
                                        <h6>Average User Score</h6>
                                        <div className="d-flex align-items-center gap-1">
                                            <div style={{ "--phoenix-circle-progress-bar": q.latest_avg_score }}>
                                                <svg
                                                    className="circle-progress-svg"
                                                    width="38"
                                                    height="38"
                                                    viewBox="0 0 125 125"
                                                >
                                                    <circle
                                                        className="progress-bar-rail"
                                                        cx="65"
                                                        cy="45"
                                                        r="54"
                                                        fill="none"
                                                        strokeLinecap="round"
                                                        strokeWidth="15"
                                                    ></circle>
                                                    <circle
                                                        className="progress-bar-top"
                                                        cx="65"
                                                        cy="45"
                                                        r="54"
                                                        fill="none"
                                                        strokeLinecap="round"
                                                        stroke={q.latest_avg_score <= 20 ? "red" : q.latest_avg_score <= 60 ? "orange" : "green"}
                                                        strokeWidth="12"
                                                    ></circle>
                                                </svg>
                                            </div>
                                            <h6 className="mb-0 text-body">{q.latest_avg_score}%</h6>
                                        </div>
                                    </div> */}

                                    {/* Retry Button */}
                                    <div className="col-12 col-sm-auto">
                                        <Link className="fw-semibold fs-9" to={`/prepration/${q?.question?.id}`}>
                                            Retry Question
                                            <span className="fa-solid fa-arrow-right ms-2"></span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
