import assert from 'node:assert/strict';
import test from 'node:test';
import {getCanonicalProjectRedirect} from '../src/theme/NotFound/canonicalizeProjectPath.mjs';

const redirects = [
  ['root without slash', '/thecleaners', '/TheCleaners/'],
  ['root with slash', '/thecleaners/', '/TheCleaners/'],
  ['uppercase prefix', '/THECLEANERS/', '/TheCleaners/'],
  [
    'mixed-case prefix and deep link',
    '/Thecleaners/Get-TheCleaners/',
    '/TheCleaners/Get-TheCleaners/',
  ],
  [
    'suffix, query, and fragment',
    '/tHeClEaNeRs/Get-TheCleaners/?q=A%2FB#Safety',
    '/TheCleaners/Get-TheCleaners/?q=A%2FB#Safety',
  ],
];

for (const [name, input, expected] of redirects) {
  test(`redirects ${name}`, () => {
    const target = getCanonicalProjectRedirect(`https://day3bits.com${input}`);
    assert.equal(target, expected);
    assert.ok(target.startsWith('/'));
    assert.ok(!target.startsWith('//'));
  });
}

const unchanged = [
  '/TheCleaners',
  '/TheCleaners/',
  '/TheCleaners/Get-TheCleaners/',
  '/unrelated-missing-page',
  '/thecleaners-extra/',
  '/%74hecleaners/',
  '//thecleaners/',
];

for (const input of unchanged) {
  test(`leaves ${input} unchanged`, () => {
    assert.equal(
      getCanonicalProjectRedirect(`https://day3bits.com${input}`),
      null,
    );
  });
}
