import React, { useState, useRef, useCallback, useEffect } from 'react';
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp, FiMinus, FiLoader, FiDownload } from "react-icons/fi";
import Swal from 'sweetalert2';
import BulletPointsEditor from './BulletPointsEditor';
import avatar from '../../assets/images/default_avatar.jpeg'
import {
    ModernTemplate,
    ClassicTemplate,
    ProfessionalTemplate2,
    ProfessionalTemplate,
    Template5,
    Template6,
    Template7,
    Template8,
    Template9,
    Template10,
    Template11,
    Template12,
    Template13
} from "../templates";
import toggleImage from '../../assets/images/P-solid-rgb.svg';

import { Row, Col, Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { setParsedResume, updateField, analyzeResumeAi, setSelectedTemplate, fetchResumeById, updateResumeById } from "../../features/resume/resumeSlice";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from 'react-toastify';
import { useNavigate, useParams } from "react-router-dom";
import { ClassicCoverLetterTemplate } from "../cover-letter-templates";
import CoverLetter from "./components/coverLetter";
import html2pdf from "html2pdf.js";



const cardTemplate = [
    // { name: 'Template1', template: ModernTemplate, image: 'dummy.jpg' },
    // { name: 'Template2', template: ClassicTemplate, image: 'dummy.jpg' },
    // { name: 'Template3', template: ProfessionalTemplate, image: 'dummy.jpg' },
    // { name: 'Template4', template: ProfessionalTemplate2, image: 'dummy.jpg' },
    { name: 'Luxe', template: Template13, image: 'Luxe.png' },
    { name: 'Default', template: Template9, image: 'default1.png' },
    { name: 'Professional', template: Template5, image: 'professional.png', recommended: true },
    { name: 'Chrono', template: Template6, image: 'chrono.png' },
    { name: 'Elegant', template: Template7, image: 'elegant.png' },
    { name: 'Modern', template: Template8, image: 'modern.png', recommended: true },
    { name: 'Classic', template: Template12, image: 'classic.png' },
    { name: 'Unique', template: Template11, image: 'unique.png' },
];

const coverLetterjson = {
    header: {
        applicant_name: "John Doe",
        applicant_address: "123 Main Street, Faisalabad, Pakistan",
        applicant_email: "johndoe@email.com",
        applicant_phone: "+92 300 1234567",
        date: "September 5, 2025"
    },
    recipient: {
        hiring_manager_name: "Jane Smith",
        company_name: "Tech Solutions Ltd.",
        company_address: "456 Business Road, London, UK"
    },
    body: {
        greeting: "Dear Hiring Manager,",
        opening_paragraph: "I am excited to apply for the Frontend Developer position at Tech Solutions Ltd...",
        middle_paragraphs: [
            "At Techtrack Software Solutions, I contributed to multiple Laravel and React projects...",
            "I am also proficient in Flutter/Dart and exploring Machine Learning..."
        ],
        closing_paragraph: "I would be delighted to discuss how my skills can contribute to your company’s success.",
        signature: "Sincerely, John Doe"
    }
};



export default function CVBuilder() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { parsedResume, AnalyseResumeData, AiResumeLoader, selectedTemplate, prevParsedResume, saveChangesLoader } = useSelector((state) => state.resume);
    const [zoom, setZoom] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [activeAccordion, setActiveAccordion] = useState('headline');
    const [expandedWorkExpItems, setExpandedWorkExpItems] = useState([]);
    const [profilePic, setProfilePic] = useState(null);


    const [currentSkill, setCurrentSkill] = useState('');
    const [currentLanguage, setCurrentLanguage] = useState('');
    const [languageLevel, setLanguageLevel] = useState('Intermediate');
    const [currentHobby, setCurrentHobby] = useState('');
    const cvRef = useRef();

    const [customSections, setCustomSections] = useState([]);

    // State for active tab
    // const [selectedTemplate, setSelectedTemplate] = useState("Default");




    const handleTabClick = (tabName) => {
        setActiveTab((prevTab) => (prevTab === tabName ? '' : tabName)); // toggle if same, else set new
    };

    const handleNextTab = () => {
        if (activeTab == "tabPreview") {
            setActiveTab("tabDesign"); // toggle if same, else set new
        } 
    }

    const handlePreviousTab = () => {
        if (activeTab == "tabDesign") {
            setActiveTab("tabPreview"); // toggle if same, else set new
        }
    }


    const handleTemplateChange = (templateName) => {
        dispatch(setParsedResume({
            ...parsedResume,
            template: templateName
        }));
        dispatch(setSelectedTemplate(templateName));
    };

    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            if (!id) return;
            const ActionReturn = await dispatch(fetchResumeById(id)).unwrap();
            if (!isMounted) return;
            console.log("Action return fetch resume by id", ActionReturn);
            if (!(ActionReturn.success)) {
                window.location = '/cv-builder';
            }
        };
        load();
        return () => { isMounted = false; };
    }, [id])


    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);

    // Check if there are unsaved changes
    useEffect(() => {
        setHasUnsavedChanges(parsedResume !== prevParsedResume);
    }, [parsedResume, prevParsedResume]);

    useEffect(() => {
        const handleClick = (e) => {
            // If we're already processing navigation or no unsaved changes, allow the click
            if (isNavigating || !hasUnsavedChanges || saveChangesLoader) return;
    
            const link = e.target.closest('a');
            if (link && link.href) {
                // Check if it's an external link or different route
                const currentUrl = window.location.href;
                const targetUrl = link.href;
                
                // Only intercept if it's a different page
                if (currentUrl !== targetUrl && !targetUrl.includes('#')) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    Swal.fire({
                        title: 'Unsaved Changes',
                        text: 'You have unsaved changes. Are you sure you want to leave? Your changes will be lost.',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, leave page',
                        cancelButtonText: 'Stay on page',
                        allowOutsideClick: false,
                        backdrop: true
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Set a flag in sessionStorage to prevent the beforeunload alert
                            sessionStorage.setItem('allowNavigation', 'true');
                            setIsNavigating(true);
                            window.location.href = targetUrl;
                        }
                    });
                }
            }
        };
    
        // Use capture phase to catch all clicks
        document.addEventListener('click', handleClick, true);
        return () => document.removeEventListener('click', handleClick, true);
    }, [hasUnsavedChanges, saveChangesLoader, isNavigating]);
    
    // Update the beforeunload handler to check the flag
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            // Check if navigation was explicitly allowed
            if (sessionStorage.getItem('allowNavigation') === 'true') {
                sessionStorage.removeItem('allowNavigation');
                return;
            }
            
            if (hasUnsavedChanges && !saveChangesLoader) {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
                return 'You have unsaved changes. Are you sure you want to leave?';
            }
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [hasUnsavedChanges, saveChangesLoader]);

    // Safe navigation function for programmatic navigation
    const safeNavigate = useCallback((path, options = {}) => {
        if (hasUnsavedChanges && !saveChangesLoader && !isNavigating) {
            Swal.fire({
                title: 'Unsaved Changes',
                text: 'You have unsaved changes. Are you sure you want to leave? Your changes will be lost.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, leave page',
                cancelButtonText: 'Stay on page',
                allowOutsideClick: false,
                backdrop: true
            }).then((result) => {
                if (result.isConfirmed) {
                    setIsNavigating(true);
                    navigate(path, options);
                }
            });
        } else {
            navigate(path, options);
        }
    }, [hasUnsavedChanges, saveChangesLoader, isNavigating, navigate]);

    // Update your save function
    const handleSaveChanges = () => {
        if (parsedResume != prevParsedResume) {
            dispatch(updateResumeById({ id, parsedResume })).then(() => {
                setHasUnsavedChanges(false);
                toast.success('Changes saved successfully!');
            }).catch((error) => {
                toast.error('Failed to save changes');
            });
        }
    };



      // Add visual indicator in your save button
      const renderSaveButton = () => (
        <button 
            className="btn btn-primary btn-sm position-relative" 
            onClick={handleSaveChanges} 
            disabled={parsedResume == prevParsedResume || saveChangesLoader}
        >
            {saveChangesLoader ? (
                <><FiLoader size={14} className="me-2 animate-spin" />Saving...</>
            ) : (
                <>
                    Save Changes
                    {hasUnsavedChanges && (
                        <span 
                            className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                            title="Unsaved changes"
                            style={{ fontSize: '6px' }}
                        >
                            <span className="visually-hidden">Unsaved changes</span>
                        </span>
                    )}
                </>
            )}
        </button>
    );

    // Reset navigation flag when component unmounts or changes occur
    useEffect(() => {
        return () => {
            setIsNavigating(false);
        };
    }, []);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         if (parsedResume?.languageStyle) {
    //             // setActiveTab("tabAnalysis");
    //             console.log("I am here");
    //             if (!(parsedResume?.analysingDone)) {

    //                 try {
    //                     const returnAction = await dispatch(analyzeResumeAi({
    //                         languageStyle: parsedResume?.languageStyle ?? null,
    //                         headline: parsedResume?.headline,
    //                         summary: parsedResume?.summary,
    //                         workExperience: parsedResume?.workExperience?.map((item) => item.workExperienceDescription)
    //                     })).unwrap();

    //                     if (returnAction?.data) {
    //                         // Create a single updated resume object with the new flag
    //                         const updatedResume = {
    //                             ...parsedResume,
    //                             analysingDone: true  // Add the flag here
    //                         };

    //                         // Update headline if exists in response
    //                         if (returnAction.data.headline?.suggested_paragraph) {
    //                             updatedResume.headline = returnAction.data.headline.suggested_paragraph;
    //                         }

    //                         // Update summary if exists in response
    //                         if (returnAction.data.summary?.suggested_paragraph) {
    //                             updatedResume.summary = returnAction.data.summary.suggested_paragraph;
    //                         }

    //                         // Update work experiences
    //                         if (Array.isArray(returnAction.data.workExperience)) {
    //                             updatedResume.workExperience = (updatedResume.workExperience || []).map((item, index) => {
    //                                 const suggested = returnAction.data.workExperience[index]?.suggested_paragraph;
    //                                 return suggested
    //                                     ? { ...item, workExperienceDescription: suggested }
    //                                     : item;
    //                             });
    //                         }

    //                         // Dispatch the update
    //                         dispatch(setParsedResume(updatedResume));

    //                         // Save to the server
    //                         dispatch(updateResumeById({ id, parsedResume: updatedResume }));
    //                     }
    //                 } catch (error) {
    //                     console.error('Error analyzing resume:', error);
    //                 }

    //             }
    //         }
    //     };

    //     fetchData();
    // }, [parsedResume.languageStyle]);



    useEffect(() => {
        if (AiResumeLoader) {
            Swal.fire({
                title: 'Analysing CV',
                html: 'Please wait while we analyze your resume...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
        } else {
            Swal.close();
        }
    }, [AiResumeLoader]);


    useEffect(() => {
        return () => {
            Swal.close();
        };
    }, []);


    const zoomIn = () => {
        setZoom(prev => {
            const newZoom = Math.min(prev + 0.1, 2);
            console.log('Zoom In clicked. New zoom level:', newZoom);
            return newZoom;
        });
    };

    const zoomOut = () => {
        setZoom(prev => {
            const newZoom = Math.max(prev - 0.1, 0.5);
            console.log('Zoom Out clicked. New zoom level:', newZoom);
            return newZoom;
        });
    };



    const handleAnalyze = () => {
        dispatch(analyzeResumeAi({
            languageStyle: parsedResume?.languageStyle ?? null,
            headline: parsedResume?.headline,
            summary: parsedResume?.summary?.paragraph,
            workExperience: parsedResume?.workExperience?.map((item) => item.workExperienceDescription)
        }));
    };



    useEffect(() => {
        if (parsedResume?.skill && parsedResume.skill.length > 0) {
            // Check if any skills have the selected property
            const hasSelectedProperty = parsedResume.skill.some(skill => 'selected' in skill);

            if (!hasSelectedProperty) {
                // Initialize first 5 skills as selected
                const updatedSkills = parsedResume.skill.map((skill, index) => ({
                    ...skill,
                    selected: index < 5
                }));
                dispatch(updateField({ path: "skill", value: updatedSkills }));
            }
        }
    }, [parsedResume?.skill]);



    const handleAddSkill = () => {
        if (currentSkill.trim()) {
            const currentSkills = parsedResume?.skill || [];

            dispatch(
                updateField({
                    path: "skill",
                    value: [
                        ...currentSkills,
                        {
                            name: currentSkill.trim(),
                            selected: true, // default selected
                        },
                    ],
                })
            );

            setCurrentSkill("");
        }
    };


    const handleAddHobby = () => {
        if (!currentHobby.trim()) {
            toast.error("Please enter a hobby", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            return;
        }

        dispatch(updateField({ path: "hobbies", value: [...(parsedResume.hobbies || []), currentHobby.trim()] }));
        setCurrentHobby('');
    };


    const handleAddLanguage = () => {
        if (!currentLanguage.trim()) {
            toast.error("Please enter a language", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            return;
        }

        const newLanguage = {
            name: currentLanguage.trim(),
            level: languageLevel,
            fluency: languageLevel
        };

        dispatch(updateField({ path: "languages", value: [...(parsedResume.languages || []), newLanguage] }));
        setCurrentLanguage('');
    };



    //     const updateField = (path, value) => {
    //         dispatch(setParsedResume((prev) => {
    //             const newResume = { ...prev };
    //             const pathParts = path.match(/(\w+)(?:\[(\d+)\])?\.?(\w+)?/);
    //             if (!pathParts) {
    //                 newResume[path] = value;
    //                 return newResume;
    //             }

    //             const [_, key, index, subKey] = pathParts;
    //             if (index && subKey) {
    //                 if (!newResume[key]) newResume[key] = [];
    //                 if (!newResume[key][index]) newResume[key][index] = {};
    //                 newResume[key][index][subKey] = value;
    //             } else if (index) {
    //                 if (!newResume[key]) newResume[key] = [];
    //                 newResume[key][index] = value;
    //             } else {
    //                 newResume[key] = value;
    //             }
    //             return newResume;
    //         })
    //     );
    //    }


    const calculatePages = () => {
        if (!cvRef.current) return 1;

        const a4HeightPx = 1123; // A4 height in pixels at 96 DPI
        const contentHeight = cvRef.current.scrollHeight;
        const calculatedPages = Math.ceil(contentHeight / a4HeightPx);

        // Check if the last page has meaningful content (at least 20% filled)
        const lastPageContent = contentHeight % a4HeightPx;
        if (calculatedPages > 1 && lastPageContent < (a4HeightPx * 0.2)) {
            return calculatedPages - 1;
        }
        return calculatedPages;
    };

    // Update total pages when resume data changes
    // Update total pages when resume data changes
    useEffect(() => {
        if (parsedResume && cvRef.current) {
            setTimeout(() => {
                const pages = calculatePages();
                setTotalPages(pages);
                if (currentPage > pages) {
                    setCurrentPage(pages);
                }
            }, 100);
        }
    }, [parsedResume, currentPage]);

    const [downloadPDFLoader, setDownloadPDFLoader] = useState(false);

    // Handle auto-download when URL contains download=true
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const shouldAutoDownload = urlParams.get('download') === 'true';

        if (shouldAutoDownload && !downloadPDFLoader && parsedResume) {
            const downloadAndClose = async () => {
                await handleDownloadPDF();
                // Small delay to ensure download starts before closing
                setTimeout(() => {
                    window.close();
                }, 1000);
            };
            downloadAndClose();
        }
    }, [parsedResume, downloadPDFLoader]);

    const handleDownloadPDF = async () => {
        if (!cvRef.current) return;

        const element = cvRef.current;

        const opt = {
            margin: 5,
            filename: `${parsedResume?.candidateName?.[0]?.firstName || "CV"}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            pagebreak: { mode: ["css", "legacy"] } // 👈 respects CSS page-break rules
        };

        await html2pdf().from(element).set(opt).save();
    };


    const previewContainerRef = useRef(null);

    const scrollToPage = useCallback((pageNumber) => {
        if (!cvRef.current || !previewContainerRef.current || pageNumber < 1 || pageNumber > totalPages) return;

        const pageHeight = cvRef.current.scrollHeight / totalPages;
        const scrollPosition = (pageNumber - 1) * pageHeight;

        previewContainerRef.current.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
        });

        setCurrentPage(pageNumber);
    }, [totalPages]);

    // Handle page navigation
    const goToPage = useCallback((page) => {
        scrollToPage(page);
    }, [scrollToPage]);




    const [activeTab, setActiveTab] = useState('tabPreview');


    const toggleAccordion = (section) => {
        setActiveAccordion(activeAccordion === section ? null : section);
    };

    const toggleWorkExpItem = (index) => {
        setExpandedWorkExpItems(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const handleAnalysis = () => {
        setActiveTab('tabAnalysis');
        // if (!AnalyseResumeData || Object.keys(AnalyseResumeData).length === 0) {
        //     handleAnalyze();
        // }
    }


    const handleApplyWorkExp = (index, returnAction = null) => {
        // clone the parsedResume object
        const updatedResume = { ...parsedResume };

        // Ensure workExperience exists and has the item at the given index
        if (!updatedResume.workExperience?.[index]) {
            console.error('Invalid work experience index or work experience not found');
            return;
        }

        // Get the suggested paragraph from either returnAction or AnalyseResumeData
        const suggestedParagraph =
            returnAction?.data?.workExperience?.[index]?.suggested_paragraph ||
            AnalyseResumeData?.workExperience?.[index]?.suggested_paragraph;

        if (!suggestedParagraph) {
            console.error('No suggested paragraph found for work experience at index', index);
            return;
        }

        // Update the work experience description
        updatedResume.workExperience = updatedResume.workExperience.map((item, i) =>
            i === index
                ? { ...item, workExperienceDescription: suggestedParagraph }
                : item
        );

        // dispatch back to redux
        dispatch(setParsedResume(updatedResume));
    };


    const handleUndoWorkExp = (index) => {
        // clone the parsedResume object
        const updatedResume = { ...parsedResume };

        // clone workExperience array
        const updatedWorkExperience = [...updatedResume.workExperience];

        // replace only the description at the given index
        updatedWorkExperience[index] = {
            ...updatedWorkExperience[index],
            workExperienceDescription: AnalyseResumeData.workExperience[index].original,
        };

        // assign updated array back
        updatedResume.workExperience = updatedWorkExperience;

        // dispatch back to redux
        dispatch(setParsedResume(updatedResume));
    };


    // const handleApply = (type, returnAction = null) => {
    //     const updatedResume = { ...parsedResume };

    //     if (type === "headline") {
    //         const suggestedHeadline = returnAction?.data?.headline?.suggested_paragraph ||
    //             (AnalyseResumeData?.headline?.suggested_paragraph ?? '');
    //         updatedResume.headline = suggestedHeadline;
    //     }

    //     if (type === "summary") {
    //         const suggestedSummary = returnAction?.data?.summary?.suggested_paragraph ||
    //             (AnalyseResumeData?.summary?.suggested_paragraph ?? '');
    //         updatedResume.summary?.paragraph = suggestedSummary;
    //     }

    //     dispatch(setParsedResume(updatedResume));
    // };


    // const handleUndoApply = (type) => {
    //     const updatedResume = { ...parsedResume };

    //     if (type === "headline") {
    //         updatedResume.headline = AnalyseResumeData.headline.original;
    //     }

    //     if (type === "summary") {
    //         updatedResume.summary = AnalyseResumeData.summary.original;
    //     }

    //     dispatch(setParsedResume(updatedResume));
    // };


    // State for form fields
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        headline: '',
        email: '',
        phone: '',
        address: '',
        postCode: '',
        city: '',
        summary: '',
        avatar: avatar
    });

    // State for accordion sections
    const [openSections, setOpenSections] = useState({
        personal: false,
        education: false,
        employment: false,
        skills: false,
        languages: false,
        hobbies: false
    });

    // Ref for file input
    const fileInputRef = useRef(null);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleApplySummary = () => {
        dispatch(updateField({ path: "summary", value: SummarySuggestions }));
    };



    const handleRemovePhoto = () => {
        setProfilePic(null); // Clear the profile picture
        dispatch(updateField({ path: "profilePic", value: null }));
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset the file input
        }
    };
    // Handle avatar upload
    const handleAvatarUpload = (e) => {
        // const file = e.target.files[0];
        // if (file) {
        //     const reader = new FileReader();
        //     reader.onload = (event) => {
        //         setFormData(prev => ({
        //             ...prev,
        //             avatar: event.target.result
        //         }));
        //     };
        //     reader.readAsDataURL(file);
        // }
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result);
                dispatch(updateField({ path: "profilePic", value: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Toggle accordion sections
    const toggleSection = (section) => {
        setOpenSections((prev) => {
            // If the clicked section is already open, close it
            if (prev[section]) {
                return { [section]: false };
            }

            // Otherwise, close all and open only the clicked one
            return { [section]: true };
        });
    };



    // State with consistent prefix
    const [eduList, setEduList] = useState([]);
    const [eduListdispatch, setEduListdispatch] = useState([]);
    const [eduCurrentForm, setEduCurrentForm] = useState(null);


// Update the education form state to include educationMajor
const [eduFormData, setEduFormData] = useState({
    eduDegree: '',
    eduInstitution: '',
    eduStartDate: '',
    eduEndDate: '',
    achievedGrade: '',
    educationMajor: [''] // Add educationMajor as an array to store multiple majors
});

// Add a function to handle adding/removing major fields
const handleAddMajor = () => {
    setEduFormData(prev => ({
        ...prev,
        educationMajor: [...prev.educationMajor, '']
    }));
};

const handleRemoveMajor = (index) => {
    setEduFormData(prev => ({
        ...prev,
        educationMajor: prev.educationMajor.filter((_, i) => i !== index)
    }));
};

const handleMajorChange = (index, value) => {
    const newMajors = [...eduFormData.educationMajor];
    newMajors[index] = value;
    setEduFormData(prev => ({
        ...prev,
        educationMajor: newMajors
    }));
};

// Update the form submission to include educationMajor
const handleAddEducation = () => {
    if (!eduFormData.eduDegree || !eduFormData.eduInstitution) {
        toast.error('Please fill in all required fields');
        return;
    }

    const newEducation = {
        educationLevel: { label: eduFormData.eduDegree },
        educationOrganization: eduFormData.eduInstitution,
        educationDates: {
            start: { date: eduFormData.eduStartDate },
            end: { date: eduFormData.eduEndDate || null }
        },
        educationMajor: eduFormData.educationMajor.filter(major => major.trim() !== ''),
        achievedGrade: eduFormData.achievedGrade || null
    };

    dispatch(updateField({
        path: 'education',
        value: [...(parsedResume.education || []), newEducation]
    }));

    // Reset form
    setEduFormData({
        eduDegree: '',
        eduInstitution: '',
        eduStartDate: '',
        eduEndDate: '',
        achievedGrade: '',
        educationMajor: ['']
    });
    setShowEducationForm(false);
};
    
    const eduHandleAddEducation = () => {
        // Check if there's already an empty form
        if (eduCurrentForm) {
            // Check if the current form has any data
            const eduHasData = Object.values(eduFormData).some(eduValue =>
                eduValue && typeof eduValue === 'string' ? eduValue.trim() !== '' : false
            );

            if (eduHasData) {
                // Check if all required fields are filled
                const eduAllFieldsFilled =
                    (eduFormData.eduDegree && eduFormData.eduDegree.trim() !== '') &&
                    (eduFormData.eduInstitution && eduFormData.eduInstitution.trim() !== '') &&
                    (eduFormData.eduStartDate && eduFormData.eduStartDate.trim() !== '') &&
                    (eduFormData.eduEndDate && eduFormData.eduEndDate.trim() !== '');

                if (!eduAllFieldsFilled) {
                    toast.error('Please complete the current education form before adding a new one');
                    return;
                }

                // If form is complete, save it
                eduHandleSaveEducation();
            }
        }

        // Create a new form
        setEduCurrentForm({
            eduId: Date.now(),
            eduDegree: '',
            eduInstitution: '',
            eduStartDate: '',
            eduEndDate: '',
            achievedGrade: ""
        });

        // Reset form data
        setEduFormData({
            eduDegree: '',
            eduInstitution: '',
            eduStartDate: '',
            eduEndDate: '',
            achievedGrade: '',
            educationMajor: ['']
        });
    };


    const eduHandleInputChange = (e) => {
        const { name, value } = e.target;
        setEduFormData({
            ...eduFormData,
            [name]: value
        });
    };

    const eduHandleSaveEducation = () => {
        // Validate form data
        if (!eduFormData.eduDegree || !eduFormData.eduInstitution || !eduFormData.eduStartDate || !eduFormData.eduEndDate) {
            toast.error('Please fill all the required fields');
            return;
        }

        // Add to educations list
        // const eduNewEducation = {
        //   eduId: eduCurrentForm.eduId,
        //   eduDegree: eduFormData.eduDegree,
        //   eduInstitution: eduFormData.eduInstitution,
        //   eduStartDate: eduFormData.eduStartDate,
        //   eduEndDate: eduFormData.eduEndDate
        // };


        // const newEducation = {
        //     educationLevel: { label: eduFormData.eduDegree },
        //     educationOrganization: eduFormData.eduInstitution,
        //     educationDates: {
        //         start: { date: eduFormData.eduStartDate },
        //         end: { date: eduFormData.eduEndDate || null }
        //     },
        //     educationMajor: eduFormData.educationMajor.filter(major => major.trim() !== ''),
        //     achievedGrade: eduFormData.achievedGrade || null
        // };

        const dispatcheducationList = {
            educationOrganization: eduFormData.eduInstitution,
            educationAccreditation: eduFormData.eduDegree,
            educationDates: {
                start: {
                    date: eduFormData.eduStartDate
                },
                end: {
                    date: eduFormData.eduEndDate
                }
            },
            educationMajor: eduFormData.educationMajor.filter(major => major.trim() !== ''),
            achievedGrade: eduFormData.achievedGrade,
            educationLevel: {
                label: eduFormData.eduDegree
            }
        }


        dispatch(updateField({ path: "education", value: [...parsedResume.education, dispatcheducationList] }));

        // setEduList([...eduList, eduNewEducation]);
        setEduCurrentForm(null);
        setEduFormData({
            eduDegree: '',
            eduInstitution: '',
            eduStartDate: '',
            eduEndDate: '',
            achievedGrade: "",
            educationMajor: ['']
        });


        // toast.success('');
    };

    const eduHandleEditEducation = (eduIndex) => {
        const eduToEdit = parsedResume.education.filter((_, index) => index === eduIndex)[0];
        if (eduToEdit) {
            setEduCurrentForm(eduToEdit);
            setEduFormData({
                eduDegree: eduToEdit.educationLevel.label,
                eduInstitution: eduToEdit.educationOrganization,
                eduStartDate: eduToEdit.educationDates.start.date,
                eduEndDate: eduToEdit.educationDates.end.date,
                achievedGrade: eduToEdit.achievedGrade,
                educationMajor: eduToEdit.educationMajor
            });

            // Remove from displayed list while editing
            dispatch(updateField({ path: "education", value: parsedResume.education.filter((_, index) => index !== eduIndex) }));
        }
    };

    const eduHandleCancelEdit = () => {
        if (eduFormData.eduDegree || eduFormData.eduInstitution || eduFormData.eduStartDate || eduFormData.eduEndDate) {
            // If there's data, add it back to the list
            const eduNewEducation = {
                eduId: eduCurrentForm.eduId,
                educationAccreditation: eduFormData.eduDegree,
                educationOrganization: eduFormData.eduInstitution,
                educationDates: {
                    start: {
                        date: eduFormData.eduStartDate
                    },
                    end: {
                        date: eduFormData.eduEndDate
                    }
                },
                educationLevel: {
                    label: eduFormData.eduDegree
                },
                achievedGrade: eduFormData.achievedGrade,
                educationMajor: eduFormData.educationMajor
            };

            dispatch(updateField({ path: "education", value: [...parsedResume.education, eduNewEducation] }));
        }

        setEduCurrentForm(null);
        setEduFormData({
            eduDegree: '',
            eduInstitution: '',
            eduStartDate: '',
            eduEndDate: '',
            achievedGrade: "",
            educationMajor: ['']
        });
    };

    const eduHandleDeleteEducation = (index) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete this education entry',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(updateField({
                    path: "education",
                    value: parsedResume.education.filter((_, i) => i !== index)
                }));
                // Swal.fire(
                //     'Deleted!',
                //     'Education entry has been deleted.',
                //     'success'
                // );
            }
        });
    };

    // =================================================================================

    const [expItems, setExpItems] = useState([]);

    // Function to add a new incomplete experience item
    const expHandleAddExperience = () => {
        // Check if there's already an incomplete form
        const hasIncomplete = expItems.some(item => !item.expIsComplete);
    
        if (hasIncomplete) {
            toast.error('Please complete the current experience form before adding a new one');
            return;
        }
    
        // Create a new incomplete experience item with highlights
        const expNewItem = {
            expId: Date.now(),
            expJobTitle: '',
            expCompany: '',
            expStartDate: '',
            expEndDate: '',
            expDescription: '',
            expIsComplete: false,
            highlights: {
                items: []
            }
        };
    
        const dispatchExperienceList = {
            workExperienceJobTitle: expNewItem.expJobTitle,
            workExperienceOrganization: expNewItem.expCompany,
            workExperienceDates: {
                start: { date: expNewItem.expStartDate },
                end: { date: expNewItem.expEndDate }
            },
            highlights: {
                items: []
            },
            expIsComplete: false
        };
    
        dispatch(updateField({ 
            path: "workExperience", 
            value: [...parsedResume.workExperience, dispatchExperienceList] 
        }));
    };

    // Handle input changes for incomplete items
    const expHandleInputChange = (expIndex, field, value) => {
        dispatch(updateField({
            path: "workExperience", value: [...parsedResume.workExperience, parsedResume.workExperience.map((item, index) =>
                index === expIndex ? { ...item, [field]: value } : item
            )]
        }));
    };

    // Mark an item as complete
    const expHandleSaveExperience = (expIndex) => {
        const item = parsedResume.workExperience[expIndex];

        // Validate required fields
        if (!item.workExperienceJobTitle || !item.workExperienceOrganization || !item.workExperienceDates?.start?.date || !item.workExperienceDates?.end?.date) {
            toast.error('Please fill all the required fields');
            return;
        }

        // Mark as complete by updating the specific item
        const updatedExperience = parsedResume.workExperience.map((item, index) =>
            index === expIndex ? { ...item, expIsComplete: true } : item
        );

        dispatch(updateField({
            path: "workExperience",
            value: updatedExperience
        }));
    };

    // Edit an existing complete item
    const expHandleEditExperience = (expIndex) => {
        const updatedExperience = parsedResume.workExperience.map((item, index) =>
            index === expIndex ? { ...item, expIsComplete: false } : item
        );

        dispatch(updateField({
            path: "workExperience",
            value: updatedExperience
        }));
    };

    // Delete an experience item
    const expHandleDeleteExperience = (expIndex) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete this experience entry',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedExperience = parsedResume.workExperience.filter((_, index) => index !== expIndex);

                dispatch(updateField({
                    path: "workExperience",
                    value: updatedExperience
                }));
            }
        });
    };

    // Cancel editing and remove incomplete items
    const expHandleCancelEdit = (expIndex) => {
        const updatedExperience = parsedResume.workExperience.filter((_, index) => index !== expIndex);

        dispatch(updateField({
            path: "workExperience",
            value: updatedExperience
        }));
    };

    // Render the component
    return (
        <div className="my-4" style={{ translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>
            <div className="row g-3">
                {/* LEFT: Tabs + Form */}
                <div className="col-12 col-xxl-6 col-lg-7">
                    <div className="card border h-100">
                        <div className="card-header border-bottom-0 pb-0 d-flex justify-content-between">
                            {/* Tabs */}
                            <ul className="nav nav-underline cv-uploader-tabs" id="cvTabs" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'tabPreview' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('tabPreview')}
                                        disabled={AiResumeLoader}
                                    >
                                        <svg width={16} className="svg-inline--fa fa-eye" aria-hidden="true" focusable="false" data-prefix="far" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                            <path fill="currentColor" d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z"></path>
                                        </svg>
                                        Preview
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'tabDesign' ? 'active' : ''}`}
                                        disabled={AiResumeLoader}
                                        onClick={() => setActiveTab('tabDesign')}
                                    >
                                        <svg width={12} className="svg-inline--fa fa-pen-ruler" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pen-ruler" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path fill="currentColor" d="M469.3 19.3l23.4 23.4c25 25 25 65.5 0 90.5l-56.4 56.4L322.3 75.7l56.4-56.4c25-25 65.5-25 90.5 0zM44.9 353.2L299.7 98.3 413.7 212.3 158.8 467.1c-6.7 6.7-15.1 11.6-24.2 14.2l-104 29.7c-8.4 2.4-17.4 .1-23.6-6.1s-8.5-15.2-6.1-23.6l29.7-104c2.6-9.2 7.5-17.5 14.2-24.2zM249.4 103.4L103.4 249.4 16 161.9c-18.7-18.7-18.7-49.1 0-67.9L94.1 16c18.7-18.7 49.1-18.7 67.9 0l19.8 19.8c-.3 .3-.7 .6-1 .9l-64 64c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0l64-64c.3-.3 .6-.7 .9-1l45.1 45.1zM408.6 262.6l45.1 45.1c-.3 .3-.7 .6-1 .9l-64 64c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0l64-64c.3-.3 .6-.7 .9-1L496 350.1c18.7 18.7 18.7 49.1 0 67.9L417.9 496c-18.7 18.7-49.1 18.7-67.9 0l-87.4-87.4L408.6 262.6z"></path>
                                        </svg>
                                        Design
                                    </button>
                                </li>
                                {/* <li className="nav-item" role="presentation">
                                    <button
                                        className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'tabAnalysis' ? 'active' : ''}`}
                                        onClick={() => handleAnalysis()}
                                        disabled={AiResumeLoader}
                                    >
                                        {AiResumeLoader ? (<><FiLoader size={14} className="me-2 animate-spin" /> analyzing </>) : <> <svg width={14} className="svg-inline--fa fa-chart-line" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chart-line" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path fill="currentColor" d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64L0 400c0 44.2 35.8 80 80 80l400 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 416c-8.8 0-16-7.2-16-16L64 64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z"></path>
                                        </svg> Analysis </>}
                                    </button>
                                </li> */}
                                {/* <li className="nav-item" role="presentation">
                                <button
                                className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'tabMatching' ? 'active' : ''}`}
                                onClick={() => setActiveTab('tabMatching')}
                                >
                                <svg width={16} className="svg-inline--fa fa-link" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="link" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                <path fill="currentColor" d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"></path>
                                </svg>
                                Job Matching
                                </button>
                                </li> */}
                                {/* <li className="nav-item" role="presentation">
                                <button
                                className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'tabCover' ? 'active' : ''}`}
                                onClick={() => setActiveTab('tabCover')}
                                >
                                <svg width={10} className="svg-inline--fa fa-file-lines" aria-hidden="true" focusable="false" data-prefix="far" data-icon="file-lines" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                <path fill="currentColor" d="M64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"></path>
                                </svg>
                                Cover Letter
                                </button>
                                </li> */}
                            </ul>
                            <button className="btn btn-primary btn-sm" onClick={handleSaveChanges} disabled={parsedResume == prevParsedResume || saveChangesLoader}>{saveChangesLoader ? (<><FiLoader size={14} className="me-2 animate-spin" />Saving...</>) : "Save Changes"}</button>
                        </div>

                        <div className="card-body pt-3">


                            {/* Tab panes */}
                            <div className="tab-content" id="cvTabsContent">
                                {/* TAB: Preview (main form) */}
                                {activeTab === 'tabPreview' && (
                                    <>
                                        <div className="tab-pane fade active show" id="tabPreview" role="tabpanel" aria-labelledby="tabPreview-tab" tabIndex="0">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h4 className="mb-0">Basic Information</h4>
                                            </div>
                                            <div className="accordion" id="cvAccordion">
                                                {/* Personal details */}
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingPersonal">
                                                        <div className="d-flex justify-content-between align-items-center w-100">
                                                            <div className="d-flex align-items-center w-100 gap-2">

                                                                {parsedResume?.editingPersonalTitle ? (
                                                                    <div className="d-flex align-items-center">
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm me-2"
                                                                            style={{ width: '200px' }}
                                                                            value={parsedResume?.personalTitle || "Personal details"}
                                                                            onChange={(e) =>
                                                                                dispatch(
                                                                                    updateField({
                                                                                        path: "personalTitle",
                                                                                        value: e.target.value
                                                                                    })
                                                                                )
                                                                            }
                                                                            onBlur={() =>
                                                                                dispatch(
                                                                                    updateField({
                                                                                        path: "editingPersonalTitle",
                                                                                        value: false
                                                                                    })
                                                                                )
                                                                            }
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === 'Enter') {
                                                                                    dispatch(
                                                                                        updateField({
                                                                                            path: "editingPersonalTitle",
                                                                                            value: false
                                                                                        })
                                                                                    );
                                                                                }
                                                                            }}
                                                                        />
                                                                        <span
                                                                            type="button"
                                                                            className="btn btn-sm btn-outline-success"
                                                                            onClick={() =>
                                                                                dispatch(
                                                                                    updateField({
                                                                                        path: "editingPersonalTitle",
                                                                                        value: false
                                                                                    })
                                                                                )
                                                                            }
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-check">
                                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                                <path d="M5 12l5 5l10 -10" />
                                                                            </svg>
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        className={`accordion-button ${openSections.personal ? '' : 'collapsed'} ${parsedResume?.personalDisabled ? 'text-muted' : ''}`}
                                                                        type="button"
                                                                        onClick={() => toggleSection('personal')}
                                                                        style={{ background: 'none', border: 'none', textAlign: 'left' }}
                                                                    >
                                                                        {parsedResume?.personalTitle || "Personal details"}
                                                                        <span
                                                                            type="button"
                                                                            className=" ms-2"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                dispatch(
                                                                                    updateField({
                                                                                        path: "editingPersonalTitle",
                                                                                        value: true
                                                                                    })
                                                                                );
                                                                            }}
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-edit">
                                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                                <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                                                                <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                                                                <path d="M16 5l3 3" />
                                                                            </svg>
                                                                        </span>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </h2>
                                                    <div
                                                        id="collapsePersonal"
                                                        className={`accordion-collapse collapse ${openSections.personal ? 'show' : ''}`}
                                                        aria-labelledby="headingPersonal"
                                                    >
                                                        <div className="accordion-body">
                                                            {!parsedResume?.personalDisabled ? (
                                                                <div className="card border-0">
                                                                    {/* Avatar + Name/Headline */}
                                                                    <div className="row g-3 mb-3">
                                                                        <div className="col-md-3 col-4">
                                                                            <div className="border rounded d-flex flex-column justify-content-center align-items-center overflow-hidden" style={{ height: '120px' }}>
                                                                                {profilePic || parsedResume?.profilePic ? (
                                                                                    <img
                                                                                        src={profilePic || parsedResume.profilePic}
                                                                                        alt="Profile"
                                                                                        style={{
                                                                                            width: '100%',
                                                                                            height: '100%',
                                                                                            objectFit: 'cover',
                                                                                        }}
                                                                                    />
                                                                                ) : (
                                                                                    <div className="text-muted">
                                                                                        <i className="bi bi-person-circle" style={{ fontSize: '3rem' }}></i>
                                                                                        <div className="small mt-1">Upload Photo</div>
                                                                                    </div>
                                                                                )}
                                                                                <input
                                                                                    id="avatarInput"
                                                                                    ref={fileInputRef}
                                                                                    type="file"
                                                                                    accept="image/*"
                                                                                    className="d-none"
                                                                                    onChange={handleAvatarUpload}
                                                                                />
                                                                            </div>
                                                                            <div className="d-flex flex-column gap-2 mt-2">
                                                                                <button
                                                                                    className="btn btn-outline-secondary btn-sm w-100"
                                                                                    type="button"
                                                                                    onClick={() => fileInputRef.current.click()}
                                                                                >
                                                                                    <svg
                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                        width="24"
                                                                                        height="24"
                                                                                        viewBox="0 0 24 24"
                                                                                        fill="none"
                                                                                        stroke="currentColor"
                                                                                        strokeWidth="2"
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                        className="feather feather-upload me-1"
                                                                                    >
                                                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                                                        <polyline points="17 8 12 3 7 8"></polyline>
                                                                                        <line x1="12" y1="3" x2="12" y2="15"></line>
                                                                                    </svg>
                                                                                    Upload Photo
                                                                                </button>
                                                                                {(profilePic || parsedResume?.profilePic) && (
                                                                                    <button
                                                                                        className="btn btn-outline-danger btn-sm w-100"
                                                                                        type="button"
                                                                                        onClick={handleRemovePhoto}
                                                                                    >
                                                                                        <svg
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            width="24"
                                                                                            height="24"
                                                                                            viewBox="0 0 24 24"
                                                                                            fill="none"
                                                                                            stroke="currentColor"
                                                                                            strokeWidth="2"
                                                                                            strokeLinecap="round"
                                                                                            strokeLinejoin="round"
                                                                                            className="feather feather-trash-2 me-1"
                                                                                        >
                                                                                            <polyline points="3 6 5 6 21 6"></polyline>
                                                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                                                            <line x1="10" y1="11" x2="10" y2="17"></line>
                                                                                            <line x1="14" y1="11" x2="14" y2="17"></line>
                                                                                        </svg>
                                                                                        Remove Photo
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-9 col-8">
                                                                            <div className="row g-3">
                                                                                <div className="col-md-6">
                                                                                    <label className="form-label">First Name</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        name="firstName"
                                                                                        value={parsedResume?.candidateName?.[0]?.firstName || ""}
                                                                                        onChange={(e) =>
                                                                                            dispatch(
                                                                                                updateField({
                                                                                                    path: "candidateName[0].firstName",
                                                                                                    value: e.target.value
                                                                                                })
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <label className="form-label">Last name</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        name="lastName"
                                                                                        value={`${parsedResume?.candidateName?.[0]?.familyName || ''}`}
                                                                                        onChange={(e) =>
                                                                                            dispatch(
                                                                                                updateField({
                                                                                                    path: "candidateName[0].familyName",
                                                                                                    value: e.target.value
                                                                                                })
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                                <div className="col-12">
                                                                                    <label className="form-label">Headline</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        name="headline"
                                                                                        value={parsedResume?.headline || ''}
                                                                                        onChange={(e) =>
                                                                                            dispatch(
                                                                                                updateField({
                                                                                                    path: "headline",
                                                                                                    value: e.target.value
                                                                                                })
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Email / Phone */}
                                                                    <div className="row g-3 mb-3">
                                                                        <div className="col-md-6">
                                                                            <label className="form-label">Email address</label>
                                                                            <input
                                                                                type="email"
                                                                                className="form-control"
                                                                                name="email"
                                                                                value={parsedResume?.email?.[0] || ''}
                                                                                onChange={(e) =>
                                                                                    dispatch(
                                                                                        updateField({
                                                                                            path: "email",
                                                                                            value: [e.target.value]
                                                                                        })
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <label className="form-label">Phone number</label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                name="phone"
                                                                                value={parsedResume?.phoneNumber?.[0]?.formattedNumber || ''}
                                                                                onChange={(e) =>
                                                                                    dispatch(
                                                                                        updateField({
                                                                                            path: "phoneNumber[0].formattedNumber",
                                                                                            value: e.target.value
                                                                                        })
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {/* Address */}
                                                                    <div className="row g-3 mb-3">
                                                                        <div className="col-12">
                                                                            <label className="form-label">Address</label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                name="address"
                                                                                value={parsedResume?.location?.formatted || ''}
                                                                                onChange={(e) =>
                                                                                    dispatch(
                                                                                        updateField({
                                                                                            path: "location.formatted",
                                                                                            value: e.target.value
                                                                                        })
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {/* Post code / City */}
                                                                    <div className="row g-3 mb-3">
                                                                        <div className="col-md-6">
                                                                            <label className="form-label">Post code</label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                name="postCode"
                                                                                value={parsedResume?.location?.postCode || ''}
                                                                                onChange={(e) =>
                                                                                    dispatch(
                                                                                        updateField({
                                                                                            path: "location.postCode",
                                                                                            value: e.target.value
                                                                                        })
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <label className="form-label">City</label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                name="city"
                                                                                value={parsedResume?.location?.city || ''}
                                                                                onChange={(e) =>
                                                                                    dispatch(
                                                                                        updateField({
                                                                                            path: "location.city",
                                                                                            value: e.target.value
                                                                                        })
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {/* Summary */}
                                                                    <div className="row g-3">
                                                                        <div className="col-12">
                                                                            <label className="form-label fw-bold small">Summary</label>
                                                                            <textarea
                                                                                rows="5"
                                                                                className="form-control"
                                                                                placeholder="Describe your professional background, key skills, achievements, and career goals. Be specific about technologies, methodologies, and results..."
                                                                                name="summary"
                                                                                value={parsedResume?.summary?.paragraph || ''}
                                                                                onChange={(e) =>
                                                                                    dispatch(
                                                                                        updateField({
                                                                                            path: "summary.paragraph",
                                                                                            value: e.target.value
                                                                                        })
                                                                                    )
                                                                                }
                                                                            ></textarea>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="text-muted text-center py-3 d-flex flex-column gap-2">
                                                                    <span
                                                                        className={`icon-toggle border-0 bg-transparent`}
                                                                    >
                                                                        <img
                                                                            src={toggleImage}
                                                                            alt="Complete icon"
                                                                            width="36"
                                                                            height="36"
                                                                        />
                                                                    </span>
                                                                    This section is disabled
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>



                                                {/* Employment */}
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingEmployment">
                                                        <div className="d-flex justify-content-between align-items-center w-100">
                                                            <div className="d-flex gap-2 align-items-center w-100">
                                                                <button
                                                                    className={`icon-toggle border-0 bg-transparent ${!parsedResume?.employmentDisabled ? 'is-active' : ''}`}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        dispatch(
                                                                            updateField({
                                                                                path: "employmentDisabled",
                                                                                value: !parsedResume?.employmentDisabled
                                                                            })
                                                                        )
                                                                    }
                                                                >
                                                                    {/* <img
                                                                        src={toggleImage}
                                                                        alt="Complete icon"
                                                                        width="28"
                                                                        height="28"
                                                                    /> */}
                                                                    {!parsedResume?.employmentDisabled ? 
                                                                    (<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="#222"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-eye"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>)
                                                                    : (<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="#222"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-eye-off"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" /><path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" /><path d="M3 3l18 18" /></svg>)
                                                                    }
                                                                </button>
                                                                {parsedResume?.editingEmploymentTitle ? (
                                                                    <div className="d-flex align-items-center">
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm me-2"
                                                                            style={{ width: '200px' }}
                                                                            value={parsedResume?.employmentTitle || "Employment"}
                                                                            onChange={(e) =>
                                                                                dispatch(
                                                                                    updateField({
                                                                                        path: "employmentTitle",
                                                                                        value: e.target.value
                                                                                    })
                                                                                )
                                                                            }
                                                                            onBlur={() =>
                                                                                dispatch(
                                                                                    updateField({
                                                                                        path: "editingEmploymentTitle",
                                                                                        value: false
                                                                                    })
                                                                                )
                                                                            }
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === 'Enter') {
                                                                                    dispatch(
                                                                                        updateField({
                                                                                            path: "editingEmploymentTitle",
                                                                                            value: false
                                                                                        })
                                                                                    );
                                                                                }
                                                                            }}
                                                                        />
                                                                        <span
                                                                            type="button"
                                                                            className=""
                                                                            onClick={() =>
                                                                                dispatch(
                                                                                    updateField({
                                                                                        path: "editingEmploymentTitle",
                                                                                        value: false
                                                                                    })
                                                                                )
                                                                            }
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-check">
                                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                                <path d="M5 12l5 5l10 -10" />
                                                                            </svg>
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        className={`accordion-button flex-grow-1 w-100 d-flex gap-2 ${openSections.employment ? '' : 'collapsed'} ${parsedResume?.employmentDisabled ? 'text-muted' : ''}`}
                                                                        type="button"
                                                                        onClick={() => toggleSection('employment')}
                                                                        style={{ background: 'none', border: 'none', textAlign: 'left' }}
                                                                    >
                                                                        {parsedResume?.employmentTitle || "Employment"}
                                                                        <span
                                                                            type="button"
                                                                            className=""
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                dispatch(
                                                                                    updateField({
                                                                                        path: "editingEmploymentTitle",
                                                                                        value: true
                                                                                    })
                                                                                );
                                                                            }}
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-edit">
                                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                                <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                                                                <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                                                                <path d="M16 5l3 3" />
                                                                            </svg>
                                                                        </span>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </h2>
                                                    <div
                                                        id="collapseEmployment"
                                                        className={`accordion-collapse collapse ${openSections.employment ? 'show' : ''}`}
                                                        aria-labelledby="headingEmployment"
                                                    >
                                                        <div className="accordion-body">
                                                            {!parsedResume?.employmentDisabled ? (
                                                                <div className="card border-0">
                                                                    {parsedResume.workExperience?.map((expItem, expIndex) => (
                                                                        <div key={expIndex} className="mb-3 p-3 border rounded">

                                                                            {(expItem?.expIsComplete) ? (
                                                                                // Display completed experience item
                                                                                <>
                                                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                                                        <small className="fw-bold text-muted">Experience #{expIndex + 1}</small>
                                                                                        <button
                                                                                            type="button"
                                                                                            className="btn btn-sm btn-outline-danger"
                                                                                            onClick={() => expHandleDeleteExperience(expIndex)}
                                                                                            title="Delete experience entry"
                                                                                        >
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                                                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                                                            </svg>
                                                                                        </button>
                                                                                    </div>
                                                                                    <div className="d-flex gap-2 align-items-start">
                                                                                        <div className="icon-span text-info">
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-briefcase">
                                                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                                                                <path d="M3 7m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"></path>
                                                                                                <path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2"></path>
                                                                                                <path d="M12 12l0 .01"></path>
                                                                                                <path d="M3 13a20 20 0 0 0 18 0"></path>
                                                                                            </svg>
                                                                                        </div>
                                                                                        <div className="content-d">
                                                                                            <h6 className="exp-title mb-1">{expItem.workExperienceJobTitle}</h6>
                                                                                            <h6 className="exp-company text-muted">{expItem.workExperienceOrganization}</h6>
                                                                                            {expItem.workExperienceDescription && (
                                                                                                <p className="exp-description mt-2">{expItem.workExperienceDescription}</p>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                    <small className="exp-time text-muted">
                                                                                        <em>{expItem.workExperienceDates?.start?.date} - {expItem.workExperienceDates?.end?.date}</em>
                                                                                    </small>
                                                                                    <div className="d-flex justify-content-end align-items-center gap-2 mt-2">
                                                                                        <button
                                                                                            type="button"
                                                                                            className="content-confirm-btn btn btn-outline-secondary btn-sm"
                                                                                            onClick={() => expHandleEditExperience(expIndex)}
                                                                                        >
                                                                                            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                                                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                                                                            </svg>
                                                                                            Edit
                                                                                        </button>
                                                                                    </div>
                                                                                </>
                                                                            ) : (
                                                                                // Display incomplete experience form
                                                                                <>
                                                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                                                        <small className="fw-bold text-muted">
                                                                                            Experience #{expIndex + 1}
                                                                                        </small>
                                                                                        <button
                                                                                            type="button"
                                                                                            className="btn btn-sm btn-outline-danger"
                                                                                            onClick={() => expHandleCancelEdit(expIndex)}
                                                                                            title="Cancel editing"
                                                                                        >
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                                                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                                                                            </svg>
                                                                                        </button>
                                                                                    </div>
                                                                                    <div className="mb-2">
                                                                                        <label className="form-label">Job Title</label>
                                                                                        <input
                                                                                            className="form-control"
                                                                                            value={expItem.workExperienceJobTitle}
                                                                                            onChange={(e) => dispatch(updateField({ path: 'workExperience.' + expIndex + '.workExperienceJobTitle', value: e.target.value }))}
                                                                                        />
                                                                                    </div>
                                                                                    <div className="mb-2">
                                                                                        <label className="form-label">Company</label>
                                                                                        <input
                                                                                            className="form-control"
                                                                                            value={expItem.workExperienceOrganization}
                                                                                            onChange={(e) => dispatch(updateField({ path: 'workExperience.' + expIndex + '.workExperienceOrganization', value: e.target.value }))}
                                                                                        />
                                                                                    </div>
                                                                                    <div className="row">
                                                                                        <div className="col-md-6">
                                                                                            <div className="mb-2">
                                                                                                <label className="form-label">Start Date</label>
                                                                                                <input
                                                                                                    placeholder="2020"
                                                                                                    className="form-control"
                                                                                                    type="text"
                                                                                                    value={expItem.workExperienceDates?.start?.date}
                                                                                                    onChange={(e) => dispatch(updateField({ path: 'workExperience.' + expIndex + '.workExperienceDates.start.date', value: e.target.value }))}
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-md-6">
                                                                                            <div className="mb-2">
                                                                                                <label className="form-label">End Date</label>
                                                                                                <input
                                                                                                    placeholder="2021 or Present"
                                                                                                    className="form-control"
                                                                                                    type="text"
                                                                                                    value={expItem.workExperienceDates?.end?.date}
                                                                                                    onChange={(e) => dispatch(updateField({ path: 'workExperience.' + expIndex + '.workExperienceDates.end.date', value: e.target.value }))}
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="mb-3">
                                                                                    <div className="mb-3">
        <label className="form-label">Additional Notes (Optional)</label>
        <textarea
            rows="3"
            className="form-control"
            value={expItem.workExperienceDescription || ''}
            onChange={(e) => dispatch(updateField({ 
                path: 'workExperience.' + expIndex + '.workExperienceDescription', 
                value: e.target.value 
            }))}
            placeholder="Any additional details about this role"
        ></textarea>
    </div>
    <div className="d-flex justify-content-between align-items-center mb-2">
        <label className="form-label">Key Achievements</label>
        <button 
            type="button" 
            className="btn btn-sm btn-outline-primary"
// Update the onClick handler for adding a new bullet point
onClick={() => {
    const updatedExperience = parsedResume.workExperience.map((item, idx) => {
        if (idx === expIndex) {
            // Create a new work experience item with updated highlights
            return {
                ...item,
                highlights: {
                    ...item.highlights,
                    items: [
                        ...(item.highlights?.items || []),
                        { id: Date.now(), bullet: '' }
                    ]
                }
            };
        }
        return item;
    });

    dispatch(updateField({
        path: 'workExperience',
        value: updatedExperience
    }));
}}
        >
            <FiPlus size={14} className="me-1" /> Add Bullet Point
        </button>
    </div>
    
    {expItem.highlights?.items?.map((bullet, bulletIndex) => (
        <div key={bullet.id || bulletIndex} className="d-flex align-items-start mb-2">
            <span className="me-2 mt-2">•</span>
            <div className="flex-grow-1">
                <input
                    type="text"
                    className="form-control form-control-sm"
                    value={bullet.bullet}
                   // Update the onChange handler for editing a bullet point
onChange={(e) => {
    const updatedExperience = parsedResume.workExperience.map((item, idx) => {
        if (idx === expIndex) {
            return {
                ...item,
                highlights: {
                    ...item.highlights,
                    items: item.highlights.items.map((b, i) => 
                        i === bulletIndex 
                            ? { ...b, bullet: e.target.value }
                            : b
                    )
                }
            };
        }
        return item;
    });

    dispatch(updateField({
        path: 'workExperience',
        value: updatedExperience
    }));
}}
                    placeholder="Enter achievement or responsibility"
                />
            </div>
            <button
                type="button"
                className="btn btn-sm btn-link text-danger ms-2"
// Update the onClick handler for removing a bullet point
onClick={() => {
    const updatedExperience = parsedResume.workExperience.map((item, idx) => {
        if (idx === expIndex) {
            return {
                ...item,
                highlights: {
                    ...item.highlights,
                    items: item.highlights.items.filter((_, i) => i !== bulletIndex)
                }
            };
        }
        return item;
    });

    dispatch(updateField({
        path: 'workExperience',
        value: updatedExperience
    }));
}}
            >
                <FiTrash2 size={14} />
            </button>
        </div>
    ))}


</div>
                                                                                    <div className="d-flex align-items-center justify-content-end gap-2 mt-3">
                                                                                        <button
                                                                                            type="button"
                                                                                            className="btn btn-outline-danger"
                                                                                            onClick={() => expHandleCancelEdit(expIndex)}
                                                                                        >
                                                                                            Cancel
                                                                                        </button>
                                                                                        <button
                                                                                            type="button"
                                                                                            className="content-confirm-btn btn btn-outline-primary"
                                                                                            onClick={() => expHandleSaveExperience(expIndex)}
                                                                                        >
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-check">
                                                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                                                                <path d="M5 12l5 5l10 -10"></path>
                                                                                            </svg>
                                                                                            Done
                                                                                        </button>
                                                                                    </div>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    ))}

                                                                    {/* Add Experience Button */}
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-outline-secondary btn-sm mt-2"
                                                                        style={{ maxWidth: 'fit-content' }}
                                                                        onClick={expHandleAddExperience}
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus me-1">
                                                                            <line x1="12" y1="5" x2="12" y2="19"></line>
                                                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                                                        </svg>
                                                                        Add Experience
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="text-muted text-center py-3 d-flex flex-column gap-2">
                                                                    <span
                                                                        className={`icon-toggle border-0 bg-transparent`}
                                                                    >
                                                                        <img
                                                                            src={toggleImage}
                                                                            alt="Complete icon"
                                                                            width="36"
                                                                            height="36"
                                                                        />
                                                                    </span>
                                                                    This section is disabled
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                                                                {/* Education */}
                                                                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingEducation">
                                                        <div className="d-flex justify-content-between align-items-center w-100">
                                                            <div className="d-flex align-items-center w-100 gap-2">

                                                                <button
                                                                    className={`icon-toggle border-0 bg-transparent ${!parsedResume?.educationDisabled ? 'is-active' : ''}`}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        dispatch(
                                                                            updateField({
                                                                                path: "educationDisabled",
                                                                                value: !parsedResume?.educationDisabled
                                                                            })
                                                                        )
                                                                    }
                                                                >
                                                                    {/* <img
                                                                        src={toggleImage}
                                                                        alt="Complete icon"
                                                                        width="28"
                                                                        height="28"
                                                                    /> */}
                                                                    {!parsedResume?.educationDisabled ? 
                                                                    (<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="#222"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-eye"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>)
                                                                    : (<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="#222"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-eye-off"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" /><path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" /><path d="M3 3l18 18" /></svg>)
                                                                    }
                                                                </button>
                                                                {parsedResume?.editingEducationTitle ? (
                                                                    <div className="d-flex align-items-center">
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm me-2"
                                                                            style={{ width: '200px' }}
                                                                            value={parsedResume?.educationTitle || "Education"}
                                                                            onChange={(e) =>
                                                                                dispatch(
                                                                                    updateField({
                                                                                        path: "educationTitle",
                                                                                        value: e.target.value
                                                                                    })
                                                                                )
                                                                            }
                                                                            onBlur={() =>
                                                                                dispatch(
                                                                                    updateField({
                                                                                        path: "editingEducationTitle",
                                                                                        value: false
                                                                                    })
                                                                                )
                                                                            }
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === 'Enter') {
                                                                                    dispatch(
                                                                                        updateField({
                                                                                            path: "editingEducationTitle",
                                                                                            value: false
                                                                                        })
                                                                                    );
                                                                                }
                                                                            }}
                                                                        />
                                                                        <span
                                                                            type="button"
                                                                            onClick={() =>
                                                                                dispatch(
                                                                                    updateField({
                                                                                        path: "editingEducationTitle",
                                                                                        value: false
                                                                                    })
                                                                                )
                                                                            }
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-check">
                                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                                <path d="M5 12l5 5l10 -10" />
                                                                            </svg>
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        className={`accordion-button flex-grow-1 w-100 gap-2 d-flex ${openSections.education ? '' : 'collapsed'} ${parsedResume?.educationDisabled ? 'text-muted' : ''}`}
                                                                        type="button"
                                                                        onClick={() => toggleSection('education')}
                                                                        style={{ background: 'none', border: 'none', textAlign: 'left' }}
                                                                    >
                                                                        {parsedResume?.educationTitle || "Education"}
                                                                        <span
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                dispatch(
                                                                                    updateField({
                                                                                        path: "editingEducationTitle",
                                                                                        value: true
                                                                                    })
                                                                                );
                                                                            }}
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-edit">
                                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                                <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                                                                <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                                                                <path d="M16 5l3 3" />
                                                                            </svg>
                                                                        </span>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </h2>
                                                    <div
                                                        id="collapseEducation"
                                                        className={`accordion-collapse collapse ${openSections.education ? 'show' : ''}`}
                                                        aria-labelledby="headingEducation"
                                                    >
                                                        <div className="accordion-body">
                                                            {!parsedResume?.educationDisabled ? (
                                                                <div className="card border-0">
                                                                    {parsedResume.education?.map((eduItem, eduIndex) => (
                                                                        <div key={eduIndex} className="mb-3 p-3 border rounded">
                                                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                                                <small className="fw-bold text-muted">Education #{eduIndex + 1}</small>
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-sm btn-outline-danger"
                                                                                    onClick={() => eduHandleDeleteEducation(eduIndex)}
                                                                                    title="Delete education entry"
                                                                                >
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                                                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                                                    </svg>
                                                                                </button>
                                                                            </div>
                                                                            <div className="d-flex gap-2 align-items-start">
                                                                                <div className="icon-span text-primary">
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                                                        <path d="M22 9l-10 -4l-10 4l10 4l10 -4v6"></path>
                                                                                        <path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4"></path>
                                                                                    </svg>
                                                                                </div>
                                                                                <div className="content-d">
                                                                                    <h6 className="edu-degree mb-1">{eduItem.educationLevel.label}</h6>
                                                                                    <h6 className="edu-institute text-muted">{eduItem.educationOrganization}</h6>
                                                                                </div>
                                                                            </div>
                                                                            <small className="edu-time text-muted">
                                                                                <em>{eduItem.educationDates.start.date} / {eduItem.educationDates.end.date}</em>
                                                                            </small>
                                                                            <div className="d-flex justify-content-end align-items-center gap-2 mt-2">
                                                                                <button
                                                                                    type="button"
                                                                                    className="content-confirm-btn btn btn-outline-secondary btn-sm"
                                                                                    onClick={() => eduHandleEditEducation(eduIndex)}
                                                                                >
                                                                                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                                                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                                                                    </svg>
                                                                                    Edit
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ))}


                                                                    {/* Current form for adding/editing */}
                                                                    {eduCurrentForm && (
                                                                        <div className="mb-3 p-3 border rounded">
                                                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                                                <small className="fw-bold text-muted">
                                                                                    {eduList.length > 0 ? `Education #${eduList.length + 1}` : 'Education #1'}
                                                                                </small>
                                                                            </div>
                                                                            <div className="mb-2">
                                                                                <label className="form-label">Degree/Qualification</label>
                                                                                <input
                                                                                    className="form-control"
                                                                                    name="eduDegree"
                                                                                    value={eduFormData.eduDegree}
                                                                                    onChange={eduHandleInputChange}
                                                                                />
                                                                            </div>
                                                                            <div className="mb-2">
                                                                                <label className="form-label">Institution</label>
                                                                                <input
                                                                                    className="form-control"
                                                                                    name="eduInstitution"
                                                                                    value={eduFormData.eduInstitution}
                                                                                    onChange={eduHandleInputChange}
                                                                                />
                                                                            </div>
                                                                            <div className="row">
                                                                                <div className="col-md-6">
                                                                                    <div className="mb-2">
                                                                                        <label className="form-label">Start Date</label>
                                                                                        <input
                                                                                            placeholder="2017"
                                                                                            className="form-control"
                                                                                            type="text"
                                                                                            name="eduStartDate"
                                                                                            value={eduFormData.eduStartDate}
                                                                                            onChange={eduHandleInputChange}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <div className="mb-2">
                                                                                        <label className="form-label">End Date</label>
                                                                                        <input
                                                                                            placeholder="2018"
                                                                                            className="form-control"
                                                                                            type="text"
                                                                                            name="eduEndDate"
                                                                                            value={eduFormData.eduEndDate}
                                                                                            onChange={eduHandleInputChange}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {/* Inside your education form, add this section after the achieved grade field */}
                                                                            <div className="mb-3">
                                                                                <label className="form-label">Major(s)</label>
                                                                                {eduFormData.educationMajor.map((major, index) => (
                                                                                    <div key={index} className="input-group mb-2">
                                                                                        <input
                                                                                            type="text"
                                                                                            className="form-control"
                                                                                            value={major}
                                                                                            onChange={(e) => handleMajorChange(index, e.target.value)}
                                                                                            placeholder={`Major ${index + 1}`}
                                                                                        />
                                                                                        {eduFormData.educationMajor.length > 1 && (
                                                                                            <button
                                                                                                type="button"
                                                                                                className="btn btn-outline-danger"
                                                                                                onClick={() => handleRemoveMajor(index)}
                                                                                            >
                                                                                                <FiTrash2 />
                                                                                            </button>
                                                                                        )}
                                                                                    </div>
                                                                                ))}
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-sm btn-outline-secondary mt-2"
                                                                                    onClick={handleAddMajor}
                                                                                >
                                                                                    <FiPlus /> Add Another Major
                                                                                </button>
                                                                            </div>
                                                                            <div className="mb-2">
                                                                                <label className="form-label">Grade Achieved</label>
                                                                                <input
                                                                                    className="form-control"
                                                                                    name="achievedGrade"
                                                                                    value={eduFormData.achievedGrade}
                                                                                    onChange={eduHandleInputChange}
                                                                                />
                                                                            </div>
                                                                            <div className="d-flex align-items-center justify-content-end gap-2 mt-2">
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-outline-danger"
                                                                                    onClick={eduHandleCancelEdit}
                                                                                >
                                                                                    Cancel
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    className="content-confirm-btn btn btn-outline-primary"
                                                                                    onClick={eduHandleSaveEducation}
                                                                                >
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                                                        <path d="M5 12l5 5l10 -10"></path>
                                                                                    </svg>
                                                                                    Done
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {/* Add Education Button */}
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-outline-secondary btn-sm mt-2"
                                                                        style={{ maxWidth: 'fit-content' }}
                                                                        onClick={eduHandleAddEducation}
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus me-1">
                                                                            <line x1="12" y1="5" x2="12" y2="19"></line>
                                                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                                                        </svg>
                                                                        Add Education
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="text-muted text-center py-3 d-flex flex-column gap-2">
                                                                    <span
                                                                        className={`icon-toggle border-0 bg-transparent`}
                                                                    >
                                                                        <img
                                                                            src={toggleImage}
                                                                            alt="Complete icon"
                                                                            width="36"
                                                                            height="36"
                                                                        />
                                                                    </span>
                                                                    This section is disabled
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Skills */}
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingSkills">
                                                        <div className="d-flex justify-content-between align-items-center w-100">
                                                            <div className="d-flex align-items-center w-100 gap-2">

                                                                <button
                                                                    className={`icon-toggle border-0 bg-transparent ${!parsedResume?.skillsDisabled ? 'is-active' : ''}`}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        dispatch(
                                                                            updateField({
                                                                                path: "skillsDisabled",
                                                                                value: !parsedResume?.skillsDisabled
                                                                            })
                                                                        )
                                                                    }
                                                                >
                                                                    {/* <img
                                                                        src={toggleImage}
                                                                        alt="Complete icon"
                                                                        width="28"
                                                                        height="28"
                                                                    /> */}
                                                                    {!parsedResume?.skillsDisabled ? 
                                                                    (<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="#222"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-eye"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>)
                                                                    : (<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="#222"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-eye-off"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" /><path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" /><path d="M3 3l18 18" /></svg>)
                                                                    }
                                                                </button>
                                                                {parsedResume?.editingSkillsTitle ? (
                                                                    <div className="d-flex align-items-center">
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm me-2"
                                                                            style={{ width: '200px' }}
                                                                            value={parsedResume?.skillsTitle || "Skills"}
                                                                            onChange={(e) =>
                                                                                dispatch(
                                                                                    updateField({
                                                                                        path: "skillsTitle",
                                                                                        value: e.target.value
                                                                                    })
                                                                                )
                                                                            }
                                                                            onBlur={() =>
                                                                                dispatch(
                                                                                    updateField({
                                                                                        path: "editingSkillsTitle",
                                                                                        value: false
                                                                                    })
                                                                                )
                                                                            }
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === 'Enter') {
                                                                                    dispatch(
                                                                                        updateField({
                                                                                            path: "editingSkillsTitle",
                                                                                            value: false
                                                                                        })
                                                                                    );
                                                                                }
                                                                            }}
                                                                        />
                                                                        <span
                                                                            type="button"
                                                                            className="btn btn-sm btn-outline-success"
                                                                            onClick={() =>
                                                                                dispatch(
                                                                                    updateField({
                                                                                        path: "editingSkillsTitle",
                                                                                        value: false
                                                                                    })
                                                                                )
                                                                            }
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-check">
                                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                                <path d="M5 12l5 5l10 -10" />
                                                                            </svg>
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        className={`accordion-button w-100 flex-grow-1 gap-2 d-flex ${openSections.skills ? '' : 'collapsed'} ${parsedResume?.skillsDisabled ? 'text-muted' : ''}`}
                                                                        type="button"
                                                                        onClick={() => toggleSection('skills')}
                                                                        style={{ background: 'none', border: 'none', textAlign: 'left' }}
                                                                    >
                                                                        {parsedResume?.skillsTitle || "Skills"}
                                                                        <span
                                                                            type="button"
                                                                            className=""
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                dispatch(
                                                                                    updateField({
                                                                                        path: "editingSkillsTitle",
                                                                                        value: true
                                                                                    })
                                                                                );
                                                                            }}
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-edit">
                                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                                <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                                                                <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                                                                <path d="M16 5l3 3" />
                                                                            </svg>
                                                                        </span>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </h2>
                                                    <div
                                                        id="collapseSkills"
                                                        className={`accordion-collapse collapse ${openSections.skills ? 'show' : ''}`}
                                                        aria-labelledby="headingSkills"
                                                    >
                                                        <div className="accordion-body">
                                                            {!parsedResume?.skillsDisabled ? (
                                                                <div className="card border-0 p-2">
                                                                    <div className="border rounded p-3">
                                                                        <label className="form-label">Add Skills (one per line)</label>
                                                                        <div className='d-flex'>
                                                                            <input type="text" className="form-control me-2" placeholder="Type a skill and press Enter to add it"
                                                                                value={currentSkill}
                                                                                onChange={(e) => setCurrentSkill(e.target.value)}
                                                                                onKeyDown={(e) => {
                                                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                                                        e.preventDefault();
                                                                                        handleAddSkill();
                                                                                    }
                                                                                }}
                                                                            />
                                                                            <button type="button" className="btn btn-outline-primary btn-sm"
                                                                                onClick={() => {
                                                                                    if (currentSkill.trim()) {
                                                                                        const currentSkills = parsedResume?.skill || [];
                                                                                        handleAddSkill();
                                                                                        setCurrentSkill('');
                                                                                    }
                                                                                }}
                                                                            >
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check me-1">
                                                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                                                </svg>
                                                                            </button>
                                                                        </div>

                                                                    </div>

                                                                    <div className="mt-3">
                                                                        <div className="mb-3">
                                                                            <h6>Selected Skills</h6>
                                                                            <div className="d-flex flex-wrap gap-2">
                                                                                {parsedResume?.skill
                                                                                    ?.filter(skill => skill.selected)
                                                                                    .map((skill, index) => (
                                                                                        <span key={index} className="badge bg-primary d-inline-flex align-items-center skill-badge">
                                                                                            {skill.name}
                                                                                            <button
                                                                                                type="button"
                                                                                                className="ms-1 bg-transparent border-0"
                                                                                                aria-label="Remove"
                                                                                                onClick={() => {
                                                                                                    const updatedSkills = [...parsedResume.skill];
                                                                                                    updatedSkills.splice(updatedSkills.findIndex(s => s.name === skill.name), 1);
                                                                                                    dispatch(updateField({ path: "skill", value: updatedSkills }));
                                                                                                }}
                                                                                            >
                                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-x">
                                                                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                                                    <path d="M18 6l-12 12" />
                                                                                                    <path d="M6 6l12 12" />
                                                                                                </svg>
                                                                                            </button>
                                                                                        </span>
                                                                                    ))}
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <h6>Suggested Skills</h6>
                                                                            <div className="d-flex flex-wrap gap-2">
                                                                                {parsedResume?.skill
                                                                                    ?.filter(skill => !skill.selected)
                                                                                    .map((skill, index) => (
                                                                                        <span key={index} className="badge bg-primary d-inline-flex align-items-center skill-badge">
                                                                                            {skill.name}
                                                                                            <button
                                                                                                type="button"
                                                                                                className="ms-1 bg-transparent border-0"
                                                                                                aria-label="Select"
                                                                                                onClick={() => {
                                                                                                    const updatedSkills = [...parsedResume.skill];
                                                                                                    const skillIndex = updatedSkills.findIndex(s => s.name === skill.name);
                                                                                                    updatedSkills[skillIndex] = {
                                                                                                        ...updatedSkills[skillIndex],
                                                                                                        selected: true
                                                                                                    };
                                                                                                    dispatch(updateField({ path: "skill", value: updatedSkills }));
                                                                                                }}
                                                                                            >
                                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-check">
                                                                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                                                    <path d="M5 12l5 5l10 -10" />
                                                                                                </svg>
                                                                                            </button>
                                                                                        </span>
                                                                                    ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <small className="text-muted d-block">Type a skill and press Enter or click Add</small>
                                                                </div>
                                                            ) : (
                                                                <div className="text-muted text-center py-3 d-flex flex-column gap-2">
                                                                    <span
                                                                        className={`icon-toggle border-0 bg-transparent`}
                                                                    >
                                                                        <img
                                                                            src={toggleImage}
                                                                            alt="Complete icon"
                                                                            width="36"
                                                                            height="36"
                                                                        />
                                                                    </span>
                                                                    This section is disabled
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Languages */}
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingLanguages">
                                                        <div className="d-flex justify-content-between align-items-center w-100">
                                                            <div className="d-flex align-items-center gap-2 w-100">

                                                                <button
                                                                    className={`icon-toggle border-0 bg-transparent ${!parsedResume?.languagesDisabled ? 'is-active' : ''}`}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        dispatch(
                                                                            updateField({
                                                                                path: "languagesDisabled",
                                                                                value: !parsedResume?.languagesDisabled
                                                                            })
                                                                        )
                                                                    }
                                                                >
                                                                    {/* <img
                                                                        src={toggleImage}
                                                                        alt="Complete icon"
                                                                        width="28"
                                                                        height="28"
                                                                    /> */}
                                                                    {!parsedResume?.languagesDisabled ? 
                                                                    (<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="#222"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-eye"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>)
                                                                    : (<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="#222"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-eye-off"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" /><path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" /><path d="M3 3l18 18" /></svg>)
                                                                    }
                                                                </button>
                                                                {parsedResume?.editingLanguagesTitle ? (
                                                                    <div className="d-flex align-items-center">
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm me-2"
                                                                            style={{ width: '200px' }}
                                                                            value={parsedResume?.languagesTitle || "Languages"}
                                                                            onChange={(e) =>
                                                                                dispatch(
                                                                                    updateField({
                                                                                        path: "languagesTitle",
                                                                                        value: e.target.value
                                                                                    })
                                                                                )
                                                                            }
                                                                            onBlur={() =>
                                                                                dispatch(
                                                                                    updateField({
                                                                                        path: "editingLanguagesTitle",
                                                                                        value: false
                                                                                    })
                                                                                )
                                                                            }
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === 'Enter') {
                                                                                    dispatch(
                                                                                        updateField({
                                                                                            path: "editingLanguagesTitle",
                                                                                            value: false
                                                                                        })
                                                                                    );
                                                                                }
                                                                            }}
                                                                        />
                                                                        <span
                                                                            type="button"
                                                                            className="btn btn-sm btn-outline-success"
                                                                            onClick={() =>
                                                                                dispatch(
                                                                                    updateField({
                                                                                        path: "editingLanguagesTitle",
                                                                                        value: false
                                                                                    })
                                                                                )
                                                                            }
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-check">
                                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                                <path d="M5 12l5 5l10 -10" />
                                                                            </svg>
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        className={`accordion-button w-100 flex-grow-1 d-flex gap-2 ${openSections.languages ? '' : 'collapsed'} ${parsedResume?.languagesDisabled ? 'text-muted' : ''}`}
                                                                        type="button"
                                                                        onClick={() => toggleSection('languages')}
                                                                        style={{ background: 'none', border: 'none', textAlign: 'left' }}
                                                                    >
                                                                        {parsedResume?.languagesTitle || "Languages"}
                                                                        <span
                                                                            type="button"
                                                                            className=""
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                dispatch(
                                                                                    updateField({
                                                                                        path: "editingLanguagesTitle",
                                                                                        value: true
                                                                                    })
                                                                                );
                                                                            }}
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-edit">
                                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                                <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                                                                <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                                                                <path d="M16 5l3 3" />
                                                                            </svg>
                                                                        </span>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </h2>
                                                    <div
                                                        id="collapseLanguages"
                                                        className={`accordion-collapse collapse ${openSections.languages ? 'show' : ''}`}
                                                        aria-labelledby="headingLanguages"
                                                    >
                                                        <div className="accordion-body">
                                                            {!parsedResume?.languagesDisabled ? (
                                                                <div className="card border-0">
                                                                    <div className="border rounded p-3">
                                                                        <label className="form-label">Add Language</label>
                                                                        <div className="row g-2">
                                                                            <div className="col-md-8">
                                                                                <input type="text" className="form-control" placeholder="Language name"
                                                                                    value={currentLanguage}
                                                                                    onChange={(e) => setCurrentLanguage(e.target.value)}
                                                                                    onKeyDown={(e) => {
                                                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                                                            e.preventDefault();
                                                                                            handleAddLanguage();
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                            <div className="col-md-3">
                                                                                <select className="form-select"
                                                                                    value={languageLevel}
                                                                                    onChange={(e) => setLanguageLevel(e.target.value)}
                                                                                >
                                                                                    <option value="Beginner">Beginner</option>
                                                                                    <option value="Intermediate">Intermediate</option>
                                                                                    <option value="Advanced">Advanced</option>
                                                                                    <option value="Native">Native</option>
                                                                                </select>
                                                                            </div>
                                                                            <div className='col-md-1'>
                                                                                <button type="button" className="btn btn-outline-primary btn-sm " style={{ padding: "5px" }}
                                                                                    onClick={handleAddLanguage}
                                                                                >
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check me-1">
                                                                                        <polyline points="20 6 9 17 4 12"></polyline>
                                                                                    </svg>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mt-3 d-flex flex-wrap gap-2">

                                                                        {(parsedResume?.languages ?? [])
                                                                            .filter((l) => {
                                                                                if (!l) return false;
                                                                                if (typeof l === 'object' && Object.keys(l).length === 0) return false;
                                                                                return Boolean(l.name || l.level || l.language);
                                                                            })
                                                                            .map((lang, index) => (
                                                                                <span key={index} className="badge bg-primary d-inline-flex align-items-center skill-badge">
                                                                                    {lang.name || lang.language}
                                                                                    {lang.level ? ` (${lang.level})` : ''}
                                                                                    <button
                                                                                        type="button"
                                                                                        className="bg-transparent border-0"
                                                                                        aria-label="Remove"
                                                                                        onClick={() => {
                                                                                            const updatedLangs = [...parsedResume.languages];
                                                                                            updatedLangs.splice(index, 1);
                                                                                            dispatch(updateField({ path: "languages", value: updatedLangs }));
                                                                                        }}
                                                                                    >
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                                                                                    </button>
                                                                                </span>
                                                                            ))}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="text-muted text-center py-3 d-flex flex-column gap-2">
                                                                    <span
                                                                        className={`icon-toggle border-0 bg-transparent`}
                                                                    >
                                                                        <img
                                                                            src={toggleImage}
                                                                            alt="Complete icon"
                                                                            width="36"
                                                                            height="36"
                                                                        />
                                                                    </span>
                                                                    This section is disabled
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Hobbies */}
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingHobbies">
                                                        <div className="d-flex justify-content-between align-items-center w-100">
                                                            <div className="d-flex align-items-center gap-2 w-100">

                                                                <button
                                                                    className={`icon-toggle border-0 bg-transparent ${!parsedResume?.hobbiesDisabled ? 'is-active' : ''}`}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        dispatch(
                                                                            updateField({
                                                                                path: "hobbiesDisabled",
                                                                                value: !parsedResume?.hobbiesDisabled
                                                                            })
                                                                        )
                                                                    }
                                                                >
                                                                    {/* <img
                                                                        src={toggleImage}
                                                                        alt="Complete icon"
                                                                        width="28"
                                                                        height="28"
                                                                    /> */}
                                                                    {!parsedResume?.hobbiesDisabled ? 
                                                                    (<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="#222"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-eye"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>)
                                                                    : (<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="#222"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-eye-off"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" /><path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" /><path d="M3 3l18 18" /></svg>)
                                                                    }
                                                                </button>
                                                                {parsedResume?.editingHobbiesTitle ? (
                                                                    <div className="d-flex align-items-center">
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm me-2"
                                                                            style={{ width: '200px' }}
                                                                            value={parsedResume?.hobbiesTitle || "Hobbies"}
                                                                            onChange={(e) =>
                                                                                dispatch(
                                                                                    updateField({
                                                                                        path: "hobbiesTitle",
                                                                                        value: e.target.value
                                                                                    })
                                                                                )
                                                                            }
                                                                            onBlur={() =>
                                                                                dispatch(
                                                                                    updateField({
                                                                                        path: "editingHobbiesTitle",
                                                                                        value: false
                                                                                    })
                                                                                )
                                                                            }
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === 'Enter') {
                                                                                    dispatch(
                                                                                        updateField({
                                                                                            path: "editingHobbiesTitle",
                                                                                            value: false
                                                                                        })
                                                                                    );
                                                                                }
                                                                            }}
                                                                        />
                                                                        <span
                                                                            type="button"
                                                                            onClick={() =>
                                                                                dispatch(
                                                                                    updateField({
                                                                                        path: "editingHobbiesTitle",
                                                                                        value: false
                                                                                    })
                                                                                )
                                                                            }
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-check">
                                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                                <path d="M5 12l5 5l10 -10" />
                                                                            </svg>
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        className={`accordion-button flex-grow-1 w-100 gap-2 ${openSections.hobbies ? '' : 'collapsed'} ${parsedResume?.hobbiesDisabled ? 'text-muted' : ''}`}
                                                                        type="button"
                                                                        onClick={() => toggleSection('hobbies')}
                                                                        style={{ background: 'none', border: 'none', textAlign: 'left' }}
                                                                    >
                                                                        {parsedResume?.hobbiesTitle || "Hobbies"}
                                                                        <span
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                dispatch(
                                                                                    updateField({
                                                                                        path: "editingHobbiesTitle",
                                                                                        value: true
                                                                                    })
                                                                                );
                                                                            }}
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-edit">
                                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                                <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                                                                <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                                                                <path d="M16 5l3 3" />
                                                                            </svg>
                                                                        </span>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </h2>
                                                    <div
                                                        id="collapseHobbies"
                                                        className={`accordion-collapse collapse ${openSections.hobbies ? 'show' : ''}`}
                                                        aria-labelledby="headingHobbies"
                                                    >
                                                        <div className="accordion-body">
                                                            {!parsedResume?.hobbiesDisabled ? (
                                                                <div className="card border-0">
                                                                    <div className="border rounded p-3">
                                                                        <label className="form-label">Add Hobby</label>
                                                                        <div className='d-flex'>
                                                                            <input type="text" className="form-control me-2" placeholder="Hobby name"
                                                                                value={currentHobby}
                                                                                onChange={(e) => setCurrentHobby(e.target.value)}
                                                                                onKeyDown={(e) => {
                                                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                                                        e.preventDefault();
                                                                                        handleAddHobby();
                                                                                    }
                                                                                }}
                                                                            />
                                                                            <button type="button" className="btn btn-outline-primary btn-sm"
                                                                                onClick={handleAddHobby}
                                                                            >
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check me-1">
                                                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                                                </svg>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mt-3 d-flex flex-wrap gap-2">

                                                                        {parsedResume?.hobbies?.map((hobby, index) => (
                                                                            <span key={index} className="badge bg-primary d-inline-flex align-items-center skill-badge">
                                                                                {hobby}
                                                                                <button
                                                                                    type="button"
                                                                                    className="ms-2 bg-transparent border-0"
                                                                                    aria-label="Remove"
                                                                                    onClick={() => {
                                                                                        const updatedHobbies = [...parsedResume.hobbies];
                                                                                        updatedHobbies.splice(index, 1);
                                                                                        dispatch(updateField({ path: "hobbies", value: updatedHobbies }));
                                                                                    }}
                                                                                >
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                                                                                </button>
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="text-muted text-center py-3 d-flex flex-column gap-2">
                                                                    <span
                                                                        className={`icon-toggle border-0 bg-transparent`}
                                                                    >
                                                                        <img
                                                                            src={toggleImage}
                                                                            alt="Complete icon"
                                                                            width="36"
                                                                            height="36"
                                                                        />
                                                                    </span>
                                                                    This section is disabled
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>



                                    </>
                                )}

                                {/* TAB placeholders */}
                                {activeTab === 'tabDesign' && (
                                    <div className={`tab-pane fade ${activeTab === 'tabDesign' ? 'show active' : ''}`} id="tabDesign" role="tabpanel" aria-labelledby="tabDesign-tab" tabIndex="0">
                                        <div className="card border-0 shadow-sm"><div className="card-body">
                                            <Row className="g-4">
                                                {cardTemplate.map((template) => (
                                                    <Col key={template.name} xs={6} sm={6} md={4} lg={3} xl={4}>
                                                        <div
                                                            className={`template-card p-3 text-center cursor-pointer ${selectedTemplate === template.name ? 'border border-primary rounded-3' : 'border border-light-subtle rounded-3'}`}
                                                            onClick={() => handleTemplateChange(template.name)}
                                                            style={{
                                                                transition: 'all 0.2s ease-in-out',
                                                                height: '100%',
                                                                backgroundColor: selectedTemplate === template.name ? 'rgba(13, 110, 253, 0.05)' : 'white',
                                                                position: 'relative', // Important for ribbon positioning
                                                                overflow: 'hidden'
                                                            }}
                                                        >
                                                            {/* Recommended Ribbon */}
                                                            {template.recommended && (
                                                                <div
                                                                    style={{
                                                                        position: 'absolute',
                                                                        top: '12px',
                                                                        right: '-40px',
                                                                        backgroundColor: '#1D0948',
                                                                        color: 'white',
                                                                        padding: '5px 40px',
                                                                        transform: 'rotate(45deg)',
                                                                        fontSize: '7px',
                                                                        fontWeight: '600',
                                                                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                                                                        zIndex: '99999'
                                                                    }}
                                                                >
                                                                    Recommended
                                                                </div>
                                                            )}

                                                            <div className="position-relative mb-3" style={{ paddingTop: '141.4%' }}>
                                                                <img
                                                                    src={`/assets/images/${template.image}`}
                                                                    alt={template.name}
                                                                    className="img-fluid position-absolute top-0 start-0 w-100 h-100 object-fit-cover rounded-2 border"
                                                                    style={{
                                                                        objectFit: 'cover',
                                                                        transition: 'transform 0.3s ease-in-out',
                                                                    }}
                                                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                                />
                                                                {selectedTemplate === template.name && (
                                                                    <div className="position-absolute top-0 end-0 m-2">
                                                                        <span className="badge bg-primary rounded-pill">
                                                                            <i className="fas fa-check"></i> Selected
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <h6 className="mb-0 fw-medium">{template.name}</h6>
                                                        </div>

                                                    </Col>
                                                ))}
                                            </Row>
                                        </div></div>
                                    </div>
                                )}
                                {activeTab === 'tabAnalysis' && (
                                    <div className={`tab-pane fade ${activeTab === 'tabAnalysis' ? 'show active' : ''}`}
                                        id="tabAnalysis"
                                        role="tabpanel"
                                        aria-labelledby="tabAnalysis-tab"
                                        tabIndex="0">
                                        <div className="accordion" id="analysisAccordion">
                                            {/* Headline Section */}
                                            <div className="accordion-item border-0 mb-3">
                                                <h2 className="accordion-header" id="headingHeadline">
                                                    <button
                                                        className={`accordion-button ${activeAccordion === 'headline' ? '' : 'collapsed'}`}
                                                        type="button"
                                                        onClick={() => toggleAccordion('headline')}
                                                        aria-expanded={activeAccordion === 'headline'}
                                                        aria-controls="collapseHeadline">
                                                        <h4 className="mb-0">Headline Analysis</h4>
                                                    </button>
                                                </h2>
                                                <div
                                                    id="collapseHeadline"
                                                    className={`accordion-collapse collapse ${activeAccordion === 'headline' ? 'show' : ''}`}
                                                    aria-labelledby="headingHeadline"
                                                    data-bs-parent="#analysisAccordion">
                                                    <div className="accordion-body">
                                                        <div className="my-2">{AnalyseResumeData?.headline?.original || parsedResume?.headline || 'No headline available'}</div>

                                                        {AnalyseResumeData?.headline?.issues?.length > 0 && (
                                                            <div className="mt-3">
                                                                <h5>Issues:</h5>
                                                                <ul className="list-group list-group-flush">
                                                                    {AnalyseResumeData.headline.issues.map((item, index) => (
                                                                        <li key={index} className="list-group-item">
                                                                            <strong>{item.issue}</strong>: {item.description}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        {AnalyseResumeData?.headline?.suggested_paragraph && (
                                                            <div className="mt-3">
                                                                <h5>Suggested Headline:</h5>
                                                                <div className="p-3 bg-light rounded mb-3">
                                                                    {AnalyseResumeData.headline?.suggested_paragraph}
                                                                </div>
                                                                <div className='d-flex space-between' style={{ "gap": "15px" }}>
                                                                    <button
                                                                        className="btn btn-primary w-75"
                                                                        onClick={() => handleApply("headline")}
                                                                        disabled={AiResumeLoader || parsedResume.headline == AnalyseResumeData?.headline?.suggested_paragraph}>
                                                                        Apply Suggestion
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-outline-primary w-25"
                                                                        onClick={() => handleUndoApply("headline")}
                                                                        disabled={AiResumeLoader || parsedResume.headline != AnalyseResumeData?.headline?.suggested_paragraph}>
                                                                        Undo Suggestion
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Summary Section */}
                                            <div className="accordion-item border-0 mb-3">
                                                <h2 className="accordion-header" id="headingSummary">
                                                    <button
                                                        className={`accordion-button ${activeAccordion === 'summary' ? '' : 'collapsed'}`}
                                                        type="button"
                                                        onClick={() => toggleAccordion('summary')}
                                                        aria-expanded={activeAccordion === 'summary'}
                                                        aria-controls="collapseSummary">
                                                        <h4 className="mb-0">Summary Analysis</h4>
                                                    </button>
                                                </h2>
                                                <div
                                                    id="collapseSummary"
                                                    className={`accordion-collapse collapse ${activeAccordion === 'summary' ? 'show' : ''}`}
                                                    aria-labelledby="headingSummary"
                                                    data-bs-parent="#analysisAccordion">
                                                    <div className="accordion-body">
                                                        <div className="my-2">{AnalyseResumeData?.summary?.original || parsedResume?.summary || 'No summary available'}</div>

                                                        {AnalyseResumeData?.summary?.issues?.length > 0 && (
                                                            <div className="mt-3">
                                                                <h5>Issues:</h5>
                                                                <ul className="list-group list-group-flush">
                                                                    {AnalyseResumeData.summary.issues.map((item, index) => (
                                                                        <li key={index} className="list-group-item">
                                                                            <strong>{item.issue}</strong>: {item.description}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        {AnalyseResumeData?.summary?.suggested_paragraph && (
                                                            <div className="mt-3">
                                                                <h5>Suggested Summary:</h5>
                                                                <div className="p-3 bg-light rounded mb-3">
                                                                    {AnalyseResumeData.summary.suggested_paragraph}
                                                                </div>
                                                                <div className='d-flex space-between' style={{ "gap": "15px" }}>
                                                                    <button
                                                                        className="btn btn-primary w-75"
                                                                        onClick={() => handleApply("summary")}
                                                                        disabled={AiResumeLoader || parsedResume?.summary == AnalyseResumeData?.summary?.suggested_paragraph}>
                                                                        Apply Suggestion
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-primary w-25"
                                                                        onClick={() => handleUndoApply("summary")}
                                                                        disabled={AiResumeLoader || parsedResume?.summary != AnalyseResumeData?.summary?.suggested_paragraph}>
                                                                        Undo Suggestion
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Work Experience Section */}
                                            {(parsedResume?.workExperience?.length > 0 || AnalyseResumeData?.workExperience?.length > 0) && (
                                                <div className="accordion-item border-0 mb-3">
                                                    <h2 className="accordion-header" id="headingWorkExp">
                                                        <button
                                                            className={`accordion-button ${activeAccordion === 'work' ? '' : 'collapsed'}`}
                                                            type="button"
                                                            onClick={() => toggleAccordion('work')}
                                                            aria-expanded={activeAccordion === 'work'}
                                                            aria-controls="collapseWorkExp">
                                                            <h4 className="mb-0">Work Experience Analysis</h4>
                                                        </button>
                                                    </h2>
                                                    <div
                                                        id="collapseWorkExp"
                                                        className={`accordion-collapse collapse ${activeAccordion === 'work' ? 'show' : ''}`}
                                                        aria-labelledby="headingWorkExp"
                                                        data-bs-parent="#analysisAccordion">
                                                        <div className="accordion-body">
                                                            {!(AnalyseResumeData?.workExperience?.length > 0) && parsedResume?.workExperience?.map((exp, index) => (
                                                                <div key={`original-${index}`} className="mb-4">
                                                                    <div className="card mb-2">
                                                                        <div
                                                                            className="card-header bg-light"
                                                                            onClick={() => toggleWorkExpItem(index)}
                                                                            style={{ cursor: 'pointer' }}>
                                                                            <div className="d-flex justify-content-between align-items-center">
                                                                                <h6 className="mb-0">
                                                                                    {exp.workExperienceJobTitle || `Work Experience #${index + 1}`}
                                                                                </h6>
                                                                                {expandedWorkExpItems.includes(index) ? <FiChevronUp /> : <FiChevronDown />}
                                                                            </div>
                                                                        </div>
                                                                        <div className={`collapse ${expandedWorkExpItems.includes(index) ? 'show' : ''}`}>
                                                                            <div className="card-body">
                                                                                <div className="mb-3">
                                                                                    <h6>Job Title:</h6>
                                                                                    <p className="mb-2">{exp.workExperienceJobTitle || 'Not specified'}</p>

                                                                                    <h6>Company:</h6>
                                                                                    <p className="mb-2">{exp.workExperienceOrganization || 'Not specified'}</p>

                                                                                    <h6>Duration:</h6>
                                                                                    <p className="mb-2">
                                                                                        {exp.workExperienceDates?.start?.date || 'Not specified'}
                                                                                        to {exp.workExperienceDates?.end?.date || 'Present'}
                                                                                    </p>

                                                                                    <h6>Description:</h6>
                                                                                    <p className="mb-0">{exp.workExperienceDescription || 'No description provided'}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}

                                                            {AnalyseResumeData?.workExperience?.map((exp, index) => (
                                                                <div key={`analysis-${index}`} className="mb-4">
                                                                    <div className="card mb-2 border-primary">
                                                                        <div
                                                                            className="card-header bg-primary text-white"
                                                                            onClick={() => toggleWorkExpItem(index + 1000)}
                                                                            style={{ cursor: 'pointer' }}>
                                                                            <div className="d-flex justify-content-between align-items-center">
                                                                                <h6 className="mb-0">
                                                                                    {parsedResume?.workExperience[index]?.workExperienceJobTitle?.split(' ').length > 7
                                                                                        ? parsedResume?.workExperience[index]?.workExperienceJobTitle.split(' ').slice(0, 7).join(' ') + '...'
                                                                                        : parsedResume?.workExperience[index]?.workExperienceJobTitle || `Analysis #${index + 1}`}
                                                                                </h6>
                                                                                {expandedWorkExpItems.includes(index + 1000) ? <FiChevronUp /> : <FiChevronDown />}
                                                                            </div>
                                                                        </div>
                                                                        <div className={`collapse ${expandedWorkExpItems.includes(index + 1000) ? 'show' : ''}`}>
                                                                            <div className="card-body">
                                                                                {exp.original && (
                                                                                    <div>
                                                                                        <h6>Orignal:</h6>
                                                                                        <div className="p-3 bg-light rounded mb-3">
                                                                                            {exp.original}
                                                                                        </div>
                                                                                    </div>
                                                                                )}

                                                                                {exp.issues?.length > 0 && (
                                                                                    <div className="mb-3">
                                                                                        <h6>Issues:</h6>
                                                                                        <ul className="list-group list-group-flush">
                                                                                            {exp.issues.map((issue, idx) => (
                                                                                                <li key={idx} className="list-group-item">
                                                                                                    <strong>{issue.issue}</strong>: {issue.description}
                                                                                                </li>
                                                                                            ))}
                                                                                        </ul>
                                                                                    </div>
                                                                                )}

                                                                                {exp.suggested_paragraph && (
                                                                                    <div>
                                                                                        <h6>Suggested Improvement:</h6>
                                                                                        <div className="p-3 bg-light rounded mb-3">
                                                                                            {exp.suggested_paragraph}
                                                                                        </div>
                                                                                        <div className='d-flex space-between' style={{ "gap": "15px" }}>
                                                                                            <button
                                                                                                className="btn btn-primary w-75"
                                                                                                onClick={() => handleApplyWorkExp(index)}
                                                                                                disabled={AiResumeLoader ||
                                                                                                    parsedResume?.workExperience[index]["workExperienceDescription"] == AnalyseResumeData?.workExperience[index]?.suggested_paragraph}>
                                                                                                Apply Suggestion
                                                                                            </button>
                                                                                            <button
                                                                                                className="btn btn-primary w-25"
                                                                                                onClick={() => handleUndoWorkExp(index)}
                                                                                                disabled={AiResumeLoader || parsedResume?.workExperience[index]["workExperienceDescription"] != AnalyseResumeData?.workExperience[index]?.suggested_paragraph}>
                                                                                                Undo Suggestion
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'tabMatching' && (
                                    <div className={`tab-pane fade ${activeTab === 'tabMatching' ? 'show active' : ''}`} id="tabMatching" role="tabpanel" aria-labelledby="tabMatching-tab" tabIndex="0">
                                        <div className="card border-0 shadow-sm"><div className="card-body">Job matching goes here.</div></div>
                                    </div>
                                )}
                                {activeTab === 'tabCover' && (
                                    <div className={`tab-pane fade ${activeTab === 'tabCover' ? 'show active' : ''}`} id="tabCover" role="tabpanel" aria-labelledby="tabCover-tab" tabIndex="0">
                                        <div className="card border-0 shadow-sm"><div className="card-body">
                                            <CoverLetter />

                                        </div></div>
                                    </div>
                                )}

                                {/* Prev/Next */}
                                <div className="card border-0 shadow-sm mt-3">
                                    <div className="card-body p-3 d-flex justify-content-between align-items-center">
                                        <button type="button" className="btn btn-outline-primary d-flex align-items-center gap-2" disabled={activeTab == "tabPreview"} onClick={handlePreviousTab}>
                                            <span aria-hidden="true">←</span> Previous
                                        </button>
                                        <button type="button" className="btn btn-primary d-flex align-items-center gap-2"
                                            onClick={handleNextTab}
                                            disabled={activeTab == "tabDesign"}
                                        >
                                            Next <span aria-hidden="true">→</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Col lg={5} xxl={6} className='right-section'>
                    <Card className="border-0 shadow-custom mb-3">
                        <Card.Header className="bg-white border-bottom p-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0 fw-semibold" style={{ fontSize: '1.1rem' }}>CV Preview</h5>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="d-flex align-items-center gap-1">
                                        <Button variant="outline-primary" size="sm" onClick={zoomOut}>
                                            <FiMinus />
                                        </Button>
                                        <Button variant="outline-primary" size="sm" onClick={zoomIn}>
                                            <FiPlus />
                                        </Button>
                                        {/* <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={handleUploadNew}
                                        className="btn btn-outline-primary"
                                        >
                                        <FiUpload size={14} /> 
                                        <span className="d-none d-xl-inline ms-1">New Upload</span>
                                        </Button> */}
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={handleDownloadPDF}
                                            disabled={downloadPDFLoader}
                                            className="btn btn-outline-primary"
                                        >
                                            {downloadPDFLoader ? <FiLoader size={14} className="animate-spin" /> : <FiDownload size={14} />}
                                            <span className="ms-1">{downloadPDFLoader ? "Generating..." : "Download PDF"}</span>
                                        </Button>
                                    </div>
                                </div>

                            </div>
                        </Card.Header>
                        <div
                            ref={previewContainerRef}
                            className="cv-template-div"
                        >
                            <div
                                ref={cvRef}
                                style={{
                                    background: 'white',
                                    padding: '16px',
                                    minHeight: `${Math.max(1, totalPages) * 1080}px`,
                                    transform: `scale(${zoom})`,
                                    transformOrigin: 'top center',
                                    transition: 'transform 0.2s ease-in-out',
                                }}
                            >
                                {(() => {
                                    const selectedTemplateData = cardTemplate.find(t => t.name === selectedTemplate);
                                    if (!selectedTemplateData) {
                                        return <div className="alert alert-warning">Please select a template</div>;
                                    }

                                    const TemplateComponent = selectedTemplateData.template;
                                    return (
                                        <TemplateComponent
                                            resumeData={{
                                                ...(parsedResume || {
                                                    candidateName: [{ firstName: '', familyName: '' }],
                                                    headline: '',
                                                    summary: [{ paragraph: '' }],
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
                                                }),
                                                customSections
                                            }}
                                        />
                                    );
                                })()}
                            </div>

                            {/* Only show page dividers if we have multiple pages with content */}
                            {totalPages > 1 && Array.from({ length: totalPages - 1 }).map((_, index) => (
                                <div
                                    key={index}
                                    style={{
                                        position: 'absolute',
                                        left: 0,
                                        right: 0,
                                        top: `${(index + 1) * 1123}px`,
                                        borderTop: '2px dashed #ccc',
                                        pointerEvents: 'none'
                                    }}
                                />
                            ))}
                        </div>
                    </Card>
                    <Card className="border-0 shadow-custom">
                        <Card.Body className="p-3">
                            <div className="d-flex justify-content-between align-items-center">
                                {/* <Button
                                    variant="outline-primary"
                                    onClick={handlePreviousStep}
                                    disabled={activeTab === "Preview"}
                                    className="d-flex align-items-center gap-2"
                                    >
                                    <FiChevronLeft /> Previous
                                    </Button>
                                    <Button
                                    variant="primary"
                                    onClick={handleNextStep}
                                    disabled={activeTab === "Cover Letter"}
                                    className="d-flex align-items-center gap-2"
                                    >
                                    Next <FiChevronRight />
                                </Button> */}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </div>
        </div>
    );
}