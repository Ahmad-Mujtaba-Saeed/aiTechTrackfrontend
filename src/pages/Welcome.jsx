import React from 'react'
import { Link } from "react-router-dom";


import logo from '../assets/images/logo.png'

export default function Welcome() {
    return (
        <main className="main min-vh-100 d-flex pt-3 pt-lg-10 " id="top">
            <div className="container-lg position-relative py-6 py-md-8" data-bs-theme="light">
                <div className="row gy-3 mb-4 justify-content-between">
                    <div className="col-md-12 col-auto pb-3">
                        <div className="d-flex flex-center text-decoration-none mb-4">
                            <img src={logo} alt="CV Builder" width="200" />
                        </div>
                        <div className="card-body position-relative  ">
                            <h1 className="mb-2 fw-semibold text-center">Where do you want to start?</h1>
                            <h3 className="fs-7 fw-normal lh-lg text-center">
                                CV Builder curates job opportunities that match your profile, allowing you to apply
                                quickly and efficiently.
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="row mb-3 g-3 feature-cards justify-content-center">

                    <div className="col-12 col-xl-4">
                        <div className="card h-100 w-100 overflow-hidden position-relative card">
                            <div className="card-body px-3 position-relative card-body">
                                <div className="icon-item icon-item-md rounded-1 shadow-none">
                                   <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-notes"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 5a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2l0 -14" /><path d="M9 7l6 0" /><path d="M9 11l6 0" /><path d="M9 15l4 0" /></svg>
                                </div>
                                <h4 className="my-3">Smart CV Builder</h4>
                                <p className="fs-8">Tailor your CV to any job in seconds. Just upload and optimise.</p>
                                <div class="d-flex justify-content-end">
                                    <Link to="/cv-builder" className="stretched-link btn btn-primary">Get Started</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-xl-4">
                        <div className="card h-100 w-100 overflow-hidden position-relative card">
                            <div className="card-body px-3 position-relative card-body">
                                <div className="icon-item icon-item-md rounded-1 shadow-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-brand-tabler"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 9l3 3l-3 3" /><path d="M13 15h3" /><path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4l0 -10" /></svg>
                                </div>
                                <h3 className="my-3">Skip to Dashboard</h3>
                                <p className="fs-8">
                                    Head over to your personal dashboard and explore. The opportunities are endless!
                                </p>
                                <div class="d-flex justify-content-end">
                                    <Link className="stretched-link btn btn-primary" to="/">Get Started</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    )
}
