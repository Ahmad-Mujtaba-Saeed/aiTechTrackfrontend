import React from 'react';
import demo_profile from '../../assets/demo_profile.avif';

const Template6 = ({ resumeData }) => {
  const styles = {
    container: {
      maxWidth: "850px",
      margin: "0 auto",
      padding: "40px",
      fontFamily: "'Segoe UI', Tahoma, sans-serif",
      background: "#fff",
      lineHeight: "1.6",
    },
    header: {
      fontSize: "14px",
      color: "#333",
      marginBottom: "20px",
    },
    candidateHeadline: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#2585E0",
      margin: "10px 0 4px",
    },
    headlineText: {
      fontSize: "15px",
      fontWeight: "500",
      color: "#000",
      marginBottom: "20px",
    },
    sectionTitle: {
      fontSize: "15px",
      fontWeight: "600",
      color: "#2585E0",
      margin: "20px 0 8px",
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
    },
    profile: {
      fontSize: "14px",
      color: "#333",
      marginBottom: "20px",
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
    },
    leftColumn: {
      width: "100%",
    },
    rightColumn: {
      width: "100%",
    },
    bulletList: {
      margin: "6px 0 0 18px",
      padding: 0,
      fontSize: "14px",
      color: "#333",
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
    },
    jobTitle: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#2585E0",
      margin: "0 0 2px",
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
    },
    company: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#000",
      margin: "0 0 6px",
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
    },
    date: {
      fontSize: "13px",
      color: "#777",
      marginBottom: "8px",
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
    },
    pagecontentfull: {
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        {resumeData?.candidateName?.[0]?.firstName}{" "}
        {resumeData?.candidateName?.[0]?.familyName ? ` ${resumeData?.candidateName?.[0]?.familyName}` : ''}
        {resumeData?.email?.[0] ? ` | ${resumeData?.email?.[0]}` : ''}
        {resumeData?.phoneNumber?.[0]?.formattedNumber ? ` | ${resumeData?.phoneNumber?.[0]?.formattedNumber}` : ''}
        {resumeData?.location?.formatted ? ` | ${resumeData.location?.formatted}` : ''}
        {resumeData?.location?.city ? ` ${resumeData.location?.city}` : ''}
        {resumeData?.location?.postCode ? ` (${resumeData.location?.postCode})` : ''}
        <br></br>
        {resumeData?.socialLinks?.github ? ` Github: ${resumeData.socialLinks.github}` : ''}
        <br></br>
        {resumeData?.socialLinks?.linkedin ? ` LinkedIn: ${resumeData.socialLinks.linkedin}` : ''}
        <br></br>
        {resumeData?.socialLinks?.website ? ` Website: ${resumeData.socialLinks.website}` : ''}
      </div>

      {/* Candidate Headline */}
      {resumeData?.headline ? <>
        <h2 style={styles.candidateHeadline}>Candidate Headline</h2>
      <p style={styles.headlineText}>
        {resumeData?.headline || "Results-Driven Partnerships & Client Success Leader"}
      </p>
      </>: ""}


      {/* Profile */}
      {resumeData?.summary?.paragraph ? <>      <h2 style={styles.sectionTitle}>Profile</h2>
      <p style={styles.profile}>
        {resumeData?.summary?.paragraph}
      </p>
      </>: ""}


      {/* Two Column Layout */}
      <div style={styles.twoColumn}>
        {/* Left Column */}
        {resumeData?.skill?.length > 0 && !(resumeData?.skillsDisabled) && (
        <div style={styles.leftColumn}>
          <h2 style={styles.sectionTitle}>{resumeData?.skillsTitle || 'Key Skills'}</h2>
          <ul style={styles.bulletList}>
            {(resumeData?.skill).map((skill, index) => (
          <li key={index} style={styles.sidebarListItem}>
             {skill.name || skill}
          </li>
             ))}
          </ul>
        </div>
        )}

        {/* Right Column */}
        {resumeData?.workExperience?.length > 0 && !(resumeData?.employmentDisabled) && (
        <div style={styles.rightColumn}>
          <h2 style={styles.sectionTitle}>{resumeData?.employmentTitle || 'Experience'}</h2>
          {(resumeData?.workExperience).map((job, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <p style={styles.jobTitle}>
                {job.workExperienceJobTitle} | {job.workExperienceOrganization}
              </p>
              <p style={styles.date}>
                  {job.workExperienceDates?.start?.date} - {job.workExperienceDates?.end?.date || 'Present'}
              </p>
              <p style={styles.profile}>
                {job.workExperienceDescription}
              </p>
                {job.highlights?.items?.length > 0 && (
               <ul style={styles.bulletList}>
                   {job.highlights.items.map((point, i) => (
                      <li key={i} style={styles.bulletItem}>{point.bullet}</li>
                    ))}
                 </ul>
                )}
            </div>
          ))}
        </div>
        )}
        {resumeData?.education?.length > 0 && !(resumeData?.educationDisabled) && (
        <div style={styles.rightColumn}>
          <h2 style={styles.sectionTitle}>{resumeData?.educationTitle || 'Education'}</h2>
          {(resumeData?.education).map((edu, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <p style={styles.jobTitle}>
                {edu.educationLevel.label} | {edu.educationOrganization}
              </p>
              {edu.educationMajor.length > 0 ? (
                <>
                  <div className='d-flex' style={styles.pagecontentfull}>
                    <div>
                       Subjects : 
                    </div>
                    <div className='ms-1'>
                      {edu.educationMajor.map((major, i) => (
                        <span key={i}> {i > 0 ? ', ' : ''}{major}</span>
                      ))}
                    </div>
                  </div>
                  {/* <br /> */}
                </>
              ) : ""}
              {edu.achievedGrade ? (
                <>
                  <div className='d-flex' style={styles.pagecontentfull}>
                    <div>
                      Grade : 
                    </div>
                    <div className='ms-1'>
                      {edu.achievedGrade}
                    </div>
                  </div>
                  {/* <br /> */}
                </>
              ) : ""}
              
              <p style={styles.date}>
                  {edu.educationDates?.start?.date} - {edu.educationDates?.end?.date}
              </p>
              <p style={styles.profile}>
                {edu.educationDescription}
              </p>
            </div>
          ))}
        </div>
        )}

        {/* Hobbies */}
        {resumeData?.hobbies?.length > 0 && !(resumeData?.hobbiesDisabled) && (
          <div style={styles.leftColumn}>
            <h2 style={styles.sectionTitle}>
              {resumeData?.hobbiesTitle || 'Hobbies'}
            </h2>
            <ul style={styles.sidebarList}>
              {resumeData.hobbies.map((hobby, idx) => (
                <li style={styles.sidebarListItem} key={idx}>{hobby}</li>
              ))}
            </ul>
          </div>
        )}

        {resumeData?.languages?.length > 0 && !(resumeData?.languagesDisabled) && (
          <div style={styles.leftColumn}>
            <h2 style={styles.sectionTitle}>{resumeData?.languagesTitle || 'Languages'}</h2>
            <ul style={styles.bulletList}>
              {(resumeData?.languages).map((language, index) => (
            <li key={index} style={styles.sidebarListItem}>
               {language.name} ({language.level})
            </li>
               ))}
            </ul>
          </div>
          )}

        {resumeData?.customSections?.map((section, index) => (
          <div key={index} style={{ marginBottom: index === resumeData.customSections.length - 1 ? '5px' : '20px' }}>
            <h2 style={styles.sectionTitle}>{section.title}</h2>
            <div 
              style={styles.profileText}
              dangerouslySetInnerHTML={{ __html: section.content }} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Template6;
