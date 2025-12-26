import React from 'react'
import { Link } from "react-router-dom";


import logo from '../../assets/images/MPF-logo.svg'

export default function F2Verification() {
    return (
        <main className="main" id="top">
            <div className="container-fluid bg-body-tertiary dark__bg-gray-1200">
                <div className="bg-holder bg-auth-card-overlay auth-bg-image"></div>
                <div className="row flex-center position-relative min-vh-100 g-0">
                    <div className="col-12 col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-4">
                        <div className="card border border-translucent">
                            <div className="card-body pb-6">
                                <div className="auth-form-box">
                                    <div className="text-center">
                                        <form id="otpForm" className="verification-form" noValidate>
                                            <div className="d-flex flex-center text-decoration-none mb-4">
                                                <img src={logo} alt="MyPathfinder logo" width="200" />
                                            </div>

                                            <h4 className="text-body-highlight">Enter the verification code</h4>
                                            <p>
                                                We sent a 6-digit code via SMS to
                                                <span className="visually-hidden">ending in 556</span>
                                                <span aria-hidden="true">
                                                    <span className="mask-dots">00000000</span><span className="last">123</span>
                                                </span>
                                            </p>


                                            <fieldset className="border-0 p-0 m-0" aria-describedby="otpHelp" role="group">
                                                <legend className="visually-hidden">Your one-time verification code</legend>
                                                <div className="otp-group mb-2">
                                                    <input
                                                        className="form-control otp-input"
                                                        name="otp[]"
                                                        aria-label="Digit 1"
                                                        type="text"
                                                        inputMode="numeric"
                                                        pattern="[0-9]*"
                                                        maxLength="1"
                                                        autoComplete="one-time-code" />
                                                    <input
                                                        className="form-control otp-input"
                                                        name="otp[]"
                                                        aria-label="Digit 2"
                                                        type="text"
                                                        inputMode="numeric"
                                                        pattern="[0-9]*"
                                                        maxLength="1" />
                                                    <input
                                                        className="form-control otp-input"
                                                        name="otp[]"
                                                        aria-label="Digit 3"
                                                        type="text"
                                                        inputMode="numeric"
                                                        pattern="[0-9]*"
                                                        maxLength="1" />
                                                    <span className="otp-sep" aria-hidden="true">–</span>
                                                    <input
                                                        className="form-control otp-input"
                                                        name="otp[]"
                                                        aria-label="Digit 4"
                                                        type="text"
                                                        inputMode="numeric"
                                                        pattern="[0-9]*"
                                                        maxLength="1" />
                                                    <input
                                                        className="form-control otp-input"
                                                        name="otp[]"
                                                        aria-label="Digit 5"
                                                        type="text"
                                                        inputMode="numeric"
                                                        pattern="[0-9]*"
                                                        maxLength="1" />
                                                    <input
                                                        className="form-control otp-input"
                                                        name="otp[]"
                                                        aria-label="Digit 6"
                                                        type="text"
                                                        inputMode="numeric"
                                                        pattern="[0-9]*"
                                                        maxLength="1" />
                                                </div>
                                                <div
                                                    id="otpError"
                                                    className="invalid-feedback d-block text-center"
                                                    aria-live="polite"
                                                    style={{display: 'none'}}></div>
                                            </fieldset>

                                            <div className="form-check text-start my-3">
                                                <input className="form-check-input" id="remember-device" type="checkbox" />
                                                <label className="form-check-label" htmlFor="remember-device">Don’t ask again on this device</label>
                                            </div>

                                            <button type="submit" className="btn btn-secondary w-100 mb-3">Verify</button>
                                            <Link className="fs-9" to="#!">Didn’t receive the code? Contact us.</Link>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
