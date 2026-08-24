import React from 'react';
import { View, Text, Image, Link, StyleSheet } from '@react-pdf/renderer';
import { KEEP_WITH_NEXT } from './theme';
import { parseHtml } from './html';
import Icon from './icons';

/**
 * Shared building blocks for the PDF templates.
 *
 * These exist mainly to centralise pagination behaviour. The old html2canvas
 * pipeline rasterised the whole CV and sliced the image at fixed offsets, which
 * is what cut text in half mid-line. react-pdf paginates properly, but only if
 * we are disciplined about two things:
 *
 *   1. `wrap={false}` is used ONLY on blocks that are guaranteed shorter than a
 *      page. A `wrap={false}` block taller than the page gets clipped — the
 *      exact failure we are replacing. So it is applied to entry headers and
 *      single-line rows, never to whole sections or bullet lists.
 *
 *   2. Section headings carry `minPresenceAhead`, so a heading with too little
 *      room beneath it moves to the next page instead of being stranded at the
 *      bottom with its content overleaf.
 *
 * Nothing here uses fixed heights or `overflow: hidden`, both of which defeat
 * react-pdf's measurement pass.
 */

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start' },
  bulletMarker: { flexShrink: 0 },
  bulletBody: { flex: 1 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap' },
});

/* ------------------------------------------------------------------ text -- */

export function Heading({ theme, children, style, ...rest }) {
  const label = theme.uppercaseSections && typeof children === 'string'
    ? children.toUpperCase()
    : children;

  // Some designs set headings in the body weight rather than bold.
  const common = {
    fontFamily: theme.sectionWeight === 'regular' ? theme.fontFamily : theme.fontFamilyBold,
    fontSize: theme.sectionSize,
    color: theme.accent,
    letterSpacing: theme.letterSpacing,
  };

  const variant = theme.sectionStyle;

  // Full-width filled bar with reversed text.
  if (variant === 'bar') {
    return (
      <View
        style={[
          { backgroundColor: theme.barBackground || theme.accent, paddingVertical: 3, paddingHorizontal: 7, marginBottom: 7 },
          style,
        ]}
        {...rest}
      >
        <Text style={[common, { color: theme.onAccent }]}>{label}</Text>
      </View>
    );
  }

  // Outlined box that hugs the label.
  if (variant === 'boxed') {
    return (
      <View
        style={[
          {
            borderWidth: 1,
            borderColor: theme.rule,
            paddingVertical: 3,
            paddingHorizontal: 7,
            marginBottom: 8,
            alignSelf: 'flex-start',
          },
          style,
        ]}
        {...rest}
      >
        <Text style={common}>{label}</Text>
      </View>
    );
  }

  if (variant === 'plain') {
    return (
      <Text style={[common, { marginBottom: 6 }, style]} {...rest}>
        {label}
      </Text>
    );
  }

  // Default: heading with a hairline rule beneath.
  return (
    <View
      style={[{ borderBottomWidth: 0.75, borderBottomColor: theme.rule, paddingBottom: 3, marginBottom: 8 }, style]}
      {...rest}
    >
      <Text style={common}>{label}</Text>
    </View>
  );
}

export function Body({ theme, children, style, ...rest }) {
  return (
    <Text
      style={[
        {
          fontFamily: theme.fontFamily,
          fontSize: theme.bodySize,
          color: theme.body,
          lineHeight: theme.lineHeight,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

export function Meta({ theme, children, style, ...rest }) {
  return (
    <Text
      style={[
        {
          fontFamily: theme.fontFamily,
          fontSize: theme.metaSize,
          color: theme.muted,
          lineHeight: theme.lineHeight,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

/* -------------------------------------------------------------- sections -- */

/**
 * A titled section. The wrapper intentionally wraps (react-pdf's default) so a
 * long section flows onto the next page; only the heading is pinned to the
 * content that follows it.
 */
export function Section({ theme, title, children, style, first = false, lead = null }) {
  // `minPresenceAhead` on a heading-only wrapper is not enough: react-pdf will
  // still park the title (and its underline) in a sliver of leftover space and
  // send the first item to the next page, so the rule and the skills look merged.
  // Pinning the heading to `lead` (the first bullet / line) with wrap={false}
  // moves both together. `lead` must stay shorter than a page.
  return (
    <View style={[{ marginTop: first ? 0 : theme.sectionGap }, style]}>
      <View wrap={false} minPresenceAhead={lead ? undefined : KEEP_WITH_NEXT}>
        <Heading theme={theme}>{title}</Heading>
        {lead}
      </View>
      {children}
    </View>
  );
}

/**
 * One employment / education entry.
 *
 * The entry itself wraps so a long bullet list can continue overleaf, but the
 * header block (role, employer, dates) is atomic — a few lines at most, so it is
 * always safely shorter than a page.
 */
export function Entry({ theme, title, subtitle, meta, children, last = false }) {
  return (
    <View style={{ marginBottom: last ? 0 : theme.entryGap }}>
      <View wrap={false} minPresenceAhead={28}>
        {Boolean(meta) && (
          <Meta theme={theme} style={{ marginBottom: 1.5 }}>
            {meta}
          </Meta>
        )}
        {Boolean(title) && (
          <Text
            style={{
              fontFamily: theme.fontFamilyBold,
              fontSize: theme.bodySize + 0.5,
              color: theme.ink,
              lineHeight: 1.3,
            }}
          >
            {title}
          </Text>
        )}
        {Boolean(subtitle) && (
          <Text
            style={{
              fontFamily: theme.fontFamilyItalic,
              fontSize: theme.bodySize,
              color: theme.accent,
              lineHeight: 1.35,
              marginTop: 1,
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {children}
    </View>
  );
}

/* ----------------------------------------------------------------- lists -- */

export function Bullet({ theme, children, marker = '•', color, style, atomic = true }) {
  // A bullet is a flex row: a one-line marker beside a multi-line body. Letting
  // it split leaves the marker stranded at the foot of one page with its text
  // at the head of the next, so the row is kept whole and moved down instead.
  //
  // `minPresenceAhead` alone was not enough here — it only guarantees space
  // exists, so the row could still start and then break immediately after the
  // marker. `atomic` is escapable for the rare bullet taller than a full page,
  // which must be allowed to split or it would be clipped entirely.
  return (
    <View style={[styles.bulletRow, { marginTop: 2.5 }, style]} wrap={!atomic}>
      <Text
        style={[
          styles.bulletMarker,
          {
            fontFamily: theme.fontFamily,
            fontSize: theme.bodySize,
            color: color || theme.accent,
            lineHeight: theme.lineHeight,
            width: 11,
          },
        ]}
      >
        {marker}
      </Text>
      <Body theme={theme} style={[styles.bulletBody, color ? { color } : null]}>
        {children}
      </Body>
    </View>
  );
}

/**
 * Above this many characters a single bullet may be taller than one page, at
 * which point keeping it atomic would clip it rather than move it. Roughly half
 * a page of body text, so well clear of any normal achievement line.
 */
const SPLITTABLE_LENGTH = 2200;

const isOversized = (value) =>
  typeof value === 'string' && value.length > SPLITTABLE_LENGTH;

export function BulletList({ theme, items, color, style }) {
  if (!items?.length) return null;
  return (
    <View style={[{ marginTop: 3 }, style]}>
      {items.map((item, index) => (
        <Bullet key={index} theme={theme} color={color} atomic={!isOversized(item)}>
          {item}
        </Bullet>
      ))}
    </View>
  );
}

/** Inline pills — used for skills in the sans-serif templates. */
export function Chips({ theme, items, background, color, style }) {
  if (!items?.length) return null;
  return (
    <View style={[styles.chipWrap, style]}>
      {items.map((item, index) => (
        <View
          key={index}
          wrap={false}
          style={{
            backgroundColor: background || '#F1F3F5',
            borderRadius: 2,
            paddingVertical: 2.5,
            paddingHorizontal: 6,
            marginRight: 4,
            marginBottom: 4,
          }}
        >
          <Text
            style={{
              fontFamily: theme.fontFamily,
              fontSize: theme.metaSize,
              color: color || theme.ink,
            }}
          >
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

/** Label/value rows, e.g. the Personal Details table. */
export function DetailRows({ theme, entries, labelWidth = 92, color, labelColor }) {
  if (!entries?.length) return null;
  return (
    <View>
      {entries.map(({ label, value }) => (
        <View key={label} style={[styles.row, { marginBottom: 2 }]} wrap={false}>
          <Text
            style={{
              width: labelWidth,
              flexShrink: 0,
              fontFamily: theme.fontFamilyBold,
              fontSize: theme.bodySize,
              color: labelColor || theme.ink,
              lineHeight: theme.lineHeight,
            }}
          >
            {label}
          </Text>
          <Text
            style={{
              flex: 1,
              fontFamily: theme.fontFamily,
              fontSize: theme.bodySize,
              color: color || theme.body,
              lineHeight: theme.lineHeight,
            }}
          >
            {value}
          </Text>
        </View>
      ))}
    </View>
  );
}

/**
 * Role/date row: title on the left, dates flush right on the same baseline.
 * Used by the designs that put dates in the right margin rather than above.
 */
export function TitleDateRow({ theme, title, date, titleColor, dateColor, bold = true }) {
  return (
    <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'flex-start' }]}>
      <Text
        style={{
          flex: 1,
          paddingRight: 10,
          fontFamily: bold ? theme.fontFamilyBold : theme.fontFamily,
          fontSize: theme.bodySize + 0.5,
          color: titleColor || theme.ink,
          lineHeight: 1.3,
        }}
      >
        {title}
      </Text>
      {Boolean(date) && (
        <Text
          style={{
            flexShrink: 0,
            fontFamily: theme.fontFamily,
            fontSize: theme.metaSize,
            color: dateColor || theme.muted,
            lineHeight: 1.45,
          }}
        >
          {date}
        </Text>
      )}
    </View>
  );
}

/** Contact line with a leading icon, as used in the banner/sidebar designs. */
export function IconRow({ theme, icon, children, color, size, gap = 6, style }) {
  return (
    <View style={[styles.row, { alignItems: 'center', marginBottom: 3.5 }, style]} wrap={false}>
      <View style={{ width: (size || theme.bodySize) + gap, flexShrink: 0 }}>
        <Icon name={icon} size={size || theme.bodySize} color={color || theme.ink} />
      </View>
      <Text
        style={{
          flex: 1,
          fontFamily: theme.fontFamily,
          fontSize: theme.bodySize,
          color: color || theme.body,
          lineHeight: 1.35,
        }}
      >
        {children}
      </Text>
    </View>
  );
}

/** Filled-square list marker, used for Qualities and Hobbies. */
export function SquareList({ theme, items, color, markerColor, size = 4.5 }) {
  if (!items?.length) return null;
  return (
    <View>
      {items.map((item, index) => (
        <View key={index} style={[styles.row, { alignItems: 'center', marginBottom: 5 }]} wrap={false}>
          <View
            style={{
              width: size,
              height: size,
              backgroundColor: markerColor || color || theme.accent,
              marginRight: 7,
              flexShrink: 0,
            }}
          />
          <Text
            style={{
              flex: 1,
              fontFamily: theme.fontFamily,
              fontSize: theme.bodySize,
              color: color || theme.body,
              lineHeight: 1.35,
            }}
          >
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

/** Five-dot proficiency rating, as used by the Modern sidebar. */
export function DotRating({ level, filled, empty, count = 5, size = 4 }) {
  const LEVELS = { beginner: 1, elementary: 2, intermediate: 3, advanced: 4, expert: 5, fluent: 4, native: 5 };
  const score = LEVELS[String(level || '').toLowerCase()] ?? 4;
  return (
    <View style={[styles.row, { alignItems: 'center' }]}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={{
            width: size * 2,
            height: size * 2,
            borderRadius: size,
            backgroundColor: index < score ? filled : empty,
            marginLeft: index === 0 ? 0 : 3,
          }}
        />
      ))}
    </View>
  );
}

/** Skill strength meter. Rendered only when a level is actually recorded. */
export function LevelBar({ level, track, fill, width = '100%' }) {
  const LEVELS = { beginner: 0.25, elementary: 0.4, intermediate: 0.6, advanced: 0.8, expert: 1, native: 1, fluent: 0.9 };
  const ratio = LEVELS[String(level || '').toLowerCase()] ?? 0.7;
  return (
    <View style={{ width, height: 3, backgroundColor: track, borderRadius: 2, marginTop: 3 }}>
      <View style={{ width: `${ratio * 100}%`, height: 3, backgroundColor: fill, borderRadius: 2 }} />
    </View>
  );
}

/* ------------------------------------------------------------ rich text -- */

/** Renders parsed CKEditor HTML using PDF primitives. */
export function RichText({ theme, html, color }) {
  const blocks = React.useMemo(() => parseHtml(html), [html]);
  if (!blocks.length) return null;

  return (
    <View>
      {blocks.map((block, index) => {
        const runs = (
          <>
            {block.runs.map((run, runIndex) => {
              const runStyle = {
                fontFamily: run.bold ? theme.fontFamilyBold : run.italic ? theme.fontFamilyItalic : theme.fontFamily,
                textDecoration: run.underline ? 'underline' : run.strike ? 'line-through' : 'none',
                color: run.href ? theme.accent : undefined,
              };
              if (run.href) {
                return (
                  <Link key={runIndex} src={run.href} style={runStyle}>
                    {run.text}
                  </Link>
                );
              }
              return (
                <Text key={runIndex} style={runStyle}>
                  {run.text}
                </Text>
              );
            })}
          </>
        );

        if (block.type === 'listItem') {
          return (
            <Bullet
              key={index}
              theme={theme}
              marker={block.marker || '•'}
              color={color}
              style={{ marginLeft: (block.depth || 0) * 10 }}
            >
              {runs}
            </Bullet>
          );
        }

        if (block.type === 'heading') {
          return (
            <Text
              key={index}
              minPresenceAhead={24}
              style={{
                fontFamily: theme.fontFamilyBold,
                fontSize: theme.bodySize + (block.level <= 2 ? 1.5 : 0.5),
                color: color || theme.ink,
                marginTop: index === 0 ? 0 : 5,
                marginBottom: 2,
              }}
            >
              {runs}
            </Text>
          );
        }

        return (
          <Body key={index} theme={theme} style={{ marginTop: index === 0 ? 0 : 4, color: color || theme.body }}>
            {runs}
          </Body>
        );
      })}
    </View>
  );
}

/* --------------------------------------------------------------- photos -- */

export function Photo({ src, size = 76, radius, border, style }) {
  if (!src) return null;
  return (
    <Image
      src={src}
      style={[
        {
          width: size,
          height: size,
          objectFit: 'cover',
          borderRadius: radius ?? size / 2,
          ...(border ? { borderWidth: 2, borderColor: border } : null),
        },
        style,
      ]}
    />
  );
}

/** Page N of M, repeated on every page. */
export function PageNumber({ theme, style }) {
  return (
    <Text
      fixed
      render={({ pageNumber, totalPages }) => (totalPages > 1 ? `${pageNumber} / ${totalPages}` : '')}
      style={[
        {
          position: 'absolute',
          bottom: 18,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: theme.fontFamily,
          fontSize: 7.5,
          color: theme.muted,
        },
        style,
      ]}
    />
  );
}
