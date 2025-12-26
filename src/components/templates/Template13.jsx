import React from 'react';
import demo_profile from '../../assets/images/default_avatar.jpeg';

const Template13 = ({ resumeData }) => {
  const styles = {
    body: {
      fontFamily: 'Arial, sans-serif',
      margin: 0,
      padding: 0,
      background: '#f7f7f7',
      color: '#000'
    },
    resume: {
      background: '#fff',
      width: '800px',
      margin: '40px auto',
      padding: '40px 50px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)'
    },
    headline: {
      fontSize: '15px',
      color: '#7a1e37',
      fontWeight: 'bold'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '30px'
    },
    headerBar: {
      backgroundColor: '#7a1e37',
      width: '60px',
      height: '60px',
      marginRight: '15px'
    },
    name: {
      fontSize: '28px',
      color: '#7a1e37',
      fontWeight: 'bold'
    },
    sectionTitle: {
      fontSize: '18px',
      borderBottom: '1px solid #ccc',
      paddingBottom: '5px',
      marginTop: '30px',
      color: '#000',
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
    },
    personalDetails: {
      marginTop: '10px',
      lineHeight: 1.6
    },
    personalDetailItem: {
      display: 'flex',
      marginBottom: '5px'
    },
    label: {
      width: '130px',
      fontWeight: 'bold',
      color: '#7a1e37'
    },
    summary: {
      marginTop: '10px',
      lineHeight: 1.6
    },
    sectionContent: {
      marginTop: '10px',
      lineHeight: 1.6
    },
    workExperience: {
      marginTop: '10px'
    },
    job: {
      marginBottom: '20px'
    },
    jobDate: {
      color: '#7a1e37',
      fontWeight: 'bold'
    },
    jobTitle: {
      fontWeight: 'bold'
    },
    jobCompany: {
      fontWeight: 'bold',
      color: '#000'
    },
    bulletList: {
      margin: '8px 0 0 20px',
      paddingLeft: 0
    },
    bulletItem: {
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
      marginBottom: '5px'
    },
    footer: {
      textAlign: 'center',
      fontSize: '12px',
      marginTop: '40px',
      color: '#999'
    },
    pagecontentfull : {
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
    }

  };

  return (
    <div style={styles.resume}>
      {!(resumeData?.personalDisabled) && (
        <>
      <div style={styles.header}>
        <div style={styles.headerBar}></div>
        <div style={styles.name}>
          {resumeData?.candidateName?.[0]?.firstName} {resumeData?.candidateName?.[0]?.familyName}
          <p style={styles.headline}>
          {resumeData?.headline || 'Professional title'}
        </p>
        </div>
      </div>

      {/* Personal Details */}
      <h2 style={styles.sectionTitle}>{resumeData?.personalTitle || "Personal Details"}</h2>
      <div style={styles.personalDetails}>
        <div style={styles.personalDetailItem}>
          <div style={styles.label}>Name</div>
          <div>{resumeData?.candidateName?.[0]?.firstName} {resumeData?.candidateName?.[0]?.familyName}</div>
        </div>
        {resumeData?.email?.[0] && (
          <div style={styles.personalDetailItem}>
            <div style={styles.label}>Email address</div>
            <div>{resumeData.email[0]}</div>
          </div>
        )}
        {resumeData?.phoneNumber?.[0]?.formattedNumber && (
          <div style={styles.personalDetailItem}>
            <div style={styles.label}>Phone number</div>
            <div>{resumeData.phoneNumber[0].formattedNumber}</div>
          </div>
        )}
        {resumeData?.location?.formatted && (
          <div style={styles.personalDetailItem}>
            <div style={styles.label}>Address</div>
            <div>{resumeData.location.formatted}</div>
          </div>
        )}
        {resumeData?.location?.city && (
          <div style={styles.personalDetailItem}>
            <div style={styles.label}>City</div>
            <div>{resumeData.location.city}</div>
          </div>
        )}
        {resumeData?.location?.postCode && (
          <div style={styles.personalDetailItem}>
            <div style={styles.label}>postCode</div>
            <div>{resumeData.location.postCode}</div>
          </div>
        )}
        {resumeData?.socialLinks?.github  && (
          <div style={styles.personalDetailItem}>
            <div style={styles.label}>Github</div>
            <div>{resumeData?.socialLinks?.github}</div>
            </div>
          )}
                  {resumeData?.socialLinks?.linkedin  && (
          <div style={styles.personalDetailItem}>
            <div style={styles.label}>LinkedIn</div>
            <div>{resumeData?.socialLinks?.linkedin}</div>
            </div>
          )}
                  {resumeData?.socialLinks?.website  && (
          <div style={styles.personalDetailItem}>
            <div style={styles.label}>Website</div>
            <div>{resumeData?.socialLinks?.website}</div>
            </div>
          )}
      </div>

      {/* Summary */}
      {resumeData?.summary?.paragraph && (
        <>
          <h2 style={styles.sectionTitle}>Summary</h2>
          <div style={styles.summary}>
            {resumeData.summary?.paragraph}
          </div>
        </>
      )}
</>
    )}
      {/* Work Experience */}
      {resumeData?.workExperience?.length > 0 && !(resumeData?.employmentDisabled) && (
        <>
          <h2 style={styles.sectionTitle}>{resumeData?.employmentTitle || "Employment"}</h2>
          <div style={styles.workExperience}>
            {resumeData.workExperience.map((job, index) => (
              <div key={index} style={styles.job}>
                <div style={styles.jobDate}>
                  {job.workExperienceDates?.start?.date} - {job.workExperienceDates?.end?.date || 'Present'}
                </div>
                <div style={styles.jobTitle}>{job.workExperienceJobTitle}</div>
                <div style={styles.jobCompany}>{job.workExperienceOrganization}</div>
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
          </div>
        </>
      )}

      {/* Education */}
      {resumeData?.education?.length > 0 && !(resumeData?.educationDisabled)  && (
        <>
          <h2 style={styles.sectionTitle}>{resumeData?.educationTitle || "Education"}</h2>
          <div style={styles.sectionContent}>
            {resumeData.education.map((edu, index) => (
              <div key={index} style={{ marginBottom: '20px' }}>
                <div style={styles.pagecontentfull}><strong>{edu.educationDates?.start?.date} - {edu.educationDates?.end?.date}</strong></div>
                <div style={styles.pagecontentfull}>{edu.educationLevel.label}</div>
                {edu.achievedGrade ? <div style={styles.pagecontentfull}> <div style={{display:"flex", gap:"10px"}}> <span style={{fontSize:"17px" , fontWeight:"700"}}>Grade:</span>  {edu.achievedGrade}</div></div> : ""}
                
                <div style={styles.pagecontentfull}>{edu.educationOrganization}</div>
                {edu.educationDescription && (
                  <ul style={styles.bulletList}>
                    {edu.educationDescription.split('\n').map((point, i) => (
                      <li key={i} style={styles.bulletItem}>{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </>
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
            style={styles.sectionContent}
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        </div>
      ))}
    </div>
  );
};

export default Template13;
