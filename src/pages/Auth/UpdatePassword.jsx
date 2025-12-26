import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../../features/user/userSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import logo from '../../assets/images/MPF-logo.svg';

export default function UpdatePassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: '',
    password_confirmation: ''
  });
  
  const { loading, forgetPasswordError, forgetPasswordSuccess } = useSelector((state) => state.user || {});
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (forgetPasswordError) {
      toast.error(forgetPasswordError);
    }
    if (forgetPasswordSuccess) {
      toast.success(forgetPasswordSuccess);
      setTimeout(() => {
      navigate('/sign-in');
      }, 3000);
    }
  }, [forgetPasswordError, forgetPasswordSuccess, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.password_confirmation) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (!token || !email) {
      toast.error('Invalid reset link');
      return;
    }
    
    try {
      await dispatch(resetPassword({
        email,
        token,
        password: formData.password,
        password_confirmation: formData.password_confirmation
      })).unwrap();
      
      // alert("Password updated successfully");
    } catch (error) {
      // Error is handled by the toast in the effect
    }
  };

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
                          Enter your new password below
                        </p>

                        <form onSubmit={handleSubmit}>
                          <div className="mb-3 text-start">
                            <label className="form-label" htmlFor="password">New Password</label>
                            <div className="form-icon-container">
                              <input
                                className={`form-control w-100 ${forgetPasswordError?.includes('password') ? 'is-invalid' : ''}`}
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter new password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength="8"
                              />
                            </div>
                          </div>
                          
                          <div className="mb-3 text-start">
                            <label className="form-label" htmlFor="password_confirmation">
                              Confirm New Password
                            </label>
                            <div className="form-icon-container">
                              <input
                                className="form-control w-100"
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                placeholder="Confirm new password"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>

                          <button 
                            type="submit" 
                            className="btn btn-primary w-100"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Updating...
                              </>
                            ) : 'Update Password'}
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