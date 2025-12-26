import React from 'react'
import { Link } from "react-router-dom";


export default function ControlComponents() {
    return (
        <div className="row mb-4 g-3 feature-cards" style={{translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1}}>
            <div className="col-12 col-md-6 col-xl-3">
                <div className="card border h-100 w-100 overflow-hidden position-relative">
                    <div className="card-body px-4 position-relative text-center">
                        <div className="icon-item icon-item-md rounded-1 shadow-none mx-auto" style={{backgroundColor: '#ece5fc'}}><svg width={20} className="svg-inline--fa fa-file-import fs-7" style={{color: '#BA67EF'}} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-import" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M128 64c0-35.3 28.7-64 64-64L352 0l0 128c0 17.7 14.3 32 32 32l128 0 0 288c0 35.3-28.7 64-64 64l-256 0c-35.3 0-64-28.7-64-64l0-112 174.1 0-39 39c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l80-80c9.4-9.4 9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l39 39L128 288l0-224zm0 224l0 48L24 336c-13.3 0-24-10.7-24-24s10.7-24 24-24l104 0zM512 128l-128 0L384 0 512 128z"></path></svg><span className="fa-solid fa-file-import fs-7" style={{color: '#BA67EF'}}></span></div>
                        <h4 className="my-3">Smart CV Builder</h4>
                        <p className="fs-8">Tailor your CV to any job in seconds. Just upload and optimise.</p>
                        <Link to="/cv-builder" className="stretched-link btn btn-primary w-100">Launch CV Builder</Link>
                    </div>
                </div>
            </div>
            <div className="col-12 col-md-6 col-xl-3">
                <div className="card border h-100 w-100 overflow-hidden position-relative">
                    <div className="card-body px-4 position-relative text-center">
                        <div className="icon-item icon-item-md rounded-1 shadow-none mx-auto" style={{backgroundColor: '#ece5fc'}}><svg width={20} className="svg-inline--fa fa-video fs-7" style={{color: '#BA67EF'}} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="video" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M0 128C0 92.7 28.7 64 64 64l256 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2l0 256c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1l0-17.1 0-128 0-17.1 14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"></path></svg> <span className="fa-solid fa-video fs-7" style={{color: '#BA67EF'}}></span></div>
                        <h4 className="my-3">Interview Simulator</h4>
                        <p className="fs-8">Practise with industry specific questions and real time feedback.</p>
                        <Link className="stretched-link btn btn-primary w-100" to="/interview">Practise an Interview</Link>
                    </div>
                </div>
            </div>
            <div className="col-12 col-md-6 col-xl-3">
                <div className="card border h-100 w-100 overflow-hidden position-relative">
                    <div className="card-body px-4 position-relative text-center">
                        <div className="icon-item icon-item-md rounded-1 shadow-none mx-auto" style={{backgroundColor: '#ece5fc'}}><svg width={20} className="svg-inline--fa fa-magnifying-glass fs-7" style={{color: '#BA67EF'}} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="magnifying-glass" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path></svg> <span className="fa-solid fa-search fs-7" style={{color: '#BA67EF'}}></span></div>
                        <h4 className="my-3">Job Search</h4>
                        <p className="fs-8">Find roles that align with your experience, strengths and goals.</p>
                        <Link className="stretched-link btn btn-primary w-100" to="/job-search">Browse Vacancies</Link>
                    </div>
                </div>
            </div>
            <div className="col-12 col-md-6 col-xl-3">
                <div className="card border h-100 w-100 overflow-hidden position-relative">
                    <div className="card-body px-4 position-relative text-center">
                        <div className="icon-item icon-item-md rounded-1 shadow-none mx-auto" style={{backgroundColor: '#ece5fc'}}><svg width={20} className="svg-inline--fa fa-chart-column fs-7" style={{color: '#BA67EF'}} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chart-column" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M32 32c17.7 0 32 14.3 32 32l0 336c0 8.8 7.2 16 16 16l400 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L80 480c-44.2 0-80-35.8-80-80L0 64C0 46.3 14.3 32 32 32zM160 224c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32zm128-64l0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160c0-17.7 14.3-32 32-32s32 14.3 32 32zm64 32c17.7 0 32 14.3 32 32l0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-96c0-17.7 14.3-32 32-32zM480 96l0 224c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-224c0-17.7 14.3-32 32-32s32 14.3 32 32z"></path></svg> <span className="fa-solid fa-chart-column fs-7" style={{color: '#BA67EF'}}></span> </div>
                        <h4 className="my-3">Progress Tracker</h4>
                        <p className="fs-8">Track your progress, stay organised, and see where you can improve.</p>
                        <Link className="stretched-link btn btn-primary w-100" to="/application-tracker">View Progress Tracker</Link>
                    </div>
                </div>
            </div>





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
