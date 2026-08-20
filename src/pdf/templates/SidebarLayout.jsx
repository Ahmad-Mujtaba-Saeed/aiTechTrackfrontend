import React from 'react';
import { Page, View, Text } from '@react-pdf/renderer';
import { Photo, PageNumber, Section } from '../primitives';
import { contactEntries } from '../normalize';
import {
  ProfileSection,
  WorkSection,
  EducationSection,
  SkillsSection,
  LanguagesSection,
  HobbiesSection,
  CustomSections,
} from '../sections';

/**
 * Two-column shell shared by the Professional and Modern designs.
 *
 * IMPORTANT — why this is not a flex row.
 *
 * The obvious implementation is `flexDirection: 'row'` with a sidebar column and
 * a main column. That renders page one correctly and then breaks badly: when the
 * row splits across pages, react-pdf re-runs the flex layout for the continuation
 * fragment. The sidebar column has no content left, so it collapses to zero width
 * and the main column slides left to x=0 — printing the rest of the CV directly
 * on top of the coloured band, unreadable.
 *
 * So the columns are not siblings in a row. Instead:
 *
 *   - The band is a `fixed` absolutely positioned View, repeated on every page.
 *   - Sidebar content is absolutely positioned, so it sits outside the flow and
 *     appears on page one only. (Absolute offsets are relative to the page's
 *     border box, not its padding box, so `left: 0` is the true paper edge.)
 *   - Main content is ordinary flow, offset by the Page's own `paddingLeft`.
 *     Page padding is re-applied to every page, so page two keeps the offset.
 *
 * The trade-off is that absolute content cannot itself paginate, so an unusually
 * crowded sidebar would overflow. `spillOver` below moves the least essential
 * sections into the main column before that can happen.
 */

const GUTTER = 24;
const SIDE_PADDING = 20;
const TOP = 34;
const BOTTOM = 40;

/**
 * Rough height estimate for the sidebar, in points, used to decide what still
 * fits. Deliberately conservative — over-estimating merely moves a section into
 * the main column, while under-estimating would clip it.
 */
function estimateSidebarHeight({ theme, contacts, resume, hasPhoto, skillVariant }) {
  const heading = theme.sectionSize + 14;
  let height = hasPhoto ? 108 : 0;

  height += heading + contacts.length * 22;

  if (resume.labels.skills.enabled && resume.skills.length) {
    height += heading + resume.skills.length * (skillVariant === 'bars' ? 17 : 14);
  }
  if (resume.labels.languages.enabled && resume.languages.length) {
    height += heading + resume.languages.length * 14;
  }
  if (resume.labels.hobbies.enabled && resume.hobbies.length) {
    height += heading + resume.hobbies.length * 13;
  }
  return height;
}

export default function SidebarLayout({ resume, theme, skillVariant = 'bars', photoRadius }) {
  const width = theme.sidebarWidth;
  const contacts = contactEntries(resume);
  const hasPhoto = Boolean(resume.photo);

  // Usable vertical space on page one for the absolutely positioned sidebar.
  const available = 841.89 - TOP - BOTTOM;

  // Drop the least essential sections into the main column, worst case first,
  // until the estimate fits. Contact details and skills always stay put.
  const spillOver = [];
  let estimate = estimateSidebarHeight({ theme, contacts, resume, hasPhoto, skillVariant });
  for (const key of ['hobbies', 'languages']) {
    if (estimate <= available) break;
    spillOver.push(key);
    estimate -= key === 'hobbies'
      ? theme.sectionSize + 14 + resume.hobbies.length * 13
      : theme.sectionSize + 14 + resume.languages.length * 14;
  }
  const inSidebar = (key) => !spillOver.includes(key);

  // The sidebar uses inverted ink, so it needs its own theme derivative rather
  // than the accent-on-white values the main column uses.
  const sidebarTheme = {
    ...theme,
    accent: theme.sidebarInk,
    onAccent: theme.sidebarBackground,
    ink: theme.sidebarInk,
    body: theme.sidebarInk,
    muted: theme.sidebarMuted,
    rule: 'rgba(255,255,255,0.35)',
    sectionStyle: 'rule',
    sectionSize: theme.sectionSize - 0.5,
    bodySize: theme.bodySize - 0.5,
    sectionGap: 13,
  };

  return (
    <Page
      size="A4"
      style={{
        paddingTop: TOP,
        paddingBottom: BOTTOM,
        // Keeps every page's flowed content clear of the band.
        paddingLeft: width + GUTTER,
        paddingRight: 34,
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* The band itself, repeated on every page. */}
      <View
        fixed
        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width, backgroundColor: theme.sidebarBackground }}
      />

      {/* Sidebar content — outside the flow, so page one only. */}
      <View
        style={{
          position: 'absolute',
          top: TOP,
          left: SIDE_PADDING,
          width: width - SIDE_PADDING * 2,
        }}
      >
        {hasPhoto && (
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Photo src={resume.photo} size={92} radius={photoRadius} border="rgba(255,255,255,0.6)" />
          </View>
        )}

        {contacts.length > 0 && (
          <Section theme={sidebarTheme} title={resume.labels.personal.title} first>
            {contacts.map(({ label, value }) => (
              <View key={label} style={{ marginBottom: 5 }}>
                <Text
                  style={{
                    fontFamily: sidebarTheme.fontFamilyBold,
                    fontSize: sidebarTheme.metaSize - 0.5,
                    color: theme.sidebarMuted,
                    letterSpacing: 0.5,
                  }}
                >
                  {label.toUpperCase()}
                </Text>
                <Text
                  style={{
                    fontFamily: sidebarTheme.fontFamily,
                    fontSize: sidebarTheme.bodySize,
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

        <SkillsSection
          resume={resume}
          theme={sidebarTheme}
          variant={skillVariant}
          color={theme.sidebarInk}
          muted="#FFFFFF"
          track="rgba(255,255,255,0.28)"
        />
        {inSidebar('languages') && (
          <LanguagesSection resume={resume} theme={sidebarTheme} color={theme.sidebarInk} />
        )}
        {inSidebar('hobbies') && (
          <HobbiesSection resume={resume} theme={sidebarTheme} color={theme.sidebarInk} />
        )}
      </View>

      {/* Main column — ordinary flow, offset by the page padding. */}
      <View style={{ marginBottom: 14 }} wrap={false}>
        <Text
          style={{
            fontFamily: theme.fontFamilyBold,
            fontSize: theme.nameSize,
            color: theme.ink,
            letterSpacing: 0.4,
            lineHeight: 1.15,
          }}
        >
          {resume.name.full}
        </Text>
        {Boolean(resume.headline) && (
          <Text
            style={{
              fontFamily: theme.fontFamily,
              fontSize: theme.headlineSize,
              color: theme.accent,
              marginTop: 3,
              letterSpacing: 0.4,
            }}
          >
            {resume.headline}
          </Text>
        )}
        <View style={{ height: 2, width: 46, backgroundColor: theme.accent, marginTop: 8 }} />
      </View>

      <ProfileSection resume={resume} theme={theme} first />
      <WorkSection resume={resume} theme={theme} />
      <EducationSection resume={resume} theme={theme} />
      {!inSidebar('languages') && <LanguagesSection resume={resume} theme={theme} variant="inline" />}
      {!inSidebar('hobbies') && <HobbiesSection resume={resume} theme={theme} />}
      <CustomSections resume={resume} theme={theme} />

      <PageNumber theme={theme} style={{ left: width }} />
    </Page>
  );
}
