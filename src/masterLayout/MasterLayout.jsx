import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, NavLink, } from "react-router-dom";
import { Button } from 'react-bootstrap';
// import ThemeToggleButton from "../helper/ThemeToggleButton";
// import { useAuth } from "../context/AuthContext";


import logo from '../assets/images/CV-Builder.svg';
import logoLight from '../assets/images/CV-Builder.svg';
import avatar from '../assets/demo_profile.avif'
import favicon from '../assets/demo_profile.avif';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/user/userSlice";
import ChatBot from "../components/chat-bot-agent/ChatBot";

const MasterLayout = ({ children }) => {

  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.user);

  const { slug } = data.roles[0].slug ? data.roles[0] : { slug: 'user' };

  console.log("Role Slug:", slug);

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
    return location.pathname === path ? "active" : "";
  };

  const isNavToggled = (path, classes) => {
    // Extract the ID from the path if it matches the pattern
    const pathSegments = location.pathname.split('/');
    const routeWithoutId = pathSegments.slice(0, -1).join('/');

    console.log(routeWithoutId)

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
    <main className={`main ${collapsed ? "navbar-vertical-collapsed" : ""} ${isNavToggled('/cv-generate', 'navbar-vertical-collapsed')} `} id="top" data-bs-theme={theme}>
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
                    <Link className={`nav-link label-1 ${isActive('/core-settings')}`} to="/core-settings" role="button" data-bs-toggle="" aria-expanded="false">
                      <div className="d-flex align-items-center"><span className="nav-link-icon"><Icon icon='tabler:settings' width={'18px'} height={'18px'} /></span><span className="nav-link-text-wrapper"><span className="nav-link-text">Core Settings</span></span>
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
        {/* <div className="navbar-vertical-footer">
          <button className="btn navbar-vertical-toggle border-0 fw-semibold w-100 white-space-nowrap d-flex align-items-center" onClick={toggleNavbar}><span className="uil uil-left-arrow-to-left fs-8"></span><span className="uil uil-arrow-from-right fs-8"></span><span className="navbar-vertical-footer-text ms-2">Collapsed View</span></button>
        </div> */}
      </nav>
      <nav className="navbar navbar-top fixed-top navbar-expand-lg bg-white navbar-light dark__bg-dark dark__navbar-dark" id="navbarDefault">
        <div className="navbar-logo">
          <button className="btn navbar-toggler navbar-toggler-humburger-icon hover-bg-transparent" type="button" onClick={mobileToggle}><span className="navbar-toggle-icon"><span className="toggle-line"></span></span></button>
          <Link className="navbar-brand me-1 me-sm-3" to="/">
            <div className="d-flex align-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 140" width={250}>

                <defs>

                  <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#d946ef', stopOpacity: 1 }} />
                  </linearGradient>


                  <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
                  </linearGradient>


                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  <filter id="softGlow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.15" />
                  </filter>
                </defs>


                <circle cx="65" cy="70" r="55" fill="#5a5a5a" opacity="0.3" />


                <g transform="translate(25, 25)" filter="url(#shadow)">

                  <rect x="15" y="10" width="70" height="90" rx="8" fill="#5a5a5a" />

                  <rect x="20" y="15" width="60" height="80" rx="6" fill="white" opacity="0.95" />

                  <circle cx="50" cy="30" r="8" fill="#5a5a5a" opacity="0.5" />
                  <circle cx="50" cy="28" r="3" fill="#fff" />
                  <path d="M 44 33 Q 44 30, 50 30 T 56 33" stroke="#fff" stroke-width="1.5" fill="none" stroke-linecap="round" />

                  <rect x="28" y="45" width="44" height="3" rx="1.5" fill="#5a5a5a" opacity="0.3" />
                  <rect x="28" y="51" width="38" height="2" rx="1" fill="#5a5a5a" opacity="0.15" />
                  <rect x="28" y="56" width="42" height="2" rx="1" fill="#5a5a5a" opacity="0.15" />

                  <rect x="28" y="64" width="36" height="3" rx="1.5" fill="#5a5a5a" opacity="0.3" />
                  <rect x="28" y="70" width="40" height="2" rx="1" fill="#5a5a5a" opacity="0.15" />
                  <rect x="28" y="75" width="34" height="2" rx="1" fill="#5a5a5a" opacity="0.15" />

                  <rect x="28" y="83" width="32" height="3" rx="1.5" fill="#5a5a5a" opacity="0.3" />

                  <g transform="translate(75, 80)">
                    <circle cx="0" cy="0" r="12" fill="url(#accentGradient)" filter="url(#softGlow)" />
                    <path d="M -5 -1 L -2 3 L 5 -4" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
                  </g>
                </g>

                <g transform="translate(120, 0)">
                  <text x="10" y="94" font-family="'Google Sans Flex', cursive, 'Segoe UI', Arial, sans-serif" font-size="60" font-weight="500" letter-spacing="0">
                    <tspan fill="#ffffff4d">CV</tspan>
                    <tspan fill="#fff" dx="0">Builder</tspan>
                  </text>
                </g>

                <g transform="translate(420, 30)" opacity="0.9">
                  <path d="M 0,-8 L 2,-2 L 8,0 L 2,2 L 0,8 L -2,2 L -8,0 L -2,-2 Z" fill="url(#accentGradient)" filter="url(#glow)">
                    <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
                  </path>
                </g>

                <g transform="translate(450, 70)" opacity="0.85">
                  <path d="M 0,-6 L 1.5,-1.5 L 6,0 L 1.5,1.5 L 0,6 L -1.5,1.5 L -6,0 L -1.5,-1.5 Z" fill="#8b5cf6" filter="url(#glow)">
                    <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="6s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
                  </path>
                </g>

                <g transform="translate(440, 105)" opacity="0.8">
                  <path d="M 0,-4 L 1,-1 L 4,0 L 1,1 L 0,4 L -1,1 L -4,0 L -1,-1 Z" fill="#d946ef" filter="url(#softGlow)">
                    <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.5s" repeatCount="indefinite" />
                  </path>
                </g>


                <g transform="translate(115, 25)" opacity="0.7">
                  <path d="M 0,-3 L 0.7,-0.7 L 3,0 L 0.7,0.7 L 0,3 L -0.7,0.7 L -3,0 L -0.7,-0.7 Z" fill="#fbbf24" filter="url(#softGlow)">
                    <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="10s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite" />
                  </path>
                </g>

                <g transform="translate(290, 65)" opacity="0.6">
                  <circle cx="0" cy="0" r="2" fill="#fbbf24" filter="url(#softGlow)">
                    <animate attributeName="r" values="1.5;3;1.5" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" />
                  </circle>
                </g>

                <g opacity="0.4">
                  <circle cx="380" cy="50" r="1.5" fill="#8b5cf6">
                    <animate attributeName="cy" values="50;45;50" dur="4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.2;0.6;0.2" dur="4s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="410" cy="90" r="1.5" fill="#d946ef">
                    <animate attributeName="cy" values="90;85;90" dur="5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.2;0.6;0.2" dur="5s" repeatCount="indefinite" />
                  </circle>
                </g>
              </svg>
            </div>
          </Link>
        </div>
        <div className="collapse navbar-collapse navbar-top-collapse order-1 order-lg-0 justify-content-center" id="navbarTopCollapse">
          {/* <ul className="navbar-nav navbar-nav-top" data-dropdown-on-hover="data-dropdown-on-hover">
            <li className="nav-item dropdown"><Link className="nav-link lh-1" to="/" aria-haspopup="true">
              <Icon icon='tabler:chart-pie-2' width={'16px'} height={'16px'} className="me-1" />
              Dashboard</Link>
            </li>
            <li className="nav-item dropdown"><Link className="nav-link lh-1" to="/cv-builder" aria-haspopup="true">
              <Icon icon='tabler:notes' width={'16px'} height={'16px'} className="me-1" />
              CV Builder</Link>
            </li>
          </ul> */}
        </div>
        <ul className="navbar-nav navbar-nav-icons flex-row">
          {/* <li className="nav-item">
            <div className="theme-control-toggle fa-icon-wait px-2">
              {theme == 'dark' ? (
                <label className="mb-0 theme-control-toggle-label theme-control-toggle-light" onClick={toggleTheme} htmlFor="themeControlToggle" data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Switch theme" style={{ height: '32px', width: '32px' }}><Icon icon='tabler:moon' width={'18px'} height={'18px'} /></label>
              ) : (
                <label className="mb-0 theme-control-toggle-label theme-control-toggle-dark" onClick={toggleTheme} htmlFor="themeControlToggle" data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Switch theme" style={{ height: '32px', width: '32px' }}><Icon icon='tabler:sun-high' width={'18px'} height={'18px'} /></label>
              )}
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
                    <li className="nav-item"><Link className="nav-link px-3 d-block" to="/profile?settings=true"> <Icon icon={'tabler:settings'} width={'18px'} height={'18px'} className="me-1" />Settings &amp; Privacy </Link></li>
                    <li className="nav-item"><Link className="nav-link px-3 d-block logout-link" to="#" onClick={() => dispatch(logout())}> <Icon icon={'tabler:logout'} width={'18px'} height={'18px'} className="me-1" />Sign Out </Link></li>
                  </ul>
                </div>
                <div className=" p-0">
                  <hr className="mt-0" />
                  <div className="mt-2 mb-3 text-center fw-bold fs-10 text-body-quaternary"><Link className="text-body-quaternary me-1" to="/privacy-policy" target="_blank`">Privacy policy</Link>&bull;<Link className="text-body-quaternary mx-1" to="/terms" target="_blank">Terms</Link>&bull;<Link className="text-body-quaternary ms-1" to="#">Cookies</Link></div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </nav>
      <div className={`content ${isNavToggled('/cv-generate', 'pb-0')}`} data-bs-theme="light">
        {children}
        <footer className={`footer position-absolute ${isNavToggled('/cv-generate', 'd-none')}`} style={{ translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>
          <div className="row g-0 justify-content-between align-items-center h-100">
            <div className="col-12 col-sm-auto text-center">
              <p className="mb-0 mt-2 mt-sm-0 fs-9">2025 © Cv Builder<span className="d-none d-sm-inline-block"></span></p>
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
      <ChatBot />
    </main>
  );
};

export default MasterLayout;
