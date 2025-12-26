import React from 'react';

const ModernTemplate = ({ resumeData }) => {
  const customSections = resumeData.customSections;
  console.log(customSections);
  return (
    <div className="modern-template" style={{ 
    fontFamily: "'Inter', sans-serif",
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px',
    backgroundColor: '#ffffff',
    color: '#333333'
  }}>
    <header style={{
      textAlign: 'center',
      marginBottom: '30px',
      borderBottom: '2px solid #3498db',
      paddingBottom: '20px'
    }}>
      <h1 style={{
        fontSize: '36px',
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: '5px'
      }}>
        {resumeData?.candidateName?.[0]?.firstName} {resumeData?.candidateName?.[0]?.familyName}
      </h1>
      <p style={{
        fontSize: '18px',
        color: '#3498db',
        fontWeight: '500',
        letterSpacing: '1px'
      }}>
        {resumeData?.headline}
      </p>
    </header>

    <div style={{ display: 'flex', gap: '30px' }}>
      {/* Left Column */}
      <div style={{ width: '30%' }}>
        <section style={{ marginBottom: '25px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#2c3e50',
            borderBottom: '1px solid #eee',
            paddingBottom: '5px',
            marginBottom: '15px'
          }}>CONTACT</h3>
          <p style={{ marginBottom: '8px' }}>{resumeData?.phoneNumber?.[0]?.formattedNumber}</p>
          <p style={{ marginBottom: '8px' }}>{resumeData?.email?.[0]}</p>
          <p style={{ marginBottom: '8px' }}>{resumeData?.location?.formatted}</p>
          <p style={{ marginBottom: '8px' }}>{resumeData?.location?.city}</p>
          <p style={{ marginBottom: '8px' }}>{resumeData?.location?.postCode}</p>
          {/* {resumeData?.website?.[0] && <p>{resumeData?.website?.[0]}</p>} */}
        </section>

        <section style={{ marginBottom: '25px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#2c3e50',
            borderBottom: '1px solid #eee',
            paddingBottom: '5px',
            marginBottom: '15px'
          }}>EDUCATION</h3>
          {resumeData?.education?.map((edu, index) => (
            <div key={index} style={{ marginBottom: '20px' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '5px' }}>{edu.educationAccreditation}</h4>
              <p style={{ fontStyle: 'italic', marginBottom: '5px' }}>{edu.educationOrganization}</p>
              <p style={{ fontSize: '14px', color: '#7f8c8d' }}>
                {edu.educationDates?.start?.date} - {edu.educationDates?.end?.date}
              </p>
            </div>
          ))}
        </section>

        <section>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#2c3e50',
            borderBottom: '1px solid #eee',
            paddingBottom: '5px',
            marginBottom: '15px'
          }}>SKILLS</h3>
          <ul style={{ paddingLeft: '20px' }}>
            {resumeData?.skill?.filter(skill => skill.selected).map((skill, index) => (
              <li key={index} style={{ marginBottom: '8px' }}>{skill.name}</li>
            ))}
          </ul>
        </section>
      </div>

      {/* Right Column */}
      <div style={{ width: '70%' }}>
        <section style={{ marginBottom: '30px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#2c3e50',
            borderBottom: '1px solid #eee',
            paddingBottom: '5px',
            marginBottom: '15px'
          }}>PROFILE</h3>
          <p style={{ lineHeight: '1.6' }}>{resumeData?.summary}</p>
        </section>

        <section>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#2c3e50',
            borderBottom: '1px solid #eee',
            paddingBottom: '5px',
            marginBottom: '15px'
          }}>WORK EXPERIENCE</h3>
          {resumeData?.workExperience?.map((exp, index) => (
            <div key={index} style={{ marginBottom: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <h4 style={{ fontWeight: '600' }}>{exp.workExperienceJobTitle}</h4>
                <span style={{ color: '#7f8c8d' }}>
                  {exp.workExperienceDates?.start?.date} - {exp.workExperienceDates?.end?.date || 'Present'}
                </span>
              </div>
              <p style={{ fontStyle: 'italic', marginBottom: '10px' }}>{exp.workExperienceOrganization}</p>
              <p style={{ lineHeight: '1.6' }}>{exp.workExperienceDescription}</p>
            </div>
          ))}
        </section>
        {customSections
          .filter(section => section.type === 'description' || section.type === 'skills' || section.type === 'list' || section.type === 'entries')
          .map((section, idx) => (
            <section key={`right-${section.id}`}>
              <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#2c3e50',
            borderBottom: '1px solid #eee',
            paddingBottom: '5px',
            marginBottom: '15px'
          }}>{section.title.toUpperCase()}</h3>
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
<div key={entryIdx} style={{ marginBottom: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <h4 style={{ fontWeight: '600' }}>{entry.title}</h4>
                <span style={{ color: '#7f8c8d' }}>
                  {entry.date}
                </span>
              </div>
              <p style={{ lineHeight: '1.6' }}>{entry.description}</p>
            </div>
                  ))
                )}
            </section>
          ))}
      </div>
    </div>
  </div>

);
}

export default ModernTemplate;