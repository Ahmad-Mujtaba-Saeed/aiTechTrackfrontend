import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Modal, Button, Card, Form, Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import {
  createEmptyResume,
  uploadExistingResume,
  updateResumeById,
  generateCvAi,
  getrecentCvsCreated,
  delCreatedCv,
  updateResumeName
} from '../../features/resume/resumeSlice';
import { toast } from 'react-toastify';
import { FiLoader, FiFile, FiX } from "react-icons/fi";
import { Pagination } from 'react-bootstrap';
import { Spinner } from "react-bootstrap";
import { set } from 'lodash';
import RecentCVsTable from './RecentCVsTable';


export default function BuildingComponents() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading,
    error,
    AiCvLoader,
    emptyResumeLoader,
    recentCVsLoader,
    recentCVs,
    delResumeLoader
  } = useSelector((state) => state.resume);

  // State for AI CV generation modal
  const [showAiModal, setShowAiModal] = useState(false);
  const [showFinalize, setShowFinalize] = useState(false);
  const [message, setMessage] = useState('Uploading your CV for analysis — this may take a moment...')

  // State for file upload modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // State for upload form data
  const [uploadFormData, setUploadFormData] = useState({
    languageStyle: '',
    additionalInfo: ''
  });

  // State for AI generation form data
  const [aiFormData, setAiFormData] = useState({
    jobTitle: "",
    description: "",
  });

  // Initialize component
  useEffect(() => {
    dispatch(getrecentCvsCreated());
  }, [dispatch]);

  // Modal handlers
  const handleCloseAiModal = () => setShowAiModal(false);
  const handleShowAiModal = () => setShowAiModal(true);

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
    setUploadFormData({ languageStyle: '', additionalInfo: '' });
  };

  const handleShowUploadModal = (file) => {
    setSelectedFile(file);
    setShowUploadModal(true);
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

  // Manual CV creation
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

  // AI CV generation
  const handleCvAiGeneration = async () => {
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
      const createResult = await dispatch(createEmptyResume(emptyResume)).unwrap();

      if (createResult?.data?.id) {
        const resumeId = createResult.data.id;

        try {
          const aiResult = await dispatch(generateCvAi(aiFormData)).unwrap();

          const updatedResume = {
            ...aiResult.data,
            id: resumeId,
            template: "Default"
          };

          await dispatch(updateResumeById({ id: resumeId, parsedResume: updatedResume }));
          navigate(`/cv-generate/${resumeId}`);
          toast.success('AI-generated CV created successfully!');
        } catch (error) {
          console.error('Error generating AI CV:', error);
          toast.error(error?.message || "Failed to generate AI CV. Please try again.");
        }
      }
    } catch (error) {
      console.error('Error creating empty CV:', error);
      toast.error(error?.message || "Failed to create CV. Please try again.");
    }
  };

  // File selection handler
  const handleFileSelect = (e) => {
    if (loading) return;

    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['.pdf', '.doc', '.docx', '.rtf', '.odt'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

      if (!allowedTypes.includes(fileExtension)) {
        toast.error('Please select a valid file type (PDF, DOC, DOCX, RTF, ODT)');
        e.target.value = null;
        return;
      }

      handleShowUploadModal(file);
    }
    e.target.value = null;
  };

  // Upload form submission
  const handleUploadSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error('No file selected');
      return;
    }

    handleCloseUploadModal();

    // Proceed with file upload
    await uploadFile(selectedFile);
  };

  // Actual file upload process
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    // Add additional info if provided
    if (uploadFormData.languageStyle) {
      formData.append('languageStyle', uploadFormData.languageStyle);
    }
    if (uploadFormData.additionalInfo) {
      formData.append('additionalInfo', uploadFormData.additionalInfo);
    }


    setShowFinalize(true);

    setMessage('Uploading your CV for analysis — this may take a moment...')

    // toast.info('Uploading your CV for analysis — this may take a moment...', {
    //   autoClose: 5000,
    //   position: 'top-right'
    // });
    // Schedule sequential toasts
    setTimeout(() => {
      // toast.info('Parsing your CV content...', {
      //   autoClose: 5000,
      //   position: 'top-right'
      // });
      setMessage('Parsing your CV content...')

      setTimeout(() => {
        // toast.info(`Analyzing your CV in ${uploadFormData.languageStyle || 'standard'} style...`, {
        //   autoClose: 5000,
        //   position: 'top-right'
        // });
        setMessage(`Analysing your CV in ${uploadFormData.languageStyle || 'standard'} style...`)

        setTimeout(() => {
          // toast.info('Finalising your CV...', {
          //   autoClose: 20000,
          //   position: 'top-right'
          // });
          setMessage('Finalising your CV...')
        }, 9000); // 7 seconds after the second toast (12s total)
      }, 9000); // 7 seconds after the first toast (7s total)
    }, 20000); // 20 seconds after initial toast

    try {
      const uploadResult = await dispatch(uploadExistingResume(formData)).unwrap();

      if (uploadResult?.data) {
        const createResult = await dispatch(createEmptyResume(uploadResult.data)).unwrap();

        if (createResult?.data?.id) {
          setShowFinalize(false);
          navigate(`/cv-generate/${createResult.data.id}`);
          toast.success('CV uploaded and processed successfully!');
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to upload file';
      toast.error(`Upload failed: ${errorMessage}`);
    }
  };

  // Delete CV handler
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

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };


  function getFileExtension(filename) {
    if (typeof filename !== "string") return null;

    const parts = filename.split(".");
    if (parts.length <= 1) return null; // no extension found

    return parts.pop().toLowerCase(); // return last part as extension
  }


  function getFileIcon(filename) {
    if (typeof filename !== "string") return "📄"; // default

    const ext = filename.split(".").pop().toLowerCase();

    switch (ext) {
      case "pdf":
        return (<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-file-type-pdf"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" /><path d="M5 18h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6" /><path d="M17 18h2" /><path d="M20 15h-3v6" /><path d="M11 15v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1z" /></svg>); // or "fa-solid fa-file-pdf"
      case "doc":
        return (<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-file-type-doc"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" /><path d="M5 15v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1z" /><path d="M20 16.5a1.5 1.5 0 0 0 -3 0v3a1.5 1.5 0 0 0 3 0" /><path d="M12.5 15a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1 -3 0v-3a1.5 1.5 0 0 1 1.5 -1.5z" /></svg>); // or "fa-solid fa-file-word"
      case "docx":
        return (<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-file-type-docx"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" /><path d="M2 15v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1z" /><path d="M17 16.5a1.5 1.5 0 0 0 -3 0v3a1.5 1.5 0 0 0 3 0" /><path d="M9.5 15a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1 -3 0v-3a1.5 1.5 0 0 1 1.5 -1.5z" /><path d="M19.5 15l3 6" /><path d="M19.5 21l3 -6" /></svg>);
      case "rtf":
      case "odt":
        return (<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-license"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 21h-9a3 3 0 0 1 -3 -3v-1h10v2a2 2 0 0 0 4 0v-14a2 2 0 1 1 2 2h-2m2 -4h-11a3 3 0 0 0 -3 3v11" /><path d="M9 7l4 0" /><path d="M9 11l4 0" /></svg>);
      default:
        return (<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-notes"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" /><path d="M9 7l6 0" /><path d="M9 11l6 0" /><path d="M9 15l4 0" /></svg>); // default icon
    }
  }


  return (
    <>
      <div className="row mb-3 g-3 feature-cards">
        {/* Upload Existing CV Card */}
        <div className="col-12 col-xl-3">
          <Card className="border h-100 w-100 overflow-hidden position-relative">
            <Card.Body className="px-6 py-9 position-relative text-center" style={{ height: "300px" }}>
              <div
                className="icon-item icon-item-md rounded-1 shadow-none mx-auto"
                style={{ backgroundColor: '#ece5fc' }}>
                <FiFile size={20} style={{ color: '#ba67ef' }} />
              </div>
              <h4 className="my-3">Upload an existing CV</h4>
              <p className="fs-8">
                Upload your existing CV and proceed with keyword optimisation for ATS compatibility.
              </p>

              <input
                id="cvUpload"
                type="file"
                className="visually-hidden"
                disabled={loading}
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.rtf,.odt"
              />
              <label
                htmlFor="cvUpload"
                className={`btn btn-primary w-100 stretched-link ${emptyResumeLoader || loading || AiCvLoader ? 'disabled' : ''
                  }`}
                style={{
                  pointerEvents: emptyResumeLoader || loading || AiCvLoader ? 'none' : 'auto',
                  opacity: emptyResumeLoader || loading || AiCvLoader ? 0.65 : 1
                }}
              >
                {loading ? (
                  <><FiLoader size={14} className="me-2 animate-spin" />Launching...</>
                ) : "Upload Now"}
              </label>
            </Card.Body>
          </Card>
        </div>

        {/* Build from Scratch Card */}
        <div className="col-12 col-xl-3">
          <Card className="border h-100 w-100 overflow-hidden position-relative">
            <Card.Body className="px-6 py-9 position-relative text-center">
              <div
                className="icon-item icon-item-md rounded-1 shadow-none mx-auto"
                style={{ backgroundColor: '#ece5fc' }}>
                <svg width={20} className="svg-inline--fa fa-file-pen fs-7" style={{ color: '#ba67ef' }} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-pen" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 125.7-86.8 86.8c-10.3 10.3-17.5 23.1-21 37.2l-18.7 74.9c-2.3 9.2-1.8 18.8 1.3 27.5L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zM549.8 235.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-29.4 29.4-71-71 29.4-29.4c15.6-15.6 40.9-15.6 56.6 0zM311.9 417L441.1 287.8l71 71L382.9 487.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z"></path></svg>
              </div>
              <h4 className="my-3">Build from scratch</h4>
              <p className="fs-8">
                Build your CV from scratch, using clean, modern templates designed for recruiters.
              </p>
              <Button
                className="stretched-link btn btn-primary w-100"
                onClick={handleManualCV}
                disabled={emptyResumeLoader || loading || AiCvLoader}
              >
                {emptyResumeLoader ? (
                  <><FiLoader size={14} className="me-2 animate-spin" />Launching...</>
                ) : 'Launch CV Builder'}
              </Button>
            </Card.Body>
          </Card>
        </div>

        {/* Recent CVs Section */}
        {Array.isArray(recentCVs?.data) && recentCVs?.data?.length > 0 && (

          <>
            {/* Recent CVs Section */}
            {recentCVs?.data?.length > 0 ? (
              <div className="col-12 col-xl-6">
                <Card className="border h-100 w-100 position-relative">
                  <Card.Body className="position-relative">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">Recent CVs</h5>

                    </div>

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
                  </Card.Body>
                </Card>
              </div>
            ) : null}
          </>
        )}
      </div>

      {/* File Upload Modal */}
      <Modal
        show={showUploadModal}
        onHide={handleCloseUploadModal}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload CV Details</Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleUploadSubmit}>
          <Modal.Body>
            {/* File Info Display */}
            {selectedFile && (
              <div className="alert alert-info d-flex align-items-center p-0 gap-2">
                {/* <FiFile className="me-2" /> */}
                {getFileIcon(selectedFile.name)}
                <div>
                  <strong>Selected file:</strong> {selectedFile.name}<br />
                  <small>Size: {formatFileSize(selectedFile.size)}</small>
                </div>
              </div>
            )}

            {/* File Type Selection */}
            <Form.Group className="mb-3">
              <Form.Label>Select your style</Form.Label>
              <Form.Select
                value={uploadFormData.languageStyle}
                onChange={(e) => setUploadFormData({
                  ...uploadFormData,
                  languageStyle: e.target.value
                })}
              >
                <option value="">Select document type...</option>
                <option value="Professional">Professional</option>
                <option value="Creative">Creative</option>
                <option value="Analytical">Analytical</option>
                <option value="Results Driven">Results Driven</option>
                <option value="Strategic">Strategic</option>
                <option value="Technical">Technical</option>
                <option value="Collaborative">Collaborative</option>
                <option value="Entrepreneurial">Entrepreneurial</option>

              </Form.Select>
            </Form.Group>

            {/* Additional Information */}
            <Form.Group className="mb-3">
              <Form.Label>Job Description (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Any additional notes about this document..."
                value={uploadFormData.additionalInfo}
                onChange={(e) => setUploadFormData({
                  ...uploadFormData,
                  additionalInfo: e.target.value
                })}
              />
              <Form.Text className="text-muted">
                This information will help us process your document better.
              </Form.Text>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleCloseUploadModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!selectedFile}
            >
              {loading ? (
                <><FiLoader size={14} className="me-2 animate-spin" />Uploading...</>
              ) : (
                'Upload & Process'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* AI Generation Modal */}
      <Modal
        show={showAiModal}
        onHide={handleCloseAiModal}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Generate AI-Powered CV</Modal.Title>
        </Modal.Header>

        <Form>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Professional Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Senior Software Engineer"
                value={aiFormData.jobTitle}
                onChange={(e) => setAiFormData({
                  ...aiFormData,
                  jobTitle: e.target.value
                })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Professional Summary</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Describe your professional background, key skills, achievements, and career goals..."
                value={aiFormData.description}
                onChange={(e) => setAiFormData({
                  ...aiFormData,
                  description: e.target.value
                })}
                required
              />
              <Form.Text className="text-muted">
                Tip: aim for 3–6 concise sentences that highlight your key achievements.
              </Form.Text>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleCloseAiModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCvAiGeneration}
              disabled={AiCvLoader || !aiFormData.jobTitle || !aiFormData.description}
            >
              {AiCvLoader ? (
                <><FiLoader size={14} className="me-2 animate-spin" />Generating...</>
              ) : (
                'Generate CV'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <div className={`position-fixed top-50 start-50 translate-middle text-center ${ !showFinalize ? 'd-none' : '' }`} style={{ zIndex: 1050, backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '2rem', borderRadius: '10px', boxShadow: '0 0 20px rgba(0,0,0,0.2)', width: '100%', maxWidth: '550px' }}>
        <div className="mb-3">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        </div>
        <h4>{message}</h4>
        <p className="text-muted">Please wait while processing...</p>
        <div className="progress mt-3" style={{ height: '10px' }}>
          <div
            className="progress-bar progress-bar-striped progress-bar-animated"
            role="progressbar"
            style={{ width: '100%' }}
          ></div>
        </div>
      </div>
    </>
  );
}