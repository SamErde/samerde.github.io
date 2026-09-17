import React, {useEffect} from 'react';
import NotFound from '@theme-original/NotFound';
import {getCanonicalProjectRedirect} from './canonicalizeProjectPath.mjs';

/**
 * Canonicalize only the first path segment for the TheCleaners project site.
 * Unrelated missing routes retain the standard Day 3 Bits 404 experience.
 */
export default function NotFoundWrapper(props) {
  useEffect(() => {
    const target = getCanonicalProjectRedirect(window.location.href);
    if (target) {
      window.location.replace(target);
    }
  }, []);

  return <NotFound {...props} />;
}
