import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "../../../api/axios";

/**
 * Step machine:
 *   choose        -> pick "skills" or "job-description"
 *   job-input     -> only for job-description mode: paste/edit the JD
 *   loading       -> API call in flight
 *   result        -> render whichever result came back
 *
 * Both /ats-check and /job-match return the same top-level envelope
 * ({ success, message, data }) and the same category shape
 * ({ label, score, max_score, assessment, strengths, issues }),
 * so one result renderer covers both — job-match just has two extra
 * fields (recommendation, keyword_analysis) that render conditionally.
 */
const AtsCheckModal = ({ show, onHide, resumeId, savedJobDescription }) => {
    const [step, setStep] = useState("choose");
    const [mode, setMode] = useState(null); // 'skills' | 'job-description'
    const [jobDescription, setJobDescription] = useState(savedJobDescription || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);

    const reset = () => {
        setStep("choose");
        setMode(null);
        setError("");
        setResult(null);
        setLoading(false);
    };

    const handleClose = () => {
        reset();
        onHide();
    };

    const chooseSkills = () => {
        setMode("skills");
        runAnalysis("skills");
    };

    const chooseJobDescription = () => {
        setMode("job-description");
        setStep("job-input");
    };

    const submitJobDescription = () => {
        if (jobDescription.trim().length < 40) {
            setError("Paste the full job description — a title alone isn't enough to score against (minimum 40 characters).");
            return;
        }
        setError("");
        runAnalysis("job-description");
    };

    const runAnalysis = async (activeMode) => {
        setStep("loading");
        setLoading(true);
        setError("");

        try {
            const endpoint =
                activeMode === "skills"
                    ? `/resume/${resumeId}/ats-check`
                    : `/resume/${resumeId}/job-match`;

            const payload =
                activeMode === "job-description"
                    ? { job_description: jobDescription.trim() }
                    : {};

            const response = await axios.post(endpoint, payload);

            if (response.data?.success) {
                setResult(response.data.data);
                setStep("result");
            } else {
                throw new Error(response.data?.message || "Analysis failed.");
            }
        } catch (err) {
            const apiMessage = err?.response?.data?.message;
            const requiresJobDescription = err?.response?.data?.requires_job_description;

            if (requiresJobDescription) {
                // Backend has no saved JD and none was sent — bounce back
                // to the input step instead of a dead-end error screen.
                setMode("job-description");
                setStep("job-input");
                setError(apiMessage || "Please provide a job description first.");
            } else {
                setError(apiMessage || "Something went wrong while analyzing your CV. Please try again.");
                setStep(activeMode === "job-description" ? "job-input" : "choose");
                toast.error(apiMessage || "ATS analysis failed.");
            }
        } finally {
            setLoading(false);
        }
    };

    const scoreTone = (pct) => (pct >= 75 ? "#0F6E5C" : pct >= 50 ? "#B8791A" : "#A8342A");

    return (
        <Modal show={show} onHide={handleClose} centered size="lg" backdrop="static" className="ats-check-modal">
            <Modal.Header closeButton className="ats-modal-header">
                <Modal.Title className="ats-modal-title">
                    {step === "result"
                        ? mode === "job-description"
                            ? "Job Match Results"
                            : "ATS Scan Results"
                        : "ATS Check"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="ats-modal-body">
                {/* STEP: choose mode */}
                {step === "choose" && (
                    <div>
                        <p className="ats-choose-subtitle">
                            Choose how you'd like your CV checked.
                        </p>
                        <div className="d-flex flex-column gap-3 mt-3">
                            <button
                                type="button"
                                className="ats-option-card"
                                onClick={chooseSkills}
                                disabled={loading}
                            >
                                <strong className="ats-option-title">Score my CV</strong>
                                <div className="ats-option-desc">
                                    General ATS readiness — structure, keywords, and content quality based on your CV alone.
                                </div>
                            </button>
                            <button
                                type="button"
                                className="ats-option-card"
                                onClick={chooseJobDescription}
                                disabled={loading}
                            >
                                <strong className="ats-option-title">Match against a job description</strong>
                                <div className="ats-option-desc">
                                    Score your CV against a specific job posting — keyword gaps, missing requirements, tailored suggestions.
                                </div>
                            </button>
                        </div>
                        {error && <div className="ats-error mt-3">{error}</div>}
                    </div>
                )}

                {/* STEP: job description input */}
                {step === "job-input" && (
                    <div>
                        <p className="ats-step-lead">
                            Paste the full description of the job you're applying for. We'll compare it against your CV to show the ATS match.
                        </p>
                        <div className="ats-field">
                            <label className="ats-field-label" htmlFor="ats-jd-textarea">Job Description</label>
                            <textarea
                                id="ats-jd-textarea"
                                className="ats-textarea"
                                rows={8}
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the full job posting here…"
                            />
                        </div>
                        {error && <div className="ats-error mb-3">{error}</div>}
                        <div className="ats-row-actions">
                            <button type="button" className="ats-btn-ghost" onClick={() => setStep("choose")}>
                                ← Back
                            </button>
                            <button type="button" className="ats-btn-primary" onClick={submitJobDescription} disabled={loading}>
                                Run Analysis
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP: loading */}
                {step === "loading" && (
                    <div className="text-center py-5">
                        <div className="spinner-border" role="status" style={{ color: "#F4762A" }} />
                        <p className="ats-choose-subtitle mt-3 mb-0">
                            {mode === "job-description" ? "Comparing your CV against the job description…" : "Scanning your CV…"}
                        </p>
                    </div>
                )}

                {/* STEP: result */}
                {step === "result" && result && (
                    <div>
                        {/* Score row */}
                        <div className="ats-score-row">
                            <span className="ats-score-num">{result.score}</span>
                            <span className="ats-score-max">/100</span>
                            <span className="ats-score-badge">{result.grade}</span>
                            {result.recommendation && (
                                <span className="badge bg-secondary text-uppercase ms-2">
                                    {result.recommendation.replace("_", " ")}
                                </span>
                            )}
                        </div>

                        {result.summary && (
                            <p className="ats-summary-text">{result.summary}</p>
                        )}

                        {/* Job-match only: keyword analysis */}
                        {result.keyword_analysis && (
                            <div className="ats-block">
                                <div className="ats-block-title">Keyword match</div>
                                {result.keyword_analysis.matched?.length > 0 && (
                                    <div className="mb-2">
                                        <span className="text-muted small d-block mb-1">Matched</span>
                                        {result.keyword_analysis.matched.map((kw, i) => (
                                            <span key={i} className="ats-keyword-badge ats-keyword-badge-matched">{kw}</span>
                                        ))}
                                    </div>
                                )}
                                {result.keyword_analysis.missing_critical?.length > 0 && (
                                    <div className="mb-2">
                                        <span className="text-muted small d-block mb-1">Missing (critical)</span>
                                        {result.keyword_analysis.missing_critical.map((kw, i) => (
                                            <span key={i} className="ats-keyword-badge ats-keyword-badge-missing">{kw}</span>
                                        ))}
                                    </div>
                                )}
                                {result.keyword_analysis.missing_nice_to_have?.length > 0 && (
                                    <div>
                                        <span className="text-muted small d-block mb-1">Missing (nice to have)</span>
                                        {result.keyword_analysis.missing_nice_to_have.map((kw, i) => (
                                            <span key={i} className="ats-keyword-badge ats-keyword-badge-nice">{kw}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Category breakdown */}
                        <div className="ats-block">
                            <div className="ats-block-title">Breakdown</div>
                            {Object.entries(result.categories || {}).map(([key, cat]) => {
                                const pct = Math.round((cat.score / cat.max_score) * 100);
                                return (
                                    <div key={key} className="ats-breakdown-row">
                                        <div className="ats-breakdown-top">
                                            <span className="ats-breakdown-name">{cat.label}</span>
                                            <span className="ats-breakdown-score">{cat.score}/{cat.max_score}</span>
                                        </div>
                                        <div className="ats-bar-track">
                                            <div
                                                className="ats-bar-fill"
                                                style={{
                                                    width: `${pct}%`,
                                                    background: pct >= 70 ? "#221C16" : "#F4762A",
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Suggestions */}
                        {result.suggestions?.length > 0 && (
                            <div className="ats-block">
                                <div className="ats-block-title">Suggestions</div>
                                <div className="ats-suggestion-list">
                                    {result.suggestions.map((s, i) => (
                                        <div key={i} className="ats-suggestion-card">
                                            <div className="ats-suggestion-head">
                                                <strong className="ats-suggestion-title">{s.title}</strong>
                                                <span className={`ats-priority-badge ${
                                                    s.priority === "high" ? "ats-badge-high"
                                                    : s.priority === "medium" ? "ats-badge-medium"
                                                    : "ats-badge-low"
                                                }`}>
                                                    {s.priority}
                                                </span>
                                            </div>
                                            <p className="ats-suggestion-desc">{s.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="ats-run-again">
                            <button type="button" className="ats-btn-ghost" onClick={reset}>
                                Run another check
                            </button>
                        </div>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default AtsCheckModal;
