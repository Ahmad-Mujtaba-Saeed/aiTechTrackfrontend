import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import {
  Section,
  Entry,
  Body,
  Meta,
  Bullet,
  BulletList,
  Chips,
  DetailRows,
  LevelBar,
  RichText,
} from './primitives';
import { contactEntries, formatRange } from './normalize';

/**
 * Content sections, shared by every template.
 *
 * Each section is purely theme-driven, so the eight designs differ by layout and
 * tokens rather than by duplicated rendering logic. A fix to how, say, education
 * dates render lands in all eight at once.
 */

export function ProfileSection({ resume, theme, first }) {
  if (!resume.labels.profile.enabled || !resume.summary) return null;
  return (
    <Section theme={theme} title={resume.labels.profile.title} first={first}>
      <Body theme={theme} style={{ textAlign: 'justify' }}>
        {resume.summary}
      </Body>
    </Section>
  );
}

export function PersonalDetailsSection({ resume, theme, first, includeName = true, labelWidth }) {
  if (!resume.labels.personal.enabled) return null;
  const entries = contactEntries(resume, { includeName });
  if (!entries.length) return null;

  return (
    <Section theme={theme} title={resume.labels.personal.title} first={first}>
      <DetailRows theme={theme} entries={entries} labelWidth={labelWidth} />
    </Section>
  );
}

export function WorkSection({ resume, theme, first, showDatesInline = false }) {
  if (!resume.labels.employment.enabled || !resume.work.length) return null;

  return (
    <Section theme={theme} title={resume.labels.employment.title} first={first}>
      {resume.work.map((job, index) => {
        const range = formatRange(job);
        const last = index === resume.work.length - 1;

        // Inline mode puts the date on the same line as the employer; stacked
        // mode gives it its own line above the role.
        return (
          <Entry
            key={index}
            theme={theme}
            last={last}
            meta={showDatesInline ? null : range}
            title={job.title}
            subtitle={
              showDatesInline
                ? [job.org, range].filter(Boolean).join('  ·  ')
                : job.org
            }
          >
            {Boolean(job.description) && (
              <Body theme={theme} style={{ marginTop: 3 }}>
                {job.description}
              </Body>
            )}
            <BulletList theme={theme} items={job.bullets} />
          </Entry>
        );
      })}
    </Section>
  );
}

export function EducationSection({ resume, theme, first, showDatesInline = false }) {
  if (!resume.labels.education.enabled || !resume.education.length) return null;

  return (
    <Section theme={theme} title={resume.labels.education.title} first={first}>
      {resume.education.map((edu, index) => {
        const range = formatRange(edu);
        const last = index === resume.education.length - 1;

        const facts = [
          edu.majors.length ? `Subjects: ${edu.majors.join(', ')}` : '',
          edu.areaOfStudy,
          edu.grade ? `Grade: ${edu.grade}` : '',
          edu.accreditation,
        ].filter(Boolean);

        return (
          <Entry
            key={index}
            theme={theme}
            last={last}
            meta={showDatesInline ? null : range}
            title={edu.degree}
            subtitle={
              showDatesInline
                ? [edu.org, range].filter(Boolean).join('  ·  ')
                : edu.org
            }
          >
            {facts.map((fact) => (
              <Body key={fact} theme={theme} style={{ marginTop: 2 }}>
                {fact}
              </Body>
            ))}
            <BulletList theme={theme} items={edu.bullets} />
          </Entry>
        );
      })}
    </Section>
  );
}

/**
 * Skills, in one of four presentations.
 *   list   — bulleted, one per line
 *   chips  — inline pills
 *   bars   — name plus a strength meter (sidebar templates)
 *   inline — comma-separated run of text, the most compact option
 */
export function SkillsSection({ resume, theme, first, variant = 'chips', color, muted, track }) {
  if (!resume.labels.skills.enabled || !resume.skills.length) return null;
  const names = resume.skills.map((skill) => skill.name);
  const title = resume.labels.skills.title;

  if (variant === 'list') {
    const [leadName, ...rest] = names;
    return (
      <Section
        theme={theme}
        title={title}
        first={first}
        lead={
          <Bullet theme={theme} color={color} style={{ marginTop: 3 }}>
            {leadName}
          </Bullet>
        }
      >
        {rest.length > 0 && (
          <View>
            {rest.map((item, index) => (
              <Bullet key={index} theme={theme} color={color} atomic={!isOversizedSkill(item)}>
                {item}
              </Bullet>
            ))}
          </View>
        )}
      </Section>
    );
  }

  if (variant === 'inline') {
    return (
      <Section
        theme={theme}
        title={title}
        first={first}
        lead={
          <Body theme={theme} style={{ marginTop: 3, ...(color ? { color } : null) }}>
            {names.join(' · ')}
          </Body>
        }
      />
    );
  }

  if (variant === 'bars') {
    const [leadSkill, ...restSkills] = resume.skills;
    return (
      <Section
        theme={theme}
        title={title}
        first={first}
        lead={<SkillBar theme={theme} skill={leadSkill} color={color} muted={muted} track={track} />}
      >
        {restSkills.map((skill, index) => (
          <SkillBar key={index} theme={theme} skill={skill} color={color} muted={muted} track={track} />
        ))}
      </Section>
    );
  }

  return (
    <Section theme={theme} title={title} first={first}>
      <Chips theme={theme} items={names} background={hexWithAlpha(theme.accent)} color={theme.ink} />
    </Section>
  );
}

const isOversizedSkill = (value) => typeof value === 'string' && value.length > 2200;

function SkillBar({ theme, skill, color, muted, track }) {
  return (
    <View style={{ marginBottom: 5 }} wrap={false}>
      <Text
        style={{
          fontFamily: theme.fontFamily,
          fontSize: theme.bodySize,
          color: color || theme.body,
        }}
      >
        {skill.name}
      </Text>
      <LevelBar
        level={skill.level}
        track={track || 'rgba(255,255,255,0.25)'}
        fill={muted || '#FFFFFF'}
      />
    </View>
  );
}

export function LanguagesSection({ resume, theme, first, variant = 'list', color }) {
  if (!resume.labels.languages.enabled || !resume.languages.length) return null;

  const labels = resume.languages.map((lang) =>
    lang.level ? `${lang.name} (${lang.level})` : lang.name,
  );

  if (variant === 'inline') {
    return (
      <Section
        theme={theme}
        title={resume.labels.languages.title}
        first={first}
        lead={
          <Body theme={theme} style={{ marginTop: 3, ...(color ? { color } : null) }}>
            {labels.join(' · ')}
          </Body>
        }
      />
    );
  }

  const [leadLabel, ...rest] = labels;
  return (
    <Section
      theme={theme}
      title={resume.labels.languages.title}
      first={first}
      lead={
        <Bullet theme={theme} color={color} style={{ marginTop: 3 }}>
          {leadLabel}
        </Bullet>
      }
    >
      {rest.length > 0 && <BulletList theme={theme} items={rest} color={color} />}
    </Section>
  );
}

export function HobbiesSection({ resume, theme, first, variant = 'inline', color }) {
  if (!resume.labels.hobbies.enabled || !resume.hobbies.length) return null;

  return (
    <Section theme={theme} title={resume.labels.hobbies.title} first={first}>
      {variant === 'inline' ? (
        <Body theme={theme} style={color ? { color } : null}>
          {resume.hobbies.join(' · ')}
        </Body>
      ) : (
        <BulletList theme={theme} items={resume.hobbies} color={color} />
      )}
    </Section>
  );
}

export function CustomSections({ resume, theme, color }) {
  if (!resume.custom.length) return null;
  return (
    <>
      {resume.custom.map((entry, index) => (
        <Section key={entry.id ?? index} theme={theme} title={entry.title || 'Additional Information'}>
          <RichText theme={theme} html={entry.content} color={color} />
        </Section>
      ))}
    </>
  );
}

export function QualitiesSection({ resume, theme, title = 'Key Strengths', color }) {
  if (!resume.qualities.length) return null;
  return (
    <Section theme={theme} title={title}>
      <BulletList theme={theme} items={resume.qualities} color={color} />
    </Section>
  );
}

/** Soft tint of the accent, for chip backgrounds. */
function hexWithAlpha(hex) {
  const match = /^#?([0-9a-f]{6})$/i.exec(String(hex || ''));
  if (!match) return '#F1F3F5';
  const int = parseInt(match[1], 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  // Blend toward white so text stays legible without measuring contrast.
  const mix = (channel) => Math.round(channel + (255 - channel) * 0.88);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}
