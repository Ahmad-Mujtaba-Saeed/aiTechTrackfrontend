import React from 'react';
import demo_profile from '../../assets/images/default_avatar.jpeg';

const Template12 = ({ resumeData }) => {
  const styles = {
    resumeContainer: {
      fontFamily: 'Arial, sans-serif',
      margin: 0,
      padding: '40px',
      backgroundColor: '#fff',
      color: '#000',
    },
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      border: '1px solid #ccc',
      padding: 0,
    },
    resumeTitle: {
      textAlign: 'center',
      fontSize: '28px',
      margin: '20px 0 5px',
    },
    headline: {
      textAlign: 'center',
      fontSize: '16px',
      fontStyle: 'italic',
      color: '#444',
      marginBottom: '20px',
    },
    profileImage: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '20px',
    },
    image: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '2px solid #ccc',
    },
    section: {
      padding:"0px",
      margin: 0,
      borderTop: '5px solid #666',
    },
    sectionTitle: {
      backgroundColor: '#666',
      color: '#fff',
      fontWeight: 'bold',
      padding: '8px 12px',
      fontSize: '16px',
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
    },
    sectionContent: {
      padding: '12px',
    },
    contactParagraph: {
      margin: '5px 0',
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
    },
    jobTitle: {
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
      fontWeight: 'bold',
    },
    jobInfo: {
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
      marginBottom: '8px',
      fontSize: '14px',
      color: '#333',
    },
    date: {
      fontWeight: 'bold',
    },
    ul: {
      paddingLeft: '20px',
      margin: '8px 0',
    },
    li: {
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
      marginBottom: '6px',
    },
    pagecontentfull : {
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
    }
  };

  return (
    <div style={styles.resumeContainer}>
      <div style={styles.container}>
      {!(resumeData?.personalDisabled) && (
        <>
        {resumeData?.profilePic ? (
          <div style={styles.profileImage}>
            <img
              src={resumeData?.profilePic}
              alt="Profile"
              style={styles.image}
          />
        </div>
        ) : ""}
        <h1 style={styles.resumeTitle}>
          {resumeData?.candidateName?.[0]?.firstName} {resumeData?.candidateName?.[0]?.familyName}
        </h1>
        <p style={styles.headline}>
          {resumeData?.headline || 'Professional title'}
        </p>

        {/* Personal Details */}
        <section style={styles.section}>
          <div style={styles.sectionTitle}>{resumeData?.personalTitle || "Personal Details"}</div>
          <div style={styles.sectionContent}>
            {resumeData?.email?.[0] && (
              <p style={styles.contactParagraph}>
                <strong>Email address:</strong> {resumeData.email[0]}
              </p>
            )}
            {resumeData?.phoneNumber?.[0]?.formattedNumber && (
              <p style={styles.contactParagraph}>
                <strong>Phone number:</strong> {resumeData.phoneNumber[0].formattedNumber}
              </p>
            )}
            {resumeData?.location?.formatted && (
              <p style={styles.contactParagraph}>
                <strong>Address:</strong> {resumeData.location.formatted}
              </p>
            )}
            {resumeData?.location?.city && (
              <p style={styles.contactParagraph}>
                <strong>City:</strong> {resumeData.location.city}
              </p>
            )}
            {resumeData?.location?.postCode && (
              <p style={styles.contactParagraph}>
                <strong>Postcode:</strong> {resumeData.location.postCode}
              </p>
            )}
            {resumeData?.socialLinks?.github && (
              <p style={styles.contactParagraph}>
                <strong>Github:</strong> {resumeData?.socialLinks?.github }
              </p>
            )}
            {resumeData?.socialLinks?.linkedin && (
              <p style={styles.contactParagraph}>
                <strong>LinkedIn:</strong> {resumeData?.socialLinks?.linkedin }
              </p>
            )}
            {resumeData?.socialLinks?.website && (
              <p style={styles.contactParagraph}>
                <strong>Website:</strong> {resumeData?.socialLinks?.website }
              </p>
            )}
          </div>
        </section>

        {/* Resume Objective / Summary */}
        <section style={styles.section}>
          <div style={styles.sectionTitle}>Profile</div>
          <div style={styles.sectionContent}>
            <p>{resumeData?.summary?.paragraph || 'Professional summary goes here...'}</p>
          </div>
        </section>
        </>
        )}
        {/* Education */}
        {resumeData?.education?.length > 0  && !(resumeData?.educationDisabled) && (
          <section style={styles.section}>
            <div style={styles.sectionTitle}>{resumeData?.educationTitle || "Education"}</div>
            <div style={styles.sectionContent}>
              {resumeData.education.map((edu, index) => (
                <div key={index} style={{ marginBottom: '15px' }}>
                  <p style={styles.date}>
                    {edu.educationDates?.start?.date} - {edu.educationDates?.end?.date}
                  </p>
                  <p style={styles.jobTitle}>{edu.educationLevel?.label}</p>
                  <p style={styles.jobInfo}>{edu.educationOrganization}</p>
                  
                  {edu.achievedGrade ? <div style={styles.pagecontentfull}> <div style={{display:"flex", gap:"10px"}}> <span style={{fontSize:"17px" , fontWeight:"700"}}>Grade:</span>  {edu.achievedGrade}</div></div> : ""}
                  {edu.educationDescription && (
                    <ul style={styles.ul}>
                      {edu.educationDescription.split('\n').map((desc, i) => (
                        <li key={i} style={styles.li}>{desc}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Work Experience */}
        {resumeData?.workExperience?.length > 0 &&!(resumeData?.employmentDisabled) && (
          <section style={styles.section}>
            <div style={styles.sectionTitle}>{resumeData?.employmentTitle || "Work Experience"}</div>
            <div style={styles.sectionContent}>
              {resumeData.workExperience.map((job, index) => (
                <div key={index} style={{ marginBottom: '15px' }}>
                  <p style={styles.date}>
                    {job.workExperienceDates?.start?.date} - {job.workExperienceDates?.end?.date || 'Present'}
                  </p>
                  <p style={styles.jobTitle}>{job.workExperienceJobTitle}</p>
                  <p style={styles.jobInfo}>{job.workExperienceOrganization}</p>
                  <p>{job.workExperienceDescription ?? ""}</p>
                  <h5>Key Achievements</h5>
                  {job.highlights?.items?.length > 0 && (
                    <ul style={styles.ul}>
                      {job.highlights.items.map((point, i) => (
                        <li key={i} style={styles.li}>{point.bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {!(resumeData?.skillsDisabled) && (resumeData?.skill?.length > 0) && (
          <div style={{ marginBottom: '30px' }}>
            <h2 style={styles.sectionTitle}>
              {resumeData?.skillsTitle || 'Skills'}
            </h2>
            <ul style={styles.sidebarList}>
              {(resumeData?.skill || [])
                .filter(skill => skill.selected)
                .map((skill, index) => (
                  <li key={index} style={styles.sidebarListItem}>
                     {skill.name || skill}
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Languages */}
        {resumeData?.languages?.length > 0 && !(resumeData?.languagesDisabled) && (
          <div style={styles.leftColumn}>
            <h2 style={styles.sectionTitle}>
              {resumeData?.languagesTitle || 'Languages'}
            </h2>
            <ul style={styles.bulletList}>
              {(resumeData?.languages || []).map((language, index) => (
            <li key={index} style={styles.sidebarListItem}>
               {language.name} ({language.level})
            </li>
               ))}
            </ul>
          </div>
          )}

        {/* Hobbies */}
        {resumeData?.hobbies?.length > 0 && !(resumeData?.hobbiesDisabled) && (
          <div style={styles.leftColumn}>
            <h2 style={styles.sectionTitle}>
              {resumeData?.hobbiesTitle || 'Hobbies'}
            </h2>
            <ul style={styles.sidebarList}>
              {(resumeData?.hobbies || []).map((hobby, idx) => (
                <li style={styles.sidebarListItem} key={idx}>{hobby}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Custom Sections */}

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

export default Template12;
