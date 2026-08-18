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
					<div className="col-11 col-sm-10 col-xl-8">
						<div className="row g-3">
							{/* Left: Login Form */}
							<div className="col-xl-6">
								<div className="card auth-card">
									<div className="card-body py-5">
										<div className="row align-items-center">
											<div className="col mx-auto">
												<div className="auth-form-box">
													<div className="text-center mb-5">
														<Link
															className="d-flex flex-center text-decoration-none my-4"
															to="/"
															aria-label="Go to homepage"
														>
															<div className="d-flex align-items-center fw-bolder fs-3 d-inline-block">
																<img
																	src={logo}
																	alt="CV Builder logo"
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
							<div className="col-xl-6">
								<div
									className="card auth-card shadow-lg rounded-4 border-0 p-4"
									style={{ backgroundColor: "#f8f9fa" }}
								>
									{/* Admin Section */}
									<div className="mb-5">
										<div className="d-flex align-items-center mb-3">
											<span className="badge bg-dark me-2 py-2 px-3 rounded-pill">
												Admin
											</span>
											<h5 className="fw-bold mb-0">Demo Credentials</h5>
										</div>
										<div className="mb-3">
											<div className="input-group">
												<span className="input-group-text bg-primary text-white">
													<i className="bi bi-envelope-fill"></i>
												</span>
												<input
													type="text"
													className="form-control"
													value="admin@admin.com"
													readOnly
												/>
											</div>
										</div>
										<div className="mb-3">
											<div className="input-group">
												<span className="input-group-text bg-primary text-white">
													<i className="bi bi-lock-fill"></i>
												</span>
												<input
													type="password"
													className="form-control"
													value="AIProj@techtrack"
													readOnly
												/>
											</div>
										</div>
										<button
											className="btn btn-primary w-100 fw-bold"
											type="button"
											onClick={() => {
												if (formikRef.current) {
													formikRef.current.setFieldValue("email", "admin@admin.com");
													formikRef.current.setFieldValue("password", "AIProj@techtrack");
													toast.info("Admin credentials copied to form");
												}
											}}
										>
											Use Admin Credentials
										</button>
									</div>

									<hr className="my-4" />

									{/* User Section */}
									<div>
										<div className="d-flex align-items-center mb-3">
											<span className="badge me-2 py-2 px-3 rounded-pill" style={{ backgroundColor: 'green' }}>
												User
											</span>
											<h5 className="fw-bold mb-0">Demo Credentials</h5>
										</div>
										<div className="mb-3">
											<div className="input-group">
												<span className="input-group-text bg-success text-white">
													<i className="bi bi-envelope-fill"></i>
												</span>
												<input
													type="text"
													className="form-control"
													value="user123@gmail.com"
													readOnly
												/>
											</div>
										</div>
										<div className="mb-3">
											<div className="input-group">
												<span className="input-group-text bg-success text-white">
													<i className="bi bi-lock-fill"></i>
												</span>
												<input
													type="password"
													className="form-control"
													value="AIProj@techtrack"
													readOnly
												/>
											</div>
										</div>
										<button
											className="btn w-100 fw-bold"
											style={{ backgroundColor: 'green', color: 'white' }}
											type="button"
											onClick={() => {
												if (formikRef.current) {
													formikRef.current.setFieldValue("email", "user123@gmail.com");
													formikRef.current.setFieldValue("password", "AIProj@techtrack");
													toast.info("User credentials copied to form");
												}
											}}
										>
											Use User Credentials
										</button>
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
