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
 * Basic — compact and utilitarian.
 *
 * Contact details collapse into a single wrapping strip under the name instead
 * of a table, which buys roughly a third of a page back for actual content.
 * Section headings are solid bars, so the structure is obvious at a glance.
 */
export default function Basic({ resume, theme }) {
  const contacts = contactEntries(resume).map((entry) => entry.value);

  return (
    <Page size="A4" style={{ ...theme.page, backgroundColor: '#FFFFFF' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }} wrap={false}>
        <Photo src={resume.photo} size={64} radius={3} style={{ marginRight: 14 }} />
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: theme.fontFamilyBold,
              fontSize: theme.nameSize,
              color: theme.ink,
              letterSpacing: 0.3,
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
                marginTop: 2,
              }}
            >
              {resume.headline}
            </Text>
          )}
        </View>
      </View>

      {contacts.length > 0 && (
        <View
          style={{
            borderTopWidth: 0.75,
            borderBottomWidth: 0.75,
            borderColor: theme.rule,
            paddingVertical: 5,
            marginBottom: 4,
          }}
        >
          <Meta theme={theme}>{contacts.join('   ·   ')}</Meta>
        </View>
      )}

      <ProfileSection resume={resume} theme={theme} />
      <WorkSection resume={resume} theme={theme} showDatesInline />
      <EducationSection resume={resume} theme={theme} showDatesInline />
      <SkillsSection resume={resume} theme={theme} variant="chips" />
      <LanguagesSection resume={resume} theme={theme} variant="inline" />
      <HobbiesSection resume={resume} theme={theme} />
      <CustomSections resume={resume} theme={theme} />

      <PageNumber theme={theme} />
    </Page>
  );
}
