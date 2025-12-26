import React from 'react';
import demo_profile from '../../assets/images/default_avatar.jpeg';

const Template11 = ({ resumeData }) => {
  const styles = {
    resumeContainer: {
      fontFamily: 'Arial, sans-serif',
      padding: '30px',
      backgroundColor: '#fff',
      color: '#000',
      lineHeight: 1.6,
      maxWidth: '900px',
      margin: '0 auto',
    },
    resumeTitle: {
      textAlign: 'left',
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    headline: {
      fontSize: '16px',
      fontStyle: 'italic',
      color: '#444',
      marginBottom: '10px',
    },
    horizontalRule: {
      border: 'none',
      borderTop: '4px solid #000',
      margin: '20px 0',
    },
    section: {
      padding:"0px",
      marginBottom: '20px',
    },
    sectionTitle: {
      backgroundColor: '#000',
      color: '#fff',
      padding: '6px 10px',
      fontSize: '14px',
      fontWeight: 'bold',
      display: 'inline-block',
      marginBottom: '10px',
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
    },
    detailText: {
      margin: '2px 0',
      fontSize: '14px',
    },
    summary: {
      fontSize: '14px',
      marginTop: '10px',
    },
    eduItem: {
      marginBottom: '20px',
    },
    eduInstitution: {
      fontWeight: 'bold',
      fontSize: '14px',
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
    },
    eduLocation: {
      fontStyle: 'italic',
      fontSize: '13px',
      marginBottom: '5px',
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
    },
    eduDate: {
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
      fontSize: '13px',
    },
    bulletList: {
      marginTop: '5px',
      paddingLeft: '18px',
    },
    bulletItem: {
      fontSize: '13px',
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
      marginBottom: '4px',
    },
    italicLabel: {
      fontStyle: 'italic',
      fontSize: '13px',
      marginBottom: '4px',
    },
    employmentItem: {
      marginBottom: '20px',
    },
    jobTitle: {
      fontWeight: 'bold',
      fontSize: '14px',
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
    },
    jobOrg: {
      fontSize: '13px',
      color: '#666',
      marginBottom: '4px',
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
    },
    jobDate: {
      fontSize: '13px',
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
    },
    pagecontentfull : {
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
    }
  };

  return (
    <div style={styles.resumeContainer}>
      <h1 style={styles.resumeTitle}>
        {resumeData?.candidateName?.[0]?.firstName} {resumeData?.candidateName?.[0]?.familyName}
      </h1>
      <p style={styles.headline}>
          {resumeData?.headline || 'Professional title'}
        </p>
      <hr style={styles.horizontalRule} />

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>{resumeData?.personalTitle || "Personal details"}</h2>
        <div style={styles.personalDetails}>
          {resumeData?.location?.formatted && (
            <div style={styles.detailItem}>
              <span style={styles.label}>Address:</span> {resumeData.location.formatted}
            </div>
          )}
          {resumeData?.location?.city && (
            <div style={styles.detailItem}>
              <span style={styles.label}>City:</span> {resumeData.location.city}
            </div>
          )}
          {resumeData?.location?.postCode && (
            <div style={styles.detailItem}>
              <span style={styles.label}>Postcode:</span> {resumeData.location.postCode}
            </div>
          )}
          {resumeData?.email?.[0] && (
            <div style={styles.detailItem}>
              <span style={styles.label}>Email address:</span> {resumeData.email[0]}
            </div>
          )}
          {resumeData?.phoneNumber?.[0]?.formattedNumber && (
            <div style={styles.detailItem}>
              <span style={styles.label}>Phone number:</span> {resumeData.phoneNumber[0].formattedNumber}
            </div>
          )}
          {resumeData?.socialLinks?.github  && (
            <div style={styles.detailItem}>
              <span style={styles.label}>Github:</span> {resumeData?.socialLinks?.github }
            </div>
          )}
          {resumeData?.socialLinks?.linkedin  && (
            <div style={styles.detailItem}>
              <span style={styles.label}>Linkedin:</span> {resumeData?.socialLinks?.linkedin }
            </div>
          )}
          {resumeData?.socialLinks?.website  && (
            <div style={styles.detailItem}>
              <span style={styles.label}>Website:</span> {resumeData?.socialLinks?.website }
            </div>
          )}
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Summary</h2>
        <p style={styles.summary}>
          {resumeData?.summary?.paragraph || 'Professional summary goes here...'}
        </p>
      </section>

    {!(resumeData?.educationDisabled) && (resumeData?.education?.length > 0) && (
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>{resumeData?.educationTitle || "Education"}</h2>
        {resumeData?.education?.map((edu, index) => (
          <div key={index} style={styles.eduItem}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong style={styles.eduInstitution}>
                {edu.educationLevel.label}
                {edu.educationAreaOfStudy && `, ${edu.educationAreaOfStudy}`}
              </strong>
              {edu.educationDates && (
                <span style={styles.eduDate}>
                  {edu.educationDates.start?.date} - {edu.educationDates.end?.date || 'Present'}
                </span>
              )}
            </div>
            {edu.educationOrganization && (
              <div style={styles.eduLocation}>{edu.educationOrganization}</div>
            )}



{edu?.achievedGrade ? (
                <strong style={styles.eduInstitution}>
                
                Grade: { ` ${edu.achievedGrade}`}
              </strong>
              ) : <></>}
            {edu.educationDescription && (
              <>
                <p style={styles.italicLabel}>
                  <strong><u>Notable Coursework</u></strong>
                </p>
                <ul style={styles.bulletList}>
                  {edu.educationDescription.split('\n').map((item, i) => (
                    <li key={i} style={styles.bulletItem}>{item}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ))}
      </section>
      )}


      {!(resumeData?.employmentDisabled) && (resumeData?.workExperience?.length > 0) && (
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>{resumeData?.employmentTitle || "Employment"}</h2>
        {resumeData?.workExperience?.map((job, index) => (
          <div key={index} style={styles.employmentItem}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={styles.jobTitle}>{job.workExperienceJobTitle}</div>
              <div style={styles.jobDate}>
                {job.workExperienceDates?.start?.date} - {job.workExperienceDates?.end?.date || 'Present'}
              </div>
            </div>
            <div style={styles.jobOrg}>{job.workExperienceOrganization}</div>
            <p>{job.workExperienceDescription ?? ""}</p>
            <h5>Key Achievements</h5>
            {job.highlights?.items?.length > 0 && (
              <ul style={styles.bulletList}>
                {job.highlights.items.map((point, i) => (
                  <li key={i} style={styles.bulletItem}>{point.bullet}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>
      )}

      {resumeData?.skill?.length > 0 && !(resumeData?.skillsDisabled) && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>{resumeData?.skillsTitle || "Skills"}</h2>
          <ul style={styles.bulletList}>
          {(resumeData?.skill || []).filter(skill => skill.selected).map((skill, index) => (
              <li key={index} style={styles.bulletItem}>
                <strong>{skill.name}</strong>
              </li>
            ))}
          </ul>
        </section>
      )}

      {resumeData?.languages?.length > 0 && !(resumeData?.languagesDisabled) && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>{resumeData?.languagesTitle || 'Languages'}</h2>
          {resumeData.languages.map((lang, idx) => {
            return (
              <div key={idx} style={styles.languageItem}>
                 <li key={idx} style={styles.bulletItem}>
                <strong>{lang.name}:</strong> {lang.level}
              </li>
              </div>
            );
          })}
        </section>
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


      {resumeData?.customSections?.map((section, index) => (
        <div key={index} style={{ marginBottom: index === resumeData.customSections.length - 1 ? '5px' : '20px' }}>
          <h2 style={styles.sectionTitle}>{section.title}</h2>
          <div
            style={{ marginTop: "15px" }}
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        </div>
      ))}
    </div>
  );
};

export default Template11;
