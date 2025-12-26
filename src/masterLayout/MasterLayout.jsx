import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, NavLink, } from "react-router-dom";
import { Button } from 'react-bootstrap';
// import ThemeToggleButton from "../helper/ThemeToggleButton";
// import { useAuth } from "../context/AuthContext";


import logo from '../assets/images/MPF-logo.svg';
import logoLight from '../assets/images/MPF-Logo-Light.svg';
import avatar from '../assets/images/team/40x40/57.webp'
import favicon from '../assets/images/MPF-180x180.png';
import { useDispatch , useSelector } from "react-redux";
import { logout } from "../features/user/userSlice";

const MasterLayout = ({ children }) => {

  const dispatch = useDispatch();
  const {data} = useSelector((state) => state.user);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  const [collapsed, setCollapsed] = useState(() => {
    const savedState = localStorage.getItem("navbarCollapsed");
    return savedState === "true" && window.innerWidth >= 992;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);

    // (Optional) update document attribute for styling
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const mobileToggle = () => {
    setIsMobile((prev) => !prev);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const isActive = (path) => {
    return location.pathname === path ? "text-primary" : "";
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setCollapsed(false);
        localStorage.setItem("navbarCollapsed", "false");
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleNavbar = () => {
    if (window.innerWidth >= 992) {
      const newState = !collapsed;
      setCollapsed(newState);
      localStorage.setItem("navbarCollapsed", newState.toString());
    }
  };

  return (
    <main className={`main ${collapsed ? "navbar-vertical-collapsed" : ""}`} id="top" data-bs-theme={theme}>
      <nav className={`navbar navbar-vertical ${isMobile ? "navbar-expand" : "navbar-expand active"} navbar-expand-lg mobile-expand bg-white navbar-light dark__bg-dark dark__navbar-dark`}>
        <div className="collapse navbar-collapse" id="navbarVerticalCollapse">

          <div className="navbar-vertical-content">
            <ul className="navbar-nav flex-column" id="navbarVerticalNav">
              <li className="nav-item">

                <p className="navbar-vertical-label">
                  Navigation
                </p>
                <hr className="navbar-vertical-line" />

                <div className="nav-item-wrapper">
                  <Link className={`nav-link label-1 ${isActive('/')}`} to="/" role="button" data-bs-toggle="" aria-expanded="false">
                    <div className="d-flex align-items-center"><span className="nav-link-icon"><Icon icon='tabler:chart-pie-2' width={'18px'} height={'18px'} /></span><span className="nav-link-text-wrapper"><span className="nav-link-text ">Dashboard</span></span>
                    </div>
                  </Link>
                </div>

                <div className="nav-item-wrapper"><Link className={`nav-link label-1 ${isActive('/cv-builder')}`} to="/cv-builder" role="button" data-bs-toggle="" aria-expanded="false">
                  <div className="d-flex align-items-center"><span className="nav-link-icon"><Icon icon='tabler:notes' width={'18px'} height={'18px'} /></span><span className="nav-link-text-wrapper"><span className="nav-link-text">CV Builder</span></span>
                  </div>
                </Link>
                </div>
                <div className="nav-item-wrapper"><Link className={`nav-link label-1 ${isActive('/job-search')}`} to="/job-search" role="button" data-bs-toggle="" aria-expanded="false">
                  <div className="d-flex align-items-center"><span className="nav-link-icon"><Icon icon='tabler:search' width={'18px'} height={'18px'} /></span><span className="nav-link-text-wrapper"><span className="nav-link-text">Job Search</span></span>
                  </div>
                </Link>
                </div>


                <div className="nav-item-wrapper"><Link className={`nav-link label-1 ${isActive('/interview')}`} to="/interview" role="button" data-bs-toggle="" aria-expanded="false">
                  <div className="d-flex align-items-center"><span className="nav-link-icon"><Icon icon='tabler:brand-line' width={'18px'} height={'18px'} /></span><span className="nav-link-text-wrapper"><span className="nav-link-text">Interview Practise</span></span>
                  </div>
                </Link>
                </div>

                <div className="nav-item-wrapper"><Link className={`nav-link label-1 ${isActive('/application-tracker')}`} to="/application-tracker" role="button" data-bs-toggle="" aria-expanded="false">
                  <div className="d-flex align-items-center"><span className="nav-link-icon"><Icon icon='tabler:calendar' width={'18px'} height={'18px'} /></span><span className="nav-link-text-wrapper"><span className="nav-link-text">Application Tracker</span></span>
                  </div>
                </Link>
                </div>

                <div className="nav-item-wrapper"><Link className={`nav-link label-1 disabled ${isActive('/events')}`} to="/events" role="button" data-bs-toggle="" aria-expanded="false" onClick={(e) => e.preventDefault()}>
                  <div className="d-flex align-items-center"><span className="nav-link-icon"><Icon icon='tabler:bookmark' width={'18px'} height={'18px'} /></span><span className="nav-link-text-wrapper"><span className="nav-link-text">Events</span></span>
                    <span className="badge ms-auto badge bg-warning-subtle nav-link-badge ">Coming Soon</span>
                  </div>
                </Link>
                </div>

                <div className="nav-item-wrapper">
                  <Link className={`nav-link label-1 disabled ${isActive('/community')}`} to="/community" role="button" data-bs-toggle="" aria-expanded="false" onClick={(e) => e.preventDefault()}>
                    <div className="d-flex align-items-center"><span className="nav-link-icon"><Icon icon='tabler:brand-stackshare' width={'18px'} height={'18px'} /></span><span className="nav-link-text-wrapper"><span className="nav-link-text">Community</span></span>
                      <span className="badge ms-auto badge bg-warning-subtle nav-link-badge ">Coming Soon</span>
                    </div>
                  </Link>
                </div>
              </li>
              <li className="nav-item">

                <p className="navbar-vertical-label">Support</p>
                <hr className="navbar-vertical-line" />

                {/* <div className="nav-item-wrapper"><Link className={`nav-link label-1 ${isActive('/get-started')}`} to="/get-started" role="button" data-bs-toggle="" aria-expanded="false">
                  <div className="d-flex align-items-center"><span className="nav-link-icon"><Icon icon='tabler:brand-safari' width={'18px'} height={'18px'} /></span><span className="nav-link-text-wrapper"><span className="nav-link-text">Getting Started</span></span>
                  </div>
                </Link>
                </div> */}

                <div className="nav-item-wrapper"><Link className={`nav-link label-1 ${isActive('/career-advice')}`} to="/career-advice" role="button" data-bs-toggle="" aria-expanded="false">
                  <div className="d-flex align-items-center"><span className="nav-link-icon"><Icon icon='tabler:help' width={'18px'} height={'18px'} /></span><span className="nav-link-text-wrapper"><span className="nav-link-text">Careers Advice</span></span>
                  </div>
                </Link>
                </div>
{/* 
                <div className="nav-item-wrapper"><Link className={`nav-link label-1 ${isActive('/support')}`} to="/support" role="button" data-bs-toggle="" aria-expanded="false">
                  <div className="d-flex align-items-center"><span className="nav-link-icon"><Icon icon='tabler:world' width={'18px'} height={'18px'} /></span><span className="nav-link-text-wrapper"><span className="nav-link-text">Support</span></span>
                  </div>
                </Link>
                </div> */}

                <div className="nav-item-wrapper"><Link className={`nav-link label-1 ${isActive('/upgrade-subscription')}`} to="/upgrade-subscription" role="button" data-bs-toggle="" aria-expanded="false">
                  <div className="d-flex align-items-center"><span className="nav-link-icon"><Icon icon='tabler:tag' width={'18px'} height={'18px'} /></span><span className="nav-link-text-wrapper"><span className="nav-link-text">Payment Plans</span></span>
                  </div>
                </Link>
                </div>

                {/* <div className="nav-item-wrapper"><Link className={`nav-link label-1 ${isActive('/notification')}`} to="/notification" role="button" data-bs-toggle="" aria-expanded="false">
                  <div className="d-flex align-items-center"><span className="nav-link-icon"><Icon icon='tabler:bell' width={'18px'} height={'18px'} /></span><span className="nav-link-text-wrapper"><span className="nav-link-text">Notifications</span></span>
                  </div>
                </Link>
                </div> */}

                <div className="nav-item-wrapper"><Link className={`nav-link label-1`} to="" role="button" data-bs-toggle="" aria-expanded="false" onClick={() => dispatch(logout())}>
                  <div className="d-flex align-items-center"><span className="nav-link-icon"><Icon icon='tabler:logout' width={'18px'} height={'18px'} /></span><span className="nav-link-text-wrapper"><span className="nav-link-text">Sign Out</span></span>
                  </div>
                </Link>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="navbar-vertical-footer">
          <button className="btn navbar-vertical-toggle border-0 fw-semibold w-100 white-space-nowrap d-flex align-items-center" onClick={toggleNavbar}><span className="uil uil-left-arrow-to-left fs-8"></span><span className="uil uil-arrow-from-right fs-8"></span><span className="navbar-vertical-footer-text ms-2">Collapsed View</span></button>
        </div>
      </nav>
      <nav className="navbar navbar-top fixed-top navbar-expand-lg bg-white navbar-light dark__bg-dark dark__navbar-dark" id="navbarDefault">
        <div className="navbar-logo">
          <button className="btn navbar-toggler navbar-toggler-humburger-icon hover-bg-transparent" type="button" onClick={mobileToggle}><span className="navbar-toggle-icon"><span className="toggle-line"></span></span></button>
          <Link className="navbar-brand me-1 me-sm-3" to="/">
            <div className="d-flex align-items-center">
              <img src={logo} alt="phoenix-light" id="logo-light" width="120" />
              <img src={logoLight} alt="phoenix-dark" id="logo-dark" width="120" />
            </div>
          </Link>
        </div>
        <div className="collapse navbar-collapse navbar-top-collapse order-1 order-lg-0 justify-content-center" id="navbarTopCollapse">
          <ul className="navbar-nav navbar-nav-top" data-dropdown-on-hover="data-dropdown-on-hover">
            <li className="nav-item dropdown"><Link className="nav-link lh-1" to="/" aria-haspopup="true">
              <Icon icon='tabler:chart-pie-2' width={'16px'} height={'16px'} className="me-1" />
              Dashboard</Link>
            </li>
            <li className="nav-item dropdown"><Link className="nav-link lh-1" to="/cv-builder" aria-haspopup="true">
              <Icon icon='tabler:notes' width={'16px'} height={'16px'} className="me-1" />
              CV Builder</Link>

            </li>
            <li className="nav-item dropdown">
              <Link className="nav-link lh-1" to="/job-search" aria-haspopup="true">
                <Icon icon='tabler:search' width={'16px'} height={'16px'} className="me-1" />
                Job Search
              </Link>
            </li>
            <li className="nav-item dropdown"><Link className="nav-link lh-1" to="/interview" aria-haspopup="true">
              <Icon icon='tabler:brand-line' width={'16px'} height={'16px'} className="me-1" />
              Interview Practise</Link>
            </li>
            <li className="nav-item dropdown"><Link className="nav-link lh-1" to="/application-tracker" aria-haspopup="true">
              <Icon icon='tabler:calendar' width={'16px'} height={'16px'} className="me-1" />
              Application Tracker</Link>

            </li>
          </ul>
        </div>
        <ul className="navbar-nav navbar-nav-icons flex-row">
          <li className="nav-item">
            <div className="theme-control-toggle fa-icon-wait px-2">
              {theme == 'dark' ? (
                <label className="mb-0 theme-control-toggle-label theme-control-toggle-light" onClick={toggleTheme} htmlFor="themeControlToggle" data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Switch theme" style={{ height: '32px', width: '32px' }}><Icon icon='tabler:moon' width={'18px'} height={'18px'} /></label>
              ) : (
                <label className="mb-0 theme-control-toggle-label theme-control-toggle-dark" onClick={toggleTheme} htmlFor="themeControlToggle" data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Switch theme" style={{ height: '32px', width: '32px' }}><Icon icon='tabler:sun-high' width={'18px'} height={'18px'} /></label>
              )}
            </div>
          </li>
          {/* <li className="nav-item">
            <Link className="nav-link" to="#" data-bs-toggle="modal" data-bs-target="#searchBoxModal">
              <span className="d-block" style={{ height: '20px', width: '20px' }}>
                <Icon icon='tabler:search' width={'19px'} height={'19px'} />
              </span>
            </Link>
          </li>
          <li className="nav-item dropdown">
            <Link className="nav-link" to="#" style={{ minWidth: '2.25rem' }} role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-bs-auto-close="outside"><span className="d-block" style={{ height: '20px', width: '20px' }}><Icon icon='tabler:bell' width={'20px'} height={'20px'} /></span></Link>

            <div className="dropdown-menu dropdown-menu-end notification-dropdown-menu py-0 shadow border navbar-dropdown-caret" id="navbarDropdownNotfication" aria-labelledby="navbarDropdownNotfication">
              <div className="card position-relative border-0">
                <div className="card-header p-2">
                  <div className="d-flex justify-content-between">
                    <h5 className="text-body-emphasis mb-0">Notifications</h5>
                    <button className="btn btn-link p-0 fs-9 fw-normal" type="button">Mark all as read</button>
                  </div>
                </div>
                <div className="card-body p-0">
                  <div className="scrollbar-overlay" style={{ height: '27rem' }}>
                    <div className="px-2 px-sm-3 py-3 notification-card position-relative read border-bottom">
                      <div className="d-flex align-items-center justify-content-between position-relative">
                        <div className="d-flex">
                          <div className="avatar avatar-m status-online me-3"><img className="rounded-circle" src="img/team/40x40/30.webp" alt="" />
                          </div>
                          <div className="flex-1 me-sm-3">
                            <h4 className="fs-9 text-body-emphasis">MyPathfinder</h4>
                            <p className="fs-9 text-body-highlight mb-2 mb-sm-3 fw-normal"><span className='me-1 fs-10'>💬</span>Sent you a message!<span className="ms-2 text-body-quaternary text-opacity-75 fw-bold fs-10">10m</span></p>
                            <p className="text-body-secondary fs-9 mb-0"><span className="me-1 fas fa-clock"></span><span className="fw-bold">10:41 AM </span>July 7,2025</p>
                          </div>
                        </div>
                        <div className="dropdown notification-dropdown">
                          <button className="btn fs-10 btn-sm dropdown-toggle dropdown-caret-none transition-none" type="button" data-bs-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent"><span className="fas fa-ellipsis-h fs-10 text-body"></span></button>
                          <div className="dropdown-menu py-2"><Link className="dropdown-item" to="#!">Mark as unread</Link></div>
                        </div>
                      </div>
                    </div>
                    <div className="px-2 px-sm-3 py-3 notification-card position-relative unread border-bottom">
                      <div className="d-flex align-items-center justify-content-between position-relative">
                        <div className="d-flex">
                          <div className="avatar avatar-m status-online me-3">
                            <img className="rounded-circle" src="img/team/40x40/30.webp" alt="" />
                          </div>
                          <div className="flex-1 me-sm-3">
                            <h4 className="fs-9 text-body-emphasis">MyPathfinder</h4>
                            <p className="fs-9 text-body-highlight mb-2 mb-sm-3 fw-normal"><span className='me-1 fs-10'>📅</span>Created an event.<span className="ms-2 text-body-quaternary text-opacity-75 fw-bold fs-10">20m</span></p>
                            <p className="text-body-secondary fs-9 mb-0"><span className="me-1 fas fa-clock"></span><span className="fw-bold">10:20 AM </span>August 2,2025</p>
                          </div>
                        </div>
                        <div className="dropdown notification-dropdown">
                          <button className="btn fs-10 btn-sm dropdown-toggle dropdown-caret-none transition-none" type="button" data-bs-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent"><span className="fas fa-ellipsis-h fs-10 text-body"></span></button>
                          <div className="dropdown-menu py-2"><Link className="dropdown-item" to="#!">Mark as unread</Link></div>
                        </div>
                      </div>
                    </div>
                    <div className="px-2 px-sm-3 py-3 notification-card position-relative read border-bottom">
                      <div className="d-flex align-items-center justify-content-between position-relative">
                        <div className="d-flex">
                          <div className="avatar avatar-m status-online me-3"><img className="rounded-circle" src="img/team/40x40/30.webp" alt="" />
                          </div>
                          <div className="flex-1 me-sm-3">
                            <h4 className="fs-9 text-body-emphasis">MyPathfinder</h4>
                            <p className="fs-9 text-body-highlight mb-2 mb-sm-3 fw-normal"><span className='me-1 fs-10'>💬</span>Sent you a message!<span className="ms-2 text-body-quaternary text-opacity-75 fw-bold fs-10">10m</span></p>
                            <p className="text-body-secondary fs-9 mb-0"><span className="me-1 fas fa-clock"></span><span className="fw-bold">10:41 AM </span>July 7,2025</p>
                          </div>
                        </div>
                        <div className="dropdown notification-dropdown">
                          <button className="btn fs-10 btn-sm dropdown-toggle dropdown-caret-none transition-none" type="button" data-bs-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent"><span className="fas fa-ellipsis-h fs-10 text-body"></span></button>
                          <div className="dropdown-menu py-2"><Link className="dropdown-item" to="#!">Mark as unread</Link></div>
                        </div>
                      </div>
                    </div>
                    <div className="px-2 px-sm-3 py-3 notification-card position-relative unread border-bottom">
                      <div className="d-flex align-items-center justify-content-between position-relative">
                        <div className="d-flex">
                          <div className="avatar avatar-m status-online me-3">
                            <img className="rounded-circle" src="img/team/40x40/30.webp" alt="" />
                          </div>
                          <div className="flex-1 me-sm-3">
                            <h4 className="fs-9 text-body-emphasis">MyPathfinder</h4>
                            <p className="fs-9 text-body-highlight mb-2 mb-sm-3 fw-normal"><span className='me-1 fs-10'>📅</span>Created an event.<span className="ms-2 text-body-quaternary text-opacity-75 fw-bold fs-10">20m</span></p>
                            <p className="text-body-secondary fs-9 mb-0"><span className="me-1 fas fa-clock"></span><span className="fw-bold">10:20 AM </span>August 2,2025</p>
                          </div>
                        </div>
                        <div className="dropdown notification-dropdown">
                          <button className="btn fs-10 btn-sm dropdown-toggle dropdown-caret-none transition-none" type="button" data-bs-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent"><span className="fas fa-ellipsis-h fs-10 text-body"></span></button>
                          <div className="dropdown-menu py-2"><Link className="dropdown-item" to="#!">Mark as unread</Link></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer p-0 border-top border-translucent border-0">
                  <div className="my-2 text-center fw-bold fs-10 text-body-tertiary text-opacity-85"><Link className="fw-bolder" to="#">Notification history</Link></div>
                </div>
              </div>
            </div>
          </li> */}
          <li className="nav-item dropdown"><Link className="nav-link lh-1 pe-0" id="navbarDropdownUser" to="#" role="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-haspopup="true" aria-expanded="false">
            <div className="avatar avatar-l ">
              <img className="rounded-circle " src={data?.profile_img_url || favicon} alt="" />
            </div>
          </Link>
            <div className="dropdown-menu dropdown-menu-end navbar-dropdown-caret py-0 dropdown-profile shadow border" aria-labelledby="navbarDropdownUser">
              <div className="card position-relative border-0">
                <div className="card-body p-0">
                  <div className="text-center pt-4 pb-3">
                    <div className="avatar avatar-xl ">
                      <img className="rounded-circle " src={data?.profile_img_url || favicon} alt="" />
                    </div>
                    <h6 className="mt-2 text-body-emphasis">{data?.name ?? "MPF Admin"}</h6>
                  </div>
                </div>
                <div className="overflow-auto scrollbar">
                  <ul className="nav d-flex flex-column mb-2 pb-1">
                    <li className="nav-item"><Link className="nav-link px-3 d-block" to="/profile"> <span className="me-2 align-bottom" data-feather="user"></span><span>Profile</span></Link></li>
                    <li className="nav-item"><Link className="nav-link px-3 d-block" to="/"><span className="me-2 align-bottom" data-feather="pie-chart"></span>Dashboard</Link></li>
                    <li className="nav-item"><Link className="nav-link px-3 d-block" to="/profile?settings=true"> <span className="me-2 align-bottom" data-feather="settings"></span>Settings &amp; Privacy </Link></li>
                    {/* <li className="nav-item"><Link className="nav-link px-3 d-block" to="#"> <span className="me-2 align-bottom" data-feather="help-circle"></span>Help Center</Link></li> */}
                  </ul>
                </div>
                <div className=" p-0">
                  <hr />
                  <div className="px-3"> <Link onClick={() => dispatch(logout())} className="btn btn-phoenix-secondary d-flex flex-center w-100" to="#"> <span className="me-2" data-feather="log-out"> </span>Sign out</Link></div>
                  <div className="my-2 text-center fw-bold fs-10 text-body-quaternary"><Link className="text-body-quaternary me-1" to="/privacy-policy" target="_blank`">Privacy policy</Link>&bull;<Link className="text-body-quaternary mx-1" to="/terms" target="_blank">Terms</Link>&bull;<Link className="text-body-quaternary ms-1" to="#">Cookies</Link></div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </nav>
      <div className="content" data-bs-theme="light">
        {children}
        <footer className="footer position-absolute" style={{ translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>
          <div className="row g-0 justify-content-between align-items-center h-100">
            <div className="col-12 col-sm-auto text-center">
              <p className="mb-0 mt-2 mt-sm-0 fs-9">2025 © MyPathfinder<span className="d-none d-sm-inline-block"></span></p>
            </div>
            <div className="col-12 col-sm-auto text-center">
              <p className="mb-0 text-body-tertiary text-opacity-85 fs-9">v1.23.0</p>
            </div>
          </div>
        </footer>
        <div className="modal fade" id="searchBoxModal" tabIndex="-1" aria-hidden="true" data-bs-backdrop="true" data-phoenix-modal="data-phoenix-modal">
          <div className="modal-dialog">
            <div className="modal-content mt-15 rounded-pill">
              <div className="modal-body p-0">
                <div className="search-box navbar-top-search-box" data-list='{"valueNames":["title"]}' style={{ width: 'auto' }}>
                  <form className="position-relative" data-bs-toggle="search" data-bs-display="static">
                    <input className="form-control search-input fuzzy-search rounded-pill form-control-lg" type="search" placeholder="Search..." aria-label="Search" />
                    <span className="fas fa-search search-box-icon"></span>
                  </form>
                  <div className="btn-close position-absolute end-0 top-50 translate-middle cursor-pointer shadow-none" data-bs-dismiss="search">
                    <button className="btn btn-link p-0" aria-label="Close"></button>
                  </div>
                  <div className="dropdown-menu border start-0 py-0 overflow-hidden w-100">
                    <div className="scrollbar-overlay" style={{ maxHeight: '30rem' }}>
                      <div className="list pb-3">
                        <h6 className="dropdown-header text-body-highlight fs-9 border-bottom border-translucent py-2 lh-sm">Recently Searched</h6>
                        <div className="py-2">
                          <a className="dropdown-item" href="#">
                            <div className="d-flex align-items-center">
                              <div className="fw-normal text-body-highlight title">
                                <span className="fa-solid fa-clock-rotate-left" data-fa-transform="shrink-2"></span>
                                CV Builder
                              </div>
                            </div>
                          </a>
                          <a className="dropdown-item" href="#">
                            <div className="d-flex align-items-center">
                              <div className="fw-normal text-body-highlight title">
                                <span className="fa-solid fa-clock-rotate-left" data-fa-transform="shrink-2"></span>
                                Manchester Graphic Designer
                              </div>
                            </div>
                          </a>
                        </div>
                        <h6 className="dropdown-header text-body-highlight fs-9 border-bottom border-translucent py-2 lh-sm">Quick Links</h6>
                        <div className="py-2">
                          <a className="dropdown-item" href="cv-builder.html">
                            <div className="d-flex align-items-center">
                              <div className="fw-normal text-body-highlight title">
                                <span className="fa-solid fa-link" data-fa-transform="shrink-2"></span>
                                CV Builder
                              </div>
                            </div>
                          </a>
                          <a className="dropdown-item" href="interview.html">
                            <div className="d-flex align-items-center">
                              <div className="fw-normal text-body-highlight title">
                                <span className="fa-solid fa-link" data-fa-transform="shrink-2"></span>
                                Practise an Interview
                              </div>
                            </div>
                          </a>
                          <a className="dropdown-item" href="tracker.html">
                            <div className="d-flex align-items-center">
                              <div className="fw-normal text-body-highlight title">
                                <span className="fa-solid fa-link" data-fa-transform="shrink-2"></span>
                                View Application History
                              </div>
                            </div>
                          </a>
                          <a className="dropdown-item" href="job-search.html">
                            <div className="d-flex align-items-center">
                              <div className="fw-normal text-body-highlight title">
                                <span className="fa-solid fa-link" data-fa-transform="shrink-2"></span>
                                Search for a Vacancy
                              </div>
                            </div>
                          </a>
                        </div>
                        <hr className="my-0" />
                      </div>
                      <div className="text-center">
                        <p className="fallback fw-bold fs-7 d-none text-body-highlight">No Result Found.</p>
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
};

export default MasterLayout;
