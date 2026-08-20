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
 * Luxe — centred serif masthead in burgundy.
 *
 * The name is framed by double rules and the contact line is centred beneath it,
 * giving a formal, letterpress feel suited to senior and client-facing roles.
 */
export default function Luxe({ resume, theme }) {
  const contacts = contactEntries(resume).map((entry) => entry.value);

  return (
    <Page size="A4" style={{ ...theme.page, backgroundColor: '#FFFFFF' }}>
      <View style={{ alignItems: 'center', marginBottom: 20 }} wrap={false}>
        {Boolean(resume.photo) && (
          <Photo src={resume.photo} size={82} border={theme.accent} style={{ marginBottom: 12 }} />
        )}

        <View
          style={{
            borderTopWidth: 2,
            borderBottomWidth: 0.75,
            borderColor: theme.accent,
            paddingVertical: 10,
            paddingHorizontal: 10,
            alignItems: 'center',
            alignSelf: 'stretch',
          }}
        >
          <Text
            style={{
              fontFamily: theme.fontFamilyBold,
              fontSize: theme.nameSize,
              color: theme.accent,
              letterSpacing: theme.letterSpacing,
              textAlign: 'center',
              lineHeight: 1.15,
            }}
          >
            {resume.name.full.toUpperCase()}
          </Text>
          {Boolean(resume.headline) && (
            <Text
              style={{
                fontFamily: theme.fontFamilyItalic,
                fontSize: theme.headlineSize + 0.5,
                color: theme.ink,
                marginTop: 5,
                textAlign: 'center',
              }}
            >
              {resume.headline}
            </Text>
          )}
        </View>

        {contacts.length > 0 && (
          <Meta theme={theme} style={{ marginTop: 8, textAlign: 'center', color: theme.body }}>
            {contacts.join('   ·   ')}
          </Meta>
        )}
      </View>

      <ProfileSection resume={resume} theme={theme} first />
      <WorkSection resume={resume} theme={theme} />
      <EducationSection resume={resume} theme={theme} />
      <SkillsSection resume={resume} theme={theme} variant="inline" />
      <LanguagesSection resume={resume} theme={theme} variant="inline" />
      <HobbiesSection resume={resume} theme={theme} />
      <CustomSections resume={resume} theme={theme} />

      <PageNumber theme={theme} />
    </Page>
  );
}
