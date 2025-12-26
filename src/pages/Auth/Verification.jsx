import React from 'react'
import { Link } from "react-router-dom";


import logo from '../../assets/images/MPF-logo.svg'


export default function Verification() {
  return (
    <main className="main" id="top">
      <div className="container-fluid bg-body-tertiary dark__bg-gray-1200">
        <div className="bg-holder bg-auth-card-overlay auth-bg-image"></div>

        <div className="row flex-center position-relative min-vh-100 g-0 py-5">
          <div className="col-11 col-sm-10 col-xl-4">
            <div className="card border border-translucent auth-card auth-card--narrow">
              <div className="card-body pb-6">
                <div className="row align-items-center gx-0 gy-7">
                  <div className="col mx-auto">
                    <div className="auth-form-box">
                      <div className="text-center">
                        <div className="d-flex flex-center text-decoration-none mb-4">
                          <div className="d-flex align-items-center fw-bolder fs-3 d-inline-block">
                            <img src={logo} alt="MyPathfinder logo" width="200" />
                          </div>
                        </div>

                        <h3 className="fw-bold">Secure Your Account</h3>
                        <p className="text-body-tertiary">
                          We’ll text a 6-digit verification code to the phone number below.
                        </p>

                        <form action="2fa.html" method="post" data-2fa-form="data-2fa-form" noValidate="novalidate">
                          <div className="mb-3 text-start">
                            <label className="form-label" htmlFor="tel">Phone number</label>
                            <div className="form-icon-container">
                              <input
                                className="form-control form-icon-input w-100"
                                id="tel"
                                name="phone"
                                type="tel"
                                placeholder="+44 7123 456789"
                                autoComplete="tel"
                                inputMode="tel"
                                autoCapitalize="off"
                                required
                                pattern="^\+?[1-9]\d{1,14}$"
                              />
                              <svg width={11} className="svg-inline--fa fa-phone form-icon fs-9 text-body" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="phone" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"></path></svg>
                            </div>
                          </div>
                          <div className="visually-hidden" aria-live="polite"></div>

                          <button type="submit" className="btn btn-secondary w-100">
                            Send code
                          </button>
                        </form>
                      </div>
                    </div>
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
