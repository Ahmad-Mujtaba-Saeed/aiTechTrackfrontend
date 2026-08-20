import React from 'react';
import { Page, View, Text } from '@react-pdf/renderer';
import {
  Section,
  Body,
  Meta,
  BulletList,
  SquareList,
  DotRating,
  Photo,
  RichText,
  PageNumber,
} from '../primitives';
import { contactEntries, formatRange } from '../normalize';
import Icon from '../icons';
import { ICON_FOR_LABEL } from '../iconMap';

/**
 * Modern — terracotta sidebar, circular photo, dates in a left gutter.
 *
 * Two pagination constraints shape this file:
 *
 *  1. The sidebar is not a flex sibling of the main column. react-pdf re-runs
 *     flex layout for a fragment continuing onto a new page, so the emptied
 *     sidebar column would collapse and the main column slide underneath the
 *     band. Instead the band is `fixed`, its content absolutely positioned
 *     (page one only), and the main column is offset by the Page's own
 *     `paddingLeft`, which is re-applied to every page.
 *
 *  2. Each entry puts its dates in a left gutter. That is done with an absolute
 *     date inside the entry plus matching `paddingLeft` on the entry, not a flex
 *     row — a row would break the same way if the entry spanned a page boundary.
 */

const SIDE_PADDING = 20;
const TOP = 34;
const BOTTOM = 40;
const GUTTER = 18;

/** Conservative height estimate so absolute sidebar content cannot overflow. */
function estimateSidebar({ theme, contacts, resume, hasPhoto }) {
  const heading = theme.sectionSize + 16;
  let height = hasPhoto ? 132 : 24;
  height += heading + contacts.length * 15;
  if (resume.labels.languages.enabled && resume.languages.length) {
    height += heading + resume.languages.length * 16;
  }
  if (resume.qualities.length) height += heading + resume.qualities.length * 14;
  if (resume.labels.hobbies.enabled && resume.hobbies.length) {
    height += heading + resume.hobbies.length * 14;
  }
  if (resume.labels.skills.enabled && resume.skills.length) {
    height += heading + resume.skills.length * 14;
  }
  return height;
}

export default function Modern({ resume, theme }) {
  const width = theme.sidebarWidth;
  const dateCol = theme.dateColumn;
  const contacts = contactEntries(resume, { includeName: true });
  const hasPhoto = Boolean(resume.photo);

  // Sidebar ink is reversed out of the band, so it needs its own token set.
  const side = {
    ...theme,
    accent: theme.sidebarInk,
    ink: theme.sidebarInk,
    body: theme.sidebarInk,
    muted: theme.sidebarMuted,
    rule: 'rgba(255,255,255,0.45)',
    sectionStyle: 'rule',
    sectionSize: theme.sectionSize - 1,
    bodySize: theme.bodySize - 0.5,
    sectionGap: 14,
  };

  // Move the least essential blocks into the main column if the sidebar is full.
  const available = 841.89 - TOP - BOTTOM;
  const spill = [];
  let estimate = estimateSidebar({ theme, contacts, resume, hasPhoto });
  for (const key of ['skills', 'hobbies', 'qualities']) {
    if (estimate <= available) break;
    spill.push(key);
    estimate -= theme.sectionSize + 16 + (resume[key]?.length || 0) * 14;
  }
  const inSide = (key) => !spill.includes(key);

  const entry = ({ title, org, date, description, facts = [], bullets, key, last }) => (
    // minPresenceAhead sits on the entry itself, not just the header below.
    // The date is absolutely positioned at the entry's origin, so if only the
    // header moved to the next page the date would be left behind alone at the
    // foot of this one.
    <View
      key={key}
      style={{ marginBottom: last ? 0 : theme.entryGap + 2, paddingLeft: dateCol }}
      minPresenceAhead={52}
    >
      {/* Absolute rather than a flex row, so a long entry can span pages
          without the date column collapsing. */}
      {Boolean(date) && (
        <Text
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: dateCol - 10,
            fontFamily: theme.fontFamilyBold,
            fontSize: theme.metaSize,
            color: theme.accent,
            lineHeight: 1.4,
          }}
        >
          {date}
        </Text>
      )}

      <View wrap={false} minPresenceAhead={30}>
        <Text
          style={{
            fontFamily: theme.fontFamilyBold,
            fontSize: theme.bodySize + 0.5,
            color: theme.ink,
            lineHeight: 1.3,
          }}
        >
          {title}
        </Text>
        {Boolean(org) && (
          <Text
            style={{
              fontFamily: theme.fontFamily,
              fontSize: theme.metaSize,
              color: theme.accent,
              marginTop: 1,
            }}
          >
            {org}
          </Text>
        )}
      </View>

      {Boolean(description) && (
        <Body theme={theme} style={{ marginTop: 3 }}>
          {description}
        </Body>
      )}
      {facts.map((fact) => (
        <Body key={fact} theme={theme} style={{ marginTop: 2 }}>
          {fact}
        </Body>
      ))}
      <BulletList theme={theme} items={bullets} />
    </View>
  );

  return (
    <Page
      size="A4"
      style={{
        paddingTop: TOP,
        paddingBottom: BOTTOM,
        paddingLeft: width + GUTTER,
        paddingRight: 32,
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* The band, repeated on every page. */}
      <View
        fixed
        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width, backgroundColor: theme.sidebarBackground }}
      />

      {/* ---------------------------------------------------------- sidebar -- */}
      <View
        style={{ position: 'absolute', top: TOP, left: SIDE_PADDING, width: width - SIDE_PADDING * 2 }}
      >
        {hasPhoto && (
          <View style={{ alignItems: 'center', marginBottom: 12 }}>
            <Photo src={resume.photo} size={104} border="rgba(255,255,255,0.75)" />
          </View>
        )}



        {contacts.length > 0 && (
          <Section theme={side} title={resume.labels.personal.title} first>
            {contacts.map(({ label, value }) => (
              <View
                key={label}
                style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 5 }}
                wrap={false}
              >
                <View style={{ width: 14, flexShrink: 0, paddingTop: 0.5 }}>
                  <Icon name={ICON_FOR_LABEL[label] || 'globe'} size={8} color={theme.sidebarInk} />
                </View>
                <Text
                  style={{
                    flex: 1,
                    fontFamily: theme.fontFamily,
                    fontSize: side.bodySize,
                    color: theme.sidebarInk,
                    lineHeight: 1.35,
                  }}
                >
                  {value}
                </Text>
              </View>
            ))}
          </Section>
        )}

        {resume.labels.languages.enabled && resume.languages.length > 0 && (
          <Section theme={side} title={resume.labels.languages.title}>
            {resume.languages.map((lang, index) => (
              <View
                key={index}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}
                wrap={false}
              >
                <Text
                  style={{
                    fontFamily: theme.fontFamilyBold,
                    fontSize: side.bodySize,
                    color: theme.sidebarInk,
                    paddingRight: 8,
                  }}
                >
                  {lang.name}
                </Text>
                <DotRating level={lang.level} filled="#FFFFFF" empty="rgba(255,255,255,0.4)" />
              </View>
            ))}
          </Section>
        )}

        {inSide('qualities') && resume.qualities.length > 0 && (
          <Section theme={side} title="Qualities">
            <SquareList theme={side} items={resume.qualities} color={theme.sidebarInk} markerColor="#FFFFFF" />
          </Section>
        )}

        {inSide('skills') && resume.labels.skills.enabled && resume.skills.length > 0 && (
          <Section theme={side} title={resume.labels.skills.title}>
            <SquareList
              theme={side}
              items={resume.skills.map((skill) => skill.name)}
              color={theme.sidebarInk}
              markerColor="#FFFFFF"
            />
          </Section>
        )}

        {inSide('hobbies') && resume.labels.hobbies.enabled && resume.hobbies.length > 0 && (
          <Section theme={side} title={resume.labels.hobbies.title}>
            <SquareList theme={side} items={resume.hobbies} color={theme.sidebarInk} markerColor="#FFFFFF" />
          </Section>
        )}
      </View>

      {/* ------------------------------------------------------ main column -- */}
      {resume.labels.profile.enabled && Boolean(resume.summary) && (
        <Section theme={theme} title={resume.labels.profile.title} first>
          <Body theme={theme}>{resume.summary}</Body>
        </Section>
      )}

      {resume.labels.employment.enabled && resume.work.length > 0 && (
        <Section theme={theme} title={resume.labels.employment.title}>
          {resume.work.map((job, index) =>
            entry({
              key: index,
              title: job.title,
              org: job.org,
              date: formatRange(job),
              description: job.description,
              bullets: job.bullets,
              last: index === resume.work.length - 1,
            }),
          )}
        </Section>
      )}

      {resume.labels.education.enabled && resume.education.length > 0 && (
        <Section theme={theme} title={resume.labels.education.title}>
          {resume.education.map((edu, index) =>
            entry({
              key: index,
              title: edu.degree,
              org: edu.org,
              date: formatRange(edu),
              facts: [
                edu.majors.length ? `Subjects: ${edu.majors.join(', ')}` : '',
                edu.areaOfStudy,
                edu.grade ? `Grade: ${edu.grade}` : '',
                edu.accreditation,
              ].filter(Boolean),
              bullets: edu.bullets,
              last: index === resume.education.length - 1,
            }),
          )}
        </Section>
      )}

      {!inSide('skills') && resume.labels.skills.enabled && resume.skills.length > 0 && (
        <Section theme={theme} title={resume.labels.skills.title}>
          <Body theme={theme}>{resume.skills.map((skill) => skill.name).join(' · ')}</Body>
        </Section>
      )}
      {!inSide('hobbies') && resume.labels.hobbies.enabled && resume.hobbies.length > 0 && (
        <Section theme={theme} title={resume.labels.hobbies.title}>
          <Body theme={theme}>{resume.hobbies.join(' · ')}</Body>
        </Section>
      )}

      {resume.custom.map((custom, index) => (
        <Section key={custom.id ?? index} theme={theme} title={custom.title || 'Additional Information'}>
          <RichText theme={theme} html={custom.content} />
        </Section>
      ))}

      <PageNumber theme={theme} style={{ left: width }} />
    </Page>
  );
}
