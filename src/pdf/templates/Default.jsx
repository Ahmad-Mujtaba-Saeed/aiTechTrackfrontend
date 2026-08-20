import React from 'react';
import { Page, View, Text } from '@react-pdf/renderer';
import { Photo, PageNumber } from '../primitives';
import {
  PersonalDetailsSection,
  ProfileSection,
  WorkSection,
  EducationSection,
  SkillsSection,
  LanguagesSection,
  HobbiesSection,
  CustomSections,
} from '../sections';

/**
 * Default — the recommended design.
 *
 * Serif, single column, formal. Leads with a personal-details table, which is
 * what European employers and most ATS parsers expect to find first.
 */
export default function Default({ resume, theme }) {
  return (
    <Page size="A4" style={{ ...theme.page, backgroundColor: '#FFFFFF' }}>
      <View
        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}
        wrap={false}
      >
        <View style={{ flex: 1, paddingRight: 16 }}>
          <Text
            style={{
              fontFamily: theme.fontFamilyBold,
              fontSize: theme.nameSize,
              color: theme.ink,
              letterSpacing: theme.letterSpacing,
            }}
          >
            {resume.name.full}
          </Text>
          {Boolean(resume.headline) && (
            <Text
              style={{
                fontFamily: theme.fontFamilyItalic,
                fontSize: theme.headlineSize,
                color: theme.muted,
                marginTop: 3,
              }}
            >
              {resume.headline}
            </Text>
          )}
        </View>
        <Photo src={resume.photo} size={74} border={theme.rule} />
      </View>

      <PersonalDetailsSection resume={resume} theme={theme} first labelWidth={104} />
      <ProfileSection resume={resume} theme={theme} />
      <WorkSection resume={resume} theme={theme} />
      <EducationSection resume={resume} theme={theme} />
      <SkillsSection resume={resume} theme={theme} variant="list" />
      <LanguagesSection resume={resume} theme={theme} />
      <HobbiesSection resume={resume} theme={theme} />
      <CustomSections resume={resume} theme={theme} />

      <PageNumber theme={theme} />
    </Page>
  );
}
