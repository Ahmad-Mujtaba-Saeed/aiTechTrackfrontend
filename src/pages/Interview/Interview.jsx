import React, { useEffect, useState } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import BreadCrum from "../../components/BreadCrum";
import InterviewPractice from "../../components/Interview/InterviewPractice";
import PracticeHistory from "../../components/Interview/PracticeHistory";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../../features/interview/interviewSlice";
import { fetchInterviewHistory, fetchInterviewQuestions, getRandomQuestions, setParsedFeedback } from "../../features/interview/interviewSlice";

import { motion } from "framer-motion";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    InputGroup,
    FormControl,
    Modal,
    Spinner
} from "react-bootstrap";



import axios from "../../utils/axios"
import { useNavigate } from "react-router-dom";

const Interview = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data } = useSelector((state) => state.user);
    const { history, filters, interviewQuestions } = useSelector((state) => state.interview);
    const [isLoadingFilters, setIsLoadingFilters] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Filter options
    const [difficulties, setDifficulties] = useState([]);
    const [questionTypes, setQuestionTypes] = useState([]);
    const [subcategories, setSubcategories] = useState([]);



    useEffect(() => {
        if (data?.preferred_industry && data?.preferred_industry_type) {
            dispatch(setFilters({
                subcategory: data?.preferred_industry,
                questionType: data?.preferred_industry_type,
                difficulty: {
                    id: 1,
                    name: "Easy",
                    slug: "E"
                },
                searchQuery: ""
            }));
            console.log("Dispatching fetchInterviewHistory action");
            dispatch(fetchInterviewHistory());
            console.log("Dispatching fetchInterviewQuestions action");
            dispatch(fetchInterviewQuestions());
        } else {
            dispatch(setFilters({
                subcategory: null,
                questionType: null,
                difficulty: null,
                searchQuery: ""
            }));
        }
    }, [data]);


    const getRandomQuestionsInterview = async () => {
        console.log("getRandomQuestionsInterview called");
        try {
            console.log("Dispatching getRandomQuestions action");
            const resultAction = await dispatch(getRandomQuestions());
            if (getRandomQuestions.fulfilled.match(resultAction)) {
                console.log("Successfully fetched random questions:", resultAction.payload);
                const id = resultAction.payload[0]?.id
                navigate(`/prepration/${id}`);
            } else if (getRandomQuestions.rejected.match(resultAction)) {
                console.error("Failed to fetch random questions:", resultAction.error);
            }
        } catch (error) {
            console.error("Error in getRandomQuestionsInterview:", error);
        }
    }


    // Fetch filter options on component mount
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                setIsLoadingFilters(true);
                // Fetch difficulties
                const [difficultiesRes, questionTypesRes] = await Promise.all([
                    axios.get('/api/filters/difficulties'),
                    axios.get('/api/filters/question-types')
                ]);

                setDifficulties(difficultiesRes.data);
                setQuestionTypes(questionTypesRes.data);

            } catch (error) {
                console.error("Error fetching filter options:", error);
            } finally {
                setIsLoadingFilters(false);
            }
        };

        fetchFilterOptions();
    }, []);


    useEffect(() => {
        const fetchSubcategories = async () => {
            if (!filters.questionType) {
                setSubcategories([]);
                return;
            }

            try {
                setIsLoadingFilters(true);
                const res = await axios.get(
                    `/api/filters/question-types/${filters.questionType.id}/subcategories`
                );
                setSubcategories(res.data);
            } catch (error) {
                console.error("Error fetching subcategories:", error);
            } finally {
                setIsLoadingFilters(false);
            }
        };

        fetchSubcategories();
    }, [filters.questionType]);



    const handleNextStep = () => {
        setCurrentStep(prev => prev + 1);
    };

    const handlePreviousStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleFinish = () => {
        setShowModal(false);
    };


    const handleFilterChange = (filterType, value) => {
        const newFilters = { ...filters, [filterType]: value };
        if (filterType == 'questionType') {
            newFilters.subcategory = null;
        }
        newFilters.searchQuery = "";
        dispatch(setFilters(newFilters));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(fetchInterviewQuestions());
    };


    useEffect(() => {
        if (filters) {
            dispatch(fetchInterviewQuestions());
        }
    }, [filters]);


    useEffect(()=>{
        dispatch(fetchInterviewHistory());
    },[])

    const resetFilters = () => {
        dispatch(setFilters({
            difficulty: null,
            questionType: null,
            subcategory: null,
            searchQuery: ""
        }));
    };


    const handleViewDetails = (item) => {
        console.log('Viewing details for interview:', item.id);
        dispatch(setParsedFeedback(item));
        navigate(`/question-feedback`);
    };


    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <>
                        <Modal.Title className="text-center mb-4">Select Difficulty Level</Modal.Title>
                        <div className="d-grid gap-2">
                            {difficulties.map(difficulty => (
                                <Button
                                    key={difficulty.id}
                                    variant={filters.difficulty?.id === difficulty.id ? "primary" : "outline-primary"}
                                    className="text-start py-3"
                                    onClick={() => handleFilterChange('difficulty', difficulty)}
                                >
                                    {difficulty.name}
                                </Button>
                            ))}
                        </div>
                    </>
                );

            case 2:
                return (
                    <>
                        <Modal.Title className="text-center mb-4">What Do You Want to Practice?</Modal.Title>
                        <div className="d-grid gap-2">
                            {questionTypes.map(type => (
                                <Button
                                    key={type.id}
                                    variant={filters.questionType?.id === type.id ? "primary" : "outline-primary"}
                                    className="text-start py-3"
                                    onClick={() => handleFilterChange('questionType', type)}
                                >
                                    {type.name}
                                </Button>
                            ))}
                        </div>
                    </>
                );

            case 3:
                // Only show subcategory selection for Industry Specific questions
                if (filters.questionType?.slug == "IND") {
                    return (
                        <>
                            <Modal.Title className="text-center mb-4">Select Subcategory</Modal.Title>
                            {isLoading ? (
                                <div className="text-center p-4">
                                    <Spinner animation="border" />
                                </div>
                            ) : (
                                <div className="d-grid gap-2">
                                    {subcategories.length > 0 ? (
                                        subcategories.map(subcategory => (
                                            <Button
                                                key={subcategory.id}
                                                variant={filters.subcategory?.id === subcategory.id ? "primary" : "outline-primary"}
                                                className="text-start py-3"
                                                onClick={() => handleFilterChange('subcategory', subcategory)}
                                            >
                                                {subcategory.name}
                                            </Button>
                                        ))
                                    ) : (
                                        <div className="text-center p-3 text-muted">
                                            No subcategories available for the selected industry
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    );
                }
                // For non-industry questions, skip this step
                return null;

            default:
                return null;
        }
    };

    const isNextDisabled = () => {
        switch (currentStep) {
            case 1: return !filters.difficulty;
            case 2: return !filters.questionType;
            case 3: return filters.questionType?.slug === "IND" ? !filters.subcategory : true;
            default: return true;
        }
    };



    return (
        <>

            <MasterLayout>
                <Modal
                    show={showModal}
                    onHide={() => { }}
                    backdrop="static"
                    keyboard={false}
                    centered
                >
                    <Modal.Body className="p-4">
                        {isLoading && currentStep === 1 ? (
                            <div className="text-center p-4">
                                <Spinner animation="border" />
                                <p className="mt-2">Loading options...</p>
                            </div>
                        ) : (
                            <>

                                <div className="mb-4">
                                    {renderStepContent()}
                                </div>

                                <div className="d-flex justify-content-between mt-4">
                                    <Button
                                        variant="outline-secondary"
                                        onClick={currentStep === 1 ? () => setShowModal(false) : handlePreviousStep}
                                        disabled={isLoading}
                                    >
                                        {currentStep === 1 ? 'Cancel' : 'Back'}
                                    </Button>

                                    {(currentStep === 1 || currentStep === 2) && filters?.questionType?.slug === "IND" ? (
                                        <Button
                                            variant="primary"
                                            onClick={handleNextStep}
                                            disabled={isNextDisabled() || isLoading}
                                        >
                                            Next
                                        </Button>
                                    ) : currentStep === 1 ? (
                                        <Button
                                            variant="primary"
                                            onClick={handleNextStep}
                                            disabled={isNextDisabled() || isLoading}
                                        >
                                            Next
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="success"
                                            onClick={handleFinish}
                                            disabled={isNextDisabled() || isLoading}
                                        >
                                            Start Practicing
                                        </Button>
                                    )}
                                </div>

                                <div className="text-center mt-3 text-muted">
                                    Step {currentStep} of {filters?.questionType?.slug == "IND" ? 3 : 2}
                                </div>
                            </>
                        )}
                    </Modal.Body>
                </Modal>
                {!showModal && (
                    <>
                        <BreadCrum title='Interview Simulator' subTitle='Practise with industry specific questions and real-time feedback.' />
                        <InterviewPractice interviewQuestions={interviewQuestions} setShowModal={setShowModal} filters={filters} dispatch={dispatch} getRandomQuestionsInterview={getRandomQuestionsInterview} />
                        <PracticeHistory history={history} handleViewDetails={handleViewDetails} />
                    </>
                )}
            </MasterLayout>
        </>
    );
};

export default Interview;
