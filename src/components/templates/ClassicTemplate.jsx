import React from 'react';

const ClassicTemplate = ({ resumeData }) => {
  const customSections = resumeData.customSections;
  console.log(customSections);
  return (
  <div style={{ 
    fontFamily: "'Inter', sans-serif",
    lineHeight: '1.5',
    color: '#333',
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f5f5f5'
  }}>
    <div style={{
      backgroundColor: 'white',
      padding: '30px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{
        fontSize: '36px',
        marginBottom: '5px',
        color: '#000 !important',
        fontWeight: '500'
      }}>
        {resumeData?.candidateName?.[0]?.firstName} {resumeData?.candidateName?.[0]?.familyName}
      </h1>
      
      <h2 style={{
        fontSize: '17px',
        marginTop: '0',
        color: '#555',
        fontWeight: '400',
        textTransform: 'uppercase',
        marginBottom: '20px'
      }}>
        {resumeData?.headline}
      </h2>
      
      <div style={{
        fontSize: '14px',
        marginBottom: '20px',
        color: '#555'
      }}>
        {resumeData?.phoneNumber?.[0]?.formattedNumber}<br/>
        {resumeData?.email?.[0]}<br/>
        {resumeData?.location?.formatted}<br/>
        {resumeData?.location?.city}<br/>
        {resumeData?.location?.postCode}<br/>
      </div>
      
      <hr style={{
        border: 'none',
        borderTop: '2px solid #e0e0e0',
        margin: '20px 0'
      }} />
      
      <section style={{
        marginBottom: '25px',
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '5px'
      }}>
        <h3 style={{
          fontSize: '18px',
          textTransform: 'uppercase',
          color: '#000',
          marginBottom: '10px',
          background: '#c9af28',
          padding: '10px 12px 8px',
          borderRadius: '0px 50px 50px 0px',
          fontWeight: '500',
          width: 'fit-content'
        }}>
          Profile
        </h3>
        <p style={{
          paddingLeft: '30px',
          margin: '0',
          lineHeight: '1.6'
        }}>
          {resumeData?.summary}
        </p>
      </section>
      
      <hr style={{
        border: 'none',
        borderTop: '2px solid #e0e0e0',
        margin: '20px 0'
      }} />
      
      <section style={{
        marginBottom: '25px',
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '5px'
      }}>
        <h3 style={{
          fontSize: '18px',
          textTransform: 'uppercase',
          color: '#000',
          marginBottom: '10px',
          background: '#c9af28',
          padding: '10px 12px 8px',
          borderRadius: '0px 50px 50px 0px',
          fontWeight: '500',
          width: 'fit-content'
        }}>
          Education
        </h3>
        
        {resumeData?.education?.map((edu, index) => (
          <div key={index}>
            <div style={{
              fontWeight: '600',
              marginBottom: '5px',
              fontSize: '16px',
              paddingLeft: '30px'
            }}>
              {edu.educationDates?.start?.date} - {edu.educationDates?.end?.date}
            </div>
            <ul style={{
              paddingLeft: '80px',
              marginTop: '5px',
              marginBottom: '15px'
            }}>
              <li style={{ marginBottom: '5px' }}>
                <strong style={{ fontWeight: '600' }}>
                  {edu.educationAccreditation}
                </strong><br/>
                {edu.educationOrganization}
              </li>
            </ul>
          </div>
        ))}
      </section>
      
      <hr style={{
        border: 'none',
        borderTop: '2px solid #e0e0e0',
        margin: '20px 0'
      }} />
      
      <section style={{
        marginBottom: '25px',
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '5px'
      }}>
        <h3 style={{
          fontSize: '18px',
          textTransform: 'uppercase',
          color: '#000',
          marginBottom: '10px',
          background: '#c9af28',
          padding: '10px 12px 8px',
          borderRadius: '0px 50px 50px 0px',
          fontWeight: '500',
          width: 'fit-content'
        }}>
          Experience
        </h3>
        
        {resumeData?.workExperience?.map((exp, index) => (
          <div key={index}>
            <div style={{
              fontWeight: '600',
              marginBottom: '5px',
              fontSize: '16px',
              paddingLeft: '30px'
            }}>
              {exp.workExperienceDates?.start?.date} - {exp.workExperienceDates?.end?.date || 'Present'}
            </div>
            <ul style={{
              paddingLeft: '80px',
              marginTop: '5px',
              marginBottom: '15px'
            }}>
              <li style={{ marginBottom: '5px' }}>
                <strong style={{ fontWeight: '600' }}>
                  {exp.workExperienceJobTitle}
                </strong><br/>
                <em>{exp.workExperienceOrganization}</em>
              </li>
              <li style={{ marginBottom: '5px' }}>
                {exp.workExperienceDescription}
              </li>
            </ul>
          </div>
        ))}
      </section>

      {resumeData?.skill && resumeData.skill.length > 0 && (
        <>
          <hr style={{
            border: 'none',
            borderTop: '2px solid #e0e0e0',
            margin: '20px 0'
          }} />
          
          <section style={{
            marginBottom: '25px',
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '5px'
          }}>
            <h3 style={{
              fontSize: '18px',
              textTransform: 'uppercase',
              color: '#000',
              marginBottom: '10px',
              background: '#c9af28',
              padding: '10px 12px 8px',
              borderRadius: '0px 50px 50px 0px',
              fontWeight: '500',
              width: 'fit-content'
            }}>
              Skills
            </h3>
            <ul style={{
              paddingLeft: '80px',
              marginTop: '5px'
            }}>
              {resumeData.skill.filter(skill => skill.selected).map((skill, index) => (
                <li key={index} style={{ marginBottom: '5px' }}>
                  {skill.name}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
      {customSections
        .filter(section => section.type === 'description' || section.type === 'skills' || section.type === 'list' || section.type === 'entries')
        .map((section, idx) => (
          <section style={{
            marginBottom: '25px',
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '5px'
          }} key={`right-${section.id}`}>
            <h3 style={{
          fontSize: '18px',
          textTransform: 'uppercase',
          color: '#000',
          marginBottom: '10px',
          background: '#c9af28',
          padding: '10px 12px 8px',
          borderRadius: '0px 50px 50px 0px',
          fontWeight: '500',
          width: 'fit-content'
        }}>{section.title.toUpperCase()}</h3>
              {section.type === 'description' && (
                <p style={{
                  paddingLeft: '40px',
                  marginTop: '5px',
                  marginBottom: '15px'
                }}>{section.content}</p>
              )}
              {section.type === 'skills' && (
                section.content.map((skill, skillIdx) => (
                  <p style={{
                    paddingLeft: '40px',
                    marginTop: '5px',
                    marginBottom: '15px'
                  }} key={skillIdx}>{skill.name}: {skill.level}</p>
                ))
              )}
              {section.type === 'list' && (
                section.content.map((item, itemIdx) => (
                  <p style={{
                    paddingLeft: '40px',
                    marginTop: '5px',
                    marginBottom: '15px'
                  }} key={itemIdx}>• {item}</p>
                ))
              )}
              {section.type === 'entries' && (
                  section.content.map((entry, entryIdx) => (
<div key={entryIdx}>
            <div style={{
              fontWeight: '600',
              marginBottom: '5px',
              fontSize: '16px',
              paddingLeft: '30px'
            }}>
              {entry.date}
            </div>
            <ul style={{
              paddingLeft: '80px',
              marginTop: '5px',
              marginBottom: '15px'
            }}>
              <li style={{ marginBottom: '5px' }}>
                <strong style={{ fontWeight: '600' }}>
                  {entry.title}
                </strong><br/>
              </li>
              <li style={{ marginBottom: '5px' }}>
                {entry.description}
              </li>
            </ul>
          </div>
                  ))
                )}
          </section>
        ))}
    </div>
  </div>
);
}
export default ClassicTemplate;