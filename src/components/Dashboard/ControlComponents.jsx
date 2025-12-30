import React from 'react'
import { Link } from "react-router-dom";


export default function ControlComponents() {
    return (
        <div className="row mb-4 g-3 feature-cards" style={{translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1}}>
            <div className="col-12 col-md-6 col-xl-3">
                <div className="card border h-100 w-100 overflow-hidden position-relative">
                    <div className="card-body px-4 position-relative text-center">
                        <div className="icon-item icon-item-md rounded-1 shadow-none mx-auto" style={{backgroundColor: '#00000033'}}><svg width={20} className="svg-inline--fa fa-file-import fs-7" style={{color: '#000000'}} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-import" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M128 64c0-35.3 28.7-64 64-64L352 0l0 128c0 17.7 14.3 32 32 32l128 0 0 288c0 35.3-28.7 64-64 64l-256 0c-35.3 0-64-28.7-64-64l0-112 174.1 0-39 39c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l80-80c9.4-9.4 9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l39 39L128 288l0-224zm0 224l0 48L24 336c-13.3 0-24-10.7-24-24s10.7-24 24-24l104 0zM512 128l-128 0L384 0 512 128z"></path></svg><span className="fa-solid fa-file-import fs-7" style={{color: '#000000'}}></span></div>
                        <h4 className="my-3">Smart CV Builder</h4>
                        <p className="fs-8">Tailor your CV to any job in seconds. Just upload and optimise.</p>
                        <Link to="/cv-builder" className="stretched-link btn btn-primary w-100">Launch CV Builder</Link>
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
