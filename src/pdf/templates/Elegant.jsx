import React from 'react';
import { Page, View, Text } from '@react-pdf/renderer';
import { Photo, PageNumber } from '../primitives';
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
 * Elegant — full-bleed teal banner over a single content column.
 *
 * The banner carries the name, headline and contact details in reversed ink,
 * leaving the body free of any contact table at all.
 */
export default function Elegant({ resume, theme }) {
  const contacts = contactEntries(resume);
  const gutter = theme.page.paddingHorizontal;

  return (
    <Page size="A4" style={{ ...theme.page, backgroundColor: '#FFFFFF' }}>
      {/* Full-bleed banner: negative margins escape the page padding, which
          stays on the Page so page two still gets a proper top margin. */}
      <View
        style={{
          backgroundColor: theme.bannerBackground,
          paddingTop: 30,
          paddingBottom: 24,
          paddingHorizontal: gutter,
          marginHorizontal: -gutter,
          marginTop: -theme.page.paddingTop,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        wrap={false}
      >
        {Boolean(resume.photo) && (
          <Photo src={resume.photo} size={86} border="rgba(255,255,255,0.7)" style={{ marginRight: 20 }} />
        )}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: theme.fontFamilyBold,
              fontSize: theme.nameSize,
              color: theme.bannerInk,
              letterSpacing: 0.8,
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
                color: 'rgba(255,255,255,0.88)',
                marginTop: 3,
                letterSpacing: 0.6,
              }}
            >
              {resume.headline}
            </Text>
          )}
          {contacts.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 9 }}>
              {contacts.map(({ label, value }) => (
                <Text
                  key={label}
                  style={{
                    fontFamily: theme.fontFamily,
                    fontSize: theme.metaSize,
                    color: 'rgba(255,255,255,0.92)',
                    marginRight: 12,
                    marginBottom: 2,
                  }}
                >
                  {value}
                </Text>
              ))}
            </View>
          )}
        </View>
      </View>

      <View style={{ paddingTop: 18 }}>
        <ProfileSection resume={resume} theme={theme} first />
        <WorkSection resume={resume} theme={theme} />
        <EducationSection resume={resume} theme={theme} />
        <SkillsSection resume={resume} theme={theme} variant="chips" />
        <LanguagesSection resume={resume} theme={theme} variant="inline" />
        <HobbiesSection resume={resume} theme={theme} />
        <CustomSections resume={resume} theme={theme} />
      </View>

      <PageNumber theme={theme} />
    </Page>
  );
}
