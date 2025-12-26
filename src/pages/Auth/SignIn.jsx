import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/images/MPF-logo.svg";
import { Button } from "react-bootstrap";
// Redux imports
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../features/user/userSlice";
import GoogleSignIn from "./GoogleSignIn";

// Validation schema
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  // Get loading/error from Redux
  const { loading, error } = useSelector((state) => state.user);

  const handleLogin = async (values, { setSubmitting, setFieldError }) => {
    try {
      // Clear previous errors
      setFieldError('email', '');
      setFieldError('password', '');
      
      // Reset loading state in Redux
      dispatch({ type: 'user/login/pending' });
      
      const result = await dispatch(login(values)).unwrap();
      
      toast.success("Login successful!");
      window.location.href = "/";
    } catch (error) {
      console.error("Login error:", error);
      
      // Ensure loading is set to false in both Redux and local state
      dispatch({ type: 'user/login/rejected', error: error });
      setSubmitting(false);
      
      // Handle 401 Unauthorized (invalid credentials)
      if (error.status === 401 || error.message?.includes('Unauthenticated')) {
        setFieldError('password', 'Invalid email or password');
        toast.error('Invalid email or password');
      } 
      // Handle validation errors (422)
      else if (error.errors) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          const errorMessage = Array.isArray(messages) ? messages[0] : String(messages);
          setFieldError(field.toLowerCase(), errorMessage);
        });
        toast.error('Please correct the errors in the form');
      } 
      // Handle other errors
      else {
        const errorMessage = error.message || 'Login failed. Please try again.';
        toast.error(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <main className="main" id="top">
      <div className="container-fluid bg-body-tertiary">
        <div className="bg-holder bg-auth-card-overlay auth-bg-image"></div>

        <div className="row flex-center position-relative min-vh-100 g-0">
          <div className="col-11 col-sm-10 col-xl-4">
            <div className="card border border-translucent auth-card">
              <div className="card-body py-5">
                <div className="row align-items-center gx-0 gy-7">
                  <div className="col mx-auto">
                    <div className="auth-form-box">
                      <div className="text-center mb-5">
                        <Link
                          className="d-flex flex-center text-decoration-none mb-4"
                          to="/"
                          aria-label="Go to homepage"
                        >
                          <div className="d-flex align-items-center fw-bolder fs-3 d-inline-block">
                            <img
                              src={logo}
                              alt="MyPathfinder logo"
                              width="200"
                            />
                          </div>
                        </Link>
                        <h3 className="fw-bold">Sign In</h3>
                        <p>Get access to your account</p>
                      </div>
                      <GoogleSignIn />
                      <div className="position-relative">
                        <hr className="bg-body-secondary mt-5 mb-4" />
                        <div className="divider-content-center bg-body-emphasis">
                          or use email
                        </div>
                      </div>

                      <Formik
                        initialValues={{ email: "", password: "", remember: false }}
                        validationSchema={loginSchema}
                        onSubmit={handleLogin}
                      >
                        {({
                          values,
                          errors,
                          touched,
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          isSubmitting,
                        }) => (
                          <form onSubmit={handleSubmit} noValidate>
                            {/* {error && (
                              <div
                                className="alert alert-danger d-flex align-items-center mb-3"
                                role="alert"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  className="me-2"
                                  fill="currentColor"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                </svg>
                                <div>{error}</div>
                              </div>
                            )} */}

                            {/* Email */}
                            <div className="mb-3 text-start">
                              <label className="form-label" htmlFor="email">
                                Email address
                              </label>
                              <input
                                className={`form-control ${
                                  touched.email && errors.email ? "is-invalid" : ""
                                }`}
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={loading}
                              />
                              {touched.email && errors.email && (
                                <div className="invalid-feedback d-block">
                                  {errors.email}
                                </div>
                              )}
                            </div>

                            {/* Password */}
                            <div className="mb-3 text-start">
                              <label className="form-label" htmlFor="password">
                                Password
                              </label>
                              <div className="position-relative">
                                <input
                                  className={`form-control pe-6 ${
                                    touched.password && errors.password
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  id="password"
                                  name="password"
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Password"
                                  value={values.password}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  disabled={loading}
                                />
                                <button
                                  className="btn px-3 py-0 h-100 position-absolute top-0 end-0"
                                  type="button"
                                  onClick={togglePasswordVisibility}
                                >
                                  {showPassword ? "🙈" : "👁️"}
                                </button>
                              </div>
                              {touched.password && errors.password && (
                                <div className="invalid-feedback d-block">
                                  {errors.password}
                                </div>
                              )}
                            </div>

                            {/* Remember Me */}
                            <div className="row flex-between-center mb-3">
                              <div className="col-auto">
                                <div className="form-check mb-0">
                                  <input
                                    className="form-check-input"
                                    id="remember"
                                    name="remember"
                                    type="checkbox"
                                    checked={values.remember}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    disabled={loading}
                                  />
                                  <label
                                    className="form-check-label mb-0"
                                    htmlFor="remember"
                                  >
                                    Remember me
                                  </label>
                                </div>
                              </div>
                              <div className="col-auto">
                                <Link
                                  className="fs-9 fw-semibold"
                                  to="/forget-password"
                                >
                                  Forgot Password?
                                </Link>
                              </div>
                            </div>

                            {/* Submit */}
                            <button
                              type="submit"
                              className="btn btn-primary w-100 mb-4"
                              disabled={loading || isSubmitting}
                            >
                              {loading ? (
                                <>
                                  <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                  Signing In...
                                </>
                              ) : (
                                "Sign In"
                              )}
                            </button>

                            <div className="text-center">
                              <Link className="fs-9 fw-bold" to="/sign-up">
                                Create an account
                              </Link>
                            </div>
                          </form>
                        )}
                      </Formik>
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
