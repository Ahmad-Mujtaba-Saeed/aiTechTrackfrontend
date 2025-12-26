import React from 'react';
import demo_profile from '../../assets/images/default_avatar.jpeg';

const ProfessionalTemplate2 = ({ resumeData }) => {
  console.log(resumeData);
  const customSections = resumeData.customSections;
  console.log(customSections);
  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <img
          src={resumeData?.profilePic || demo_profile}
          alt="Profile"
          style={styles.profileImage}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = demo_profile;
          }}
        />
        <h2 style={styles.name}>
          {resumeData?.candidateName?.[0]?.firstName} {resumeData?.candidateName?.[0]?.familyName}
        </h2>
        <p style={styles.headline}>{resumeData?.headline}</p>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Contact</h3>
          <p>{resumeData?.email?.[0]}</p>
          <p>{resumeData?.phoneNumber?.[0]?.formattedNumber}</p>
          <p>{resumeData?.location?.formatted}</p>
          <p>{resumeData?.location?.city}</p>
          <p>{resumeData?.location?.postCode}</p>
          {/* <p>{resumeData?.website?.[0]}</p> */}
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Skills</h3>
          {(resumeData?.skill || []).filter(skill => skill.selected).map((skill, idx) => (
            <p key={idx}>{skill.name}</p>
          ))}
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Languages</h3>
          {(resumeData?.languages || []).map((lang, idx) => (
            <p key={idx}>{lang.name}: {lang.fluency}</p>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <div style={styles.section}>
          <h3 style={styles.mainSectionTitle}>Summary</h3>
        <p>{resumeData?.summary || '...'}</p>
        </div>

        <div style={styles.section}>
          <h3 style={styles.mainSectionTitle}>Experience</h3>
          {(resumeData?.workExperience || []).map((exp, idx) => (
            <div key={idx} style={styles.entry}>
              <strong>{exp.workExperienceJobTitle}</strong><br />
              <em>{exp.workExperienceOrganization} | {exp.workExperienceDates?.start?.date} – {exp.workExperienceDates?.end?.date || 'Present'}</em>
              <p>{exp.workExperienceDescription}</p>
            </div>
          ))}
        </div>

        <div style={styles.section}>
          <h3 style={styles.mainSectionTitle}>Education</h3>
          {(resumeData?.education || []).map((edu, idx) => (
            <div key={idx} style={styles.entry}>
              <strong>{edu.educationAccreditation}</strong><br />
              <em>{edu.educationOrganization} | {edu.educationDates?.start?.date} – {edu.educationDates?.end?.date}</em>
            </div>
          ))}
        </div>
        {customSections
          .filter(section => section.type === 'description' || section.type === 'skills' || section.type === 'list' || section.type === 'entries')
          .map((section, idx) => (
            <div style={styles.section} key={`right-${section.id}`}>
              <h3 style={styles.mainSectionTitle}>{section.title}</h3>
                {section.type === 'description' && (
                  <p>{section.content}</p>
                )}
                {section.type === 'skills' && (
                  section.content.map((skill, skillIdx) => (
                    <p key={skillIdx}>{skill.name}: {skill.level}</p>
                  ))
                )}
                {section.type === 'list' && (
                  section.content.map((item, itemIdx) => (
                    <p key={itemIdx}>• {item}</p>
                  ))
                )}
                {section.type === 'entries' && (
                  section.content.map((entry, entryIdx) => (
                    <div key={entryIdx} style={styles.entry}>
                      <strong>{entry.title}</strong><br />
                      <em>{entry.subtitle} | {entry.date}</em>
                      <p>{entry.description}</p>
                    </div>
                  ))
                )}
            </div>
          ))}
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    display: 'flex',
    fontFamily: 'Inter, sans-serif',
    maxWidth: '960px',
    margin: '40px auto',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  sidebar: {
    width: '30%',
    backgroundColor: '#003366',
    color: '#fff',
    padding: '30px 20px',
    textAlign: 'center'
  },
  profileImage: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '15px',
    border: '3px solid #fff'
  },
  name: {
    fontSize: '22px',
    fontWeight: 600,
    marginBottom: '4px'
  },
  headline: {
    fontStyle: 'italic',
    fontSize: '14px',
    marginBottom: '25px',
    color: '#d1e0ff'
  },
  section: {
    textAlign: 'left',
    marginTop: '20px'
  },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: 600,
    borderBottom: '1px solid #ccc',
    paddingBottom: '6px',
    marginBottom: '10px'
  },
  main: {
    width: '70%',
    padding: '40px'
  },
  mainSectionTitle: {
    color: '#003366',
    fontSize: '18px',
    marginBottom: '12px',
    borderBottom: '2px solid #003366',
    paddingBottom: '6px'
  },
  entry: {
    marginBottom: '18px',
    fontSize: '14px'
  }
};

export default ProfessionalTemplate2;
