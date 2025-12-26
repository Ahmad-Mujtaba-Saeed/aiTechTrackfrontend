import React , {useState, useEffect} from "react";
// import { UserContext } from "../../../context/UserContext";
// import { FeedbackContext } from "../../../context/feedbackContext";
// import { useContext } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import { useDispatch , useSelector } from 'react-redux';
import "./InterviewFeedback.css";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const getProficiencyLevel = (score) => {
    const numericScore = parseFloat(score);
    if (isNaN(numericScore)) return '';
    
    if (numericScore >= 95) return 'Excellent';
    if (numericScore >= 85) return 'Strong';
    if (numericScore >= 70) return 'Competent';
    if (numericScore >= 50) return 'Developing';
    return 'Beginner';
};

const ProgressBar = ({ value, maxValue, label }) => {
    const percentage = (value / maxValue) * 100;
    let color = '#28a745'; // Green
    
    if (percentage < 35) {
        color = '#dc3545'; // Red
    } else if (percentage < 70) {
        color = '#ffc107'; // Amber
    }
    
    return (
        <div className="progress-container">
            <div className="progress-label">
                <span>{label}:</span>
                <span>{value}/{maxValue} ({Math.round(percentage)}%)</span>
            </div>
            <div className="progress">
                <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: color
                    }}
                    aria-valuenow={value}
                    aria-valuemin="0"
                    aria-valuemax={maxValue}
                ></div>
            </div>
        </div>
    );
};

const renderStarRating = (score , maxScore) => {
    const maxStars = 5;
    const starValue = maxScore / maxStars; // Each star is worth 10 points (50/5)
    const filledStars = Math.floor(score / starValue);
    const hasHalfStar = (score % starValue) >= (starValue / 2);
    
    const stars = [];
    
    // Add filled stars
    for (let i = 0; i < filledStars; i++) {
        stars.push(<FaStar key={`full-${i}`} style={{ color: '#FFD700' }} />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
        stars.push(<FaStarHalfAlt key="half" style={{ color: '#FFD700' }} />);
    }
    
    // Add empty stars
    const emptyStars = maxStars - filledStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<FaRegStar key={`empty-${i}`} style={{ color: '#FFD700' }} />);
    }
    
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {stars}
            <span style={{ marginLeft: '5px', color: '#666' }}>({score}/{maxScore})</span>
        </div>
    );
};

const InterviewFeedback = () => {
    const dispatch = useDispatch();

    // const [parsedFeedback,setParsedFeedback] = useState(null);
    const { parsedFeedback } = useSelector((state) => state.interview);
    const { data } = useSelector((state) => state.interview);
    const navigate = useNavigate();
    
    return (
        <>
        <MasterLayout>
        <div className="feedback-container">
            <div className="feedback-header">
                <div className="d-flex justify-content-between">
                {parsedFeedback?.evaluation?.breakdown?.total?.score < 40 
  ? <h1>Please review the feedback and try the question again.</h1> 
  : <h1>Great job on completing your interview practice!</h1>}

                <div className="d-flex gap-2">
                    <button 
                        className="btn btn-outline-primary d-flex align-items-center gap-1"
                        onClick={() => navigate('/interview')}
                    >
                        <i className="bi bi-house-door"></i> Main Menu
                    </button>
                    <button 
                        className="btn btn-primary d-flex align-items-center gap-1"
                        onClick={() => navigate('/prepration/' + parsedFeedback?.question?.id)}
                    >
                        <i className="bi bi-arrow-repeat"></i> Retry
                    </button>
                </div>
                </div>
            </div>
            
            <div className="feedback-content">
                <div className="left-column">
                    <div className="score-section">
                        <h2>Your Score</h2>
                        <div className="question-title">
                            <h3>{parsedFeedback?.question?.speech}</h3>
                            <span>{parsedFeedback?.industry?.name}</span>
                        </div>
                        
                        <div className="page-indicator">(PAGE)</div>
                        
                        <div className="score-table">
                            <table>
                                <tbody>
                                    <tr>
                                        <td rowSpan="3" className="score-percentage">
                                            {parsedFeedback?.evaluation?.breakdown?.total?.score}%
                                            <div className="proficiency-level">
                                                {getProficiencyLevel(parsedFeedback?.evaluation?.breakdown?.total?.score)}
                                            </div>
                                        </td>
                                        <td>Star Method</td>
                                        <td className="percentage">
                                            {renderStarRating(parseFloat(parsedFeedback?.evaluation?.breakdown?.star_method?.total?.score) || 0 , 50)}
                                        </td>
                                        <td>
                                            <div className="dropdown">
                                                <button 
                                                    className="btn btn-sm btn-link p-0" 
                                                    type="button" 
                                                    data-bs-toggle="dropdown" 
                                                    aria-expanded="false"
                                                >
                                                    <FaEllipsisV />
                                                </button>
                                                <ul className="dropdown-menu">
                                                    <li><h6 className="dropdown-header">Detailed Breakdown</h6></li>
                                                    <li><div className="dropdown-item">
                                                        <strong>Star Method:</strong>
                                                        {/* <li>
                                                        <ProgressBar 
                                                            value={parsedFeedback?.evaluation?.breakdown?.star_method?.situation?.score || 0} 
                                                            maxValue={10} 
                                                            label="Situation" 
                                                        />
                                                    </li>
                                                    <li>
                                                        <ProgressBar 
                                                            value={parsedFeedback?.evaluation?.breakdown?.star_method?.task?.score || 0} 
                                                            maxValue={10} 
                                                            label="Task" 
                                                        />
                                                    </li>
                                                    <li>
                                                        <ProgressBar 
                                                            value={parsedFeedback?.evaluation?.breakdown?.star_method?.action?.score || 0} 
                                                            maxValue={20} 
                                                            label="Action" 
                                                        />
                                                    </li>
                                                    <li>
                                                        <ProgressBar 
                                                            value={parsedFeedback?.evaluation?.breakdown?.star_method?.result?.score || 0} 
                                                            maxValue={10} 
                                                            label="Result" 
                                                        />
                                                    </li> */}
                                                        <ul className="mb-2">
                                                            <li>Situation: {renderStarRating(parseFloat(parsedFeedback?.evaluation?.breakdown?.star_method?.situation?.score) || 0 , 10)}</li>
                                                            <li>Task: {renderStarRating(parseFloat(parsedFeedback?.evaluation?.breakdown?.star_method?.task?.score) || 0 , 10)} </li>
                                                            <li>Action: {renderStarRating(parseFloat(parsedFeedback?.evaluation?.breakdown?.star_method?.action?.score) || 0 , 20)} </li>
                                                            <li>Result: {renderStarRating(parseFloat(parsedFeedback?.evaluation?.breakdown?.star_method?.result?.score) || 0 , 10)} </li>
                                                        </ul>
                                                    </div></li>
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Communication</td>
                                        <td className="percentage">
                                            {renderStarRating(parseFloat(parsedFeedback?.evaluation?.breakdown?.communication?.total?.score) || 0 , 20)}
                                        </td>
                                        <td>
                                            <div className="dropdown">
                                                <button 
                                                    className="btn btn-sm btn-link p-0" 
                                                    type="button" 
                                                    data-bs-toggle="dropdown" 
                                                    aria-expanded="false"
                                                >
                                                    <FaEllipsisV />
                                                </button>
                                                <ul className="dropdown-menu">
                                                    <li><h6 className="dropdown-header">Detailed Breakdown</h6></li>
                                                    <li><div className="dropdown-item">
                                                        <strong>Communication:</strong>
                                                        <ul className="mb-2">
                                                        <li>
                                                        <ProgressBar 
                                                            value={parsedFeedback?.evaluation?.breakdown?.communication?.clarity?.score || 0} 
                                                            maxValue={8} 
                                                            label="Clarity" 
                                                        />
                                                    </li>
                                                    <li>
                                                        <ProgressBar 
                                                            value={parsedFeedback?.evaluation?.breakdown?.communication?.professional_language?.score || 0} 
                                                            maxValue={4} 
                                                            label="Professional Language" 
                                                        />
                                                    </li>
                                                    <li>
                                                        <ProgressBar 
                                                            value={parsedFeedback?.evaluation?.breakdown?.communication?.confidence?.score || 0} 
                                                            maxValue={4} 
                                                            label="Confidence" 
                                                        />
                                                    </li>
                                                    <li>
                                                        <ProgressBar 
                                                            value={parsedFeedback?.evaluation?.breakdown?.communication?.filler_words?.score || 0} 
                                                            maxValue={4} 
                                                            label="Filler Words" 
                                                        />
                                                    </li>
                                                        </ul>
                                                    </div></li>
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Competencies</td>
                                        <td className="percentage">
                                            {renderStarRating(parseFloat(parsedFeedback?.evaluation?.breakdown?.competencies?.total?.score) || 0 , 30)}
                                        </td>
                                        <td>
                                            <div className="dropdown">
                                                <button 
                                                    className="btn btn-sm btn-link p-0" 
                                                    type="button" 
                                                    data-bs-toggle="dropdown" 
                                                    aria-expanded="false"
                                                >
                                                    <FaEllipsisV />
                                                </button>
                                                <ul className="dropdown-menu">
                                                    <li><h6 className="dropdown-header">Detailed Breakdown</h6></li>
                                                    <li><div className="dropdown-item">
                                                        <strong>Competencies:</strong>
                                                        <ul className="mb-2">
                                                            <li>
                                                        <ProgressBar 
                                                            value={parsedFeedback?.evaluation?.breakdown?.competencies?.critical_thinking?.score || 0} 
                                                            maxValue={8} 
                                                            label="Critical Thinking" 
                                                        />
                                                    </li>
                                                    <li>
                                                        <ProgressBar 
                                                            value={parsedFeedback?.evaluation?.breakdown?.competencies?.teamwork_balance?.score || 0} 
                                                            maxValue={5} 
                                                            label="Teamwork Balance" 
                                                        />
                                                    </li>
                                                    <li>
                                                        <ProgressBar 
                                                            value={parsedFeedback?.evaluation?.breakdown?.competencies?.goal_orientation?.score || 0} 
                                                            maxValue={5} 
                                                            label="Goal Orientation" 
                                                        />
                                                    </li>
                                                    <li>
                                                        <ProgressBar 
                                                            value={parsedFeedback?.evaluation?.breakdown?.competencies?.emotional_intelligence?.score || 0} 
                                                            maxValue={6} 
                                                            label="Emotional Intelligence" 
                                                        />
                                                    </li>
                                                    <li>
                                                        <ProgressBar 
                                                            value={parsedFeedback?.evaluation?.breakdown?.competencies?.structural_coherence?.score || 0} 
                                                            maxValue={3} 
                                                            label="Structural Coherence" 
                                                        />
                                                    </li>
                                                    <li>
                                                        <ProgressBar 
                                                            value={parsedFeedback?.evaluation?.breakdown?.competencies?.question_relevance?.score || 0} 
                                                            maxValue={3} 
                                                            label="Question Relevance" 
                                                        />
                                                    </li>
                                                        </ul>
                                                    </div></li>
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div className="divider"></div>
                    
                    <div className="core-feedback">
                        <h2>Core feedback</h2>
                        <ul>
                            {parsedFeedback?.evaluation?.top_improvements?.map((issue, index) => (
                                <li key={index}>
                                    <strong>{issue.title}</strong><br />
                                    {issue.description}
                                </li>
                            ))}
                            {/* <li>
                                <strong>Too Vague</strong><br />
                                Include specific roles, industries, and measurable experiences (e.g., "4 years in tech and retail sectors").
                            </li>
                            <li>
                                <strong>No clear value proposition</strong><br />
                                Highlight a few key strengths (e.g., communication, problem solving) with examples or proof.
                            </li>
                            <li>
                                <strong>Lacks structure</strong><br />
                                Use a 3-part flow past experience – present motivation – future goal aligned with the company.
                            </li> */}
                        </ul>
                    </div>
                </div>
                
                <div className="right-column">
                    <div className="feedback-transcript">
                        <h2>Feedback transcript</h2>
                        <div className="transcript-item">
                            <p className="question"><strong>Question asked by MyPathfinder</strong></p>
                            <p className="quote">{parsedFeedback?.question?.speech}</p>
                        </div>
                        
                        <div className="transcript-item">
                            <p className="response"><strong>Your response</strong></p>
                            <p className="quote">{parsedFeedback?.transcription}</p>
                        </div>
                        
                        <div className="transcript-item">
                            <p className="ideal"><strong>MyPathfinder suggested response structure</strong></p>
                            <p className="quote">{parsedFeedback?.evaluation?.ideal_response}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </MasterLayout>
        </>
    );
};

export default InterviewFeedback;