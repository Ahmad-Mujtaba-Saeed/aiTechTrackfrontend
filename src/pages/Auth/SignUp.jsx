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
            <div className="card auth-card">
              <div className="card-body">
                <div className="auth-form-box">
                  <div className="text-center my-5">
                    <div className="d-flex flex-center text-decoration-none mb-4">
                      <div className="d-flex align-items-center fw-bolder fs-3 d-inline-block">
                        <img src={logo} alt="CV Builder logo" width="200" />
                      </div>
                    </div>
                    <h3 className="fw-bold">Sign Up</h3>
                    
                    <p>Free and unlimited for 7 days</p>
                  </div>

                  <GoogleSignIn />

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

                    <div className="mb-3 text-start form-group">
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

                    <div className="mb-3 text-start form-group">
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

                    <div className="mb-3 text-start form-group">
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


                      <div className="col-sm-12  form-group">
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
