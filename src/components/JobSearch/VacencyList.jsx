import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import Avatar from '../../assets/images/MPF-180x180.png'
import { Button, Modal, Badge , Form} from "react-bootstrap";
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs, setfilteredJobs , JobAppliedCreate } from "../../features/job/jobSlice";
import { PulseLoader } from "react-spinners";
import { getrecentCvsCreated, delCreatedCv , createEmptyResume , updateResumeName } from '../../features/resume/resumeSlice';
import { updateCompletedSteps } from "../../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Pagination } from 'react-bootstrap';
import RecentCVsTable from '../../components/CvBuilder/RecentCVsTable';


const VacanciesList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

    const {
      recentCVsLoader,
      recentCVs,
      delResumeLoader
    } = useSelector((state) => state.resume);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("uk");
  const [country, setCountry] = useState("uk");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [salaryRange, setSalaryRange] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const { filteredJobs, jobs, loading, error } = useSelector((state) => state.job);
  const [selectedJob, setSelectedJob] = useState(null);
  const { data } = useSelector((state) => state.user);
    // Initialize component
    useEffect(() => {
      dispatch(getrecentCvsCreated());
    }, [dispatch]);
  const [showModal, setShowModal] = useState(false);

  const [showModalMPFCV, setShowModalMPFCV] = useState(false);





    const handleManualCV = async () => {
      const emptyResume = {
        candidateName: [{ firstName: '', familyName: '' }],
        headline: '',
        summary: '',
        phoneNumber: [{ formattedNumber: '' }],
        email: [''],
        location: { formatted: '' },
        workExperience: [],
        education: [],
        skill: [],
        profilePic: null,
        website: [''],
        certifications: [],
        languages: [],
        hobbies: []
      };
  
      try {
        const resultAction = await dispatch(createEmptyResume(emptyResume)).unwrap();
  
        if (resultAction?.data?.id) {
          navigate(`/cv-generate/${resultAction.data.id}`);
          toast.success('Empty CV created successfully! Start editing your CV.');
        }
      } catch (error) {
        console.error('Error creating empty CV:', error);
        toast.error(error?.message || "Failed to create empty CV. Please try again.");
      }
    };

  const ukCities = [
    "All",
    "London",
    "Birmingham",
    "Glasgow",
    "Manchester",
    "Liverpool",
    "Bristol",
    "Leeds",
    "Sheffield",
    "Edinburgh",
    "Cardiff",
    "Belfast",
    "Newcastle upon Tyne",
    "Nottingham",
    "Coventry",
    "Leicester",
    "Bradford",
    "Aberdeen",
    "Stoke-on-Trent",
    "Wolverhampton",
    "Plymouth",
    "Southampton",
    "Derby",
    "Brighton and Hove",
    "Cambridge",
    "Oxford",
    "Milton Keynes",
    "Portsmouth",
    "York",
    "Swansea",
    "Dundee",
    "Norwich",
    "Exeter",
    "Gloucester",
    "Salford",
    "Peterborough",
    "Canterbury",
    "Bath",
    "Chester",
    "Durham",
    "Lincoln",
    "St Davids"
  ];


  const [salaryRanges, setSalaryRanges] = useState([
    { label: "All Salaries", value: "0-0" },
    { label: "£20,000 +", value: "20000-1000000" },
    { label: "£25,000 +", value: "25000-1000000" },
    { label: "£30,000 +", value: "30000-1000000" },
    { label: "£35,000 +", value: "35000-1000000" },
    { label: "£40,000 +", value: "40000-1000000" },
    { label: "£50,000 +", value: "50000-1000000" },
    { label: "£60,000 +", value: "60000-1000000" },
    { label: "£70,000 +", value: "70000-1000000" },
    { label: "£80,000 +", value: "80000-1000000" },
    { label: "£100,000 +", value: "100000-1000000" },
    { label: "£150,000+", value: "150000-1000000" }
  ]);



  const handleJobSearch = () => {
    dispatch(fetchJobs({ searchQuery, location, country, remote: remoteOnly }))
  }


  const handleJobClick = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowFullDescription(false);
    setShowModal(false);
    setSelectedJob(null);
  };

    const handleRenameCv = async (resumeId, title) => {
      const newName = prompt('Enter new name for CV:', title);
      if (newName && newName.trim() && newName !== title) {
        try {
          const updateResult = await dispatch(updateResumeName({id: resumeId, name: newName})).unwrap();
          console.log(updateResult);
          if (updateResult?.data) {
            dispatch(getrecentCvsCreated({}));
            toast.success('CV renamed successfully');
          }
        } catch (error) {
          toast.error(error.message || 'Failed to rename CV');
        }
      }
    };



      const handleDeleteCv = (resumeId) => {
        dispatch(delCreatedCv(resumeId))
          .unwrap()
          .then(() => {
            toast.success('CV deleted successfully');
            dispatch(getrecentCvsCreated());
          })
          .catch((error) => {
            toast.error(error.message || 'Failed to delete CV');
          });
      };
    

    // Add these states at the top of your component
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(5); // Default items per page

// Update your useEffect that fetches the data
useEffect(() => {
  dispatch(getrecentCvsCreated({ page: currentPage, perPage: itemsPerPage }));
}, [dispatch, currentPage, itemsPerPage]);

// In your component's return, add the pagination controls
<div className="d-flex justify-content-between align-items-center mt-3">
  <div className="d-flex align-items-center">
    <span className="me-2">Show:</span>
    <Form.Select 
      size="sm" 
      style={{ width: '80px' }} 
      value={itemsPerPage}
      onChange={(e) => setItemsPerPage(Number(e.target.value))}
    >
      <option value="5">5</option>
      <option value="10">10</option>
      <option value="20">20</option>
      <option value="50">50</option>
    </Form.Select>
  </div>
  
  <Pagination>
    <Pagination.First 
      onClick={() => setCurrentPage(1)} 
      disabled={currentPage === 1} 
    />
    <Pagination.Prev 
      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
      disabled={currentPage === 1} 
    />
    
    {Array.from({ length: Math.min(5, recentCVs.last_page || 1) }, (_, i) => {
      const pageNum = Math.max(1, 
        Math.min(
          (recentCVs.last_page || 1) - 4,
          Math.max(1, currentPage - 2)
        ) + i
      );
      return (
        <Pagination.Item 
          key={pageNum} 
          active={pageNum === currentPage}
          onClick={() => setCurrentPage(pageNum)}
        >
          {pageNum}
        </Pagination.Item>
      );
    })}
    
    <Pagination.Next 
      onClick={() => setCurrentPage(prev => Math.min(prev + 1, recentCVs.last_page || 1))} 
      disabled={currentPage === (recentCVs.last_page || 1)} 
    />
    <Pagination.Last 
      onClick={() => setCurrentPage(recentCVs.last_page || 1)} 
      disabled={currentPage === (recentCVs.last_page || 1)} 
    />
  </Pagination>
</div>

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleJobRedirect = async (job, link) => {
    // Prevent multiple clicks
    if (isButtonDisabled) return;
    
    // Disable the button and set cooldown
    setIsButtonDisabled(true);
    
    try {
      // Create a new object with proper boolean values
      const jobData = {
        job: job,
        title: job.job_title || 'No Title',
        company: job.employer_name || 'No Company',
        status: 'prep' // Update status to reflect application sent
      };
      
      // Convert to JSON and back to ensure proper typing
      const sanitizedData = JSON.parse(JSON.stringify(jobData));
      
      await dispatch(JobAppliedCreate(sanitizedData)).unwrap();
    } catch (error) {
      console.error('Error saving job application:', error);
      // Still proceed with the redirect even if saving fails
    }
    
    try {
      const formData = new FormData();
      formData.append("applied_job", "true"); // Send as string "true"

      await dispatch(updateCompletedSteps(formData)).unwrap();
      window.open(link, "_blank");
    } catch (error) {
      console.error("Error updating steps:", error);
      window.open(link, "_blank");
    } finally {
      // Re-enable the button after 3 seconds
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 3000);
    }
  };






  // const [vacancies] = useState([
  //     {
  //         position: "Senior Software Developer",
  //         location: "Manchester",
  //         date: "01/08/2025",
  //         salary: "£53,000+",
  //         applyNow: "#",
  //         applyWithMpf: "#"
  //     },
  //     {
  //         position: "Team Leader",
  //         location: "Stockport",
  //         date: "01/08/2025",
  //         salary: "£60,000+",
  //         applyNow:
  //             "https://uk.indeed.com/cmp/Clear-Business?from=mobviewjob&tk=1j31b3rm7l13m81f&fromjk=82f6edbbb857fc35&attributionid=mobvjcmp",
  //         applyWithMpf: "#pdfModal"
  //     }
  // ]);

  // Transform jobs data for DataTable
  const vacancies = useMemo(() => {
    if (!filteredJobs || filteredJobs.length === 0) {
      return [
      ];
    }

    return filteredJobs.map(job => ({
      position: job.job_title || "N/A",
      company: job.employer_name || "N/A",
      location: job.job_location || "N/A",
      date: job.job_posted_at || (job.created_at ? new Date(job.created_at).toLocaleDateString() : "N/A"),
      salary: job.job_min_salary || job.job_max_salary ? (
        `${job.job_salary_currency || '£'} ${job.job_min_salary === job.job_max_salary
          ? job.job_min_salary.toLocaleString()
          : `${job.job_min_salary?.toLocaleString() || '0'} - ${job.job_max_salary?.toLocaleString()}`
        }/year`
      ) : "Not specified",
      applyNow: job.job_url || "#",
      applyWithMpf: "#",
      job_id: job.job_id,
      employer_logo: job.employer_logo,
      full_job: job
    }));
  }, [filteredJobs]);

  // ✅ Define DataTable columns
  const columns = useMemo(
    () => [
      {
        name: (<strong>Job Position</strong>),
        selector: (row) => row.position,
        sortable: true,
        cell: (row) => (
          <div className="d-flex align-items-center cursor-pointer" onClick={() => { handleJobClick(row.full_job) }}>
            {/* {row.employer_logo && (
              <img
                src={row.employer_logo}
                alt={row.company}
                className="me-2"
                style={{
                  width: '24px',
                  height: '24px',
                  objectFit: 'contain',
                  borderRadius: '4px'
                }}
              />
            )} */}
            <span className="fw-bold text-primary">
              {row.position.split(' ').length > 7
                ? row.position.split(' ').slice(0, 7).join(' ') + '...'
                : row.position}
            </span>
          </div>
        ),
        minWidth: '250px',
      },
      {
        name: (<strong>Company</strong>),
        selector: (row) => row.company,
        sortable: true,
        maxWidth: '150px'
      },
      {
        name: (<strong>Location</strong>),
        selector: (row) => row.location,
        sortable: true,
        maxWidth: '160px'
      },
      {
        name: (<strong>Date</strong>),
        selector: (row) => row.date,
        sortable: true,
        maxWidth: '140px'
      },
      {
        name: (<strong>Salary</strong>),
        selector: (row) => row.salary,
        sortable: true,
        maxWidth: '160px'
      },
      {
        name: (<strong>Actions</strong>),
        cell: (row) => (
          <div className="d-flex gap-2">
            {/* Apply Now */}
            <button
              className="badge bg-secondary-subtle text-secondary-dark border"
              onClick={() => { handleJobClick(row.full_job) }}
              target="_blank"
              rel="noreferrer"
            >
              Apply Now
            </button>

            {/* Apply with MPF */}
            {row.applyWithMpf.startsWith("#") ? (
              <button
                className="badge bg-secondary-subtle text-secondary-dark border text-primary"
                style={{ backgroundColor: "#ece5fc", color: "#BA67EF" }}
                data-bs-toggle="modal"
                data-bs-target={row.applyWithMpf}
                onClick={() => setShowModalMPFCV(true)}
              >
                Apply with MPF CV
              </button>
            ) : (
              <button
                className="badge bg-secondary-subtle text-secondary-dark border text-primary"
                style={{ backgroundColor: "#ece5fc", color: "#BA67EF" }}
                href={row.applyWithMpf}
                onClick={() => setShowModalMPFCV(true)}
              >
                Apply with MPF CV
              </button>
            )}
          </div>
        ),
        minWidth: '220px',
      }
    ],
    []
  );

  return (
    <div className="pb-9">
      <div className="row g-3 g-xl-4">



        {/* Sidebar */}
        <div className="col-xl-5 col-xxl-4">
          <div className="sticky-leads-sidebar">
            <div className="card mb-3">
              <div className="card-body">
                <div className="row align-items-center g-3">
                  <div className="col-12 col-sm-auto flex-1">
                    <div className="d-md-flex d-xl-block align-items-center justify-content-between">
                      <div className="d-flex align-items-center mb-3 mb-md-0 mb-xl-3">
                        <div className="avatar avatar-xl me-3">
                          <img
                            className="rounded-circle"
                            src={data?.profile_img_url || Avatar}
                            alt=""
                          />
                        </div>
                        <div>
                          <h4>{data?.name}</h4>
                          <div className="dropdown">
                            <div>
                              {data?.role?.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="card">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-12">
                    <div className="mb-4">
                      <div className="d-flex flex-wrap justify-content-between mb-2">
                        <h5 className="mb-0 text-body-highlight me-2">Job Title</h5>
                      </div>
                      <input className="form-control mb-3" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value) }} />
                    </div>
                    {/* <div className="mb-4">
                                            <div className="d-flex flex-wrap justify-content-between mb-2">
                                                <h5 className="mb-0 text-body-highlight me-2">Industry</h5>
                                            </div>
                                            <select className="form-select mb-3" aria-label="category">
                                                <option value="tech">Tech</option>
                                                <option value="finance">Finance</option>
                                                <option value="marketing">Marketing</option>
                                                <option value="e-commerce">E-commerce</option>
                                                <option value="catering">Catering</option>
                                            </select>
                                        </div> */}
                    <div className="mb-4">
                      <h5 className="mb-0 text-body-highlight mb-2">Location</h5>
                      <input 
                        type="text" 
                        className="form-control mb-3" 
                        placeholder="Enter location (e.g., London, Manchester)" 
                        value={location === "uk" ? "" : location}
                        onChange={(e) => setLocation(e.target.value || "uk")}
                        aria-label="Enter location"
                      />
                    </div>
                    {/* <div className="mb-4">
                                            <h5 className="mb-0 text-body-highlight mb-2">Date Posted</h5>
                                            <select className="form-select mb-3" aria-label="stage">
                                                <option value="any">Any time</option>
                                            </select>
                                        </div> */}
                    <div>
                      <div className="d-flex flex-wrap justify-content-between mb-2">
                        <h5 className="mb-0 text-body-highlight me-2">
                          Salary Expectation
                        </h5>
                      </div>
                      <select className="form-select mb-3" aria-label="lead-source"
                        value={salaryRange}
                        onChange={(e) => {
                          setSalaryRange(e.target.value);
                          if (e.target.value === "0-0") {
                            // For "All Salaries" option, show all jobs with 0/null at bottom
                            const sortedJobs = [...jobs].sort((a, b) => {
                              const aSalary = a.job_max_salary ?? a.job_min_salary ?? 0;
                              const bSalary = b.job_max_salary ?? b.job_min_salary ?? 0;
                              if (aSalary === 0 && bSalary === 0) return 0;
                              if (aSalary === 0) return 1;
                              if (bSalary === 0) return -1;
                              return bSalary - aSalary; // Sort by salary in descending order
                            });
                            dispatch(setfilteredJobs(sortedJobs));
                            return;
                          }

                          const [min, max] = e.target.value.split("-").map(Number);
                          // First filter, then sort
                          const filteredAndSorted = [...jobs]
                            .filter(job => {
                              const salary = job.job_max_salary ?? job.job_min_salary ?? 0;
                              // Include jobs within range OR jobs with 0/null salary
                              return (salary >= min && salary <= max) || salary === 0;
                            })
                            .sort((a, b) => {
                              const aSalary = a.job_max_salary ?? a.job_min_salary ?? 0;
                              const bSalary = b.job_max_salary ?? b.job_min_salary ?? 0;
                              // Push 0/null salaries to bottom
                              if (aSalary === 0 && bSalary === 0) return 0;
                              if (aSalary === 0) return 1;
                              if (bSalary === 0) return -1;
                              // Sort by salary in descending order
                              return bSalary - aSalary;
                            });

                          dispatch(setfilteredJobs(filteredAndSorted));
                        }}

                      >
                        {salaryRanges.map((range, index) => (
                          <option key={index} value={range.value}>
                            {range.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-4">
                      <h5 className="mb-0 text-body-highlight mb-2">Work Type</h5>
                      <Form.Check 
                        type="switch"
                        id="remote-switch"
                        label="Remote/Hybrid Only"
                        checked={remoteOnly}
                        onChange={(e) => setRemoteOnly(e.target.checked)}
                        className="mb-2"
                      />
                      <small className="text-muted">
                        {remoteOnly ? 'Showing only remote and hybrid positions' : 'Showing all positions'}
                      </small>
                    </div>

                  </div>
                  <Button className="text-align-center d-flex justify-content-center" style={{ height: "40px" }} disabled={loading} onClick={handleJobSearch}>
                    {loading ? <PulseLoader color="#fff" size={13} /> : (
                      <>
                        <FiSearch fontSize={14} />
                        &nbsp; Search
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Vacancies Table */}
        <div className="col-xl-7 col-xxl-8">
          {/* <div className="row g-3 justify-content-between mb-2">
                        <div className="col-12">
                            <div className="d-md-flex justify-content-between">
                                <div className="d-flex mb-3">
                                    <div className="search-box me-2">
                                        <form className="position-relative">
                                            <input
                                                className="form-control search-input search"
                                                type="search"
                                                placeholder="Search vacancies"
                                                aria-label="Search"
                                            />
                                            <svg width={13} className="svg-inline--fa fa-magnifying-glass search-box-icon" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="magnifying-glass" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path></svg>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}

          {/* Table */}
          <div className="row g-3">
            <div className="col-12">
              <div className="card h-100">
                <div className="card-body py-0 scrollbar to-do-list-body">
                  <DataTable
                    columns={columns}
                    data={vacancies}
                    pagination
                    responsive
                    persistTableHead
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Details Modal */}
      <Modal
        show={showModal}
        style={{ zIndex: 1050 }}
        onHide={handleCloseModal}
        size="lg"
        centered
      >
        {selectedJob && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedJob.job_title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">
                <h5>{selectedJob.employer_name}</h5>
                <div className="d-flex flex-wrap gap-2 mb-2">
                  <Badge bg="primary">{selectedJob.job_employment_type}</Badge>
                  {selectedJob.job_is_remote && (
                    <Badge bg="success">Remote</Badge>
                  )}
                  <Badge bg="info">{selectedJob.job_location}</Badge>
                </div>
                {selectedJob.job_posted_at && (
                  <p className="text-muted">
                    Posted: {selectedJob.job_posted_at}
                  </p>
                )}
                {(selectedJob.job_min_salary || selectedJob.job_max_salary) ? (
                  <div className="mt-2">
                    <span className="fw-bold">
                      {selectedJob.job_salary_currency} {selectedJob.job_min_salary === selectedJob.job_max_salary
                        ? `${selectedJob.job_min_salary.toLocaleString()}/year`
                        : `${selectedJob.job_min_salary.toLocaleString()} - ${selectedJob.job_max_salary.toLocaleString()}/year`}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted">Salary not specified</span>
                )}
              </div>

              <div className="mb-3">
                <h6>Job Description</h6>
                <div
                  style={{
                    maxHeight: showFullDescription ? 'none' : '150px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  <p style={{ whiteSpace: 'pre-line' }}>{selectedJob.job_description}</p>
                  {!showFullDescription && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '50px',
                        background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 100%)'
                      }}
                    />
                  )}
                </div>
                {selectedJob.job_description && selectedJob.job_description.split(/\s+/).length > 100 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="btn btn-link p-0 text-primary mt-2"
                    style={{
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 500
                    }}
                  >
                    {showFullDescription ? 'Show Less' : 'Read More'}
                  </button>
                )}
              </div>

              {selectedJob.job_highlights &&
                Object.keys(selectedJob.job_highlights).length > 0 && (
                  <div className="mb-3">
                    <h6>Highlights</h6>
                    {Object.entries(selectedJob.job_highlights).map(
                      ([key, values]) => (
                        <div key={key} className="mb-2">
                          <strong>{key}:</strong>
                          <ul className="mb-1">
                            {values.map((value, i) => (
                              <li key={i}>{value}</li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                )}

              <div className="mb-3">
                {/* <h6>Apply Options</h6> */}
                <div className="d-grid gap-2">
                  {/* {selectedJob.apply_options &&
                    selectedJob.apply_options.map((option, index) => (
                      <Button
                        key={index}
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleJobRedirect(option.apply_link)}
                      >
                        Apply via {option.publisher}
                      </Button>
                    ))} */}
                  {selectedJob.job_apply_link && (
                    <>
                    <Button
                      variant="primary"
                      onClick={() => handleJobRedirect(selectedJob, selectedJob.job_apply_link)}
                      disabled={isButtonDisabled}
                    >
                      {isButtonDisabled ? 'Processing...' : 'Apply Now'}
                    </Button>
                    <center>
                    <div>We'll add this to your tracker!</div>
                    </center>
                    </>
                  )}
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
      {/* {Array.isArray(recentCVs?.data) && recentCVs?.data.length > 0 && ( */}
      <div className="col-12">
      <Modal 
        show={showModalMPFCV} 
        onHide={() => setShowModalMPFCV(false)}
        size="lg"
        aria-labelledby="recent-cvs-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Your Recent CVs</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container-fluid">
            <RecentCVsTable
  data={recentCVs.data}
  currentPage={currentPage}
  setCurrentPage={setCurrentPage}
  lastPage={recentCVs.last_page}
  delResumeLoader={delResumeLoader}
  handleRenameCv={handleRenameCv}
  handleDeleteCv={handleDeleteCv}
  compact={true} 
/>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleManualCV}>
            Create New CV
          </Button>
        </Modal.Footer>
      </Modal>
          </div>
        {/* )} */}
    </div>
  );
};

export default VacanciesList;
