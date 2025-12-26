import React from "react";

const ClassicCoverLetterTemplate = ({ coverLetter }) => {
  if (!coverLetter) return null;

  const { header, recipient, body } = coverLetter;

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        lineHeight: "1.6",
        color: "#333",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ margin: "0", fontSize: "20px", fontWeight: "600" }}>
            {header?.applicant_name}
          </h2>
          <p style={{ margin: "3px 0" }}>{header?.applicant_address}</p>
          <p style={{ margin: "3px 0" }}>{header?.applicant_email}</p>
          <p style={{ margin: "3px 0" }}>{header?.applicant_phone}</p>
          <p style={{ margin: "10px 0 0 0", fontStyle: "italic" }}>
            {header?.date}
          </p>
        </div>

        {/* Recipient */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ margin: "3px 0" }}>{recipient?.hiring_manager_name}</p>
          <p style={{ margin: "3px 0" }}>{recipient?.company_name}</p>
          <p style={{ margin: "3px 0" }}>{recipient?.company_address}</p>
        </div>

        {/* Body */}
        <div style={{ marginBottom: "20px" }}>
          <p>{body?.greeting}</p>
          <p>{body?.opening_paragraph}</p>

          {body?.middle_paragraphs &&
            body?.middle_paragraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}

          <p>{body?.closing_paragraph}</p>
          <p style={{ marginTop: "30px" }}>{body?.signature}</p>
        </div>
      </div>
    </div>
  );
};

export default ClassicCoverLetterTemplate;
