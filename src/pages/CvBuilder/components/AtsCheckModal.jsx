import React, { useState, useRef, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "../../../api/axios";

/**
 * Step machine:
 *   choose        -> pick "skills" or "job-description"
 *   skills-input  -> tag/chip input for skills (new step before analysis)
 *   job-input     -> paste job description
 *   loading       -> API call in flight
 *   result        -> render results
 */
const AtsCheckModal = ({ show, onHide, resumeId, savedJobDescription }) => {
    const [step, setStep] = useState("choose");
    const [mode, setMode] = useState(null); // 'skills' | 'job-description'
    const [jobDescription, setJobDescription] = useState(savedJobDescription || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);

    // Skills tag input state
    const [skills, setSkills] = useState([]);
    const [skillEntry, setSkillEntry] = useState("");
    const [skillInputFocused, setSkillInputFocused] = useState(false);
    const skillInputRef = useRef(null);

    const reset = () => {
        setStep("choose");
        setMode(null);
        setError("");
        setResult(null);
        setLoading(false);
        setSkills([]);
        setSkillEntry("");
    };

    const handleClose = () => {
        reset();
        onHide();
    };

    // Modal title based on current step
    const modalTitle = () => {
        if (step === "skills-input") return "Score my CV";
        if (step === "job-input") return "Match against a job description";
        if (step === "result") return mode === "job-description" ? "Job Match Results" : "ATS Scan Results";
        return "ATS Check";
    };

    // ── Choose step ──────────────────────────────────────────
    const chooseSkills = () => {
        setMode("skills");
        setStep("skills-input");
    };

    const chooseJobDescription = () => {
        setMode("job-description");
        setStep("job-input");
    };

    // ── Skills tag input ──────────────────────────────────────
    const addSkill = (raw) => {
        const val = raw.trim().replace(/,+$/, "").trim();
        if (val && !skills.includes(val)) {
            setSkills((prev) => [...prev, val]);
        }
        setSkillEntry("");
    };

    const removeSkill = (idx) => {
        setSkills((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleSkillKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addSkill(skillEntry);
        } else if (e.key === "Backspace" && skillEntry === "" && skills.length > 0) {
            setSkills((prev) => prev.slice(0, -1));
        }
    };

    const handleSkillBlur = () => {
        if (skillEntry.trim()) addSkill(skillEntry);
        setSkillInputFocused(false);
    };

    const submitSkills = () => {
        // flush any pending entry
        const pending = skillEntry.trim().replace(/,+$/, "").trim();
        const finalSkills = pending && !skills.includes(pending)
            ? [...skills, pending]
            : skills;

        if (finalSkills.length === 0) {
            if (skillInputRef.current) {
                skillInputRef.current.placeholder = "Please add at least one skill first...";
                skillInputRef.current.focus();
            }
            return;
        }

        if (pending) setSkills(finalSkills);
        setSkillEntry("");
        runAnalysis("skills", finalSkills);
    };

    // ── Job description ───────────────────────────────────────
    const submitJobDescription = () => {
        if (jobDescription.trim().length < 40) {
            setError("Paste the full job description — a title alone isn't enough (minimum 40 characters).");
            return;
        }
        setError("");
        runAnalysis("job-description");
    };

    // ── API call ──────────────────────────────────────────────
    const runAnalysis = async (activeMode, skillsList = skills) => {
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
                    : { skills: skillsList };

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
                setMode("job-description");
                setStep("job-input");
                setError(apiMessage || "Please provide a job description first.");
            } else {
                setError(apiMessage || "Something went wrong while analyzing your CV. Please try again.");
                setStep(activeMode === "job-description" ? "job-input" : "skills-input");
                toast.error(apiMessage || "ATS analysis failed.");
            }
        } finally {
            setLoading(false);
        }
    };

    // ── Helpers ───────────────────────────────────────────────
    const barColor = (pct) => (pct >= 70 ? "#221C16" : "#F4762A");

    const priorityClass = (p) => {
        if (p === "high") return "ats-badge-high";
        if (p === "medium") return "ats-badge-medium";
        return "ats-badge-low";
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg" backdrop="static" className="ats-check-modal">
            <Modal.Header closeButton className="ats-modal-header">
                <Modal.Title className="ats-modal-title">
                    {modalTitle()}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="ats-modal-body">

                {/* ── CHOOSE ── */}
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

                {/* ── SKILLS INPUT ── */}
                {step === "skills-input" && (
                    <div>
                        <p className="ats-step-lead">
                            Add the skills you'd like highlighted in your CV (e.g. React, Figma, Excel, Communication). Press Enter or comma to add each one.
                        </p>

                        <div className="ats-field">
                            <label className="ats-field-label">Skills</label>
                            <div
                                className={`ats-tag-input${skillInputFocused ? " focused" : ""}`}
                                onClick={() => skillInputRef.current?.focus()}
                            >
                                {skills.map((s, i) => (
                                    <span key={i} className="ats-chip">
                                        {s}
                                        <button
                                            type="button"
                                            className="ats-chip-remove"
                                            onClick={(e) => { e.stopPropagation(); removeSkill(i); }}
                                            aria-label={`Remove ${s}`}
                                        >
                                            &times;
                                        </button>
                                    </span>
                                ))}
                                <input
                                    ref={skillInputRef}
                                    type="text"
                                    className="ats-tag-input-field"
                                    value={skillEntry}
                                    placeholder={skills.length === 0 ? "Please add at least one skill first..." : "Add another skill..."}
                                    onChange={(e) => setSkillEntry(e.target.value)}
                                    onKeyDown={handleSkillKeyDown}
                                    onFocus={() => setSkillInputFocused(true)}
                                    onBlur={handleSkillBlur}
                                />
                            </div>
                            <div className="ats-hint">Adding at least 3–4 skills gives a more accurate analysis.</div>
                        </div>

                        {error && <div className="ats-error mb-3">{error}</div>}

                        <div className="ats-row-actions">
                            <button
                                type="button"
                                className="ats-btn-primary"
                                onClick={submitSkills}
                                disabled={loading}
                            >
                                Run Analysis
                            </button>
                        </div>
                    </div>
                )}

                {/* ── JOB DESCRIPTION INPUT ── */}
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
                                placeholder="Paste the full job posting description here..."
                            />
                        </div>

                        {error && <div className="ats-error mb-3">{error}</div>}

                        <div className="ats-row-actions">
                            <button
                                type="button"
                                className="ats-btn-primary"
                                onClick={submitJobDescription}
                                disabled={loading}
                            >
                                Run Analysis
                            </button>
                        </div>
                    </div>
                )}

                {/* ── LOADING ── */}
                {step === "loading" && (
                    <div className="text-center py-5">
                        <div className="spinner-border" role="status" style={{ color: "#F4762A" }} />
                        <p className="ats-choose-subtitle mt-3 mb-0">
                            {mode === "job-description"
                                ? "Comparing your CV against the job description…"
                                : "Scanning your CV…"}
                        </p>
                    </div>
                )}

                {/* ── RESULT ── */}
                {step === "result" && result && (
                    <div>
                        {/* Score row */}
                        <div className="ats-score-row">
                            <span className="ats-score-num">{result.score}</span>
                            <span className="ats-score-max">/100</span>
                            <span className="ats-score-badge">{result.grade}</span>
                        </div>

                        {result.summary && (
                            <p className="ats-summary-text">{result.summary}</p>
                        )}

                        {/* Breakdown */}
                        {result.categories && Object.keys(result.categories).length > 0 && (
                            <div className="ats-block">
                                <div className="ats-block-title">Breakdown</div>
                                {Object.entries(result.categories).map(([key, cat]) => {
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
                                                        background: barColor(pct),
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Suggestions */}
                        {result.suggestions?.length > 0 && (
                            <div className="ats-block">
                                <div className="ats-block-title">Suggestions</div>
                                <div className="ats-suggestion-list">
                                    {result.suggestions.map((s, i) => (
                                        <div key={i} className="ats-suggestion-card">
                                            <div className="ats-suggestion-head">
                                                <strong className="ats-suggestion-title">{s.title}</strong>
                                                <span className={`ats-priority-badge ${priorityClass(s.priority)}`}>
                                                    {s.priority}
                                                </span>
                                            </div>
                                            <p className="ats-suggestion-desc">{s.description}</p>
                                            {s.priority !== "high" && (
                                                <div className="ats-suggestion-foot">
                                                    <button type="button" className="ats-edit-btn">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                                        </svg>
                                                        Edit
                                                    </button>
                                                </div>
                                            )}
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
