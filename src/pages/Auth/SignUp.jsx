import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '../../api/axios';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FaExclamationCircle } from 'react-icons/fa';
import logo from '../../assets/images/MPF-logo.svg';
import { Button, Form as BootstrapForm, Alert, Spinner } from 'react-bootstrap';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../features/user/userSlice';
import GoogleSignIn from './GoogleSignIn';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name is too long')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  // password_confirmation: Yup.string()
  //   .oneOf([Yup.ref('password'), null], 'Passwords must match')
  //   .required('Confirm Password is required'),
  phone: Yup.string()
    .required('Phone number is required')
    .test('is-valid-e164', 'Enter a valid phone number with country code', (value) => !!value && isValidPhoneNumber(value)),
  terms: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required('You must accept the terms and conditions')
});



export default function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Add Google Analytics conversion tracking for signup page
  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'conversion', {'send_to': 'AW-17741993591/aWejCMa7yMIbEPeshYxC'});
    }
  }, []);
  const [apiError, setApiError] = useState('');
  const dispatch = useDispatch();





  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    setFieldError,
    setFieldTouched,
    setFieldValue
  } = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      // password_confirmation: '',
      phone: '',
      terms: false
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError, setFieldTouched }) => {
      try {
        setIsLoading(true);
        setApiError('');

        // Clear previous errors
        Object.keys(values).forEach(key => {
          setFieldError(key, '');
        });

        // Add password_confirmation with the same value as password
        const formData = {
          ...values,
          password_confirmation: values.password
        };

        // Dispatch the register action with user data
        const result = await dispatch(register(formData)).unwrap();

        // If we get here, the registration was successful
        toast.success('Registration successful! Redirecting...');
        navigate('/');
      } catch (error) {
        console.error('Registration error:', error);

        // Handle validation errors (422 status code)
        if (error.errors) {
          // Handle field-specific errors
          Object.entries(error.errors).forEach(([field, messages]) => {
            const fieldName = field.toLowerCase();
            const errorMessage = Array.isArray(messages) ? messages[0] : String(messages);
            setFieldError(fieldName, errorMessage);
            setFieldTouched(fieldName, true, false);
          });

          // Set a general error message if available
          if (error.message) {
            setApiError(error.message);
            toast.error(error.message);
          } else {
            const errorMessage = 'Please correct the errors in the form.';
            setApiError(errorMessage);
            toast.error(errorMessage);
          }
        } else {
          // Handle other types of errors
          const errorMessage = error.message || 'Registration failed. Please try again.';
          setApiError(errorMessage);
          toast.error(errorMessage);
        }
      } finally {
        setIsLoading(false);
        setSubmitting(false);
      }
    }
  });

  return (
    <main className="main" id="top">
      
      <div className="container-fluid bg-body-tertiary dark__bg-gray-1200">
        <div className="bg-holder bg-auth-card-overlay auth-bg-image"></div>
        <div className="row flex-center position-relative min-vh-100 g-0">
          <div className="col-11 col-sm-10 col-xl-4">
            <div className="card border border-translucent auth-card">
              <div className="card-body">
                <div className="auth-form-box">
                  <div className="text-center mb-5">
                    <div className="d-flex flex-center text-decoration-none mb-4">
                      <div className="d-flex align-items-center fw-bolder fs-3 d-inline-block">
                        <img src={logo} alt="MyPathfinder logo" width="200" />
                      </div>
                    </div>
                    <h3 className="fw-bold">Access AI-powered CVs, job-matching & interview practise</h3>
                    
                    <p>Free and unlimited for 7 days</p>
                  </div>

                  {/* <Button variant="light" className="w-100 mb-3 gap-2 d-flex align-items-center justify-content-center border google-btn" onClick={() => window.location.href = '/auth/google'}>
                    <svg width={13} className="me-2 text-danger" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                      <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                    </svg>
                    sign in with Google
                  </Button> */}
                  <GoogleSignIn />

                  {/* <Button variant="light" className="w-100 mb-3 gap-2 d-flex align-items-center justify-content-center border facebook-btn" onClick={() => window.location.href = '/auth/facebook'}>
                    <svg width={13} className="me-2" style={{ color: '#1877f2' }} aria-hidden="true" focusable="false" data-prefix="fab" data-icon="facebook" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                      <path fill="currentColor" d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z"></path>
                    </svg>
                    Continue with Facebook
                  </Button> */}

                  <div className="position-relative mt-4">
                    <hr className="bg-body-secondary" />
                    <div className="divider-content-center bg-body-emphasis">or use email</div>
                  </div>

                  <BootstrapForm onSubmit={handleSubmit}>
                    {apiError && (
                      <Alert variant="danger" className="d-flex align-items-center">
                        <FaExclamationCircle className="me-2" />
                        {apiError}
                      </Alert>
                    )}

                    <div className="mb-3 text-start">
                      <label className="form-label" htmlFor="name">Name</label>
                      <BootstrapForm.Control
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Name"
                        className={`${(touched.name && errors.name) ? 'is-invalid' : ''}`}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name}
                        autoComplete="name"
                        required
                      />
                      {touched.name && errors.name && (
                        <div className="invalid-feedback d-block">
                          {errors.name}
                        </div>
                      )}
                    </div>

                    <div className="mb-3 text-start">
                      <label className="form-label" htmlFor="email">Email address</label>
                      <BootstrapForm.Control
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        className={`${touched.email && errors.email ? 'is-invalid' : ''}`}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        autoComplete="email"
                        required
                      />
                      {touched.email && errors.email && (
                        <div className="invalid-feedback d-block">
                          {errors.email}
                        </div>
                      )}
                    </div>

                    <div className="mb-3 text-start">
                      <label className="form-label" htmlFor="phone">Phone number</label>
                      <label className="form-label" htmlFor="phone" style={{fontSize:"9px", color:"#6c757d" , margin:"0" , padding:"0 8px"}}>(Your one-time verification code)</label>
                      <div>
                        <PhoneInput
                          id="phone"
                          name="phone"
                          international
                          defaultCountry="GB"
                          placeholder="+44 3123456789"
                          value={values.phone}
                          onChange={(val) => setFieldValue('phone', val)}
                          onBlur={handleBlur}
                          className='form-control'
                        />
                      </div>
                      {touched.phone && errors.phone && (
                        <div className="invalid-feedback d-block">
                          {errors.phone}
                        </div>
                      )}
                    </div>

                    {/* <div className="row g-3 mb-3"> */}
                      <div className="col-sm-12">
                        <label className="form-label" htmlFor="password">Password</label>
                        <div className="position-relative">
                          <div className="position-relative">
                            <BootstrapForm.Control
                              id="password"
                              name="password"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Password"
                              className={`pe-5 ${touched.password && errors.password ? 'is-invalid' : ''}`}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.password}
                              autoComplete="new-password"
                              required
                            />
                            <div
                              className="position-absolute top-50 end-0 translate-middle-y me-2"
                              style={{ cursor: 'pointer' }}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </div>
                          </div>
                          {touched.password && errors.password && (
                            <div className="invalid-feedback d-block">
                              {errors.password}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* <div className="col-sm-6">
                        <label className="form-label" htmlFor="password_confirmation">Confirm Password</label>
                        <div className="position-relative">
                          <div className="position-relative">
                            <BootstrapForm.Control
                              id="password_confirmation"
                              name="password_confirmation"
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="Confirm Password"
                              className={`pe-5 ${touched.password_confirmation && errors.password_confirmation ? 'is-invalid' : ''}`}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.password_confirmation}
                              autoComplete="new-password"
                              required
                            />
                            <div
                              className="position-absolute top-50 end-0 translate-middle-y me-2"
                              style={{ cursor: 'pointer' }}
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                            {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </div>
                          </div>
                          {touched.password_confirmation && errors.password_confirmation && (
                            <div className="invalid-feedback d-block">
                              {errors.password_confirmation}
                            </div>
                          )}
                        </div>
                      </div> */}
                    {/* </div> */}

                    <div className="form-check mb-3 mt-2">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        className={`form-check-input me-2 ${touched.terms && errors.terms ? 'is-invalid' : ''}`}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values.terms}
                        required
                      />
                      <label className="form-check-label fs-9 text-transform-none d-inline" htmlFor="terms">
                        I accept the <Link to="/terms" target='_blank' className="text-primary">terms</Link> and{' '}
                        <Link to="/privacy-policy" target='_blank' className="text-primary">privacy policy</Link>
                      </label>
                      {touched.terms && errors.terms && (
                        <div className="invalid-feedback d-block">
                          {errors.terms}
                        </div>
                      )}
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-100 mb-4"
                      disabled={isLoading || !Object.keys(errors).length === 0 || isSubmitting}
                    >
                      {isLoading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>

                    <div className="text-center">
                      <Link to="/sign-in" className="fs-9 fw-bold">
                        Already a member? Click here to sign in.
                      </Link>
                    </div>
                  </BootstrapForm>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
