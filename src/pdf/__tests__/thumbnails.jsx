/**
 * Regenerate the Design tab thumbnails from the live templates.
 *
 * The pictures in the design picker are the main thing users choose on, so they
 * have to be renders of the real templates rather than hand-made mockups that
 * drift. Run this after changing any template:
 *
 *   npm run pdf:thumbnails      (requires pdftoppm from poppler on PATH)
 *
 * Writes one PDF per design, which the npm script converts to PNG.
 */

import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { renderToBuffer } from '@react-pdf/renderer';

import ResumeDocument from '../ResumeDocument';
import { PDF_TEMPLATES } from '../templates';

const OUT_DIR = path.join(process.cwd(), 'public/assets/images/templates');

/**
 * A realistic one-page CV. Deliberately not the test fixture: this is what a
 * good resume looks like, sized so every section is visible in the thumbnail
 * without spilling to a second page.
 */
const SAMPLE = {
  candidateName: [{ firstName: 'Jordan', familyName: 'Avery' }],
  headline: 'Senior Product Designer',
  profilePic: null,
  email: ['jordan.avery@example.com'],
  phoneNumber: [{ formattedNumber: '+44 7700 900482' }],
  location: { formatted: '18 Bridge Street, Bristol', city: 'Bristol', postCode: 'BS1 4ND' },
  socialLinks: { linkedin: 'linkedin.com/in/javery', website: 'javery.design' },
  summary: [
    {
      paragraph:
        'Product designer with nine years building data-heavy tools for regulated ' +
        'industries. I work close to engineering, prototype in code, and care most ' +
        'about the parts of a product people use every day.',
    },
  ],
  workExperience: [
    {
      workExperienceJobTitle: 'Senior Product Designer',
      workExperienceOrganization: 'Meridian Health',
      workExperienceDates: { start: { date: 'Mar 2021' }, end: {} },
      workExperienceDescription: '',
      highlights: {
        items: [
          { bullet: 'Led the redesign of the clinician dashboard, cutting average charting time by 31%.' },
          { bullet: 'Built and maintained the design system now used by four product teams.' },
          { bullet: 'Ran the accessibility programme that took the platform to WCAG 2.2 AA.' },
        ],
      },
    },
    {
      workExperienceJobTitle: 'Product Designer',
      workExperienceOrganization: 'Northwind Financial',
      workExperienceDates: { start: { date: 'Jun 2017' }, end: { date: 'Feb 2021' } },
      workExperienceDescription: '',
      highlights: {
        items: [
          { bullet: 'Shipped the mobile onboarding flow that lifted account activation by 18%.' },
          { bullet: 'Introduced weekly usability testing, now standard across the department.' },
        ],
      },
    },
  ],
  education: [
    {
      educationLevel: { label: 'BA Graphic Design' },
      educationOrganization: 'University of the Arts London',
      educationDates: { start: { date: '2013' }, end: { date: '2016' } },
      educationMajor: ['Interaction Design'],
      achievedGrade: 'First Class Honours',
      educationDescription: '',
    },
  ],
  skill: [
    { name: 'Figma', selected: true, level: 'Expert' },
    { name: 'Design Systems', selected: true, level: 'Expert' },
    { name: 'Prototyping', selected: true, level: 'Advanced' },
    { name: 'User Research', selected: true, level: 'Advanced' },
    { name: 'HTML & CSS', selected: true, level: 'Intermediate' },
    { name: 'Accessibility', selected: true, level: 'Advanced' },
  ],
  languages: [
    { name: 'English', level: 'Native' },
    { name: 'Spanish', level: 'Intermediate' },
  ],
  hobbies: ['Bouldering', 'Film photography', 'Cooking'],
  customSections: [],
};

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const name of Object.keys(PDF_TEMPLATES)) {
    const buffer = await renderToBuffer(<ResumeDocument resume={SAMPLE} template={name} />);
    fs.writeFileSync(path.join(OUT_DIR, `${name}.pdf`), buffer);
    console.log(`  rendered ${name}`);
  }

  console.log(`\n  PDFs in ${OUT_DIR}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
