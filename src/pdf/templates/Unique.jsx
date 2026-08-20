import React from 'react';
import { Page, View, Text } from '@react-pdf/renderer';
import { Photo, PageNumber, Meta } from '../primitives';
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
 * Unique — high-contrast editorial.
 *
 * An oversized name block sits in a black slab, section headings are outlined
 * rather than filled, and contact details run as a single rule-separated line.
 * Monochrome by design, so it survives being printed on any office device.
 */
export default function Unique({ resume, theme }) {
  const contacts = contactEntries(resume).map((entry) => entry.value);

  return (
    <Page size="A4" style={{ ...theme.page, backgroundColor: '#FFFFFF' }}>
      {/* Bleeds past the page padding via negative margins. The padding itself
          stays on the Page so page two keeps its top margin. */}
      <View
        style={{
          backgroundColor: theme.accent,
          paddingVertical: 26,
          paddingHorizontal: theme.page.paddingHorizontal,
          marginHorizontal: -theme.page.paddingHorizontal,
          marginTop: -theme.page.paddingTop,
          marginBottom: 18,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        wrap={false}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: theme.fontFamilyBold,
              fontSize: theme.nameSize + 4,
              color: '#FFFFFF',
              letterSpacing: theme.letterSpacing,
              lineHeight: 1.1,
            }}
          >
            {resume.name.full.toUpperCase()}
          </Text>
          {Boolean(resume.headline) && (
            <Text
              style={{
                fontFamily: theme.fontFamily,
                fontSize: theme.headlineSize,
                color: 'rgba(255,255,255,0.78)',
                marginTop: 5,
                letterSpacing: 1.2,
              }}
            >
              {resume.headline.toUpperCase()}
            </Text>
          )}
        </View>
        <Photo src={resume.photo} size={80} radius={3} style={{ marginLeft: 18 }} />
      </View>

      {contacts.length > 0 && (
        <View style={{ borderBottomWidth: 1, borderBottomColor: theme.rule, paddingBottom: 7, marginBottom: 2 }}>
          <Meta theme={theme} style={{ color: theme.ink }}>
            {contacts.join('   |   ')}
          </Meta>
        </View>
      )}

      <ProfileSection resume={resume} theme={theme} />
      <WorkSection resume={resume} theme={theme} />
      <EducationSection resume={resume} theme={theme} />
      <SkillsSection resume={resume} theme={theme} variant="chips" />
      <LanguagesSection resume={resume} theme={theme} variant="inline" />
      <HobbiesSection resume={resume} theme={theme} />
      <CustomSections resume={resume} theme={theme} />

      <PageNumber theme={theme} />
    </Page>
  );
}
