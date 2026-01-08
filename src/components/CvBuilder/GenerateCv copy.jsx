import React, { useState, useRef, useCallback, useEffect } from 'react';
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp, FiMinus, FiLoader, FiDownload, FiX } from "react-icons/fi";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Icon } from "@iconify/react/dist/iconify.js";
import Swal from 'sweetalert2';
import BulletPointsEditor from './BulletPointsEditor';
import avatar from '../../assets/demo_profile.avif'
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

import { Row, Col, Button, Card, Dropdown } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { setParsedResume, updateField, analyzeResumeAi, setSelectedTemplate, fetchResumeById, updateResumeById } from "../../features/resume/resumeSlice";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from 'react-toastify';
import { useNavigate, useParams } from "react-router-dom";
import { ClassicCoverLetterTemplate } from "../cover-letter-templates";
import CoverLetter from "./components/coverLetter";
import html2pdf from "html2pdf.js";
import axios, { baseUrl } from "../../api/axios";

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

export default function CVBuilder() {
    const { id } = useParams();
    const resumeRef = useRef();
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
    const cvRef = useRef();

    const [customSections, setCustomSections] = useState([]);
    const [activeTab, setActiveTab] = useState('tabPreview');

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

    // State for editing experience (similar to education)
    const [expCurrentForm, setExpCurrentForm] = useState(null);
    const [expFormData, setExpFormData] = useState({
        expJobTitle: '',
        expCompany: '',
        expStartDate: '',
        expEndDate: '',
        expDescription: '',
        expHighlights: ['']
    });

    // State for editing education
    const [eduCurrentForm, setEduCurrentForm] = useState(null);
    const [eduFormData, setEduFormData] = useState({
        eduDegree: '',
        eduInstitution: '',
        eduStartDate: '',
        eduEndDate: '',
        achievedGrade: '',
        educationMajor: ['']
    });

    const handleTabClick = (tabName) => {
        setActiveTab((prevTab) => (prevTab === tabName ? '' : tabName));
    };

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

    // Add a function to handle adding/removing major fields for education
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

    // Handle adding education
    const handleAddEducation = () => {
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
                handleSaveEducation();
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

    // Handle saving education
    const handleSaveEducation = () => {
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
        };

        // If editing existing education, update it
        if (eduCurrentForm?.index !== undefined) {
            const updatedEducation = [...parsedResume.education];
            updatedEducation[eduCurrentForm.index] = dispatcheducationList;
            
            dispatch(updateField({ 
                path: "education", 
                value: updatedEducation 
            }));
        } else {
            // Add new education
            dispatch(updateField({ 
                path: "education", 
                value: [...(parsedResume.education || []), dispatcheducationList] 
            }));
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

    // Handle editing an education
    const handleEditEducation = (eduIndex) => {
        const eduToEdit = parsedResume.education[eduIndex];
        if (eduToEdit) {
            setEduCurrentForm({
                eduId: Date.now(),
                index: eduIndex
            });
            
            setEduFormData({
                eduDegree: eduToEdit.educationLevel.label,
                eduInstitution: eduToEdit.educationOrganization,
                eduStartDate: eduToEdit.educationDates.start.date,
                eduEndDate: eduToEdit.educationDates.end.date,
                achievedGrade: eduToEdit.achievedGrade,
                educationMajor: eduToEdit.educationMajor || ['']
            });
        }
    };

    // Handle canceling education edit
    const handleCancelEducationEdit = () => {
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

    // Handle deleting an education
    const handleDeleteEducation = (index) => {
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

    // Handle input changes for education form
    const eduHandleInputChange = (e) => {
        const { name, value } = e.target;
        setEduFormData({
            ...eduFormData,
            [name]: value
        });
    };

    // Toggle accordion sections
    const toggleSection = (section) => {
        setOpenSections((prev) => {
            if (prev[section]) {
                return { ...prev, [section]: false };
            }
            return { ...prev, [section]: true };
        });
    };

    // Other existing functions (handleAnalyze, handleAddSkill, handleAddHobby, etc.)
    // ... [Keep all other existing functions as they are]

    return (
        ''
    )

}