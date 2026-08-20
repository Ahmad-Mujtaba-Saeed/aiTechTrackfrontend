import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/images/logo.png";
// Redux imports
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../features/user/userSlice";
import GoogleSignIn from "./GoogleSignIn";

// Validation schema for login (email only)
const loginSchema = Yup.object().shape({
	email: Yup.string()
		.email("Please enter a valid email address")
		.required("Email is required"),
	password: Yup.string()
		.required("Password is required")
		.min(8, "Password must be at least 8 characters"),
});

export default function SignIn() {
	const dispatch = useDispatch();
	const [showPassword, setShowPassword] = useState(false);

	// Formik ref
	const formikRef = useRef(null);

	// Get loading/error from Redux
	const { loading, error } = useSelector((state) => state.user);

	const handleLogin = async (values, { setSubmitting, setFieldError }) => {
		try {
			setFieldError("email", "");
			setFieldError("password", "");

			// Prepare payload with email and password
			const loginPayload = {
				email: values.email.trim(),
				password: values.password,
				remember: values.remember
			};

			console.log("Sending login request with payload:", {
				email: loginPayload.email,
				password: "***hidden***",
				remember: loginPayload.remember
			});

			// Dispatch login action with email and password
			const result = await dispatch(login(loginPayload)).unwrap();

			toast.success("Login successful!");

			// Redirect after successful login
			setTimeout(() => {
				window.location.href = "/";
			}, 1000);

		} catch (error) {
			console.error("Login error:", error);

			setSubmitting(false);

			// Handle different error scenarios
			if (error.status === 401 || error.message?.includes("Unauthenticated")) {
				setFieldError("password", "Invalid email or password");
				toast.error("Invalid email or password");
			} else if (error.errors) {
				Object.entries(error.errors).forEach(([field, messages]) => {
					const errorMessage = Array.isArray(messages)
						? messages[0]
						: String(messages);
					setFieldError(field.toLowerCase(), errorMessage);
				});
				toast.error("Please correct the errors in the form");
			} else {
				const errorMessage = error.message || "Login failed. Please try again.";
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
					<div className="col-11 col-sm-10 col-xl-8 my-5">
						<div className="row g-3 justify-content-center">
							{/* Left: Login Form */}
							<div className="col-xl-6">
								<div className="card auth-card">
									<div className="card-body py-5">
										<div className="row align-items-center">
											<div className="col mx-auto">
												<div className="auth-form-box">
													<div className="text-center mb-5">
														<Link
															className="d-flex flex-center text-decoration-none my-2"
															to="/"
															aria-label="Go to homepage"
														>
															<div className="d-flex align-items-center fw-bolder fs-3 d-inline-block">
																<img
																	src={logo}
																	alt="Pathforge logo"
																	width="200"
																/>
															</div>
														</Link>
														<h3 className="fw-bold">Welcome back</h3>
														<p>Sign in to pick up your resume where you left off.</p>
													</div>

													<GoogleSignIn />

													<div className="position-relative">
														<hr className="bg-body-secondary mt-5 mb-4" />
														<div className="divider-content-center bg-body-emphasis">
															or use email
														</div>
													</div>

													<Formik
														innerRef={formikRef}
														initialValues={{
															email: "",
															password: "",
															remember: false,
														}}
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
															setFieldValue,
														}) => {
															return (
																<form onSubmit={handleSubmit} noValidate>
																	{/* Email field */}
																	<div className="mb-3 text-start form-group">
																		<label className="form-label">Email</label>
																		<input
																			className={`form-control ${touched.email && errors.email
																				? "is-invalid"
																				: ""
																				}`}
																			name="email"
																			type="email"
																			value={values.email}
																			onChange={handleChange}
																			onBlur={handleBlur}
																			disabled={loading}
																			placeholder="Enter your email"
																			autoComplete="email"
																		/>
																		{touched.email && errors.email && (
																			<div className="invalid-feedback d-block">
																				{errors.email}
																			</div>
																		)}
																	</div>

																	{/* Password field */}
																	<div className="mb-3 text-start form-group">
																		<label className="form-label" htmlFor="password">
																			Password
																		</label>
																		<div className="position-relative">
																			<input
																				className={`form-control pe-6 ${touched.password && errors.password
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
																				autoComplete="current-password"
																			/>
																			<button
																				className="btn px-3 py-0 h-100 position-absolute top-0 end-0"
																				type="button"
																				onClick={togglePasswordVisibility}
																				aria-label={showPassword ? "Hide password" : "Show password"}
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

																	{/* Remember Me & Forgot Password */}
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

																	{/* Submit Button */}
																	<button
																		type="submit"
																		className="btn btn-primary w-100 mb-4"
																		disabled={loading || isSubmitting}
																	>
																		{loading || isSubmitting ? (
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

																	{/* Sign Up Link */}
																	<div className="text-center">
																		<Link className="fs-9 fw-bold" to="/sign-up">
																			Create an account
																		</Link>
																	</div>
																</form>
															);
														}}
													</Formik>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							

							{/* Right: Demo Credentials Card */}
							
						</div>
						<div className="row g-3 justify-content-center">
							<div className="col-xl-6">
  <div
    className="d-flex align-items-stretch gap-0 p-2 rounded-4 mt-3"
    style={{ backgroundColor: "#15140F" }}
  >
    {/* Admin chip */}
    <button
      type="button"
      title="admin@admin.com"
      className="btn d-flex align-items-center gap-2 rounded-3 px-2 py-2 flex-fill text-start border-0"
      style={{ backgroundColor: "transparent" }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(250,247,241,0.06)")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      onClick={() => {
        if (formikRef.current) {
          formikRef.current.setFieldValue("email", "admin@admin.com");
          formikRef.current.setFieldValue("password", "AIProj@techtrack");
          toast.info("Admin credentials copied to form");
        }
      }}
    >
      <span
        className="rounded-circle flex-shrink-0"
        style={{ width: "8px", height: "8px", backgroundColor: "#C9BFAD" }}
      ></span>
      <span className="d-flex flex-column" style={{ minWidth: 0 }}>
        <span
          className="text-uppercase"
          style={{ fontSize: "9.5px", letterSpacing: "0.08em", color: "#8A7F6E" }}
        >
          Admin
        </span>
        <span
          className="fw-medium text-truncate"
          style={{ fontSize: "12px", color: "#EDE7D9" }}
        >
          admin@admin.com
        </span>
      </span>
      <span
        className="ms-auto flex-shrink-0 ps-2"
        style={{ fontSize: "10.5px", color: "#6E6455" }}
      >
        fill →
      </span>
    </button>

    <div
      className="mx-2 my-1"
      style={{ width: "1px", backgroundColor: "rgba(250,247,241,0.12)" }}
    ></div>

    {/* User chip */}
    <button
      type="button"
      title="user123@gmail.com"
      className="btn d-flex align-items-center gap-2 rounded-3 px-2 py-2 flex-fill text-start border-0"
      style={{ backgroundColor: "transparent" }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(250,247,241,0.06)")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      onClick={() => {
        if (formikRef.current) {
          formikRef.current.setFieldValue("email", "user123@gmail.com");
          formikRef.current.setFieldValue("password", "AIProj@techtrack");
          toast.info("User credentials copied to form");
        }
      }}
    >
      <span
        className="rounded-circle flex-shrink-0"
        style={{ width: "8px", height: "8px", backgroundColor: "#A8672B" }}
      ></span>
      <span className="d-flex flex-column" style={{ minWidth: 0 }}>
        <span
          className="text-uppercase"
          style={{ fontSize: "9.5px", letterSpacing: "0.08em", color: "#8A7F6E" }}
        >
          User
        </span>
        <span
          className="fw-medium text-truncate"
          style={{ fontSize: "12px", color: "#EDE7D9" }}
        >
          user123@gmail.com
        </span>
      </span>
      <span
        className="ms-auto flex-shrink-0 ps-2"
        style={{ fontSize: "10.5px", color: "#6E6455" }}
      >
        fill →
      </span>
    </button>
  </div>

  <p className="text-center small mt-2 mb-0" style={{ color: "#83786A" }}>
    Tap a role above to autofill demo credentials
  </p>
</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
