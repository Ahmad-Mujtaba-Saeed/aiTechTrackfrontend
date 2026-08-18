import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, NavLink, } from "react-router-dom";
import { Button, Dropdown } from 'react-bootstrap';


import logo from '../assets/images/logo.png';
import logoLight from '../assets/images/logo.png';

const WHITE_LOGO = '/images/logo.png';
import avatar from '../assets/demo_profile.avif'
import favicon from '../assets/demo_profile.avif';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/user/userSlice";
import ChatBot from "../components/chat-bot-agent/ChatBot";

const MasterLayout = ({ children }) => {

  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.user);

const slug = data?.roles?.[0]?.slug || "user";

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
    return location.pathname === path ? "active" : "";
  };

  const isNavToggled = (path, classes) => {
    // Extract the ID from the path if it matches the pattern
    const pathSegments = location.pathname.split('/');
    const routeWithoutId = pathSegments.slice(0, -1).join('/');

    // If no ID in current path, do exact match
    return routeWithoutId === path ? classes : "";
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
    <main className={`main ${collapsed ? "navbar-vertical-collapsed" : ""} ${isNavToggled('/cv-generate', 'navbar-vertical-collapsed')} `} id="top" data-bs-theme={'dark'}>
      <nav className={`navbar navbar-vertical ${isMobile ? "navbar-expand" : "navbar-expand active"} navbar-expand-lg mobile-expand bg-white navbar-light dark__bg-dark dark__navbar-dark`}>
        <div className="collapse navbar-collapse" id="navbarVerticalCollapse">

          <div className="navbar-vertical-content">
            <Link className="d-block d-lg-none navbar-brand me-1 me-sm-3" to="/">
            <div className="d-flex align-items-center mx-3">
              <img src={WHITE_LOGO} alt="PathForge" width="120" />
            </div>
          </Link>
            <ul className="navbar-nav flex-column" id="navbarVerticalNav">
              <li className="nav-item">
                <p className="navbar-vertical-label">
                  Navigation
                </p>
                <hr className="navbar-vertical-line" />
            
                  <div className="nav-item-wrapper">
                    <Link className={`nav-link label-1 ${isActive('/')}`} to="/" role="button" data-bs-toggle="" aria-expanded="false">
                      <div className="d-flex align-items-center"><span className="nav-link-icon"><Icon icon='tabler:layout-dashboard' width={'18px'} height={'18px'} /></span><span className="nav-link-text-wrapper"><span className="nav-link-text ">Dashboard</span></span>
                      </div>
                    </Link>
                  </div>
                
                <div className="nav-item-wrapper"><Link className={`nav-link label-1 ${isActive('/cv-builder')}`} to="/cv-builder" role="button" data-bs-toggle="" aria-expanded="false">
                  <div className="d-flex align-items-center"><span className="nav-link-icon"><Icon icon='tabler:notes' width={'18px'} height={'18px'} /></span><span className="nav-link-text-wrapper"><span className="nav-link-text">CV Builder</span></span>
                  </div>
                </Link>
                </div>
              </li>
              {slug === 'admin' && (
                <li className="nav-item">
                  <p className="navbar-vertical-label">
                    Admin
                  </p>
                  <hr className="navbar-vertical-line" />

                  <div className="nav-item-wrapper">
                    <Link className={`nav-link label-1 ${isActive('/manage-users')}`} to="/manage-users" role="button" data-bs-toggle="" aria-expanded="false">
                      <div className="d-flex align-items-center"><span className="nav-link-icon"><Icon icon='tabler:users' width={'18px'} height={'18px'} /></span><span className="nav-link-text-wrapper"><span className="nav-link-text">Manage Users</span></span>
                      </div>
                    </Link>
                  </div>
                  <div className="nav-item-wrapper">
                    <Link className={`nav-link label-1 ${isActive('/billing/subscriptions')}`} to="/billing/subscriptions" role="button" data-bs-toggle="" aria-expanded="true">
                      <div className="d-flex align-items-center"><span className="nav-link-icon"><Icon icon='tabler:notes' width={'18px'} height={'18px'} /></span><span className="nav-link-text-wrapper"><span className="nav-link-text">Subscriptions</span></span>
                      </div>
                    </Link>
                  </div>
                  <div className="nav-item-wrapper">
                    <Link className={`nav-link label-1 ${isActive('/billing/transactions')}`} to="/billing/transactions" role="button" data-bs-toggle="" aria-expanded="true">
                      <div className="d-flex align-items-center"><span className="nav-link-icon"><Icon icon='tabler:notes' width={'18px'} height={'18px'} /></span><span className="nav-link-text-wrapper"><span className="nav-link-text">Transactions</span></span>
                      </div>
                    </Link>
                  </div>
                  <div className="nav-item-wrapper">
                    <Link className={`nav-link label-1 ${isActive('/billing/plan-management')}`} to="/billing/plan-management" role="button" data-bs-toggle="" aria-expanded="true">
                      <div className="d-flex align-items-center"><span className="nav-link-icon"><Icon icon='tabler:notes' width={'18px'} height={'18px'} /></span><span className="nav-link-text-wrapper"><span className="nav-link-text">Plan Management</span></span>
                      </div>
                    </Link>
                  </div>
                  <div className="nav-item-wrapper">
                    <Link className={`nav-link label-1 ${isActive('/core-settings')}`} to="/core-settings" role="button" data-bs-toggle="" aria-expanded="false">
                      <div className="d-flex align-items-center"><span className="nav-link-icon"><Icon icon='tabler:settings' width={'18px'} height={'18px'} /></span><span className="nav-link-text-wrapper"><span className="nav-link-text">Core Settings</span></span>
                      </div>
                    </Link>
                  </div>
                  <div className="nav-item-wrapper">
                    <Link className={`nav-link label-1 ${isActive('/ats-checker')}`} to="/ats-checker" role="button" data-bs-toggle="" aria-expanded="false">
                      <div className="d-flex align-items-center"><span className="nav-link-icon"><Icon icon='tabler:file-search' width={'18px'} height={'18px'} /></span><span className="nav-link-text-wrapper"><span className="nav-link-text">ATS Checker</span></span>
                      </div>
                    </Link>
                  </div>
                </li>
              )}
              <li className="nav-item">
                <p className="navbar-vertical-label">Support</p>
                <hr className="navbar-vertical-line" />
                <div className="nav-item-wrapper"><Link className={`nav-link label-1 ${isActive('/career-advice')}`} to="/career-advice" role="button" data-bs-toggle="" aria-expanded="false">
                  <div className="d-flex align-items-center"><span className="nav-link-icon"><Icon icon='tabler:help' width={'18px'} height={'18px'} /></span><span className="nav-link-text-wrapper"><span className="nav-link-text">Careers Advice</span></span>
                  </div>
                </Link>
                </div>
                <div className="nav-item-wrapper"><Link className={`nav-link label-1 ${isActive('/upgrade-subscription')}`} to="/upgrade-subscription" role="button" data-bs-toggle="" aria-expanded="false">
                  <div className="d-flex align-items-center"><span className="nav-link-icon"><Icon icon='tabler:tag' width={'18px'} height={'18px'} /></span><span className="nav-link-text-wrapper"><span className="nav-link-text">Payment Plans</span></span>
                  </div>
                </Link>
                </div>
                <div className="nav-item-wrapper"><Link className={`nav-link label-1`} to="" role="button" data-bs-toggle="" aria-expanded="false" onClick={() => dispatch(logout())}>
                  <div className="d-flex align-items-center"><span className="nav-link-icon"><Icon icon='tabler:logout' width={'18px'} height={'18px'} /></span><span className="nav-link-text-wrapper"><span className="nav-link-text">Sign Out</span></span>
                  </div>
                </Link>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <nav className="navbar navbar-top fixed-top navbar-expand-lg bg-white navbar-light dark__bg-dark dark__navbar-dark" id="navbarDefault">
        <div className="navbar-logo">
          <button className="btn navbar-toggler navbar-toggler-humburger-icon hover-bg-transparent" type="button" onClick={mobileToggle}><span className="navbar-toggle-icon"><span className="toggle-line"></span></span></button>
          <Link className="d-none d-lg-block navbar-brand me-1 me-sm-3" to="/">
            <div className="d-flex align-items-center">
              <img src={WHITE_LOGO} alt="PathForge" width="120" />
            </div>
          </Link>
        </div>

        <div className="collapse navbar-collapse navbar-top-collapse order-1 order-lg-0 justify-content-center" id="navbarTopCollapse">
        </div>
        <ul className="navbar-nav navbar-nav-icons flex-row">

          <li className="nav-item">
            <span style={{ whiteSpace: 'nowrap', color: 'white' }}>
              {new Date(data.plan_expire_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              {' '}
              {new Date(data.plan_expire_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
            </span>
          </li>

          <li className="nav-item">
            <Dropdown drop="down" className="w-100">
              <Dropdown.Toggle variant="primary" className="p-0 Profile-toggler">
                <div className="avatar avatar-l ">
                  <img className="rounded-circle " src={data?.profile_img_url || favicon} alt="" />
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-end navbar-dropdown-caret dropdown-profile p-0 mt-3">
                <div className="card position-relative border-0">
                  <div className="card-body p-0">
                    <div className="pt-4 pb-3 d-flex px-3 align-items-center gap-2">
                      <div className="avatar avatar-xl ">
                        <img className="rounded-circle " src={data?.profile_img_url || favicon} alt="" />
                      </div>
                      <div>
                        <h6 className="mt-2 text-body-emphasis mb-0">{data?.name ?? "MPF Admin"}</h6>
                        <span className="text-body-emphasis-span">{data?.email ?? "MPF Admin"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-auto scrollbar">
                    <ul className="nav d-flex flex-column mb-2 pb-1">
                      <li className="nav-item"><Link className="nav-link px-3 d-block" to="/profile"><Icon icon={'tabler:user-circle'} width={'18px'} height={'18px'} className="me-1" /><span>Profile</span></Link></li>
                                              <li className="nav-item"><Link className="nav-link px-3 d-block" to="/"><Icon icon='tabler:layout-dashboard' width={'18px'} height={'18px'} className="me-1" />Dashboard</Link></li>
                                          <li className="nav-item"><Link className="nav-link px-3 d-block logout-link" to="#" onClick={() => dispatch(logout())}> <Icon icon={'tabler:logout'} width={'18px'} height={'18px'} className="me-1" />Sign Out </Link></li>
                    </ul>
                  </div>
                  <div className=" p-0">
                    <hr className="mt-0" />
                    <div className="mt-2 mb-3 text-center fw-bold fs-10 text-body-quaternary"><Link className="text-body-quaternary me-1" to="/privacy-policy" target="_blank`">Privacy policy</Link>&bull;<Link className="text-body-quaternary mx-1" to="/terms" target="_blank">Terms</Link>&bull;<Link className="text-body-quaternary ms-1" to="#">Cookies</Link></div>
                  </div>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </li>

        </ul>
      </nav>
      <div className={`content ${isNavToggled('/cv-generate', 'pb-0 overflow-hidden')}`} data-bs-theme="light">
        <div className="content-bg"></div>
        {children}
        <footer className={`footer position-absolute ${isNavToggled('/cv-generate', 'd-none')}`} style={{ translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>
          <div className="row g-0 justify-content-between align-items-center h-100">
            <div className="col-12 col-sm-auto text-center">
              <p className="mb-0 mt-2 mt-sm-0 fs-9">2025 © PathForge<span className="d-none d-sm-inline-block"></span></p>
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
                                PathForge
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
