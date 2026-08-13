import React from "react";

const breakdown = [
  { name: "Contact info", value: 90, type: "high" },
  { name: "Professional summary", value: 15, type: "low" },
  { name: "Work experience", value: 60, type: "normal" },
  { name: "Skills", value: 35, type: "normal" },
  { name: "Education", value: 10, type: "low" },
  { name: "Keywords & verbs", value: 55, type: "normal" },
];

const foundKeywords = [
  "content creation",
  "graphic design",
  "branding",
  "social media",
  "campaign design",
  "visual content",
  "created",
  "designed",
  "managed",
  "produced",
  "developed",
];

const missingSections = [
  "professional summary",
  "skills section",
  "education",
  "quantified results",
  "complete job dates",
];

const fixes = [
  {
    title: "Add a professional summary",
    text: "A short summary at the top gives both the ATS and the recruiter an immediate read on your focus in content creation and design.",
    severity: "high",
  },
  {
    title: "Add a dedicated skills section",
    text: "Only 3 skills were detected. List them explicitly in their own section rather than folding them into experience bullets.",
    severity: "high",
  },
  {
    title: "Add an education section",
    text: "No education entries were found. Even a brief line with institution and dates helps completeness checks.",
    severity: "high",
  },
  {
    title: "Quantify your achievements",
    text: "Add numbers — reach, output, turnaround — to your 2 experience entries so impact is measurable, not just descriptive.",
    severity: "medium",
  },
  {
    title: "Fill in complete job dates",
    text: "Give each role a full start and end date so an ATS timeline check doesn't flag a gap.",
    severity: "medium",
  },
  {
    title: "Work in more keywords",
    text: "8 keyword matches is on the low side — mirror more terms from the roles you're targeting in your bullets.",
    severity: "medium",
  },
];

const ATSChecker = () => {
  const score = 59;

  return (
    <>

      <div className="ats-page">

        {/* Header */}
        <section className="ats-dark-section p-0">
          <div className="container">

            <nav className="ats-navbar d-flex justify-content-between align-items-center">

              <div className="d-flex align-items-center gap-2">
                
              </div>

              <div className="d-flex gap-2">

                <button className="btn ats-btn ats-btn-primary ats-btn-reload">
                  ↻ Re-scan
                </button>

                <button className="btn ats-btn ats-btn-primary">
                  Export report
                </button>

              </div>

            </nav>

            <header className="ats-page-head">

              <div className="ats-eyebrow">
                <span className="ats-dot"></span>
                Scan complete · Grade: Weak
              </div>

              <h1>
                Your resume scores{" "}
                <span className="ats-score-text">
                  {score}
                </span>{" "}
                out of 100 for ATS readability.
              </h1>

              <p>
                The CV presents relevant experience in content creation and
                design, but lacks key elements — a professional summary, a
                skills section, and education details — that would improve
                ATS readiness. Achievements aren't quantified and job dates
                are incomplete.
              </p>

            </header>

          </div>
        </section>


        {/* Score */}
        <section className="ats-scan-section">
          <div className="container">

            <div className="ats-scan-panel">

              {/* Gauge */}
              <div className="ats-gauge-col">

                <div className="ats-gauge">

                  <svg viewBox="0 0 160 160">

                    <circle
                      className="ats-gauge-track"
                      cx="80"
                      cy="80"
                      r="70"
                    />

                    <circle
                      className="ats-gauge-fill"
                      cx="80"
                      cy="80"
                      r="70"
                    />

                  </svg>

                  <div className="ats-gauge-center">

                    <div className="ats-gauge-number">
                      {score}
                    </div>

                    <div className="ats-gauge-of">
                      / 100
                    </div>

                  </div>

                </div>

                <div className="ats-gauge-label">
                  Weak match
                </div>

              </div>


              {/* Breakdown */}
              <div className="ats-breakdown-col">

                {breakdown.map((item, index) => (

                  <div
                    className="ats-breakdown-row"
                    key={index}
                  >

                    <div className="ats-breakdown-name">
                      {item.name}
                    </div>

                    <div className="ats-breakdown-track">

                      <div
                        className={`ats-breakdown-fill ${item.type}`}
                        data-width={`${item.value}%`}
                      />

                    </div>

                    <div className="ats-breakdown-value">
                      {item.value}
                    </div>

                  </div>

                ))}

              </div>


              {/* Document */}
              <div className="ats-xray-col">

                <div className="ats-xray-caption">
                  Live parse
                </div>

                <div className="ats-document">

                  <div className="ats-scanline"></div>

                  <div className="ats-doc-line ats-doc-name"></div>
                  <div className="ats-doc-line ats-doc-short"></div>

                  <div className="ats-doc-line ats-doc-full mt-3"></div>
                  <div className="ats-doc-line ats-doc-full"></div>
                  <div className="ats-doc-line ats-doc-short"></div>

                  <div className="ats-doc-line ats-doc-full mt-3"></div>
                  <div className="ats-doc-line ats-doc-full"></div>
                  <div className="ats-doc-line ats-doc-full"></div>
                  <div className="ats-doc-line ats-doc-short"></div>

                  <span className="ats-doc-tag ats-doc-contact">
                    CONTACT ✓
                  </span>

                  <span className="ats-doc-tag ats-doc-skills">
                    SKILLS ⚠
                  </span>

                  <span className="ats-doc-tag ats-doc-summary">
                    SUMMARY ✗
                  </span>

                </div>

                <div className="ats-xray-note">
                  reading fields as a bot would
                </div>

              </div>

            </div>

          </div>
        </section>


        {/* Keywords */}
        <section className="ats-keyword-section">
          <div className="container">

            <div className="row g-4">

              <div className="col-lg-6">

                <div className="ats-keyword-card">

                  <h3>
                    Signal found{" "}
                    <span className="ats-count">
                      8 keywords · 5 verbs
                    </span>
                  </h3>

                  <p className="ats-description">
                    Matched keywords and strong action verbs picked up in your
                    experience section.
                  </p>

                  <div className="d-flex flex-wrap gap-2">

                    {foundKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="ats-chip ats-chip-found"
                      >
                        {keyword}
                      </span>
                    ))}

                  </div>

                </div>

              </div>


              <div className="col-lg-6">

                <div className="ats-keyword-card">

                  <h3>
                    Missing sections{" "}
                    <span className="ats-count">
                      3
                    </span>
                  </h3>

                  <p className="ats-description">
                    These sections are absent, so ATS software has nothing to
                    parse for them.
                  </p>

                  <div className="d-flex flex-wrap gap-2">

                    {missingSections.map((item, index) => (
                      <span
                        key={index}
                        className="ats-chip ats-chip-missing"
                      >
                        {item}
                      </span>
                    ))}

                  </div>

                </div>

              </div>

            </div>

          </div>
        </section>


        {/* Fixes */}
        <section className="ats-scan-section">
          <div className="container">

            <div className="ats-fix-card">

              <div className="ats-fix-head d-flex justify-content-between align-items-center">

                <h3 className="mb-0">
                  Fix these before you apply
                </h3>

                <span className="ats-fix-count">
                  {fixes.length} suggestions
                </span>

              </div>


              {fixes.map((fix, index) => (

                <div
                  className="ats-fix-item"
                  key={index}
                >

                  <div
                    className={`ats-fix-severity ${fix.severity}`}
                  />

                  <div className="ats-fix-body">

                    <h4>
                      {fix.title}
                    </h4>

                    <p>
                      {fix.text}
                    </p>

                  </div>

                  <button className="btn ats-fix-btn">
                    Fix it
                  </button>

                </div>

              ))}

            </div>


            {/* Summary */}
            <div className="ats-summary-card">

              <h3>
                Summary
              </h3>

              <p>
                The CV presents relevant experience in content creation and
                design but lacks key elements such as a professional summary,
                skills, and education details that would improve ATS
                readiness. There's also a lack of quantifiable achievements
                and detailed job dates. Overall, while the candidate's
                background is relevant, enhancements are needed to meet ATS
                standards.
              </p>

            </div>


            {/* Footer */}
            <footer className="ats-footer">

              <span className="ats-footer-grade text-dark">
                Grade: weak
              </span>

              <span className="ats-footer-score text-dark">
                Score: {score} / 100
              </span>

            </footer>

          </div>
        </section>

      </div>
    </>
  );
};

export default ATSChecker;