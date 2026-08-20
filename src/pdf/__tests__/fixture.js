/**
 * A deliberately oversized resume in the RAW `parsedResume` shape.
 *
 * Long enough to span several pages, and seeded with the awkward variants the
 * real parser emits: skills as `{ name: { name } }`, summary as an array,
 * newline-delimited education blobs, CKEditor HTML in custom sections. Every
 * distinctive string is checked for in the rendered PDF, so anything the layout
 * silently clips shows up as a test failure.
 */

const LOREM =
  'Delivered measurable improvements across the platform by profiling hot paths, ' +
  'removing redundant network round-trips and introducing a caching layer that cut ' +
  'median response time substantially while keeping the public contract unchanged.';

const job = (index) => ({
  workExperienceJobTitle: `Senior Engineer Role ${index}`,
  workExperienceOrganization: `Employer Number ${index} Limited`,
  workExperienceDates: {
    start: { date: `Jan 20${10 + index}` },
    end: index === 1 ? {} : { date: `Dec 20${11 + index}` },
  },
  workExperienceDescription: `${LOREM} Engagement marker ROLEDESC${index}.`,
  highlights: {
    items: Array.from({ length: 6 }, (_, bulletIndex) => ({
      bullet: `Achievement BULLET${index}x${bulletIndex} — ${LOREM}`,
    })),
  },
});

export const LONG_RESUME = {
  candidateName: [{ firstName: 'Alexandra', familyName: 'Whitfield-Barrington' }],
  headline: 'Principal Platform Engineer & Technical Lead',
  profilePic: null,

  email: ['alexandra.whitfield@example.com'],
  phoneNumber: [{ formattedNumber: '+44 7700 900123' }],
  location: { formatted: '42 Kingsway, London', city: 'London', postCode: 'WC2B 6LH' },
  socialLinks: {
    github: 'github.com/awhitfield',
    linkedin: 'linkedin.com/in/awhitfield',
    website: 'awhitfield.dev',
  },

  summary: [{ paragraph: `SUMMARYMARK. ${LOREM} ${LOREM}` }],

  // Six roles with six bullets each — comfortably more than one page.
  workExperience: Array.from({ length: 6 }, (_, index) => job(index + 1)),

  education: [
    {
      educationLevel: { label: 'MSc Advanced Computer Science' },
      educationOrganization: 'University of Manchester',
      educationDates: { start: { date: 'Sep 2008' }, end: { date: 'Jul 2009' } },
      educationMajor: ['Distributed Systems', 'Machine Learning'],
      achievedGrade: 'Distinction',
      educationDescription: 'EDUBULLETA thesis on consensus protocols\nEDUBULLETB teaching assistant',
    },
    {
      educationLevel: { label: 'BSc Computer Science' },
      educationOrganization: 'University of Leeds',
      educationDates: { start: { date: 'Sep 2005' }, end: { date: 'Jul 2008' } },
      educationMajor: ['Software Engineering'],
      achievedGrade: 'First Class Honours',
      educationDescription: '',
    },
  ],

  // Mixed shapes on purpose: plain string, { name }, and nested { name: { name } }.
  skill: [
    { name: 'TypeScript', selected: true, level: 'Expert' },
    { name: { name: 'React' }, selected: true, level: 'Expert' },
    { name: 'Node.js', selected: true, level: 'Advanced' },
    { name: 'PostgreSQL', selected: true, level: 'Advanced' },
    { name: 'Kubernetes', selected: true, level: 'Intermediate' },
    { name: 'Terraform', selected: true, level: 'Intermediate' },
    { name: 'GraphQL', selected: true, level: 'Advanced' },
    { name: 'SKILLKEPT', selected: true, level: 'Expert' },
    // Explicitly deselected — must NOT appear in the PDF.
    { name: 'SKILLDROPPED', selected: false, level: 'Beginner' },
  ],

  languages: [
    { name: 'English', level: 'Native' },
    { language: 'French', fluency: 'Fluent' },
    { name: { name: 'German' }, level: 'Intermediate' },
  ],

  hobbies: ['Long-distance running', 'Chess', 'HOBBYMARK woodworking'],
  qualities: ['Pragmatic', 'Collaborative'],

  customSections: [
    {
      id: 'c1',
      title: 'Certifications',
      content:
        '<p>CUSTOMPARA holder of several <strong>cloud certifications</strong> and ' +
        '<em>security accreditations</em>.</p>' +
        '<ul><li>CUSTOMLI1 AWS Solutions Architect &amp; Professional</li>' +
        '<li>CUSTOMLI2 Certified Kubernetes Administrator</li></ul>',
    },
    {
      id: 'c2',
      title: 'Speaking',
      content: '<h3>CUSTOMH3 Conferences</h3><p>CUSTOMPARA2 Regular speaker on platform topics.</p>',
    },
  ],
};

/**
 * A CV whose single bullet is taller than a whole page.
 *
 * Bullets are normally kept atomic so the marker never separates from its text.
 * That would clip a bullet too tall to fit any page, so oversized ones are
 * allowed to split — this fixture proves both ends still make it into the file.
 */
export const OVERSIZED_BULLET_RESUME = {
  candidateName: [{ firstName: 'Overflow', familyName: 'Case' }],
  summary: [{ paragraph: '' }],
  education: [],
  skill: [],
  languages: [],
  hobbies: [],
  customSections: [],
  workExperience: [
    {
      workExperienceJobTitle: 'Single Enormous Bullet',
      workExperienceOrganization: 'Edge Case Ltd',
      workExperienceDates: { start: { date: 'Jan 2020' }, end: {} },
      workExperienceDescription: '',
      highlights: {
        items: [
          {
            bullet:
              'GIANTSTART ' +
              `${LOREM} `.repeat(30) +
              'GIANTEND',
          },
        ],
      },
    },
  ],
};

/** Distinctive tokens that must survive into the rendered PDF. */
export const REQUIRED_TOKENS = [
  'SUMMARYMARK',
  ...Array.from({ length: 6 }, (_, i) => `ROLEDESC${i + 1}`),
  // First and last bullet of every role — catches clipping at page boundaries.
  ...Array.from({ length: 6 }, (_, i) => `BULLET${i + 1}x0`),
  ...Array.from({ length: 6 }, (_, i) => `BULLET${i + 1}x5`),
  'EDUBULLETA',
  'EDUBULLETB',
  'SKILLKEPT',
  'HOBBYMARK',
  'CUSTOMPARA',
  'CUSTOMLI1',
  'CUSTOMLI2',
  'CUSTOMH3',
  'CUSTOMPARA2',
];

/** Tokens that must NOT appear (deselected skill). */
export const FORBIDDEN_TOKENS = ['SKILLDROPPED'];

/** A minimal, mostly-empty resume — guards against crashes on a fresh CV. */
export const EMPTY_RESUME = {
  candidateName: [{ firstName: '', familyName: '' }],
  summary: [{ paragraph: '' }],
  workExperience: [],
  education: [],
  skill: [],
  languages: [],
  hobbies: [],
  customSections: [],
};
