import React from 'react';
import demo_profile from '../../assets/images/default_avatar.jpeg';

const Template8 = ({ resumeData }) => {
  const styles = {
    container: {
      display: 'flex',
      maxWidth: '850px',
      margin: '0 auto',
      backgroundColor: 'white',
      boxShadow: '0 0 20px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif'
    },
    headline: {
      margin: '12px 0 20px 0',
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#e9e9e9ff'
    },
    leftSidebar: {
      width: '250px',
      backgroundColor: '#943b2b',
      color: 'white',
      padding: '30px 20px',
      boxSizing: 'border-box'
    },
    profileHeader: {
      textAlign: 'center',
      marginBottom: '30px'
    },
    profileName: {
      color:"#fff",
      margin: '0 0 20px 0',
      fontSize: '18px',
      fontWeight: 'bold'
    },
    profileImageContainer: {
      width: '110px',
      height: '110px',
      borderRadius: '50%',
      overflow: 'hidden',
      margin: '0 auto',
      border: '3px solid white'
    },
    profileImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    sectionTitle: {
      margin: '0 0 15px 0',
      fontSize: '14px',
      fontWeight: 'bold',
      color: 'white'
    },
    detailItem: {
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center'
    },
    detailIcon: {
      width: '16px',
      height: '16px',
      marginRight: '10px'
    },
    detailText: {
      fontSize: '12px'
    },
    addressText: {
      fontSize: '12px',
      lineHeight: '16px'
    },
    languageContainer: {
      marginBottom: '15px'
    },
    languageName: {
      marginBottom: '5px',
      fontSize: '12px'
    },
    languageBar: {
      display: 'flex',
      gap: '2px'
    },
    languageDot: {
      width: '25px',
      height: '4px',
      backgroundColor: 'white',
      borderRadius: '2px'
    },
    languageDotInactive: {
      width: '25px',
      height: '4px',
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: '2px'
    },
    qualityItem: {
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center'
    },
    qualityDot: {
      width: '8px',
      height: '8px',
      backgroundColor: 'white',
      marginRight: '8px'
    },
    rightContent: {
      flex: 1,
      padding: '30px',
      backgroundColor: 'white'
    },
    contentSection: {
      marginBottom: '30px'
    },
    contentTitle: {
      
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
      margin: '0 0 15px 0',
      fontSize: '18px',
      color: '#4a6fa5',
      fontWeight: 'bold'
    },
    contentText: {
      
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
      margin: 0,
      fontSize: '12px',
      lineHeight: '1.6',
      color: '#333',
      textAlign: 'justify'
    },
    jobHeader: {
      
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '5px'
    },
    jobTitle: {
      
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
      margin: 0,
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#333'
    },
    jobDate: {
      
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
      fontSize: '12px',
      color: '#4a6fa5',
      fontWeight: 'bold'
    },
    companyName: {
      
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
      fontSize: '12px',
      color: '#666',
      marginBottom: '8px'
    },
    bulletList: {
      margin: 0,
      paddingLeft: '15px',
      fontSize: '12px',
      lineHeight: '1.5',
      color: '#333'
    },
    bulletItem: {
      
      pageBreakInside: "avoid",
      pageBreakBefore: "auto",
      pageBreakAfter: "auto",
      marginBottom: '5px'
    }
  };

  const renderLanguageLevel = (level) => {
    switch(level) {
      case 'Native':
        return [1, 1, 1, 1, 1];
      case 'Advanced':
        return [1, 1, 1, 1, 0];
      case 'Intermediate':
        return [1, 1, 1, 0, 0];
      case 'Beginner':
        return [1, 1, 0, 0, 0];
      default:
        return [1, 1, 1, 0, 0];
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Sidebar */}
      <div style={styles.leftSidebar}>
        {/* Profile Photo and Name */}
        <div style={styles.profileHeader}>
          <h1 style={styles.profileName}>
            {resumeData?.candidateName?.[0]?.firstName} {resumeData?.candidateName?.[0]?.familyName}
          </h1>
          {resumeData?.profilePic ? (
            <div style={styles.profileImageContainer}>
              <img 
                src={resumeData?.profilePic || demo_profile} 
                alt="Profile" 
                style={styles.profileImage} 
            />
          </div>
          ) : null}
          <p style={styles.headline}>
          {resumeData?.headline || 'Professional title'}
        </p>
        </div>

        {/* Personal Details */}
        {!(resumeData?.personalDisabled) && (
          <div style={{ marginBottom: '25px' }}>
            <h3 style={styles.sectionTitle}>{resumeData?.personalTitle || 'Personal details'}</h3>

            <div style={styles.detailItem}>
              <div style={styles.detailIcon}>👤</div>
              <span style={styles.detailText}>
                {resumeData?.candidateName?.[0]?.firstName} {resumeData?.candidateName?.[0]?.familyName}
              </span>
            </div>

            {resumeData?.email?.[0] && (
              <div style={styles.detailItem}>
                <div style={styles.detailIcon}>✉️</div>
                <span style={styles.detailText}>{resumeData.email[0]}</span>
              </div>
            )}

            {resumeData?.phoneNumber?.[0]?.formattedNumber && (
              <div style={styles.detailItem}>
                <div style={styles.detailIcon}>📞</div>
                <span style={styles.detailText}>{resumeData.phoneNumber[0].formattedNumber}</span>
              </div>
            )}

            {resumeData?.location?.formatted && (
                  <div style={{ ...styles.detailItem, alignItems: 'flex-start' }}>
                    <div style={{ ...styles.detailIcon, marginTop: '2px' }}>🏠</div>
                    <span style={styles.addressText}>
                      {resumeData.location.formatted.split(',').map((line, i) => (
                        <React.Fragment key={i}>
                          {line.trim()}
                          {i < resumeData.location.formatted.split(',').length - 1 && <br />}
                          
                        </React.Fragment>
                      ))}
                                      {resumeData?.location?.city && (
                   " " + resumeData.location.city
                )}
                {resumeData?.location?.postCode && (
                  " " + resumeData?.location?.postCode
                  
                )}
                    </span>
                  </div>
                )}
            {resumeData?.socialLinks?.linkedin && (
              <div style={styles.detailItem}>
                <div style={styles.detailIcon}>🔗</div>
                <span style={styles.detailText}>{resumeData.socialLinks.linkedin}</span>
              </div>
            )}

            {resumeData?.socialLinks?.github && (
              <div style={styles.detailItem}>
                <div style={styles.detailIcon}>🔗</div>
                <span style={styles.detailText}>{resumeData.socialLinks.github}</span>
              </div>
            )}

            {resumeData?.socialLinks?.website && (
              <div style={styles.detailItem}>
                <div style={styles.detailIcon}>🔗</div>
                <span style={styles.detailText}>{resumeData.socialLinks.website}</span>
              </div>
            )}
          </div>
        )}

        {/* Skills */}
        {!(resumeData?.skillsDisabled) && (resumeData?.skill?.length > 0) && (
          <div style={{ marginBottom: '30px' }}>
            <h2 style={styles.sectionTitle}>
              {resumeData?.skillsTitle || 'Skills'}
            </h2>
              {(resumeData?.skill || [])
                .filter(skill => skill.selected)
                .map((skill, index) => (
                    <div key={index} style={styles.qualityItem}>
                      <div style={styles.qualityDot} />
                      <span style={styles.detailText}>{skill.name}</span>
                    </div>
                ))}
          </div>
        )}

        {/* Languages */}
        {resumeData?.languages?.length > 0 && !(resumeData?.languagesDisabled) && (
          <div style={{ marginBottom: '25px' }}>
            <h3 style={styles.sectionTitle}>{resumeData?.languagesTitle || "Languages"}</h3>
            
            {resumeData?.languages?.map((lang, index) => {
              const levels = renderLanguageLevel(lang.level);
              return (
        lang.level == null ? null : (
                <div key={index} style={styles.languageContainer}>
                  <div style={styles.languageName}>{lang.name}</div>
                  <div style={styles.languageBar}>
                    {levels.map((active, i) => (
                      <div 
                        key={i} 
                        style={active ? styles.languageDot : styles.languageDotInactive}
                      />
                    ))}
                  </div>
                </div>
              
              ) );
            })}
          </div>
        )}

        {/* Qualities */}
        {/* <div style={{ marginBottom: '25px' }}>
          <h3 style={styles.sectionTitle}>Qualités</h3>
          
          {resumeData?.qualities?.map((quality, index) => (
            <div key={index} style={styles.qualityItem}>
              <div style={styles.qualityDot} />
              <span style={styles.detailText}>{quality}</span>
            </div>
          ))}
        </div> */}

        {/* Hobbies */}
        {!(resumeData?.hobbiesDisabled) && (resumeData?.hobbies?.length > 0) && (
        <div>
          <h3 style={styles.sectionTitle}>{resumeData?.hobbiesTitle || "Hobbies"}</h3>
          
          {resumeData?.hobbies?.map((hobby, index) => (
            <div key={index} style={styles.qualityItem}>
              <div style={styles.qualityDot} />
              <span style={styles.detailText}>{hobby}</span>
            </div>
          ))}
        </div>
    )}
      </div>

      {/* Right Content Area */}
      <div style={styles.rightContent}>
        {/* Professional Summary */}
        <div style={styles.contentSection}>
          <h2 style={styles.contentTitle}>Professional Summary</h2>
          <p style={styles.contentText}>
            {resumeData?.summary?.paragraph || 'Professional summary goes here...'}
          </p>
        </div>

        {/* Work Experience */}
        {resumeData?.workExperience?.length > 0 && !(resumeData?.employmentDisabled) && (
          <div style={styles.contentSection}>
            <h2 style={styles.contentTitle}>{resumeData?.employmentTitle || 'Employment'}</h2>
            
            {resumeData?.workExperience?.map((job, index) => (
              <div key={index} style={{ marginBottom: index === resumeData.workExperience.length - 1 ? 0 : '25px' }}>
                <div style={styles.jobHeader}>
                  <h3 style={styles.jobTitle}>{job.workExperienceJobTitle}</h3>
                  <span style={styles.jobDate}>
                    {job.workExperienceDates?.start?.date} - {job.workExperienceDates?.end?.date || 'Present'}
                  </span>
                </div>
                <div style={styles.companyName}>{job.workExperienceOrganization}</div>
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
        )}

        {/* Education */}
        {resumeData?.education?.length > 0 && !(resumeData?.educationDisabled) && (
          <div style={styles.contentSection}>
            <h2 style={styles.contentTitle}>{resumeData?.educationTitle || 'Education'}</h2>
            
            {resumeData?.education?.map((edu, index) => (
              <div key={index} style={{ marginBottom: index === resumeData.education.length - 1 ? 0 : '20px' }}>
                <div style={styles.jobHeader}>
                  <h3 style={styles.jobTitle}>{edu.educationLevel.label}</h3>
                  <span style={styles.jobDate}>
                    {edu.educationDates?.start?.date} - {edu.educationDates?.end?.date}
                  </span>
                </div>
                <div style={styles.companyName}>{edu.educationOrganization}</div>
                {edu.educationDescription && (
                  <p style={styles.contentText}>{edu.educationDescription}</p>
                )}
                {edu.achievedGrade ? (
                  <div style={{ marginTop: '5px' }}>
                    <strong>Grade: </strong>{edu.achievedGrade}
                  </div>
                ) : ""}
              </div>
            ))}
          </div>
        )}

        {/* Custom Sections */}
        {resumeData?.customSections?.map((section, index) => (
           <div style={styles.contentSection}>
          <div key={index} style={{ marginBottom: index === resumeData.customSections.length - 1 ? '5px' : '20px' }}>
            <h2 style={styles.contentTitle}>{section.title}</h2>
            <div
              style={styles.contentText}
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Template8;