/**
 * Canonical resume model.
 *
 * The raw `parsedResume` blob comes from the CV parser and years of incremental
 * edits, so the same logical field arrives in several shapes: `summary` is
 * sometimes an object and sometimes a single-element array, `skill[].name` is
 * sometimes a string and sometimes `{ name }`, dates live under two different
 * key names. Every template used to re-implement that defensive access inline.
 *
 * Normalising once, here, means the PDF templates only ever read a flat, known
 * shape and can stay purely presentational.
 */

/** Pull a value that may be a bare string, an array of strings, or [{ key }]. */
const pick = (value, key) => {
  if (value == null) return '';
  const first = Array.isArray(value) ? value[0] : value;
  if (first == null) return '';
  if (typeof first === 'string') return first.trim();
  if (key && typeof first === 'object') return String(first[key] ?? '').trim();
  return '';
};

/** `name` fields arrive as a string, or `{ name }`, or `{ name: { name } }`. */
const flattenName = (value) => {
  if (typeof value === 'string') return value.trim();
  if (value && typeof value === 'object') {
    return flattenName(value.name ?? value.label ?? value.language ?? '');
  }
  return '';
};

const text = (value) => (value == null ? '' : String(value).trim());

/** Drop empty strings and de-duplicate while preserving order. */
const compact = (list) => (Array.isArray(list) ? list.map(text).filter(Boolean) : []);

/**
 * Sections carry a `<key>Disabled` flag and an optional `<key>Title` override.
 * Absent flag means enabled.
 */
const section = (raw, key, fallbackTitle) => ({
  title: text(raw?.[`${key}Title`]) || fallbackTitle,
  enabled: !raw?.[`${key}Disabled`],
});

/** `{ start: { date }, end: { date } }` under one of two possible key names. */
const dateRange = (dates, { presentWhenEmpty = false } = {}) => {
  const start = text(dates?.start?.date);
  const end = text(dates?.end?.date);
  return {
    start,
    end: end || (presentWhenEmpty && start ? 'Present' : ''),
  };
};

/**
 * Split a legacy newline-delimited textarea into bullets. Tolerates `-`/`•`
 * prefixes that users type by hand.
 */
const splitLines = (value) =>
  text(value)
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*[-•*]\s*/, '').trim())
    .filter(Boolean);

export function normalizeResume(raw) {
  const source = raw || {};

  const first = text(source.candidateName?.[0]?.firstName);
  const last = text(source.candidateName?.[0]?.familyName);

  // `summary` has been both `{ paragraph }` and `[{ paragraph }]` over time.
  const summary = pick(source.summary, 'paragraph') || text(source.summary);

  const work = (source.workExperience || []).map((job) => {
    const bullets = (job?.highlights?.items || [])
      .map((item) => text(item?.bullet ?? item))
      .filter(Boolean);

    return {
      title: text(job?.workExperienceJobTitle),
      org: text(job?.workExperienceOrganization),
      ...dateRange(job?.workExperienceDates, { presentWhenEmpty: true }),
      description: text(job?.workExperienceDescription),
      bullets,
    };
  });

  const education = (source.education || []).map((edu) => ({
    degree: text(edu?.educationLevel?.label) || text(edu?.educationLevel),
    org: text(edu?.educationOrganization),
    ...dateRange(edu?.educationDates),
    majors: compact(edu?.educationMajor),
    areaOfStudy: text(edu?.educationAreaOfStudy),
    accreditation: text(edu?.educationAccreditation),
    grade: text(edu?.achievedGrade),
    // Historically a newline-delimited blob rendered as a <ul>.
    bullets: splitLines(edu?.educationDescription),
  }));

  const skills = (source.skill || [])
    // `selected` gates which parsed skills the user kept. Older records predate
    // the flag entirely, so treat "missing" as selected rather than hiding them.
    .filter((skill) => skill?.selected !== false)
    .map((skill) => ({
      name: flattenName(skill?.name ?? skill),
      level: text(skill?.level),
    }))
    .filter((skill) => skill.name);

  const languages = (source.languages || [])
    .map((lang) => ({
      name: flattenName(lang?.name ?? lang?.language ?? lang),
      level: text(lang?.level ?? lang?.fluency),
    }))
    .filter((lang) => lang.name);

  const custom = (source.customSections || [])
    .map((entry) => ({
      id: entry?.id,
      title: text(entry?.title),
      // CKEditor gives HTML; some older rows stored an array of lines.
      content: Array.isArray(entry?.content)
        ? entry.content.map(text).filter(Boolean).join('\n')
        : text(entry?.content),
    }))
    .filter((entry) => entry.title || entry.content);

  return {
    name: {
      first,
      last,
      full: [first, last].filter(Boolean).join(' '),
    },
    headline: text(source.headline),
    photo: text(source.profilePic) || null,

    contact: {
      email: pick(source.email),
      phone: pick(source.phoneNumber, 'formattedNumber'),
      address: text(source.location?.formatted),
      city: text(source.location?.city),
      postCode: text(source.location?.postCode),
      github: text(source.socialLinks?.github),
      linkedin: text(source.socialLinks?.linkedin),
      website: text(source.socialLinks?.website) || pick(source.website),
    },

    summary,
    qualities: compact(source.qualities),
    hobbies: compact(source.hobbies),

    work,
    education,
    skills,
    languages,
    custom,

    labels: {
      personal: section(source, 'personal', 'Personal Details'),
      profile: section(source, 'profile', 'Profile'),
      employment: section(source, 'employment', 'Employment'),
      education: section(source, 'education', 'Education'),
      skills: section(source, 'skills', 'Skills'),
      languages: section(source, 'languages', 'Languages'),
      hobbies: section(source, 'hobbies', 'Hobbies'),
    },
  };
}

/** Contact rows, pre-filtered to those that actually have a value. */
export function contactEntries(resume, { includeName = false } = {}) {
  const { contact } = resume;
  return [
    includeName && ['Name', resume.name.full],
    ['Email', contact.email],
    ['Phone', contact.phone],
    ['Address', contact.address],
    ['City', contact.city],
    ['Postcode', contact.postCode],
    ['LinkedIn', contact.linkedin],
    ['GitHub', contact.github],
    ['Website', contact.website],
  ]
    .filter(Boolean)
    .filter(([, value]) => Boolean(value))
    .map(([label, value]) => ({ label, value }));
}

/** True when a section has both content and its enabled flag set. */
export const showSection = (resume, key, list) =>
  resume.labels[key].enabled && (list ? list.length > 0 : true);

/** Format a date range for display, tolerating a missing half. */
export const formatRange = ({ start, end }) => {
  if (start && end) return `${start} — ${end}`;
  return start || end || '';
};

export default normalizeResume;
