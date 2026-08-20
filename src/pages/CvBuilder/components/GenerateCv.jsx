import React, { useState, useRef, useCallback, useEffect } from 'react';
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp, FiMinus, FiLoader, FiDownload, FiX } from "react-icons/fi";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Icon } from "@iconify/react/dist/iconify.js";
import Swal from 'sweetalert2';
import BulletPointsEditor from '../../../components/CvBuilder/BulletPointsEditor';
import avatar from '../../../assets/demo_profile.avif'
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
} from "../../../components/templates";

import { Row, Col, Button, Card, Dropdown, Modal } from "react-bootstrap";
import Draggable from 'react-draggable';

import { useDispatch, useSelector } from "react-redux";
import { setParsedResume, updateField, analyzeResumeAi, setSelectedTemplate, fetchResumeById, updateResumeById } from "../../../features/resume/resumeSlice";
import { toast } from 'react-toastify';
import { useNavigate, useParams } from "react-router-dom";
import { ClassicCoverLetterTemplate } from "../../../components/cover-letter-templates";
import CoverLetter from "../../../components/CvBuilder/components/coverLetter";
import ResumePdfPreview from "../../../pdf/ResumePdfPreview";
import { buildPdfBlob, savePdfBlob, resumeFilename } from "../../../pdf/usePdfBlob";
import axios, { baseUrl } from "../../../api/axios";
import AtsCheckModal from "./AtsCheckModal";
import { round } from 'lodash';



const cardTemplate = [
    { name: 'Default', template: Template9, image: 'default1.png', recommended: true },
    { name: 'Basic', template: Template12, image: 'classic.png' },
    { name: 'Professional', template: Template5, image: 'professional.png' },
    { name: 'Unique', template: Template11, image: 'unique.png' },
    { name: 'Modern', template: Template8, image: 'modern.png' },
    { name: 'Classic', template: Template6, image: 'chrono.png', recommended: true },
    { name: 'Luxe', template: Template13, image: 'Luxe.png' },
    { name: 'Elegant', template: Template7, image: 'elegant.png' },
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
    const { parsedResume, AnalyseResumeData, AiResumeLoader, prevParsedResume, saveChangesLoader, selectedTemplate, fetchingResumeLoader } = useSelector((state) => state.resume);

    const { data } = useSelector((state) => state.user);
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

    const [customSections, setCustomSections] = useState([]);

    const handleTabClick = (tabName) => {
        setActiveTab((prevTab) => (prevTab === tabName ? '' : tabName)); // toggle if same, else set new
    };

    useEffect(() => {
        if (!parsedResume?.candidateName?.[0]?.firstName && data?.name) {
            dispatch(updateField({
                path: "candidateName[0].firstName",
                value: data?.name
            }));
        }

        if (!parsedResume?.email?.[0] && data?.email) {
            dispatch(updateField({
                path: "email",
                value: [data.email]
            }));
        }

        if (!parsedResume?.phoneNumber?.[0]?.formattedNumber && data?.phone) {
            dispatch(updateField({
                path: "phoneNumber[0].formattedNumber",
                value: data.phone
            }));
        }

        if (!parsedResume?.socialLinks?.linkedin && data?.linkedin_profile_url) {
            dispatch(updateField({

                path: "socialLinks.linkedin",
                value: data.linkedin_profile_url
            }));
        }

    }, [data, parsedResume, dispatch]);

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
            console.log("Action return fetch CV by id", ActionReturn);
            if (!(ActionReturn.success)) {
                window.location = '/cv-builder';
            }
        };
        load();
        return () => { isMounted = false; };
    }, [id, dispatch])





    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);


    useEffect(() => {
        setHasUnsavedChanges(parsedResume !== prevParsedResume);
    }, [parsedResume, prevParsedResume]);

    useEffect(() => {
        const handleClick = (e) => {
            if (isNavigating || !hasUnsavedChanges || saveChangesLoader) return;

            const link = e.target.closest('a');
            if (link && link.href) {
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


    const handleSaveChanges = () => {
        // Check for empty CKEditor content in custom sections
        const emptyCustomSections = (parsedResume.customSections || [])
            .filter(section => !section.disabled) // Only check enabled sections
            .filter(section => {
                // Check if content is empty (remove HTML tags and check if it's empty)
                const plainText = section.content?.replace(/<[^>]*>/g, '').trim();
                return !plainText;
            });

        if (emptyCustomSections.length > 0) {
            toast.error(`Please add content to your custom sections: ${emptyCustomSections.map(s => s.title).join(', ')}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return; // Stop the save operation
        }

        if (parsedResume != prevParsedResume) {
            dispatch(updateResumeById({ id, parsedResume })).then(() => {
                setHasUnsavedChanges(false);
                toast.success('Changes saved successfully!');
            }).catch((error) => {
                toast.error('Failed to save changes');
            });
        }
    };


    // Reset navigation flag when component unmounts or changes occur
    useEffect(() => {
        return () => {
            setIsNavigating(false);
        };
    }, []);


    useEffect(() => {
        if (AiResumeLoader) {
            Swal.fire({
                title: 'Analysing CV',
                html: 'Please wait while we analyze your CV...',
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
            const newZoom = Math.min(prev + 0.25, 3);
            console.log('Zoom In clicked. New zoom level:', newZoom);
            return newZoom;
        });
    };

    const zoomOut = () => {
        setZoom(prev => {
            const newZoom = Math.max(prev - 0.25, 0.5);
            console.log('Zoom Out clicked. New zoom level:', newZoom);
            return newZoom;
        });
    };

    useEffect(() => {
        if (parsedResume?.skill && parsedResume?.skill.length > 0) {
            // Check if any skills have the selected property
            const hasSelectedProperty = parsedResume?.skill.some(skill => 'selected' in skill);

            if (!hasSelectedProperty) {
                // Initialize first 5 skills as selected
                const updatedSkills = parsedResume?.skill.map((skill, index) => ({
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

    const handleAddCustomSection = () => {
        const customSectionsCount = parsedResume.customSections?.length || 0;
        const sectionNumber = customSectionsCount > 0 ? ` ${customSectionsCount + 1}` : '';

        const newSection = {
            id: `custom-${Date.now()}`,
            title: `New Custom Section${sectionNumber}`,
            content: '',
            disabled: false,
            editingTitle: false
        };

        dispatch(updateField({
            path: "customSections",
            value: [...(parsedResume.customSections || []), newSection]
        }));
        setActiveAccordion(newSection.id);
        toggleSection(`custom-${newSection.id}`);
    };

    const handleUpdateCustomSection = (id, updates) => {
        const updatedSections = (parsedResume.customSections || []).map(section =>
            section.id === id ? { ...section, ...updates } : section
        );
        dispatch(updateField({ path: "customSections", value: updatedSections }));
    };

    const handleRemoveCustomSection = (id) => {
        const updatedSections = (parsedResume.customSections || []).filter(section => section.id !== id);
        dispatch(updateField({ path: "customSections", value: updatedSections }));
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


    // Page count now comes from the generated PDF itself (via
    // ResumePdfPreview's onPagesChange) instead of dividing the preview div's
    // scrollHeight by a hard-coded A4 pixel height. The old estimate assumed
    // 96 DPI and no page-break logic, so it disagreed with the actual file.
    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [totalPages, currentPage]);

    const [downloadPDFLoader, setDownloadPDFLoader] = useState(false);

    const hasAutoDownloaded = useRef(false);



    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const shouldAutoDownload = urlParams.get('download') === 'true';

        if (shouldAutoDownload && !downloadPDFLoader && parsedResume && !hasAutoDownloaded.current && !fetchingResumeLoader) {
            hasAutoDownloaded.current = true; // Mark as downloaded
            const downloadAndClose = async () => {
                setIsGeneratingPDF(true);
                try {
                    const loadingPromise = new Promise(resolve => setTimeout(resolve, 1000));

                    // Start the download process
                    const downloadPromise = handleDownloadPDF();

                    await Promise.all([loadingPromise, downloadPromise]);
                } finally {
                    setIsGeneratingPDF(false);
                }
            };
            downloadAndClose();
        }
    }, [parsedResume, downloadPDFLoader, fetchingResumeLoader, selectedTemplate]);


    const handleDownloadDocx = async () => {
        setDownloadPDFLoader(true);
        try {

            if (parsedResume !== prevParsedResume) {
                await new Promise((resolve, reject) => {
                    dispatch(updateResumeById({ id, parsedResume }))
                        .unwrap()
                        .then(() => {
                            setHasUnsavedChanges(false);
                            toast.success('Changes saved successfully!');
                            resolve();
                        })
                        .catch((error) => {
                            toast.error('Failed to save changes');
                            reject(error);
                        });
                });
            }
        } catch {
        }


        try {
            window.open(`${baseUrl}/api/resume/${id}/download-doc`, '_blank');
        } catch (error) {
            console.error('Error loading PDF:', error);
            toast.error('Failed to generate PDF');
        } finally {
            setDownloadPDFLoader(false);
        }
        return;
    }


    /**
     * Build the PDF in the browser and hand it straight to the user.
     *
     * Every design now renders through the same react-pdf document, so this is
     * one code path for all eight — no per-template branch to the backend, and
     * no html2canvas raster step. The result is a real text PDF: selectable,
     * searchable, ATS-parseable, and a few tens of KB rather than megabytes.
     */
    const handleDownloadPDF = async () => {
        setDownloadPDFLoader(true);
        try {
            // Persist first so the saved record matches the downloaded file.
            if (parsedResume !== prevParsedResume) {
                try {
                    await dispatch(updateResumeById({ id, parsedResume })).unwrap();
                    setHasUnsavedChanges(false);
                    toast.success('Changes saved successfully!');
                } catch {
                    // A failed save must not block the download the user asked
                    // for — they still get a PDF of what is on screen.
                    toast.error('Could not save changes; downloading current version');
                }
            }

            // Built fresh rather than reusing the preview blob, so a download
            // fired before the debounced preview catches up is still current.
            const blob = await buildPdfBlob(parsedResume, selectedTemplate);
            savePdfBlob(blob, resumeFilename(parsedResume));
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Failed to generate PDF');
        } finally {
            setDownloadPDFLoader(false);
        }
    };

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
    }


    const handleApplyWorkExp = (index, returnAction = null) => {
        // clone the parsedResume object
        const updatedResume = { ...parsedResume };

        // Ensure workExperience exists and has the item at the given index
        if (!updatedResume.workExperience?.[index]) {
            console.error('Invalid work experience index or work experience not found');
            return;
        }

        const suggestedParagraph =
            returnAction?.data?.workExperience?.[index]?.suggested_paragraph ||
            AnalyseResumeData?.workExperience?.[index]?.suggested_paragraph;

        if (!suggestedParagraph) {
            console.error('No suggested paragraph found for work experience at index', index);
            return;
        }

        updatedResume.workExperience = updatedResume.workExperience.map((item, i) =>
            i === index
                ? { ...item, workExperienceDescription: suggestedParagraph }
                : item
        );

        dispatch(setParsedResume(updatedResume));
    };

    const handleUndoWorkExp = (index) => {
        const updatedResume = { ...parsedResume };
        const updatedWorkExperience = [...updatedResume.workExperience];

        updatedWorkExperience[index] = {
            ...updatedWorkExperience[index],
            workExperienceDescription: AnalyseResumeData.workExperience[index].original,
        };

        updatedResume.workExperience = updatedWorkExperience;
        dispatch(setParsedResume(updatedResume));
    };

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
            if (prev[section]) {
                return { [section]: false };
            }

            return { [section]: true };
        });
    };



    // State with consistent prefix
    const [eduList, setEduList] = useState([]);
    const [eduListdispatch, setEduListdispatch] = useState([]);
    const [eduCurrentForm, setEduCurrentForm] = useState(null);

    const [editingExperience, setEditingExperience] = useState({
        index: null,
        data: null
    });


    // Update the education form state to include educationMajor
    const [eduFormData, setEduFormData] = useState({
        eduDegree: '',
        eduInstitution: '',
        eduStartDate: '',
        eduEndDate: '',
        achievedGrade: '',
        educationMajor: [''] 
    });

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

            }
        });
    };

    const [expItems, setExpItems] = useState([]);

    const [expCurrentForm, setExpCurrentForm] = useState(null);
    const [expFormData, setExpFormData] = useState({
        expJobTitle: '',
        expCompany: '',
        expStartDate: '',
        expEndDate: '',
        expDescription: '',
        expHighlights: ['']
    });

    // Handle adding/removing highlights for experience
    const handleAddHighlight = () => {
        setExpFormData(prev => ({
            ...prev,
            expHighlights: [...prev.expHighlights, '']
        }));
    };

    const handleRemoveHighlight = (index) => {
        setExpFormData(prev => ({
            ...prev,
            expHighlights: prev.expHighlights.filter((_, i) => i !== index)
        }));
    };

    const handleHighlightChange = (index, value) => {
        const newHighlights = [...expFormData.expHighlights];
        newHighlights[index] = value;
        setExpFormData(prev => ({
            ...prev,
            expHighlights: newHighlights
        }));
    };


    // Handle adding a new experience
    const handleAddExperience = () => {
        // Check if there's already an empty form
        if (expCurrentForm) {
            // Check if the current form has any data
            const expHasData = Object.values(expFormData).some(expValue =>
                expValue && typeof expValue === 'string' ? expValue.trim() !== '' : false
            );

            if (expHasData) {
                // Check if all required fields are filled
                const expAllFieldsFilled =
                    (expFormData.expJobTitle && expFormData.expJobTitle.trim() !== '') &&
                    (expFormData.expCompany && expFormData.expCompany.trim() !== '') &&
                    (expFormData.expStartDate && expFormData.expStartDate.trim() !== '');

                if (!expAllFieldsFilled) {
                    toast.error('Please complete the current experience form before adding a new one');
                    return;
                }

                // If form is complete, save it
                handleSaveExperience();
            }
        }

        // Create a new form
        setExpCurrentForm({
            expId: Date.now(),
            expJobTitle: '',
            expCompany: '',
            expStartDate: '',
            expEndDate: '',
            expDescription: '',
            expHighlights: ['']
        });

        // Reset form data
        setExpFormData({
            expJobTitle: '',
            expCompany: '',
            expStartDate: '',
            expEndDate: '',
            expDescription: '',
            expHighlights: ['']
        });
    };

    // Handle saving experience
    const handleSaveExperience = () => {
        // Validate form data
        if (!expFormData.expJobTitle || !expFormData.expCompany || !expFormData.expStartDate) {
            toast.error('Please fill all the required fields');
            return;
        }

        const dispatchExperienceList = {
            workExperienceJobTitle: expFormData.expJobTitle,
            workExperienceOrganization: expFormData.expCompany,
            workExperienceDates: {
                start: {
                    date: expFormData.expStartDate
                },
                end: {
                    date: expFormData.expEndDate || null
                }
            },
            workExperienceDescription: expFormData.expDescription,
            highlights: {
                items: expFormData.expHighlights
                    .filter(highlight => highlight.trim() !== '')
                    .map(highlight => ({ bullet: highlight }))
            }
        };

        // If editing existing experience, update it
        if (expCurrentForm?.index !== undefined) {
            const updatedExperience = [...parsedResume.workExperience];
            updatedExperience[expCurrentForm.index] = dispatchExperienceList;

            dispatch(updateField({
                path: "workExperience",
                value: updatedExperience
            }));
        } else {
            // Add new experience
            dispatch(updateField({
                path: "workExperience",
                value: [...(parsedResume.workExperience || []), dispatchExperienceList]
            }));
        }

        setExpCurrentForm(null);
        setExpFormData({
            expJobTitle: '',
            expCompany: '',
            expStartDate: '',
            expEndDate: '',
            expDescription: '',
            expHighlights: ['']
        });
    };

    // Handle editing an experience
    const handleEditExperience = (expIndex) => {
        const expToEdit = parsedResume.workExperience[expIndex];
        if (expToEdit) {
            setExpCurrentForm({
                expId: Date.now(),
                index: expIndex
            });

            setExpFormData({
                expJobTitle: expToEdit.workExperienceJobTitle || '',
                expCompany: expToEdit.workExperienceOrganization || '',
                expStartDate: expToEdit.workExperienceDates?.start?.date || '',
                expEndDate: expToEdit.workExperienceDates?.end?.date || '',
                expDescription: expToEdit.workExperienceDescription || '',
                expHighlights: expToEdit.highlights?.items?.map(item => item.bullet) || ['']
            });
        }
    };

    // Handle canceling experience edit
    const handleCancelExperienceEdit = () => {
        setExpCurrentForm(null);
        setExpFormData({
            expJobTitle: '',
            expCompany: '',
            expStartDate: '',
            expEndDate: '',
            expDescription: '',
            expHighlights: ['']
        });
    };

    // Handle deleting an experience
    const handleDeleteExperience = (expIndex) => {
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
                dispatch(updateField({
                    path: "workExperience",
                    value: parsedResume.workExperience.filter((_, i) => i !== expIndex)
                }));
            }
        });
    };

    // Handle input changes for experience form
    const expHandleInputChange = (e) => {
        const { name, value } = e.target;
        setExpFormData({
            ...expFormData,
            [name]: value
        });
    };

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


    const [modalShow, setModalShow] = useState(false);
    const [modalFor, setModalFor] = useState('')
    const [showAtsModal, setShowAtsModal] = useState(false);

    const handleClose = () => {
        setModalShow(false);
        setModalFor('');
    };

    const handleShow = (modalFor) => {
        setModalShow(true);
        setModalFor(modalFor);
    }

    const educationContainer = (edit) => (
        <div className="editor-modal-card v-wrap">
            <div className="d-flex justify-content-between align-items-center gap-2">
                <small className="">
                    {edit ? 'Edit' : 'New'} {parsedResume?.educationTitle || "Education"} Form
                </small>
                <div className="d-flex justify-content-end align-item-center gap-2">
                    {eduCurrentForm && (
                        <button
                            type="button"
                            className="custom-delete-btn-2"
                            onClick={eduHandleCancelEdit}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                        </button>
                    )}
                    <button
                        type="button"
                        className="custom-save-btn"
                        onClick={eduHandleSaveEducation}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M5 12l5 5l10 -10"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div className="h-wrap">
                <div className="form-group">
                    <label className="form-label">Degree/Qualification</label>
                    <input
                        className="form-control"
                        name="eduDegree"
                        value={eduFormData.eduDegree}
                        onChange={eduHandleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Institution</label>
                    <input
                        className="form-control"
                        name="eduInstitution"
                        value={eduFormData.eduInstitution}
                        onChange={eduHandleInputChange}
                    />
                </div>
            </div>
            <div className="h-wrap">
                <div className="form-group">
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
                <div className="form-group">
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
            <div className="form-group">
                <label className="form-label">Grade Achieved</label>
                <input
                    className="form-control"
                    name="achievedGrade"
                    value={eduFormData.achievedGrade}
                    onChange={eduHandleInputChange}
                />
            </div>
            <div className="form-group v-wrap">
                <label className="form-label">Major(s)</label>
                {eduFormData.educationMajor.map((major, index) => (
                    <div key={index} className="h-wrap align-items-center gap-2">
                        <input
                            type="text"
                            className="form-control"
                            value={major}
                            onChange={(e) => handleMajorChange(index, e.target.value)}
                            placeholder={`Major ${index + 1}`}
                        />
                        {eduFormData.educationMajor.length > 1 && (
                            <span
                                type="button"
                                className="custom-delete-btn-2"
                                onClick={() => handleRemoveMajor(index)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                            </span>
                        )}
                        {index == (eduFormData.educationMajor.length - 1) && (
                            <button
                                type="button"
                                className="custom-save-btn"
                                onClick={handleAddMajor}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-square-rounded-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 3c7.2 0 9 1.8 9 9c0 7.2 -1.8 9 -9 9c-7.2 0 -9 -1.8 -9 -9c0 -7.2 1.8 -9 9 -9" /><path d="M15 12h-6" /><path d="M12 9v6" /></svg>
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )

    const experenceContainer = (edit) => (
        <div className="editor-modal-card v-wrap">
            <div className="d-flex justify-content-between align-items-center gap-2">
                <small className="">
                    {edit ? 'Edit' : 'New'} {parsedResume?.employmentTitle || "Experience"} Form
                </small>
                <div className="d-flex justify-content-end align-item-center gap-2">
                    {expCurrentForm && (
                        <button
                            type="button"
                            className="custom-delete-btn-2"
                            onClick={handleCancelExperienceEdit}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                        </button>
                    )}
                    <button
                        type="button"
                        className="custom-save-btn"
                        onClick={handleSaveExperience}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M5 12l5 5l10 -10"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div className="h-wrap">
                <div className="form-group">
                    <label className="form-label">Job Title*</label>
                    <input
                        className="form-control"
                        name="expJobTitle"
                        value={expFormData.expJobTitle}
                        onChange={expHandleInputChange}
                        placeholder="e.g., Senior Frontend Developer"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Company*</label>
                    <input
                        className="form-control"
                        name="expCompany"
                        value={expFormData.expCompany}
                        onChange={expHandleInputChange}
                        placeholder="e.g., Google Inc."
                    />
                </div>
            </div>
            <div className="h-wrap">
                <div className="form-group">
                    <label className="form-label">Start Date*</label>
                    <input
                        placeholder="e.g., 2020 or Jan 2020"
                        className="form-control"
                        type="text"
                        name="expStartDate"
                        value={expFormData.expStartDate}
                        onChange={expHandleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input
                        placeholder="e.g., 2023, Present, or Ongoing"
                        className="form-control"
                        type="text"
                        name="expEndDate"
                        value={expFormData.expEndDate}
                        onChange={expHandleInputChange}
                    />
                </div>
            </div>
            <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <textarea
                    rows="3"
                    className="form-control"
                    name="expDescription"
                    value={expFormData.expDescription}
                    onChange={expHandleInputChange}
                    placeholder="Describe your role and responsibilities..."
                ></textarea>
            </div>

            <div className="form-group v-wrap">
                <label className="form-label">Key Achievements (Optional)</label>
                {expFormData.expHighlights.map((highlight, index) => (
                    <div key={index} className="h-wrap align-items-center gap-2">
                        <input
                            type="text"
                            className="form-control"
                            value={highlight}
                            onChange={(e) => handleHighlightChange(index, e.target.value)}
                            placeholder={`Achievement ${index + 1}`}
                        />
                        {expFormData.expHighlights.length > 1 && (
                            <button
                                type="button"
                                className="custom-delete-btn-2"
                                onClick={() => handleRemoveHighlight(index)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                            </button>
                        )}
                        {index == (expFormData.expHighlights.length - 1) && (
                            <button
                                type="button"
                                className="custom-save-btn"
                                onClick={handleAddHighlight}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-square-rounded-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 3c7.2 0 9 1.8 9 9c0 7.2 -1.8 9 -9 9c-7.2 0 -9 -1.8 -9 -9c0 -7.2 1.8 -9 9 -9" /><path d="M15 12h-6" /><path d="M12 9v6" /></svg>
                            </button>
                        )}
                    </div>
                ))}
            </div>

        </div>
    )

    const getEditorModalContent = () => {
        if (modalFor == 'personal') {
            return (
                <div className='personal-detail-wrapper'>
                    <h3 className="editor-section-title">
                        {parsedResume?.editingPersonalTitle ? (
                            <div className="d-flex align-items-center gap-2 flex-grow-1">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control "
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
                                </div>
                                <span
                                    className='cursor-pointer'
                                    onClick={() =>
                                        dispatch(
                                            updateField({
                                                path: "editingPersonalTitle",
                                                value: false
                                            })
                                        )
                                    }
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-check">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M5 12l5 5l10 -10" />
                                    </svg>
                                </span>
                            </div>
                        ) : (
                            <>
                                {parsedResume?.personalTitle || "Personal details"}
                                < span
                                    className='cursor-pointer'
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-edit">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                        <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                        <path d="M16 5l3 3" />
                                    </svg>
                                </span>
                            </>
                        )}
                    </h3>
                    <div className="h-wrap">
                        <div className="v-wrap justify-content-center">
                            <div className="h-wrap">
                                <div className="form-group">
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
                                <div className="form-group">
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
                            </div>
                            <div className="form-group">
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
                        {profilePic || parsedResume?.profilePic ? (
                            <div className="d-flex flex-column justify-content-center align-items-center personal-image-wrapper">
                                <img
                                    src={profilePic || parsedResume.profilePic}
                                    alt="Profile"
                                />
                                {(profilePic || parsedResume?.profilePic) && (
                                    <button
                                        className="custom-remove-btn"
                                        type="button"
                                        onClick={handleRemovePhoto}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="d-flex flex-column justify-content-center align-items-center personal-image-wrapper cursor-pointer" onClick={() => fileInputRef.current.click()}>
                                <div className="d-flex flex-column gap-0 align-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-photo"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 8h.01" /><path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12" /><path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5" /><path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3" /></svg>
                                    <div className="small mt-1">Upload Photo</div>
                                </div>
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
                    <div className="h-wrap">
                        <div className="form-group">
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
                        <div className="form-group">
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
                    <div className="form-group">
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
                    <div className="h-wrap">
                        <div className="form-group">
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
                        <div className="form-group">
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
                    <div className="form-group">
                        <label className="form-label">Summary</label>
                        <textarea
                            rows="5"
                            className="form-control"
                            placeholder="Describe your professional background, key skills, achievements, and career goals..."
                            name="summary"
                            value={parsedResume?.summary?.paragraph || ''}
                            onChange={(e) =>
                                dispatch(
                                    updateField({
                                        path: "summary.paragraph",
                                        value: e.target.value,
                                    })
                                )
                            }
                        ></textarea>
                    </div>
                    <h6 className="fw-bold mb-2">Social Links</h6>
                    <div className="h-wrap">
                        <div className="form-group">
                            <label className="form-label">GitHub</label>
                            <input
                                type="url"
                                className="form-control"
                                name="github"
                                placeholder="https://github.com/username"
                                value={parsedResume?.socialLinks?.github || ''}
                                onChange={(e) =>
                                    dispatch(
                                        updateField({
                                            path: "socialLinks.github",
                                            value: e.target.value,
                                        })
                                    )
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">LinkedIn</label>
                            <input
                                type="url"
                                className="form-control"
                                name="linkedin"
                                placeholder="https://linkedin.com/in/username"
                                value={parsedResume?.socialLinks?.linkedin || ''}
                                onChange={(e) =>
                                    dispatch(
                                        updateField({
                                            path: "socialLinks.linkedin",
                                            value: e.target.value,
                                        })
                                    )
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Portfolio / Website</label>
                            <input
                                type="url"
                                className="form-control"
                                name="website"
                                placeholder="https://yourwebsite.com"
                                value={parsedResume?.socialLinks?.website || ''}
                                onChange={(e) =>
                                    dispatch(
                                        updateField({
                                            path: "socialLinks.website",
                                            value: e.target.value,
                                        })
                                    )
                                }
                            />
                        </div>
                    </div>
                </div>
            )
        }

        if (modalFor == 'experence') {
            return (
                <div className='personal-detail-wrapper'>
                    <h3 className="editor-section-title mb-0">
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
                            {!parsedResume?.employmentDisabled ?
                                (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-eye"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>)
                                : (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-eye-off"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" /><path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" /><path d="M3 3l18 18" /></svg>)
                            }
                        </button>
                        {parsedResume?.editingEmploymentTitle ? (
                            <div className="d-flex align-items-center gap-2 flex-grow-1">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm me-2"
                                        value={parsedResume?.employmentTitle || "Experience"}
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
                                </div>
                                <span
                                    className='cursor-pointer'
                                    onClick={() =>
                                        dispatch(
                                            updateField({
                                                path: "editingEmploymentTitle",
                                                value: false
                                            })
                                        )
                                    }
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-check">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M5 12l5 5l10 -10" />
                                    </svg>
                                </span>
                            </div>
                        ) : (
                            <>
                                {parsedResume?.employmentTitle || "Experience"}
                                <span
                                    className='cursor-pointer'
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-edit">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                        <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                        <path d="M16 5l3 3" />
                                    </svg>
                                </span>
                            </>
                        )}
                    </h3>
                    {!parsedResume?.employmentDisabled ? (
                        <div className="v-wrap">
                            {parsedResume.workExperience?.map((expItem, expIndex) => (
                                <div key={expIndex} className="editor-modal-card v-wrap">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <small className="">{parsedResume?.employmentTitle || "Experience"} #{expIndex + 1}</small>
                                        <div className="d-flex justify-content-end align-items-center gap-2">
                                            <button
                                                type="button"
                                                className="custom-delete-btn-2"
                                                onClick={() => handleDeleteExperience(expIndex)}
                                                title="Delete experence entry"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                                            </button>
                                            <button
                                                type="button"
                                                className="custom-save-btn"
                                                onClick={() => handleEditExperience(expIndex)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-edit">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                                    <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                                    <path d="M16 5l3 3" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className='h-wrap align-items-end'>
                                        <div className="v-wrap gap-2">
                                            <div className="h-wrap">
                                                <div className="icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-report-analytics"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" /><path d="M9 17v-5" /><path d="M12 17v-1" /><path d="M15 17v-3" /></svg>
                                                </div>
                                                <div className="v-wrap gap-0">
                                                    <span className="edu-degree fw-600">{expItem.workExperienceJobTitle}</span>
                                                    <small className="edu-time text-muted">{expItem.workExperienceOrganization}</small>
                                                    {expItem.workExperienceDescription && (
                                                        <small className="edu-time text-muted">{expItem.workExperienceDescription}</small>
                                                    )}
                                                </div>
                                            </div>
                                            {expItem.highlights?.items?.length > 0 && (
                                                <ul className="mb-0 ps-5">
                                                    {expItem.highlights.items.map((item, idx) => (
                                                        <li key={idx}><small>{item.bullet}</small></li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                        <small className="exp-time text-muted flex-shrink-0">
                                            {expItem.workExperienceDates?.start?.date} - {expItem.workExperienceDates?.end?.date || 'Present'}
                                        </small>
                                    </div>
                                </div>
                            ))}

                            {expCurrentForm ? experenceContainer(true) : experenceContainer(false)}
                        </div>
                    ) : (
                        <div className="text-dark text-center py-3 d-flex flex-column gap-2">
                            <span
                                className={`icon-toggle border-0 bg-transparent text-dark`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-report-analytics"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" /><path d="M9 17v-5" /><path d="M12 17v-1" /><path d="M15 17v-3" /></svg>
                            </span>
                            This section is disabled
                        </div>
                    )}
                </div>
            )
        }

        if (modalFor == 'education') {
            return (
                <div className='personal-detail-wrapper'>
                    <h3 className="editor-section-title mb-0">
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

                            {!parsedResume?.educationDisabled ?
                                (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-eye"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>)
                                : (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-eye-off"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" /><path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" /><path d="M3 3l18 18" /></svg>)
                            }
                        </button>
                        {parsedResume?.educationDisabled ? (
                            <div className="d-flex align-items-center gap-2 flex-grow-1">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm me-2"

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
                                </div>
                                <span
                                    className='cursor-pointer'
                                    onClick={() =>
                                        dispatch(
                                            updateField({
                                                path: "editingEducationTitle",
                                                value: false
                                            })
                                        )
                                    }
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-check">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M5 12l5 5l10 -10" />
                                    </svg>
                                </span>
                            </div>
                        ) : (
                            <>
                                {parsedResume?.educationTitle || "Education"}
                                < span
                                    className='cursor-pointer'
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-edit">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                        <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                        <path d="M16 5l3 3" />
                                    </svg>
                                </span>
                            </>
                        )}
                    </h3>
                    {!parsedResume?.educationDisabled ? (
                        <div className="v-wrap">
                            {parsedResume.education?.map((eduItem, eduIndex) => (
                                <div key={eduIndex} className="editor-modal-card v-wrap">
                                    <div className="d-flex justify-content-between align-items-center mb-0">
                                        <small className="">{parsedResume?.educationTitle || "Education"} #{eduIndex + 1}</small>
                                        <div className="d-flex justify-content-end align-items-center gap-2">
                                            <button
                                                type="button"
                                                className="custom-delete-btn-2"
                                                onClick={() => eduHandleDeleteEducation(eduIndex)}
                                                title="Delete education entry"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                                            </button>
                                            <button
                                                type="button"
                                                className="custom-save-btn"
                                                onClick={() => eduHandleEditEducation(eduIndex)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-edit">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                                    <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                                    <path d="M16 5l3 3" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="h-wrap align-items-end">
                                        <div className="h-wrap">
                                            <div className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <path d="M22 9l-10 -4l-10 4l10 4l10 -4v6"></path>
                                                    <path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4"></path>
                                                </svg>
                                            </div>
                                            <div className="v-wrap gap-0">
                                                <span className="edu-degree fw-600">{eduItem.educationLevel.label}</span>
                                                <small className="edu-time text-muted">{eduItem.educationOrganization}</small>
                                            </div>
                                        </div>
                                        <small className="edu-time text-muted flex-shrink-0">
                                            {eduItem.educationDates.start.date} / {eduItem.educationDates.end.date}
                                        </small>
                                    </div>

                                </div>
                            ))}

                            {eduCurrentForm ? educationContainer(true) : educationContainer(false)}
                        </div>
                    ) : (
                        <div className="text-dark text-center py-3 d-flex flex-column gap-2">
                            <span
                                className={`icon-toggle border-0 bg-transparent text-dark`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-school"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M22 9l-10 -4l-10 4l10 4l10 -4v6" /><path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4" /></svg>
                            </span>
                            This section is disabled
                        </div>
                    )}
                </div>
            )
        }

        if (modalFor == 'skills') {
            return (
                <div className='personal-detail-wrapper'>
                    <h3 className="editor-section-title">
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

                            {!parsedResume?.skillsDisabled ?
                                (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-eye"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>)
                                : (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-eye-off"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" /><path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" /><path d="M3 3l18 18" /></svg>)
                            }
                        </button>
                        {parsedResume?.editingSkillsTitle ? (
                            <div className="d-flex align-items-center gap-2 flex-grow-1">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm me-2"

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
                                </div>
                                <span
                                    className='cursor-pointer'
                                    onClick={() =>
                                        dispatch(
                                            updateField({
                                                path: "editingSkillsTitle",
                                                value: false
                                            })
                                        )
                                    }
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-check">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M5 12l5 5l10 -10" />
                                    </svg>
                                </span>
                            </div>
                        ) : (
                            <>
                                {parsedResume?.skillsTitle || "Skills"}
                                < span
                                    className='cursor-pointer'
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-edit">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                        <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                        <path d="M16 5l3 3" />
                                    </svg>
                                </span>
                            </>
                        )}
                    </h3>
                    {!parsedResume?.skillsDisabled ? (
                        <div className="v-wrap">
                            <div className="h-wrap align-items-end">
                                <div className="form-group">
                                    <label className="form-label">Add {parsedResume?.skillsTitle || "Skills"} (one per line)</label>
                                    <input type="text" className="form-control" placeholder={(parsedResume?.skillsTitle ? parsedResume.skillsTitle + ' name' : "Type a skill and press Enter to add it")}
                                        value={currentSkill}
                                        onChange={(e) => setCurrentSkill(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleAddSkill();
                                            }
                                        }}
                                    />
                                </div>
                                <span
                                    className='cursor-pointer custom-save-btn'
                                    onClick={() => {
                                        if (currentSkill.trim()) {
                                            const currentSkills = parsedResume?.skill || [];
                                            handleAddSkill();
                                            setCurrentSkill('');
                                        }
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-check">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M5 12l5 5l10 -10" />
                                    </svg>
                                </span>
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                                {parsedResume?.skill
                                    ?.filter(skill => skill.selected)
                                    .map((skill, index) => {
                                        // Debug: log the skill structure
                                        console.log('Skill structure:', skill, 'name type:', typeof skill.name, 'name value:', skill.name);
                                        return (
                                            <span key={index} className="badge d-inline-flex align-items-center skill-badge">
                                                {typeof skill.name === 'string' ? skill.name : skill.name?.name || skill.name || 'Unknown Skill'}
                                                <button
                                                    type="button"
                                                    className="ms-1 bg-transparent border-0"
                                                    aria-label="Remove"
                                                    onClick={() => {
                                                        const skillName = typeof skill.name === 'string' ? skill.name : skill.name?.name || skill.name;
                                                        const updatedSkills = [...parsedResume.skill];
                                                        const skillIndex = updatedSkills.findIndex(s => {
                                                            const sName = typeof s.name === 'string' ? s.name : s.name?.name || s.name;
                                                            return sName === skillName;
                                                        });
                                                        if (skillIndex > -1) {
                                                            updatedSkills.splice(skillIndex, 1);
                                                            dispatch(updateField({ path: "skill", value: updatedSkills }));
                                                        }
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-x">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M18 6l-12 12" />
                                                        <path d="M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </span>
                                        )
                                    })}
                            </div>
                        </div>
                    ) : (
                        <div className="text-dark text-center py-3 d-flex flex-column gap-2">
                            <span
                                className={`icon-toggle border-0 bg-transparent text-dark`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-bulb"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7" /><path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3" /><path d="M9.7 17l4.6 0" /></svg>
                            </span>
                            This section is disabled
                        </div>
                    )}
                </div>
            )
        }

        if (modalFor == 'language') {
            return (
                <div className='personal-detail-wrapper'>
                    <h3 className="editor-section-title">
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

                            {!parsedResume?.languagesDisabled ?
                                (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-eye"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>)
                                : (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-eye-off"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" /><path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" /><path d="M3 3l18 18" /></svg>)
                            }
                        </button>
                        {parsedResume?.editingLanguagesTitle ? (
                            <div className="d-flex align-items-center gap-2 flex-grow-1">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm me-2"

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
                                </div>
                                <span
                                    className='cursor-pointer'
                                    onClick={() =>
                                        dispatch(
                                            updateField({
                                                path: "editingLanguagesTitle",
                                                value: false
                                            })
                                        )
                                    }
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-check">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M5 12l5 5l10 -10" />
                                    </svg>
                                </span>
                            </div>
                        ) : (
                            <>
                                {parsedResume?.languagesTitle || "Languages"}
                                < span
                                    className='cursor-pointer'
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-edit">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                        <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                        <path d="M16 5l3 3" />
                                    </svg>
                                </span>
                            </>
                        )}
                    </h3>
                    {!parsedResume?.languagesDisabled ? (
                        <div className="v-wrap">
                            <div className="h-wrap align-items-end">
                                <div className="form-group">
                                    <label className="form-label">Add {parsedResume?.languagesTitle || "Language"}</label>
                                    <input type="text" className="form-control" placeholder={(parsedResume?.languagesTitle ? parsedResume.languagesTitle + ' name' : "Language name")}
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
                                <div className="form-group w-50">
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
                                <span
                                    className='cursor-pointer custom-save-btn'
                                    onClick={handleAddLanguage}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-check">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M5 12l5 5l10 -10" />
                                    </svg>
                                </span>
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                                {(parsedResume?.languages ?? [])
                                    .filter((l) => {
                                        if (!l) return false;
                                        if (typeof l === 'object' && Object.keys(l).length === 0) return false;
                                        return Boolean(l.name || l.level || l.language);
                                    })
                                    .map((lang, index) => (
                                        <span key={index} className="badge d-inline-flex align-items-center skill-badge">
                                            {typeof (lang.name || lang.language) === 'string' ? (lang.name || lang.language) : (lang.name?.name || lang.language?.name || lang.name || lang.language || 'Unknown Language')}
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
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                                            </button>
                                        </span>
                                    ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-dark text-center py-3 d-flex flex-column gap-2">
                            <span
                                className={`icon-toggle border-0 bg-transparent text-dark`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-language"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 6.371c0 4.418 -2.239 6.629 -5 6.629" /><path d="M4 6.371h7" /><path d="M5 9c0 2.144 2.252 3.908 6 4" /><path d="M12 20l4 -9l4 9" /><path d="M19.1 18h-6.2" /><path d="M6.694 3l.793 .582" /></svg>
                            </span>
                            This section is disabled
                        </div>
                    )}
                </div>
            )
        }

        if (modalFor == 'hobbie') {
            return (
                <div className='personal-detail-wrapper'>
                    <h3 className="editor-section-title">
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

                            {!parsedResume?.hobbiesDisabled ?
                                (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-eye"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>)
                                : (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-eye-off"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" /><path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" /><path d="M3 3l18 18" /></svg>)
                            }
                        </button>
                        {parsedResume?.editingHobbiesTitle ? (
                            <div className="d-flex align-items-center gap-2 flex-grow-1">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm me-2"

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
                                </div>
                                <span
                                    className='cursor-pointer'
                                    onClick={() =>
                                        dispatch(
                                            updateField({
                                                path: "editingHobbiesTitle",
                                                value: false
                                            })
                                        )
                                    }
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-check">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M5 12l5 5l10 -10" />
                                    </svg>
                                </span>
                            </div>
                        ) : (
                            <>
                                {parsedResume?.hobbiesTitle || "Hobbies"}
                                < span
                                    className='cursor-pointer'
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-edit">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                        <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                        <path d="M16 5l3 3" />
                                    </svg>
                                </span>
                            </>
                        )}
                    </h3>
                    {!parsedResume?.hobbiesDisabled ? (
                        <div className="v-wrap">
                            <div className="h-wrap align-items-end">
                                <div className="form-group">
                                    <label className="form-label">Add {parsedResume?.hobbiesTitle || "Hobby"}</label>
                                    <input type="text" className="form-control" placeholder={(parsedResume?.hobbiesTitle ? parsedResume.hobbiesTitle + ' name' : "Hobby name")}
                                        value={currentHobby}
                                        onChange={(e) => setCurrentHobby(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleAddHobby();
                                            }
                                        }}
                                    />
                                </div>
                                <span
                                    className='cursor-pointer custom-save-btn'
                                    onClick={handleAddHobby}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-check">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M5 12l5 5l10 -10" />
                                    </svg>
                                </span>
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                                {parsedResume?.hobbies?.map((hobby, index) => (
                                    <span key={index} className="badge d-inline-flex align-items-center skill-badge">
                                        {hobby}
                                        <button
                                            type="button"
                                            className="bg-transparent border-0"
                                            aria-label="Remove"
                                            onClick={() => {
                                                const updatedHobbies = [...parsedResume.hobbies];
                                                updatedHobbies.splice(index, 1);
                                                dispatch(updateField({ path: "hobbies", value: updatedHobbies }));
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-dark text-center py-3 d-flex flex-column gap-2">
                            <span
                                className={`icon-toggle border-0 bg-transparent text-dark`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-object-scan"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 8v-2a2 2 0 0 1 2 -2h2" /><path d="M4 16v2a2 2 0 0 0 2 2h2" /><path d="M16 4h2a2 2 0 0 1 2 2v2" /><path d="M16 20h2a2 2 0 0 0 2 -2v-2" /><path d="M8 10a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2l0 -4" /></svg>
                            </span>
                            This section is disabled
                        </div>
                    )}
                </div>
            )
        }

        if (modalFor == 'custom') {
            return (
                <div className='personal-detail-wrapper'>
                    {parsedResume?.customSections?.map((section, index) => (
                        <div key={section.id} className="accordion-item">
                            <h3 className="accordion-header" id={`headingCustom-${section.id}`}>
                                <div className="d-flex justify-content-between align-items-center w-100">
                                    <div className="d-flex align-items-center w-100 gap-2">
                                        <button
                                            className={`icon-toggle border-0 bg-transparent ${!section?.disabled ? 'is-active' : ''}`}
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleUpdateCustomSection(section.id, {
                                                    disabled: !section?.disabled
                                                });
                                            }}
                                        >
                                            {!section?.disabled ?
                                                (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-eye"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>)
                                                : (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-eye-off"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" /><path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" /><path d="M3 3l18 18" /></svg>)
                                            }
                                        </button>

                                        {section?.editingTitle ? (
                                            <div className="d-flex align-items-center gap-2 flex-grow-1 flex-grow-1 justify-content-start">
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm me-2"
                                                        value={section?.title || "Custom Section"}
                                                        onChange={(e) => {
                                                            handleUpdateCustomSection(section.id, {
                                                                title: e.target.value
                                                            });
                                                        }}
                                                        onBlur={() => {
                                                            handleUpdateCustomSection(section.id, {
                                                                editingTitle: false
                                                            });
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                handleUpdateCustomSection(section.id, {
                                                                    editingTitle: false
                                                                });
                                                            }
                                                        }}
                                                        autoFocus
                                                    />
                                                </div>
                                                <span
                                                    type="button"
                                                    onClick={() => {
                                                        handleUpdateCustomSection(section.id, {
                                                            editingTitle: false
                                                        });
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-check">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M5 12l5 5l10 -10" />
                                                    </svg>
                                                </span>
                                            </div>
                                        ) : (
                                            <button
                                                className={`accordion-button flex-grow-1 w-100 d-flex gap-2 ${openSections[`custom-${section.id}`] ? '' : 'collapsed'} ${section?.disabled ? 'text-muted' : ''} editor-section-title m-0`}
                                                type="button"
                                                onClick={() => toggleSection(`custom-${section.id}`)}
                                                style={{ background: 'none', border: 'none', textAlign: 'left' }}
                                            >
                                                {section?.title || "Custom Section"}
                                                <span
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleUpdateCustomSection(section.id, {
                                                            editingTitle: true
                                                        });
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-edit">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                                        <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                                        <path d="M16 5l3 3" />
                                                    </svg>
                                                </span>
                                            </button>
                                        )}

                                        <button
                                            className="btn custom-delete-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveCustomSection(section.id);
                                            }}
                                            title="Delete this section"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </h3>
                            <div
                                id={`collapseCustom-${section.id}`}
                                className={`accordion-collapse collapse ${openSections[`custom-${section.id}`] ? 'show' : ''}`}
                                aria-labelledby={`headingCustom-${section.id}`}
                            >
                                <div className="accordion-body">
                                    {!section?.disabled ? (
                                        <div className="card border-0 shadow-none">
                                            <CKEditor
                                                editor={ClassicEditor}
                                                data={section?.content}
                                                onChange={(event, editor) => {
                                                    const data = editor.getData();
                                                    handleUpdateCustomSection(section.id, { content: data });
                                                }}
                                                config={{
                                                    toolbar: [
                                                        'heading', '|',
                                                        'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
                                                        'outdent', 'indent', '|',
                                                        'undo', 'redo'
                                                    ]
                                                }}
                                            />
                                            <small className="mt-2 text-muted small">
                                                Use the editor above to add content to your custom section.
                                            </small>
                                        </div>
                                    ) : (
                                        <div className="text-dark text-center py-3 d-flex flex-column gap-2">
                                            <span
                                                className={`icon-toggle border-0 bg-transparent text-dark`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-object-scan"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 8v-2a2 2 0 0 1 2 -2h2" /><path d="M4 16v2a2 2 0 0 0 2 2h2" /><path d="M16 4h2a2 2 0 0 1 2 2v2" /><path d="M16 20h2a2 2 0 0 0 2 -2v-2" /><path d="M8 10a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2l0 -4" /></svg>
                                            </span>
                                            This section is disabled
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {!parsedResume?.customSections && (
                        <div className="text-dark text-center py-3 d-flex flex-column gap-2">
                            <span
                                className={`icon-toggle border-0 bg-transparent text-dark`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-object-scan"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 8v-2a2 2 0 0 1 2 -2h2" /><path d="M4 16v2a2 2 0 0 0 2 2h2" /><path d="M16 4h2a2 2 0 0 1 2 2v2" /><path d="M16 20h2a2 2 0 0 0 2 -2v-2" /><path d="M8 10a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2l0 -4" /></svg>
                            </span>
                            No Custom Section Founds
                        </div>
                    )}
                    <div className='d-flex justify-content-center align-items-center'>
                        <button
                            onClick={() => {
                                handleAddCustomSection()
                            }}
                            className='btn btn-primary'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-layout-grid-add"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4" /><path d="M14 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4" /><path d="M4 15a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4" /><path d="M14 17h6m-3 -3v6" /></svg>
                            New Custom
                        </button>
                    </div>
                </div>
            )
        }

        if (modalFor == 'design') {
            return (
                <div className="design-wrapper">
                    {cardTemplate.map((template) => (
                        <div key={template.name}
                            className={`template-card text-center cursor-pointer ${selectedTemplate === template.name && 'selected'}`}
                            onClick={() => handleTemplateChange(template.name)}
                        >
                            {/* Recommended Ribbon */}
                            {template.recommended && (
                                <div className='recomended-badge'>
                                    Recommended
                                </div>
                            )}

                            <div className="template-card-image">
                                <img
                                    src={`/assets/images/${template.image}`}
                                    alt={template.name}
                                    className="img-fluid w-100 h-100"
                                />
                                {selectedTemplate === template.name && (
                                    <span className="selected-badge">
                                        Selected
                                    </span>
                                )}
                            </div>
                            <div className="template-title">
                                <h6 className="">{template.name}</h6>
                            </div>
                        </div>
                    ))}
                </div>
            )
        }
    }

    const getEditorModalHeader = () => {
        if (modalFor == 'personal') {
            return (
                <Modal.Title>
                    <span className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-user-scan"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 9a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M4 8v-2a2 2 0 0 1 2 -2h2" /><path d="M4 16v2a2 2 0 0 0 2 2h2" /><path d="M16 4h2a2 2 0 0 1 2 2v2" /><path d="M16 20h2a2 2 0 0 0 2 -2v-2" /><path d="M8 16a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2" /></svg>
                    </span>
                    Personal
                </Modal.Title >
            )
        }

        if (modalFor == 'experence') {
            return (
                <Modal.Title>
                    <span className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-report-analytics"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" /><path d="M9 17v-5" /><path d="M12 17v-1" /><path d="M15 17v-3" /></svg>
                    </span>
                    Experence
                </Modal.Title>
            )
        }

        if (modalFor == 'education') {
            return (
                <Modal.Title>
                    <span className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-school"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M22 9l-10 -4l-10 4l10 4l10 -4v6" /><path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4" /></svg>
                    </span>
                    Education
                </Modal.Title>
            )
        }

        if (modalFor == 'skills') {
            return (
                <Modal.Title>
                    <span className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-bulb"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7" /><path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3" /><path d="M9.7 17l4.6 0" /></svg>
                    </span>
                    Skills
                </Modal.Title>
            )
        }

        if (modalFor == 'language') {
            return (
                <Modal.Title>
                    <span className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-language"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 6.371c0 4.418 -2.239 6.629 -5 6.629" /><path d="M4 6.371h7" /><path d="M5 9c0 2.144 2.252 3.908 6 4" /><path d="M12 20l4 -9l4 9" /><path d="M19.1 18h-6.2" /><path d="M6.694 3l.793 .582" /></svg>
                    </span>
                    Languages
                </Modal.Title>
            )
        }

        if (modalFor == 'hobbie') {
            return (
                <Modal.Title>
                    <span className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-object-scan"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 8v-2a2 2 0 0 1 2 -2h2" /><path d="M4 16v2a2 2 0 0 0 2 2h2" /><path d="M16 4h2a2 2 0 0 1 2 2v2" /><path d="M16 20h2a2 2 0 0 0 2 -2v-2" /><path d="M8 10a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2l0 -4" /></svg>
                    </span>
                    Hobies
                </Modal.Title>
            )
        }

        if (modalFor == 'custom') {
            return (
                <Modal.Title>
                    <span className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-layout-grid-add"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4" /><path d="M14 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4" /><path d="M4 15a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4" /><path d="M14 17h6m-3 -3v6" /></svg>
                    </span>
                    Add Custom Sections
                </Modal.Title>
            )
        }

        if (modalFor == 'design') {
            return (
                <Modal.Title>
                    <span className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-palette"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 21a9 9 0 0 1 0 -18c4.97 0 9 3.582 9 8c0 1.06 -.474 2.078 -1.318 2.828c-.844 .75 -1.989 1.172 -3.182 1.172h-2.5a2 2 0 0 0 -1 3.75a1.3 1.3 0 0 1 -1 2.25" /><path d="M7.5 10.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M11.5 7.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M15.5 10.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /></svg>
                    </span>
                    Design
                </Modal.Title>
            )
        }
    }

    const panelItems = [
        {
            icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-user-scan"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 9a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M4 8v-2a2 2 0 0 1 2 -2h2" /><path d="M4 16v2a2 2 0 0 0 2 2h2" /><path d="M16 4h2a2 2 0 0 1 2 2v2" /><path d="M16 20h2a2 2 0 0 0 2 -2v-2" /><path d="M8 16a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2" /></svg>),
            title: 'Personal',
            slug: 'personal'
        },
        {
            icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-report-analytics"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" /><path d="M9 17v-5" /><path d="M12 17v-1" /><path d="M15 17v-3" /></svg>),
            title: 'Experence',
            slug: 'experence'
        },
        {
            icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-school"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M22 9l-10 -4l-10 4l10 4l10 -4v6" /><path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4" /></svg>),
            title: 'Education',
            slug: 'education'
        },
        {
            icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-bulb"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7" /><path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3" /><path d="M9.7 17l4.6 0" /></svg>),
            title: 'Skills',
            slug: 'skills'
        },
        {
            icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-language"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 6.371c0 4.418 -2.239 6.629 -5 6.629" /><path d="M4 6.371h7" /><path d="M5 9c0 2.144 2.252 3.908 6 4" /><path d="M12 20l4 -9l4 9" /><path d="M19.1 18h-6.2" /><path d="M6.694 3l.793 .582" /></svg>),
            title: 'Language',
            slug: 'language'
        },
        {
            icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-object-scan"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 8v-2a2 2 0 0 1 2 -2h2" /><path d="M4 16v2a2 2 0 0 0 2 2h2" /><path d="M16 4h2a2 2 0 0 1 2 2v2" /><path d="M16 20h2a2 2 0 0 0 2 -2v-2" /><path d="M8 10a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2l0 -4" /></svg>),
            title: 'Hobbies',
            slug: 'hobbie'
        },
        {
            icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-layout-grid-add"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4" /><path d="M14 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4" /><path d="M4 15a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4" /><path d="M14 17h6m-3 -3v6" /></svg>),
            title: 'Custom',
            slug: 'custom'
        },
        {
            icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-palette"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 21a9 9 0 0 1 0 -18c4.97 0 9 3.582 9 8c0 1.06 -.474 2.078 -1.318 2.828c-.844 .75 -1.989 1.172 -3.182 1.172h-2.5a2 2 0 0 0 -1 3.75a1.3 1.3 0 0 1 -1 2.25" /><path d="M7.5 10.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M11.5 7.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M15.5 10.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /></svg>),
            title: 'Design',
            slug: 'design'
        },
    ]


    // Render the component
    return (
        <div className="my-0" style={{ translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>
            <div className="custom-editor">
                <div className="control-panel">
                    {panelItems.map((item, index) => (
                        <div className="panel-item" key={index} onClick={() => handleShow(item.slug)}>
                            <div className="icon">
                                {item.icon}
                            </div>
                            <span className='panel-text'>{item.title}</span>
                        </div>
                    ))}
                </div>
                <div className="editor-preview">
                    <div className="editor-custom-btns">
                        <Button className="editor-custom-btn" onClick={handleSaveChanges} title={parsedResume == prevParsedResume ? 'Saving...' : 'Save Progress'} disabled={parsedResume == prevParsedResume || saveChangesLoader}>
                            {saveChangesLoader ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-loader"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 6l0 -3" /><path d="M16.25 7.75l2.15 -2.15" /><path d="M18 12l3 0" /><path d="M16.25 16.25l2.15 2.15" /><path d="M12 18l0 3" /><path d="M7.75 16.25l-2.15 2.15" /><path d="M6 12l-3 0" /><path d="M7.75 7.75l-2.15 -2.15" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-device-sd-card"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 21h10a2 2 0 0 0 2 -2v-14a2 2 0 0 0 -2 -2h-6.172a2 2 0 0 0 -1.414 .586l-3.828 3.828a2 2 0 0 0 -.586 1.414v10.172a2 2 0 0 0 2 2" /><path d="M13 6v2" /><path d="M16 6v2" /><path d="M10 7v1" /></svg>
                            )}
                        </Button>
                        <Button className="editor-custom-btn" onClick={zoomOut} title={`ZoomOut ${round(zoom * 100, 0)}%`} disabled={zoom == 0.5 && true}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-zoom-out-area"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M13 15h4" /><path d="M10 15a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" /><path d="M22 22l-3 -3" /><path d="M6 18h-1a2 2 0 0 1 -2 -2v-1" /><path d="M3 11v-1" /><path d="M3 6v-1a2 2 0 0 1 2 -2h1" /><path d="M10 3h1" /><path d="M15 3h1a2 2 0 0 1 2 2v1" /></svg>
                        </Button>
                        <span className="editor-custom-btn btn btn-primary zoom-view">
                            {round(zoom * 100, 0)}%
                        </span>
                        <Button className="editor-custom-btn" onClick={zoomIn} title={`ZoomIn ${round(zoom * 100, 0)}%`} disabled={zoom == 3 && true}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-zoom-in-area"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 13v4" /><path d="M13 15h4" /><path d="M10 15a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" /><path d="M22 22l-3 -3" /><path d="M6 18h-1a2 2 0 0 1 -2 -2v-1" /><path d="M3 11v-1" /><path d="M3 6v-1a2 2 0 0 1 2 -2h1" /><path d="M10 3h1" /><path d="M15 3h1a2 2 0 0 1 2 2v1" /></svg>
                        </Button>

                        <Dropdown drop="bottom" align="start">
                            <Dropdown.Toggle className="btn editor-custom-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-cloud-download"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M19 18a3.5 3.5 0 0 0 0 -7h-1a5 4.5 0 0 0 -11 -2a4.6 4.4 0 0 0 -2.1 8.4" /><path d="M12 13l0 9" /><path d="M9 19l3 3l3 -3" /></svg>
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="dropdown-menu-end">
                                <Dropdown.Item onClick={handleDownloadPDF}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-file-type-pdf me-2"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" /><path d="M5 18h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6" /><path d="M17 18h2" /><path d="M20 15h-3v6" /><path d="M11 15v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1z" /></svg>
                                    Download as PDF
                                </Dropdown.Item>

                                <Dropdown.Item onClick={handleDownloadDocx}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-file-type-docx me-2"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" /><path d="M2 15v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1z" /><path d="M17 16.5a1.5 1.5 0 0 0 -3 0v3a1.5 1.5 0 0 0 3 0" /><path d="M9.5 15a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1 -3 0v-3a1.5 1.5 0 0 1 1.5 -1.5z" /><path d="M19.5 15l3 6" /><path d="M19.5 21l3 -6" /></svg>
                                    Download as DOCX
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        <Button
                            className="editor-custom-btn"
                            onClick={() => setShowAtsModal(true)}
                            title="ATS Check"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-shield-check"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" /><path d="M9 12l2 2l4 -4" /></svg>
                        </Button>
                    </div>
                    <div className="editor-inner-wrapper">
                        <div className="cv-wrapper">
                            {/*
                              The preview is the real PDF, not an HTML rendering
                              of it, so what is on screen is exactly what gets
                              downloaded. Page breaks shown here are the ones the
                              file actually has, which the old DOM-height estimate
                              could only guess at.
                            */}
                            <ResumePdfPreview
                                resume={parsedResume}
                                template={selectedTemplate}
                                zoom={zoom}
                                onPagesChange={setTotalPages}
                                className="cv-template-div mx-auto"
                                style={{
                                    background: '#fff',
                                    height: 'calc(100vh - 190px)',
                                    width: '100%',
                                }}
                            />
                        </div>
                    </div>
                </div>

                <Modal show={modalShow} onHide={handleClose} centered backdrop="static" size='lg' className='editor-modal'>
                    <Modal.Header>
                        {getEditorModalHeader()}
                        <span onClick={handleClose} className='editor-modal-close'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c30000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                        </span>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="editor-modal-inner-wrapper">
                            {getEditorModalContent()}
                        </div>
                    </Modal.Body>
                </Modal>

            </div>
            {/* Shown while the PDF is being built and saved. Generation is
                client-side and usually well under a second, but saving to the
                API first can take longer. */}
            {downloadPDFLoader && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    backdropFilter: 'blur(5px)'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                        textAlign: 'center',
                        maxWidth: '400px',
                        width: '90%'
                    }}>
                        <div style={{
                            display: 'inline-block',
                            width: '50px',
                            height: '50px',
                            border: '4px solid rgba(122, 30, 55, 0.2)',
                            borderRadius: '50%',
                            borderTopColor: '#7a1e37',
                            animation: 'spin 1s ease-in-out infinite',
                            marginBottom: '1rem'
                        }} />
                        <h3 style={{
                            color: '#333',
                            marginBottom: '0.5rem',
                            fontWeight: '600'
                        }}>Generating Your CV</h3>
                        <p style={{
                            color: '#666',
                            margin: '0.5rem 0 1rem'
                        }}>Please wait while we prepare your document...</p>
                        <div style={{
                            height: '4px',
                            width: '100%',
                            backgroundColor: '#f0f0f0',
                            borderRadius: '2px',
                            overflow: 'hidden',
                            marginTop: '1rem'
                        }}>
                            <div style={{
                                height: '100%',
                                width: '100%',
                                backgroundColor: '#7a1e37',
                                borderRadius: '2px',
                                animation: 'loading 1.5s ease-in-out infinite'
                            }} />
                        </div>
                    </div>
                    <style jsx>{`
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            @keyframes loading {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
        `}</style>
                </div>
            )}

            <AtsCheckModal
                show={showAtsModal}
                onHide={() => setShowAtsModal(false)}
                resumeId={id}
            />
        </div>
    );
}


