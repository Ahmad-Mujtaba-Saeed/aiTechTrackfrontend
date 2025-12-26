import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import logo from '../../assets/images/MPF-logo.svg';
import { ForgotPassword } from "../../features/user/userSlice";

export default function ForgetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get loading/error/success from Redux
  const { loading, forgetPasswordError, forgetPasswordSuccess } = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('email', email);
    dispatch(ForgotPassword(formData));
  };

  // Handle success/error messages
  useEffect(() => {
    if (forgetPasswordError) {
      toast.error(forgetPasswordError);
    }
    if (forgetPasswordSuccess) {
      toast.success(forgetPasswordSuccess);
      // Redirect to login or show success message
      // setTimeout(() => {
      //   navigate('/sign-in');
      // }, 3000);
    }
    setIsSubmitting(false);
  }, [forgetPasswordError, forgetPasswordSuccess, navigate]);

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

                        <h3 className="fw-bold">Reset Your Password</h3>
                        <p className="text-body-tertiary">
                          We'll send a password reset link to your email address.
                        </p>

                        <form onSubmit={handleSubmit}>
                          <div className="mb-3 text-start">
                            <label className="form-label" htmlFor="email">Email Address</label>
                            <div className="form-icon-container">
                              <input
                                className={`form-control w-100 ${forgetPasswordError ? 'is-invalid' : ''}`}
                                id="email"
                                name="email"
                                type="email"
                                placeholder="example@gmail.com"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                required
                              />
                              {forgetPasswordError && <div className="invalid-feedback">{forgetPasswordError}</div>}
                            </div>
                          </div>

                          <button 
                            type="submit" 
                            className="btn btn-primary w-100"
                            disabled={loading || isSubmitting}
                          >
                            {loading || isSubmitting ? (
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            ) : null}
                            {loading || isSubmitting ? 'Sending...' : 'Send Reset Link'}
                          </button>
                        </form>

                        <div className="text-center mt-3">
                          <p className="mb-0">
                            Remember your password?{' '}
                            <Link to="/sign-in" className="fw-bold">
                              Sign In
                            </Link>
                          </p>
                        </div>
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
  );
}