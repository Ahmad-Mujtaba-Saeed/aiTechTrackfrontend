import React from 'react';
import demo_profile from '../../assets/demo_profile.avif';

const Template10 = ({ resumeData }) => {
    const styles = {
        resumeContainer: {
          fontFamily: 'Arial, sans-serif',
          padding: '40px',
          backgroundColor: '#fff',
          color: '#000',
          lineHeight: 1.6,
          maxWidth: '900px',
          margin: '0 auto'
        },
        resumeTitle: {
          textAlign: 'center',
          fontSize: '32px',
          marginBottom: '30px'
        },
        section: {
          marginBottom: '20px'
        },
        sectionTitle: {
          color: '#008060',
          fontSize: '20px',
          marginTop: '30px',
          
          pageBreakInside: "avoid",
          pageBreakBefore: "auto",
          pageBreakAfter: "auto",
          borderBottom: '1px solid #ccc',
          paddingBottom: '5px'
        },
        personalDetails: {
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        },
        detailItem: {
          display: 'flex',
          gap: '10px'
        },
        label: {
          fontWeight: 'bold',
          width: '150px'
        },
        summary: {
          marginTop: '10px'
        },
        job: {
          marginBottom: '20px',
          display: 'flex'
        },
        jobHeader: {
          display: 'flex',
          justifyContent: 'space-between',
          fontWeight: 'bold',
          width: '30%'
        },
        jobTitle: {
          pageBreakInside: "avoid",
          pageBreakBefore: "auto",
          pageBreakAfter: "auto",
          color: '#000',
          fontWeight: 'bold'
        },
        jobCompany: {
          pageBreakInside: "avoid",
          pageBreakBefore: "auto",
          pageBreakAfter: "auto",
          color: '#008060'
        },
        bulletList: {
          margin: '8px 0 0 20px',
          paddingLeft: '18px' // to match UL indent
        },
        bulletItem: {
          
          pageBreakInside: "avoid",
          pageBreakBefore: "auto",
          pageBreakAfter: "auto",
          marginBottom: '4px'
        },
        education: {

          marginTop: '10px'
        },
        skillsRow: {
          
          pageBreakInside: "avoid",
          pageBreakBefore: "auto",
          pageBreakAfter: "auto",
          display: 'flex',
          justifyContent: 'space-between'
        },
        skillsLabel: {
          fontWeight: 'bold',
          width: '30%'
        },
        pagecontentfull : {
          pageBreakInside: "avoid",
          pageBreakBefore: "auto",
          pageBreakAfter: "auto",
        }
      };
      

<style>
    
</style>
  return (
    // <div style={styles.container}>
    //   <div style={styles.wrapper}>
    //     {/* Header with name and photo */}
    //     <div style={styles.header}>
    //       <div>
    //         <h1 style={styles.nameTitle}>
    //           {resumeData?.candidateName?.[0]?.firstName} {resumeData?.candidateName?.[0]?.familyName}
    //         </h1>
    //         <p style={styles.subtitle}>
    //           {resumeData?.headline || 'Professional title'}
    //         </p>
    //       </div>
    //       <div style={styles.profileImage}>
    //         <img 
    //           src={resumeData?.profilePic || demo_profile} 
    //           alt="Profile" 
    //           style={styles.image} 
    //         />
    //       </div>
    //     </div>

    //     {/* Personal Details */}
    //     <h2 style={styles.sectionTitle}>Personal details</h2>
    //     <table style={styles.detailsTable}>
    //       <tbody>
    //         <tr>
    //           <td style={styles.tableLabel}>Name</td>
    //           <td style={styles.tableValue}>
    //             {resumeData?.candidateName?.[0]?.firstName} {resumeData?.candidateName?.[0]?.familyName}
    //           </td>
    //         </tr>
    //         {resumeData?.email?.[0] && (
    //           <tr>
    //             <td style={styles.tableLabel}>Email address</td>
    //             <td style={styles.tableValue}>{resumeData.email[0]}</td>
    //           </tr>
    //         )}
    //         {resumeData?.phoneNumber?.[0]?.formattedNumber && (
    //           <tr>
    //             <td style={styles.tableLabel}>Phone number</td>
    //             <td style={styles.tableValue}>{resumeData.phoneNumber[0].formattedNumber}</td>
    //           </tr>
    //         )}
    //         {resumeData?.location?.formatted && (
    //           <tr>
    //             <td style={styles.tableLabel}>Address</td>
    //             <td style={styles.tableValue}>{resumeData.location.formatted}</td>
    //           </tr>
    //         )}
    //         {resumeData?.website?.[0] && (
    //           <tr>
    //             <td style={styles.tableLabel}>LinkedIn</td>
    //             <td style={styles.tableValue}>
    //               {resumeData.website[0].replace(/^https?:\/\//, '')}
    //             </td>
    //           </tr>
    //         )}
    //       </tbody>
    //     </table>

    //     {/* Profile Summary */}
    //     <h2 style={styles.sectionTitle}>Profile</h2>
    //     <p style={styles.profileText}>
    //       {resumeData?.summary || 'Professional summary goes here...'}
    //     </p>

    //     {/* Employment History */}
    //     <h2 style={styles.sectionTitle}>Employment</h2>
    //     {resumeData?.workExperience?.map((job, index) => (
    //       <div key={index} style={{ marginBottom: index === resumeData.workExperience.length - 1 ? '5px' : '20px' }}>
    //         <p style={styles.jobPeriod}>
    //           {job.workExperienceDates?.start?.date} - {job.workExperienceDates?.end?.date || 'Present'}
    //         </p>
    //         <p style={styles.jobTitle}>{job.workExperienceJobTitle}</p>
    //         <p style={styles.company}>{job.workExperienceOrganization}</p>
    //         {job.workExperienceDescription && (
    //           <ul style={styles.bulletList}>
    //             {job.workExperienceDescription.split('\n').map((item, i) => (
    //               <li key={i} style={styles.bulletItem}>{item}</li>
    //             ))}
    //           </ul>
    //         )}
    //       </div>
    //     ))}

    //     {/* Education */}
    //     <h2 style={styles.sectionTitle}>Education</h2>
    //     {resumeData?.education?.map((edu, index) => (
    //       <div key={index} style={{ marginBottom: index === resumeData.education.length - 1 ? '5px' : '20px' }}>
    //         <p style={styles.jobPeriod}>
    //           {edu.educationDates?.start?.date} - {edu.educationDates?.end?.date}
    //         </p>
    //         <p style={styles.jobTitle}>{edu.educationAccreditation}</p>
    //         <p style={styles.company}>{edu.educationOrganization}</p>
    //         {edu.educationDescription && (
    //           <ul style={styles.bulletList}>
    //             {edu.educationDescription.split('\n').map((item, i) => (
    //               <li key={i} style={styles.bulletItem}>{item}</li>
    //             ))}
    <div style={styles.resumeContainer}>
      <h1 style={styles.resumeTitle}>
        {resumeData?.candidateName?.[0]?.firstName} {resumeData?.candidateName?.[0]?.familyName}
      </h1>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>{resumeData?.personalTitle || "Personal details"}</h2>
        <div style={styles.personalDetails}>
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
          {/* {resumeData?.website?.[0] && (
            <div style={styles.detailItem}>
              <span style={styles.label}>LinkedIn:</span> {resumeData.website[0].replace(/^https?:\/\//, '')}
            </div>
          )} */}
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Summary</h2>
        <p style={styles.summary}>
          {resumeData?.summary || 'Professional summary goes here...'}
        </p>
      </section>


{resumeData?.employmentDisabled && (
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>{resumeData?.employmentTitle || "Work Experience"}</h2>
        {resumeData?.workExperience?.map((job, index) => (
          <div key={index} style={styles.job}>
            <div style={styles.jobHeader}>
              <div className="job-dates">
                {job.workExperienceDates?.start?.date} - {job.workExperienceDates?.end?.date || 'Present'}
              </div>
            </div>
            <div>
              <div style={styles.jobTitle}>{job.workExperienceJobTitle}</div>
              <div style={styles.jobCompany}>{job.workExperienceOrganization}</div>
              {job.workExperienceDescription && (
                <ul style={styles.bulletList}>
                  {job.workExperienceDescription.split('\n').map((item, i) => (
                    <li key={i} style={styles.bulletItem}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </section>
      )}

{resumeData?.educationDisabled && (
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>{resumeData?.educationTitle || "Education"}</h2>
        {resumeData?.education?.map((edu, index) => (
          <div key={index} style={styles.education}>
            <strong>{edu.educationLevel.label}</strong>
            <p style={styles.pagecontentfull}>
              {edu.educationOrganization}<br />

              {edu.achievedGrade ? (
                <>
                <div>
                Grade:
                </div>
                <div>
                {edu.achievedGrade}
                </div>
                <br/>
             </>
            ) : ""}
              {edu.educationDates?.start?.date} - {edu.educationDates?.end?.date}
              {edu.educationDescription && (
                <ul style={styles.bulletList}>
                  {edu.educationDescription.split('\n').map((item, i) => (
                    <li key={i} style={styles.bulletItem}>{item}</li>
                  ))}
                </ul>
              )}
            </p>
          </div>
        ))}
      </section>
      )}


{resumeData?.skillsDisabled && (
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>{resumeData?.skillsTitle || "Skills"}</h2>
        <div className="skills-column">
        {(resumeData?.skill || []).filter(skill => skill.selected).map((skill, index) => (
            <div key={index} style={styles.skillsRow}>
              <span style={styles.skillsLabel}>{skill.name}</span>
              <span>{skill.level || 'Proficient'}</span>
            </div>
          ))}
        </div>
      </section>
      )}
    </div>
  );
};

export default Template10;