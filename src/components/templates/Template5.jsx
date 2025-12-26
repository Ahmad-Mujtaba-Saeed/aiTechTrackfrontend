import React from 'react';
import demo_profile from '../../assets/images/default_avatar.jpeg';

const Template5 = ({ resumeData }) => {
  console.log(resumeData);
  const customSections = resumeData?.customSections;
  console.log(customSections);
  const styles = {
    container: {
      maxWidth: '850px',
      margin: '0px auto',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#fff'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#000',
      color: '#c9c9c9',
      padding: '20px'
    },
    profileImage: {
      width: '120px',
      height: '120px',
      borderRadius: '0%',
      objectFit: 'cover',
      marginRight: '25px',
      border: '1px solid #e0e0e0',
      borderBottom: 'none'
    },
    name: {
      fontSize: '28px',
      fontWeight: 'normal',
      color: '#c9c9c9',
      margin: 0
    },
    contact: {
      margin: '6px 0',
      fontSize: '14px',
      color: '#fff'
    },
    pageContainer: {
      border: '1px solid #e0e0e0',
      display: 'flex'
    },
    leftSection: {
      width: '516px',
      padding: '40px'
    },
    rightSidebar: {
      width: '278px',
      backgroundColor: '#f7f7f7',
      padding: '40px'
    },
    section: {
      padding: "0px",
      marginBottom: '0px'
    },
    sectionTitle: {

      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
      fontSize: '18px',
      color: '#333',
      borderBottom: '2px solid #ccc',
      paddingBottom: '6px',
      margin: 0
    },
    sectionText: {

      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
      margin: '12px 0 30px',
      fontSize: '14px',
      lineHeight: '1.6',
      color: '#444'
    },
    jobEntry: {
      marginTop: '20px'
    },
    jobTitle: {

      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
      margin: '0',
      fontSize: '15px',
      fontWeight: 'bold',
      color: '#222'
    },
    period: {
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
      float: 'right',
      fontSize: '13px',
      fontWeight: 'normal',
      color: '#555'
    },
    company: {

      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
      margin: '4px 0',
      fontSize: '14px',
      color: '#666'
    },
    list: {

      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
      margin: '6px 0 0 20px',
      padding: 0,
      fontSize: '14px',
      color: '#444',
      lineHeight: '1.5'
    },
    sidebarSection: {
      paddingBottom: "0px",
      marginBottom: '0px'
    },
    sidebarTitle: {

      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
      fontSize: '16px',
      color: '#333',
      borderBottom: '1px solid #ccc',
      paddingBottom: '6px',
      margin: 0
    },
    sidebarText: {
      margin: '12px 0 0 0',
      fontSize: '14px',
      color: '#555',
      lineHeight: '1.4'
    },
    link: {
      color: '#333',
      textDecoration: 'none',
      fontWeight: 'bold'
    },
    languageBar: {

      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
      marginBottom: '16px'
    },
    barBackground: {
      backgroundColor: '#e0e0e0',
      width: '100%',
      height: '6px',
      borderRadius: '3px',
      marginTop: '4px'
    },
    barFill: {
      backgroundColor: '#333',
      height: '6px',
      borderRadius: '3px'
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
      {!(resumeData?.personalDisabled) && (
        <div style={styles.header}>
          {resumeData?.profilePic ? (
            <img src={resumeData?.profilePic || demo_profile} alt="Profile" style={styles.profileImage} />
          ) : ""}
          <div>
            <h1 style={styles.name}>
              {resumeData?.candidateName?.[0]?.firstName} {resumeData?.candidateName?.[0]?.familyName}
            </h1>
            {resumeData?.email?.[0] && (
              <p style={styles.contact}>{resumeData.email[0]}</p>
            )}
            {resumeData?.phoneNumber?.[0]?.formattedNumber && (
              <p style={styles.contact}>{resumeData.phoneNumber[0].formattedNumber}</p>
            )}
            {resumeData?.location?.formatted && (
              <p style={styles.contact}>{resumeData.location.formatted}</p>
            )}
            {(resumeData?.location?.city || resumeData?.location?.postCode) && (
              <p style={styles.contact}>
                {resumeData.location.city} {resumeData.location.postCode ? `, ${resumeData.location.postCode}` : ''}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <div style={styles.pageContainer}>
        {/* Left Section */}
        <div style={styles.leftSection}>
          {/* Profile Summary */}
          {!(resumeData?.profileDisabled) && resumeData?.summary?.paragraph && (
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>{resumeData?.profileTitle || 'Profile'}</h2>
              <p style={styles.sectionText}>{resumeData.summary?.paragraph}</p>
            </section>
          )}

          {/* Employment History */}
          {resumeData?.workExperience?.length > 0 && !(resumeData?.employmentDisabled) && (
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>{resumeData?.employmentTitle || 'Employment'}</h2>
              {resumeData.workExperience.map((job, idx) => (
                <div key={idx} style={styles.jobEntry}>
                  <p style={styles.jobTitle}>
                    {job.workExperienceJobTitle}
                    <span style={styles.period}>{job.workExperienceDates?.start?.date} – {job.workExperienceDates?.end?.date || 'Present'}</span>
                  </p>
                  <p style={styles.company}>{job.workExperienceOrganization}</p>
                  <p>{job.workExperienceDescription ?? ""}</p>
                  <h5>Key Achievements</h5>
                  <p style={styles.sectionText}>{job.highlights?.items?.length > 0 && (
                    <ul style={styles.bulletList}>
                      {job.highlights.items.map((point, i) => (
                        <li key={i} style={styles.bulletItem}>{point.bullet}</li>
                      ))}
                    </ul>
                  )}</p>
                </div>
              ))}
            </section>
          )}

          {/* Education */}
          {resumeData?.education?.length > 0 && !(resumeData?.educationDisabled) && (
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>{resumeData?.educationTitle || 'Education'}</h2>
              {resumeData.education.map((edu, idx) => (
                <div key={idx} style={styles.jobEntry}>
                  <p style={styles.jobTitle}>
                    {edu.educationLevel.label}
                    <span style={styles.period}>{edu.educationDates?.start?.date} – {edu.educationDates?.end?.date}</span>
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
                      <div className='d-flex'>
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
                  <p style={styles.company}>{edu.educationOrganization}</p>
                  <p style={styles.sectionText}>
                    {edu.educationDescription}

                  </p>
                </div>
              ))}
            </section>
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

        {/* Right Sidebar */}
        <div style={styles.rightSidebar}>


          {/* Social Links */}
          {(resumeData?.socialLinks?.github || resumeData?.socialLinks?.linkedin || resumeData?.socialLinks?.website) && (
          <div>
              <section style={styles.sidebarSection}>
                <h3 style={styles.sidebarTitle}>Social Links</h3>
                {resumeData?.socialLinks?.github && (
                  <p style={styles.contactParagraph}>
                    <strong>Github:</strong> {resumeData?.socialLinks?.github}
                  </p>
                )}
                {resumeData?.socialLinks?.linkedin && (
                  <p style={styles.contactParagraph}>
                    <strong>LinkedIn:</strong> {resumeData?.socialLinks?.linkedin}
                  </p>
                )}
                {resumeData?.socialLinks?.website && (
                  <p style={styles.contactParagraph}>
                    <strong>Website:</strong> {resumeData?.socialLinks?.website}
                  </p>
                )}
              </section>
          </div>
          )}


          {/* Languages */}

          {resumeData?.languages?.length > 0 && !(resumeData?.languagesDisabled) && (
            <section style={styles.sidebarSection}>
              <h3 style={styles.sidebarTitle}>{resumeData?.languagesTitle || 'Languages'}</h3>
              {resumeData.languages.map((lang, idx) => {
                let width;
                switch (lang.level) {
                  case 'Native': width = '100%'; break;
                  case 'Advanced': width = '70%'; break;
                  case 'Intermediate': width = '50%'; break;
                  case 'Beginner': width = '30%'; break;
                  default: width = '50%';
                }

                return (
                  lang.level == null ? null : (
                    <div key={idx} style={styles.languageBar}>
                      <span>{lang.name}</span>
                      <div style={styles.barBackground}>
                        <div style={{ ...styles.barFill, width }}></div>
                      </div>
                    </div>
                  )
                );
              })}
            </section>
          )}


          {/* Hobbies */}
          {resumeData?.hobbies?.length > 0 && !(resumeData?.hobbiesDisabled) && (
            <section style={styles.sidebarSection}>
              <h3 style={styles.sidebarTitle}>{resumeData?.hobbiesTitle || 'Hobbies'}</h3>
              <ul style={styles.list}>
                {resumeData.hobbies.map((hobby, idx) => (
                  <li style={styles.pagecontentfull} key={idx}>{hobby}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Skills */}
          {resumeData?.skill?.filter(skill => skill.selected).length > 0 && !(resumeData?.skillsDisabled) && (
            <section style={styles.sidebarSection}>
              <h3 style={styles.sidebarTitle}>{resumeData?.skillsTitle || 'Skills'}</h3>
              <ul style={styles.list}>
                {resumeData.skill
                  .filter(skill => skill.selected)
                  .map((skill, idx) => (
                    <li style={styles.pagecontentfull} key={idx}>
                      {typeof skill === 'object' ? (skill.name || skill) : skill}
                    </li>
                  ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Template5;