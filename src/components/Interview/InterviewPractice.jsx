import React from 'react'
import { Link } from "react-router-dom";
import { setFilters } from '../../features/interview/interviewSlice';

export default function InterviewPractice({interviewQuestions , setShowModal , filters , dispatch ,getRandomQuestionsInterview}) {

    const cards = [
        {
            title: "Tell me about yourself",
            description: "Master the art of introduction",
            category: "General",
            time: "5 minutes",
            path: "/prepration",
        },
        {
            title: "What are your strengths and weaknesses?",
            description: "Show self-awareness with balance",
            category: "General",
            time: "5 minutes",
            path: "/prepration",
        },
        {
            title: "Why do you want to work here?",
            description: "Align your goals with the company",
            category: "General",
            time: "5 minutes",
            path: "/prepration",
        },
        {
            title: "Why do you want to work here?",
            description: "Align your goals with the company",
            category: "General",
            time: "5 minutes",
            path: "/prepration",
        },
        {
            title: "Tell me about yourself",
            description: "Master the art of introduction",
            category: "General",
            time: "5 minutes",
            path: "/prepration",
        },
        {
            title: "What are your strengths and weaknesses?",
            description: "Show self-awareness with balance",
            category: "General",
            time: "5 minutes",
            path: "/prepration",
        },
    ];


    return (
        <>
            <div className="row g-3 justify-content-between mb-2">
                <div className="col-12">
                    <div className="d-md-flex justify-content-between">
                        <div className="mb-3">
                            <button className="btn btn-primary me-4" onClick={getRandomQuestionsInterview}>
                                <svg width={13} className="svg-inline--fa fa-shuffle me-2" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="shuffle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M403.8 34.4c12-5 25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6l0-32-32 0c-10.1 0-19.6 4.7-25.6 12.8L284 229.3 244 176l31.2-41.6C293.3 110.2 321.8 96 352 96l32 0 0-32c0-12.9 7.8-24.6 19.8-29.6zM164 282.7L204 336l-31.2 41.6C154.7 401.8 126.2 416 96 416l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c10.1 0 19.6-4.7 25.6-12.8L164 282.7zm274.6 188c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6l0-32-32 0c-30.2 0-58.7-14.2-76.8-38.4L121.6 172.8c-6-8.1-15.5-12.8-25.6-12.8l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c30.2 0 58.7 14.2 76.8 38.4L326.4 339.2c6 8.1 15.5 12.8 25.6 12.8l32 0 0-32c0-12.9 7.8-24.6 19.8-29.6s25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64z"></path></svg>
                                Practise random question
                            </button>
                            {/* <button className="btn btn-link text-body px-0">
                                <svg width={16} className="svg-inline--fa fa-file-export fs-9 me-2" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-export" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 128-168 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l168 0 0 112c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zM384 336l0-48 110.1 0-39-39c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l80 80c9.4 9.4 9.4 24.6 0 33.9l-80 80c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l39-39L384 336zm0-208l-128 0L256 0 384 128z"></path></svg>
                                Tailor to specific vacancy
                            </button> */}
                        </div>
                        <div className="d-flex mb-3">
                            <div className="search-box me-2">
                                <form className="position-relative">
                                    <input className="form-control search-input search" type="text" placeholder="Search by name"
                                        onChange={(e) => dispatch(setFilters({ ...filters, ["searchQuery"]: e.target.value }))}
                                        aria-label="Search" />
                                    <svg width={13} className="svg-inline--fa fa-magnifying-glass search-box-icon" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="magnifying-glass" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path></svg>
                                </form>
                            </div>
                            <button  onClick={() => setShowModal(true)} className="btn px-3 btn-phoenix-secondary" type="button" aria-haspopup="true" aria-expanded="false"
                                data-bs-reference="parent">
                                <svg width={13} height={16} className="svg-inline--fa fa-filter" data-fa-transform="down-3" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="filter" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="" style={{transformOrigin: '0.5em 0.6875em'}}><g transform="translate(256 256)"><g transform="translate(0, 96)  scale(1, 1)  rotate(0 0 0)"><path fill="currentColor" d="M3.9 54.9C10.5 40.9 24.5 32 40 32l432 0c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9 320 448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6l0-79.1L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z" transform="translate(-256 -256)"></path></g></g></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row g-3 list feature-cards">
                {interviewQuestions?.map((question, index) => (
                    <div className="col-12 col-md-6 col-xl-4" key={index}>
                        <div className="card h-100">
                            <div className="card-body">
                                <div className="border-bottom border-translucent">
                                    <div className="d-flex align-items-start mb-1">
                                        <div className="d-sm-flex align-items-center">
                                            <Link
                                                className="fw-bold fs-8 lh-sm title line-clamp-1"
                                                to={`/prepration/${question?.id}`}
                                                title={question?.title}
                                            >
                                            {question?.title}
                                            </Link>
                                        </div>
                                    </div>
                                    <p className="fs-9 fw-semibold text-body text mb-4">
                                        {question?.speech}
                                    </p>
                                </div>
                                <div className="row g-1 g-sm-3 mt-2 lh-1">
                                    <div className="col-12 col-sm-auto flex-1 text-truncate">
                                        <Link className="fw-semibold fs-9" to={`/prepration/${question?.id}`}>
                                            Practise Now
                                            <span className="fa-solid fa-arrow-right ms-2"></span>
                                        </Link>
                                    </div>
                                    {/* <div className="col-12 col-sm-auto">
                                        <div className="d-flex align-items-center">
                                            <svg width={13} xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-grid me-2" strokeWidth={2}><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                                            <p className="mb-0 fs-9 fw-semibold text-body-tertiary reports">
                                                {question.category}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-auto">
                                        <div className="d-flex align-items-center">
                                            <svg width={13} xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-clock me-2" strokeWidth={2}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                            <p className="mb-0 fs-9 fw-semibold text-body-tertiary date">
                                                {question.time}
                                            </p>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
