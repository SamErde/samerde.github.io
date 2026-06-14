import React from 'react';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import BlogPostItemOriginal from '@theme-original/BlogPostItem';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from './index.module.css';

// Maps tag slugs (from tags.yml permalink keys) to CSS module accent classes.
// Tag label is lowercased and spaces replaced with hyphens to match the key.
const TAG_ACCENT = {
  powershell: 'accentPowershell',
  scripting: 'accentScripting',
  'microsoft-365': 'accentM365',
  m365: 'accentM365',
  'microsoft-graph': 'accentGraph',
  azure: 'accentAzure',
  'active-directory': 'accentAD',
  dotnet: 'accentDotnet',
  pki: 'accentPki',
  windows: 'accentWindows',
  'microsoft-teams': 'accentTeams',
  issue: 'accentIssue',
  'user-group': 'accentCommunity',
  community: 'accentCommunity',
  'entra-id': 'accentEntra',
  defender: 'accentDefender',
};

function tagKey(label) {
  return label.toLowerCase().replace(/\s+/g, '-');
}

function BlogCard() {
  const {metadata} = useBlogPost();
  const {
    title,
    permalink,
    description,
    formattedDate,
    date,
    readingTime,
    tags,
  } = metadata;

  const primaryKey = tags?.[0] ? tagKey(tags[0].label) : '';
  const accentClass = TAG_ACCENT[primaryKey] ?? 'accentDefault';

  return (
    <article className={styles.card} aria-label={title}>
      {/* Colored top accent bar */}
      <div
        className={clsx(styles.accent, styles[accentClass])}
        aria-hidden="true"
      />
      <div className={styles.body}>
        <header>
          <h2 className={styles.title}>
            <Link to={permalink}>{title}</Link>
          </h2>
        </header>

        {description && (
          <p className={styles.description}>{description}</p>
        )}

        <footer className={styles.footer}>
          <div className={styles.meta}>
            <time dateTime={date}>{formattedDate}</time>
            {readingTime != null && (
              <span aria-label={`${Math.ceil(readingTime)} minute read`}>
                {' '}
                &middot; {Math.ceil(readingTime)} min read
              </span>
            )}
          </div>

          {tags.length > 0 && (
            <nav aria-label="Post tags" className={styles.tags}>
              {tags.map((tag) => {
                const key = tagKey(tag.label);
                return (
                  <Link
                    key={tag.permalink}
                    to={tag.permalink}
                    className={clsx(
                      styles.tagPill,
                      styles[TAG_ACCENT[key] ?? 'accentDefault'],
                    )}>
                    {tag.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </footer>
      </div>
    </article>
  );
}

/**
 * On the blog list page, render a compact card.
 * On the single-post page, fall through to the original implementation
 * (which includes the already-swizzled Footer with Giscus comments).
 */
export default function BlogPostItem(props) {
  const {isBlogPostPage} = useBlogPost();
  if (isBlogPostPage) {
    return <BlogPostItemOriginal {...props} />;
  }
  return <BlogCard />;
}
