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
            <Modal.Header closeButton>
                <Modal.Title>
                    {step === "result"
                        ? mode === "job-description"
                            ? "Job Match Results"
                            : "ATS Scan Results"
                        : "ATS Check"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {/* STEP: choose mode */}
                {step === "choose" && (
                    <div>
                        <p className="text-muted mb-4">
                            Choose how you'd like your CV checked.
                        </p>
                        <div className="d-flex flex-column gap-3">
                            <button
                                type="button"
                                className="btn btn-outline-dark text-start p-3"
                                onClick={chooseSkills}
                                disabled={loading}
                            >
                                <strong>Score my CV</strong>
                                <div className="text-muted small mt-1">
                                    General ATS readiness — structure, keywords, and content quality based on your CV alone.
                                </div>
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-dark text-start p-3"
                                onClick={chooseJobDescription}
                                disabled={loading}
                            >
                                <strong>Match against a job description</strong>
                                <div className="text-muted small mt-1">
                                    Score your CV against a specific job posting — keyword gaps, missing requirements, tailored suggestions.
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP: job description input */}
                {step === "job-input" && (
                    <div>
                        <p className="text-muted mb-2">
                            Paste the job description you want to match against.
                        </p>
                        <textarea
                            className="form-control"
                            rows={10}
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the full job posting here…"
                        />
                        {error && <div className="text-danger small mt-2">{error}</div>}
                        <div className="d-flex justify-content-between mt-3">
                            <Button variant="link" className="text-muted px-0" onClick={() => setStep("choose")}>
                                ← Back
                            </Button>
                            <Button variant="dark" onClick={submitJobDescription} disabled={loading}>
                                Analyze match
                            </Button>
                        </div>
                    </div>
                )}

                {/* STEP: loading */}
                {step === "loading" && (
                    <div className="text-center py-5">
                        <div className="spinner-border" role="status" />
                        <p className="text-muted mt-3 mb-0">
                            {mode === "job-description" ? "Comparing your CV against the job description…" : "Scanning your CV…"}
                        </p>
                    </div>
                )}

                {/* STEP: result */}
                {step === "result" && result && (
                    <div>
                        <div className="d-flex align-items-center gap-4 mb-4">
                            <div
                                style={{
                                    fontSize: "42px",
                                    fontWeight: 700,
                                    color: scoreTone(result.percentage ?? result.score),
                                }}
                            >
                                {result.score}
                                <span style={{ fontSize: "16px", color: "#8A9095" }}>/100</span>
                            </div>
                            <div>
                                <div className="fw-bold">{result.grade}</div>
                                {result.recommendation && (
                                    <span className="badge bg-secondary text-uppercase">
                                        {result.recommendation.replace("_", " ")}
                                    </span>
                                )}
                            </div>
                        </div>

                        {result.summary && <p className="mb-4">{result.summary}</p>}

                        {/* Job-match only: keyword analysis */}
                        {result.keyword_analysis && (
                            <div className="mb-4">
                                <h6>Keyword match</h6>
                                {result.keyword_analysis.matched?.length > 0 && (
                                    <div className="mb-2">
                                        <span className="text-muted small d-block mb-1">Matched</span>
                                        {result.keyword_analysis.matched.map((kw, i) => (
                                            <span key={i} className="badge bg-success-subtle text-success me-1 mb-1">{kw}</span>
                                        ))}
                                    </div>
                                )}
                                {result.keyword_analysis.missing_critical?.length > 0 && (
                                    <div className="mb-2">
                                        <span className="text-muted small d-block mb-1">Missing (critical)</span>
                                        {result.keyword_analysis.missing_critical.map((kw, i) => (
                                            <span key={i} className="badge bg-danger-subtle text-danger me-1 mb-1">{kw}</span>
                                        ))}
                                    </div>
                                )}
                                {result.keyword_analysis.missing_nice_to_have?.length > 0 && (
                                    <div>
                                        <span className="text-muted small d-block mb-1">Missing (nice to have)</span>
                                        {result.keyword_analysis.missing_nice_to_have.map((kw, i) => (
                                            <span key={i} className="badge bg-warning-subtle text-warning-emphasis me-1 mb-1">{kw}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Category breakdown — same shape for both modes */}
                        <div className="mb-4">
                            <h6>Breakdown</h6>
                            {Object.entries(result.categories || {}).map(([key, cat]) => {
                                const pct = Math.round((cat.score / cat.max_score) * 100);
                                return (
                                    <div key={key} className="mb-2">
                                        <div className="d-flex justify-content-between small">
                                            <span>{cat.label}</span>
                                            <span className="text-muted">{cat.score}/{cat.max_score}</span>
                                        </div>
                                        <div style={{ height: 6, background: "#EAE8E1", borderRadius: 3 }}>
                                            <div
                                                style={{
                                                    height: "100%",
                                                    width: `${pct}%`,
                                                    background: scoreTone(pct),
                                                    borderRadius: 3,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Suggestions */}
                        {result.suggestions?.length > 0 && (
                            <div>
                                <h6>Suggestions</h6>
                                {result.suggestions.map((s, i) => (
                                    <div key={i} className="border rounded p-2 mb-2">
                                        <div className="d-flex justify-content-between">
                                            <strong className="small">{s.title}</strong>
                                            <span className={`badge text-uppercase ${
                                                s.priority === "high" ? "bg-danger" : s.priority === "medium" ? "bg-warning text-dark" : "bg-success"
                                            }`}>
                                                {s.priority}
                                            </span>
                                        </div>
                                        <p className="small text-muted mb-0 mt-1">{s.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="text-end mt-3">
                            <Button variant="outline-dark" size="sm" onClick={reset}>
                                Run another check
                            </Button>
                        </div>
                    </div>
                )}

                {/* Generic error state (choose step, before any mode picked) */}
                {step === "choose" && error && (
                    <div className="text-danger small mt-3">{error}</div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default AtsCheckModal;
