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
 * Classic — chronological, unadorned, maximum ATS friendliness.
 *
 * No rules, no fills, no chips: just blue headings and generous leading. Dates
 * sit inline with the employer, which reads naturally as a career timeline.
 */
export default function Classic({ resume, theme }) {
  const contacts = contactEntries(resume).map((entry) => entry.value);

  return (
    <Page size="A4" style={{ ...theme.page, backgroundColor: '#FFFFFF' }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 }} wrap={false}>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: theme.fontFamilyBold,
              fontSize: theme.nameSize,
              color: theme.ink,
              lineHeight: 1.15,
            }}
          >
            {resume.name.full}
          </Text>
          {Boolean(resume.headline) && (
            <Text
              style={{
                fontFamily: theme.fontFamilyBold,
                fontSize: theme.headlineSize + 0.5,
                color: theme.accent,
                marginTop: 3,
              }}
            >
              {resume.headline}
            </Text>
          )}
          {contacts.length > 0 && (
            <Meta theme={theme} style={{ marginTop: 6, color: theme.body }}>
              {contacts.join('  ·  ')}
            </Meta>
          )}
        </View>
        <Photo src={resume.photo} size={72} style={{ marginLeft: 16 }} />
      </View>

      <ProfileSection resume={resume} theme={theme} first />
      <WorkSection resume={resume} theme={theme} showDatesInline />
      <EducationSection resume={resume} theme={theme} showDatesInline />
      <SkillsSection resume={resume} theme={theme} variant="inline" />
      <LanguagesSection resume={resume} theme={theme} variant="inline" />
      <HobbiesSection resume={resume} theme={theme} />
      <CustomSections resume={resume} theme={theme} />

      <PageNumber theme={theme} />
    </Page>
  );
}
