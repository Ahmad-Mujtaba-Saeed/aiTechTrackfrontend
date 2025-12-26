import React, { useEffect, useState , useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { getIndustries, getRoles, getEducationLevels , updateUserPro } from '../../features/user/userSlice';

import Select from 'react-select';

import logo from '../../assets/images/MPF-logo.svg'
import { getUser } from '../../features/user/userSlice';

export default function UploadProfile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { data, industries, roles, educationLevels, success, loading } = useSelector((state) => state.user);

    const linkedinUrlRef = useRef(null);

    useEffect(() => {
        if (!industries.length) dispatch(getIndustries());
        if (!roles.length) dispatch(getRoles());
        if (!educationLevels.length) dispatch(getEducationLevels());
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

    const [formData, setFormData] = useState({
        linkedin_profile_url: "",
        industry_id: "",
        role_id: "",
        education_level_id: "",
    });

    useEffect(()=>{
      setFormData({
        linkedin_profile_url: data?.linkedin_profile_url,
        industry_id: data?.preferred_industry_id,
        role_id: data?.role_id,
        education_level_id: data?.education_level_id,
      });
    },[data])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(updateUserPro(formData)).unwrap();
        console.log(result);
        if(result.status){
            dispatch(getUser());
            navigate('/');
        }
    };

    const industryOptions = industries.map(industry => ({ value: industry.id, label: industry.name }));
    const roleOptions = roles.map(role => ({ value: role.id, label: role.name }));
    const educationOptions = educationLevels.map(edu => ({ value: edu.id, label: edu.name }));

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
                                        <div className=" auth-card--narrow">
                                            <div className="text-center mb-5">
                                                <a className="d-flex flex-center text-decoration-none mb-4" href="index.html"
                                                    aria-label="Go to homepage">
                                                    <div className="d-flex align-items-center fw-bolder fs-3 d-inline-block">
                                                        <img src={logo} alt="MyPathfinder logo" width="200" />
                                                    </div>
                                                </a>
                                                <h3 className="fw-bold">Lets get to know you a bit first, Alex<span className="text-primary">.</span></h3>
                                                <p>MyPathfinder curates job opportunities that match your profile, allowing you to apply quickly
                                                    and efficiently.</p>
                                            </div>

                                            <div className="mb-4 text-start">
                                                <label className="form-label d-flex align-items-center gap-2" htmlFor="linkedinUrl">
                                                    <span>LinkedIn profile</span>
                                                    <span className="badge bg-primary-subtle text-primary">Preferred</span>
                                                </label>

                                                <div className="input-group input-group-lg">
                                                    <span className="input-group-text">
                                                        <i className="fab fa-linkedin-in" aria-hidden="true"></i>
                                                    </span>
                                                    <input type="url" className="form-control form-control-lg border-primary shadow-sm" id="linkedinUrl"
                                                        name="linkedin_profile_url" placeholder="https://www.linkedin.com/in/your-name" inputMode="url"
                                                        autoComplete="url" autoCapitalize="off" spellCheck="false"
                                                        pattern="https?://(www\.)?linkedin\.com/(in|pub)/[A-Za-z0-9\-\._%]+/?"
                                                        aria-describedby="linkedinHelp" required
                                                        value={formData.linkedin_profile_url}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                <div id="linkedinHelp" className="form-text">
                                                    Paste your LinkedIn URL and we’ll auto-fill the rest.
                                                </div>
                                                <div className="invalid-feedback">
                                                    Please enter a valid LinkedIn URL, e.g. https://www.linkedin.com/in/your-name
                                                </div>
                                            </div>



                                            <div className="position-relative">
                                                <hr className="bg-body-secondary mt-5 mb-4" />
                                                <div className="divider-content-center bg-body-emphasis">or complete a short questionnaire</div>
                                            </div>


                                            <form onSubmit={handleSubmit} noValidate="noValidate">

                                                <div className="mb-3 text-start">
                                                    <label className="form-label" htmlFor="industry">Industry I am looking to work in:</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text"><i className="fas fa-briefcase" aria-hidden="true"></i></span>
                                                        <select className="form-select" id="industry" name="industry_id" required
                                                            value={formData.industry_id}
                                                            onChange={handleChange}
                                                        >
                                                            <option value=""  disabled>Select an industry</option>
                                                            {industryOptions.map(option => (
                                                                <option key={option.value} value={option.value}>{option.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="mb-3 text-start">
                                                    <label className="form-label" htmlFor="jobRole">Job role I am looking to work in:</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text"><i className="fas fa-user-tie" aria-hidden="true"></i></span>
                                                        <select className="form-select" id="jobRole" name="role_id" required
                                                            value={formData.role_id}
                                                            onChange={handleChange}
                                                        >
                                                            <option value=""  disabled>Select a role</option>
                                                            {roleOptions.map(option => (
                                                                <option key={option.value} value={option.value}>{option.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="mb-3 text-start">
                                                    <label className="form-label" htmlFor="educationLevel">Highest education level:</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text">
                                                            <i className="fas fa-user-graduate" aria-hidden="true"></i>
                                                        </span>
                                                        <select className="form-select" id="educationLevel" name="education_level_id" required
                                                            value={formData.education_level_id}
                                                            onChange={handleChange}
                                                        >
                                                            <option value=""  disabled>Select education level</option>
                                                            {educationOptions.map(option => (
                                                                <option key={option.value} value={option.value}>{option.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>


                                                <div className="visually-hidden" aria-live="polite"></div>

                                                <button type="submit" className="btn btn-primary w-100 mt-2 mb-4" disabled={loading}>
                                                    {loading ? 'Saving...' : 'Continue'}
                                                </button>
                                                {success && <div className="alert alert-success" role="alert">{success}</div>}
                                            </form>
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
