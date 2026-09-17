const projectSegment = 'TheCleaners';
const projectPattern = /^\/thecleaners(?=\/|$)/i;

/**
 * Return a same-origin target for a noncanonical case variant of the
 * TheCleaners project prefix. All remaining URL components are retained.
 */
export function getCanonicalProjectRedirect(href) {
  const url = new URL(href);
  const match = projectPattern.exec(url.pathname);

  if (!match || match[0] === `/${projectSegment}`) {
    return null;
  }

  const suffix = url.pathname.slice(match[0].length);
  return `/${projectSegment}${suffix || '/'}${url.search}${url.hash}`;
}
