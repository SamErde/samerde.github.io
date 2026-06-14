/**
 * Pre-build script: generate Open Graph PNG images for every blog post.
 *
 * Usage (called automatically by the build script in package.json):
 *   node scripts/generate-og-images.mjs
 *
 * Outputs:  static/assets/img/og/posts/<slug>.png
 * Font cache: .og-font-cache/  (gitignored, downloaded once)
 *
 * Dependencies: satori, @resvg/resvg-js, gray-matter
 */

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
  existsSync,
} from 'fs';
import {join, extname, basename, resolve, dirname} from 'path';
import {fileURLToPath} from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

const BLOG_DIR = join(ROOT, 'blog');
const OUTPUT_DIR = join(ROOT, 'static', 'assets', 'img', 'og', 'posts');
const FONT_CACHE_DIR = join(ROOT, '.og-font-cache');

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const SITE_NAME = 'Day 3 Bits';
const SITE_HOST = 'day3bits.com';

/** Maps tag slugs → accent hex colors (keep in sync with index.module.css) */
const TAG_COLORS = {
  powershell: '#0167B1',
  scripting: '#7B4FFF',
  'microsoft-365': '#0078D4',
  m365: '#0078D4',
  'microsoft-graph': '#00BCF2',
  azure: '#0098FF',
  'active-directory': '#5C2D91',
  dotnet: '#512BD4',
  pki: '#505A5F',
  windows: '#0067B1',
  'microsoft-teams': '#6264A7',
  issue: '#D13438',
  'user-group': '#107C10',
  community: '#107C10',
  'entra-id': '#0F6CBD',
  defender: '#DA3B01',
};
const DEFAULT_ACCENT = '#3578E5'; // Docusaurus primary blue

function tagKey(label) {
  return label.toLowerCase().replace(/\s+/g, '-');
}

function accentForTags(tags) {
  for (const tag of tags) {
    const color = TAG_COLORS[tagKey(tag)];
    if (color) return color;
  }
  return DEFAULT_ACCENT;
}

/** Convert #RRGGBB hex + alpha 0-1 → rgba() string */
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ─── Font helpers ─────────────────────────────────────────────────────────────

const FONT_URLS = {
  regular:
    'https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.0/files/inter-latin-400-normal.woff',
  bold:
    'https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.0/files/inter-latin-700-normal.woff',
};

async function fetchFont(url, cachePath) {
  if (existsSync(cachePath)) {
    return readFileSync(cachePath);
  }
  console.log(`  Downloading font → ${basename(cachePath)}`);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Font download failed ${res.status}: ${url}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  mkdirSync(FONT_CACHE_DIR, {recursive: true});
  writeFileSync(cachePath, buf);
  return buf;
}

async function loadFonts() {
  const [regular, bold] = await Promise.all([
    fetchFont(FONT_URLS.regular, join(FONT_CACHE_DIR, 'inter-400.woff')),
    fetchFont(FONT_URLS.bold, join(FONT_CACHE_DIR, 'inter-700.woff')),
  ]);
  return [
    {name: 'Inter', data: regular, weight: 400, style: 'normal'},
    {name: 'Inter', data: bold, weight: 700, style: 'normal'},
  ];
}

// ─── OG image element tree ────────────────────────────────────────────────────

function buildElement(title, description, tags) {
  const accent = accentForTags(tags);
  const displayTags = tags.slice(0, 4);
  const shortDesc =
    description && description.length > 110
      ? description.slice(0, 110).trimEnd() + '\u2026'
      : description ?? '';

  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: `${OG_WIDTH}px`,
        height: `${OG_HEIGHT}px`,
        backgroundColor: '#0d1117',
        fontFamily: 'Inter',
      },
      children: [
        // Top accent bar
        {
          type: 'div',
          props: {
            style: {
              height: 8,
              flexShrink: 0,
              backgroundColor: accent,
            },
          },
        },
        // Body
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              padding: '48px 64px 44px',
              backgroundImage: `linear-gradient(135deg, ${hexToRgba(accent, 0.11)} 0%, transparent 55%)`,
            },
            children: [
              // Site name (top)
              {
                type: 'div',
                props: {
                  style: {
                    color: '#8b949e',
                    fontSize: 22,
                    fontWeight: 400,
                    letterSpacing: '0.03em',
                    marginBottom: 'auto',
                  },
                  children: SITE_NAME,
                },
              },
              // Post title
              {
                type: 'div',
                props: {
                  style: {
                    color: '#f0f6fc',
                    fontSize: 52,
                    fontWeight: 700,
                    lineHeight: 1.15,
                    marginTop: 20,
                    marginBottom: shortDesc ? 20 : 'auto',
                  },
                  children: title,
                },
              },
              // Description
              ...(shortDesc
                ? [
                    {
                      type: 'div',
                      props: {
                        style: {
                          color: '#8b949e',
                          fontSize: 23,
                          fontWeight: 400,
                          lineHeight: 1.45,
                          marginBottom: 'auto',
                        },
                        children: shortDesc,
                      },
                    },
                  ]
                : []),
              // Bottom row: tags + host
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 32,
                  },
                  children: [
                    // Tag pills
                    {
                      type: 'div',
                      props: {
                        style: {display: 'flex', gap: 10},
                        children: displayTags.map((tag) => ({
                          type: 'div',
                          props: {
                            style: {
                              backgroundColor: hexToRgba(accent, 0.18),
                              border: `1.5px solid ${hexToRgba(accent, 0.55)}`,
                              color: accent,
                              padding: '4px 15px',
                              borderRadius: 999,
                              fontSize: 18,
                              fontWeight: 500,
                            },
                            children: tag,
                          },
                        })),
                      },
                    },
                    // Hostname
                    {
                      type: 'div',
                      props: {
                        style: {color: '#484f58', fontSize: 20},
                        children: SITE_HOST,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Dynamic import because satori is ESM
  const {default: satori} = await import('satori');
  const {Resvg} = await import('@resvg/resvg-js');

  console.log('OG image generator');
  console.log('Loading fonts...');
  const fonts = await loadFonts();

  mkdirSync(OUTPUT_DIR, {recursive: true});

  const files = readdirSync(BLOG_DIR).filter((f) => {
    const ext = extname(f);
    return (ext === '.md' || ext === '.mdx') && !f.startsWith('.');
  });

  console.log(`Generating ${files.length} OG images → ${OUTPUT_DIR}`);

  let ok = 0;
  let skip = 0;

  for (const file of files) {
    try {
      const raw = readFileSync(join(BLOG_DIR, file), 'utf-8');
      const {data: fm} = matter(raw);

      if (!fm.title) {
        console.log(`  skip  ${file} (no title)`);
        skip++;
        continue;
      }

      // Derive slug: strip leading/trailing slashes from frontmatter slug,
      // or fall back to file basename without extension.
      const slug = fm.slug
        ? fm.slug.replace(/^\/|\/$/g, '')
        : basename(file, extname(file));

      const tags = Array.isArray(fm.tags) ? fm.tags.map(String) : [];
      const description = typeof fm.description === 'string' ? fm.description : '';

      const element = buildElement(fm.title, description, tags);
      const svg = await satori(element, {width: OG_WIDTH, height: OG_HEIGHT, fonts});
      const resvg = new Resvg(svg, {fitTo: {mode: 'width', value: OG_WIDTH}});
      const png = resvg.render().asPng();

      writeFileSync(join(OUTPUT_DIR, `${slug}.png`), png);
      console.log(`  ✓  ${slug}.png`);
      ok++;
    } catch (err) {
      console.error(`  ✗  ${file}: ${err.message}`);
    }
  }

  console.log(`Done — ${ok} generated, ${skip} skipped.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
