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
 * Pagination note: the coloured sidebar is drawn by a `fixed` absolutely
 * positioned band, so it repeats on every page regardless of how the content
 * flows. The columns themselves are ordinary flow content inside a row, which
 * lets the main column continue onto page two while the band stays put. Drawing
 * the band as part of the sidebar column instead would leave page two with a
 * white stripe the moment the sidebar ran out of content.
 */
export default function SidebarLayout({ resume, theme, skillVariant = 'bars', photoRadius }) {
  const width = theme.sidebarWidth;
  const contacts = contactEntries(resume);

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
    // Vertical padding belongs on the Page, not on the columns: react-pdf
    // re-applies Page padding to every page, whereas padding on an inner View
    // is only honoured at the start and end of that View. Putting it on the
    // columns would leave page two starting flush against the paper edge.
    <Page size="A4" style={{ paddingTop: 34, paddingBottom: 40, backgroundColor: '#FFFFFF' }}>
      {/* Repeats on every page so the band never runs out. */}
      <View
        fixed
        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width, backgroundColor: theme.sidebarBackground }}
      />

      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        {/* ------------------------------------------------------ sidebar -- */}
        <View style={{ width, paddingHorizontal: 20 }}>
          {Boolean(resume.photo) && (
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
          <LanguagesSection resume={resume} theme={sidebarTheme} color={theme.sidebarInk} />
          <HobbiesSection resume={resume} theme={sidebarTheme} color={theme.sidebarInk} />
        </View>

        {/* --------------------------------------------------------- main -- */}
        <View style={{ flex: 1, paddingLeft: 24, paddingRight: 34 }}>
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
          <CustomSections resume={resume} theme={theme} />
        </View>
      </View>

      <PageNumber theme={theme} style={{ left: width }} />
    </Page>
  );
}
