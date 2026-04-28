const fs = require('node:fs');
const path = require('node:path');

const outDir = path.join(__dirname, '..', 'build');
const rssPath = path.join(outDir, 'rss.xml');
const feedPath = path.join(outDir, 'feed.xml');

if (!fs.existsSync(rssPath)) {
  throw new Error(`Expected Docusaurus RSS feed was not found: ${rssPath}`);
}

fs.copyFileSync(rssPath, feedPath);
