import React from 'react';
import { Page, View, Text, Image } from '@react-pdf/renderer';
import {
  Section,
  Body,
  Meta,
  BulletList,
  SquareList,
  LevelBar,
  TitleDateRow,
  RichText,
  PageNumber,
} from '../primitives';
import { contactEntries, formatRange } from '../normalize';
import Icon from '../icons';

/**
 * Professional — dark banner masthead over a two-column body.
 *
 * Layout notes (the same constraint as the other multi-column design):
 * react-pdf re-runs flex layout for a fragment that continues onto a new page,
 * so real side-by-side columns collapse after page one. Instead the right-hand
 * column is absolutely positioned — it holds only short supporting detail and
 * belongs on page one — while the main column is ordinary flow kept clear of it
 * by the Page's own `paddingRight`, which react-pdf re-applies to every page.
 *
 * The banner escapes that padding with negative margins so it can bleed to all
 * three edges without stopping the padding from applying on page two.
 */

const PAD_X = 40;

export default function Professional({ resume, theme }) {
  const aside = theme.asideWidth;
  const gutter = theme.asideGutter;
  const contacts = contactEntries(resume);

  // The banner carries the everyday contact points; anything more niche drops
  // into the right-hand column so the masthead stays on one line.
  const bannerKeys = ['Email', 'Phone', 'Address'];
  const inBanner = contacts.filter((entry) => bannerKeys.includes(entry.label));
  const inAside = contacts.filter((entry) => !bannerKeys.includes(entry.label));

  const iconFor = { Email: 'mail', Phone: 'phone', Address: 'pin' };

  return (
    <Page
      size="A4"
      style={{
        paddingTop: 34,
        paddingBottom: 44,
        paddingLeft: PAD_X,
        // Keeps flowed content clear of the absolutely positioned column.
        paddingRight: PAD_X + aside + gutter,
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* ---------------------------------------------------------- banner -- */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'stretch',
          backgroundColor: theme.bannerBackground,
          height: theme.bannerHeight,
          marginTop: -34,
          marginLeft: -PAD_X,
          marginRight: -(PAD_X + aside + gutter),
          marginBottom: 20,
        }}
        wrap={false}
      >
        {Boolean(resume.photo) && (
          <Image
            src={resume.photo}
            style={{ width: theme.bannerHeight, height: theme.bannerHeight, objectFit: 'cover' }}
          />
        )}

        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 22 }}>
          <Text
            style={{
              fontFamily: theme.fontFamily,
              fontSize: theme.nameSize,
              color: theme.bannerInk,
              letterSpacing: 0.3,
            }}
          >
            {resume.name.full}
          </Text>

          {Boolean(resume.headline) && (
            <Text
              style={{
                fontFamily: theme.fontFamily,
                fontSize: theme.headlineSize - 0.5,
                color: theme.bannerMuted,
                marginTop: 3,
              }}
            >
              {resume.headline}
            </Text>
          )}

          {inBanner.length > 0 && (
            // Laid out inline rather than with IconRow: that component sizes its
            // text with flex:1 for stacked column use, which collapses when
            // several sit side by side on one line.
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 9 }}>
              {inBanner.map(({ label, value }) => (
                <View
                  key={label}
                  style={{ flexDirection: 'row', alignItems: 'center', marginRight: 14, marginBottom: 2 }}
                  wrap={false}
                >
                  <Icon name={iconFor[label]} size={7.5} color={theme.bannerInk} />
                  <Text
                    style={{
                      fontFamily: theme.fontFamily,
                      fontSize: theme.metaSize,
                      color: theme.bannerInk,
                      marginLeft: 4,
                    }}
                  >
                    {value}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* ------------------------------------------------- right-hand column -- */}
      <View
        style={{
          position: 'absolute',
          top: theme.bannerHeight + 20,
          right: PAD_X,
          width: aside,
        }}
      >
        {inAside.length > 0 && (
          <Section theme={theme} title={resume.labels.personal.title} first>
            {inAside.map(({ label, value }) => (
              <View key={label} style={{ marginBottom: 6 }}>
                <Text style={{ fontFamily: theme.fontFamily, fontSize: theme.metaSize, color: theme.muted }}>
                  {label}
                </Text>
                <Text
                  style={{
                    fontFamily: theme.fontFamily,
                    fontSize: theme.bodySize,
                    color: theme.body,
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
          <Section theme={theme} title={resume.labels.languages.title} first={!inAside.length}>
            {resume.languages.map((lang, index) => (
              <View key={index} style={{ marginBottom: 7 }} wrap={false}>
                <Text style={{ fontFamily: theme.fontFamily, fontSize: theme.bodySize, color: theme.body }}>
                  {lang.name}
                </Text>
                <LevelBar level={lang.level} track="#E4E7EB" fill={theme.accent} />
              </View>
            ))}
          </Section>
        )}

        {resume.labels.skills.enabled && resume.skills.length > 0 && (
          <Section theme={theme} title={resume.labels.skills.title}>
            <SquareList
              theme={theme}
              items={resume.skills.map((skill) => skill.name)}
              color={theme.body}
              markerColor={theme.accent}
            />
          </Section>
        )}

        {resume.qualities.length > 0 && (
          <Section theme={theme} title="Qualities">
            <SquareList theme={theme} items={resume.qualities} color={theme.body} markerColor={theme.accent} />
          </Section>
        )}

        {resume.labels.hobbies.enabled && resume.hobbies.length > 0 && (
          <Section theme={theme} title={resume.labels.hobbies.title}>
            <SquareList theme={theme} items={resume.hobbies} color={theme.body} markerColor={theme.accent} />
          </Section>
        )}
      </View>

      {/* -------------------------------------------------------- main column -- */}
      {resume.labels.profile.enabled && Boolean(resume.summary) && (
        <Section theme={theme} title={resume.labels.profile.title} first>
          <Body theme={theme} style={{ textAlign: 'justify' }}>
            {resume.summary}
          </Body>
        </Section>
      )}

      {resume.labels.employment.enabled && resume.work.length > 0 && (
        <Section theme={theme} title={resume.labels.employment.title}>
          {resume.work.map((job, index) => (
            <View
              key={index}
              style={{ marginBottom: index === resume.work.length - 1 ? 0 : theme.entryGap }}
            >
              <View wrap={false} minPresenceAhead={30}>
                <TitleDateRow theme={theme} title={job.title} date={formatRange(job)} />
                {Boolean(job.org) && (
                  <Meta theme={theme} style={{ marginTop: 0.5 }}>
                    {job.org}
                  </Meta>
                )}
              </View>
              {Boolean(job.description) && (
                <Body theme={theme} style={{ marginTop: 3 }}>
                  {job.description}
                </Body>
              )}
              <BulletList theme={theme} items={job.bullets} />
            </View>
          ))}
        </Section>
      )}

      {resume.labels.education.enabled && resume.education.length > 0 && (
        <Section theme={theme} title={resume.labels.education.title}>
          {resume.education.map((edu, index) => {
            const facts = [
              edu.majors.length ? `Subjects: ${edu.majors.join(', ')}` : '',
              edu.areaOfStudy,
              edu.grade ? `Grade: ${edu.grade}` : '',
              edu.accreditation,
            ].filter(Boolean);

            return (
              <View
                key={index}
                style={{ marginBottom: index === resume.education.length - 1 ? 0 : theme.entryGap }}
              >
                <View wrap={false} minPresenceAhead={30}>
                  <TitleDateRow theme={theme} title={edu.degree} date={formatRange(edu)} />
                  {Boolean(edu.org) && (
                    <Meta theme={theme} style={{ marginTop: 0.5 }}>
                      {edu.org}
                    </Meta>
                  )}
                </View>
                {facts.map((fact) => (
                  <Body key={fact} theme={theme} style={{ marginTop: 2 }}>
                    {fact}
                  </Body>
                ))}
                <BulletList theme={theme} items={edu.bullets} />
              </View>
            );
          })}
        </Section>
      )}

      {resume.custom.map((entry, index) => (
        <Section key={entry.id ?? index} theme={theme} title={entry.title || 'Additional Information'}>
          <RichText theme={theme} html={entry.content} />
        </Section>
      ))}

      <PageNumber theme={theme} />
    </Page>
  );
}
