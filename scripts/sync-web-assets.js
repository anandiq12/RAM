const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const webDir = path.join(root, 'www');
const apiBase = String(process.env.NEXORA_API_BASE || '').trim().replace(/\/+$/, '');

if (!apiBase) {
  throw new Error('Set NEXORA_API_BASE to the deployed Nexora API origin before syncing Android assets');
}
let parsedApiBase;
try {
  parsedApiBase = new URL(apiBase);
} catch {
  throw new Error('NEXORA_API_BASE must be a valid API origin');
}
if (!['http:', 'https:'].includes(parsedApiBase.protocol)
  || parsedApiBase.username || parsedApiBase.password
  || parsedApiBase.pathname !== '/' || parsedApiBase.search || parsedApiBase.hash) {
  throw new Error('NEXORA_API_BASE must be an HTTP(S) API origin without credentials, path, query or fragment');
}
if (parsedApiBase.protocol !== 'https:'
  && !['localhost', '127.0.0.1', '[::1]'].includes(parsedApiBase.hostname)) {
  throw new Error('NEXORA_API_BASE must use HTTPS except for localhost development');
}

fs.mkdirSync(webDir, { recursive: true });
fs.copyFileSync(path.join(root, 'Index.html'), path.join(webDir, 'index.html'));
fs.copyFileSync(path.join(root, 'Script.js'), path.join(webDir, 'Script.js'));
fs.copyFileSync(path.join(root, 'Style.css'), path.join(webDir, 'Style.css'));
fs.cpSync(path.join(root, 'assets'), path.join(webDir, 'assets'), { recursive: true });

const indexPath = path.join(webDir, 'index.html');
const html = fs.readFileSync(indexPath, 'utf8');
const escapedApiBase = apiBase
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');
if (!html.includes('</head>')) throw new Error('Index.html is missing its closing head tag');
fs.writeFileSync(indexPath, html.replace('</head>', `    <meta name="nexora-api-base" content="${escapedApiBase}" />\n  </head>`));

console.log(`Synced Nexora web assets to ${path.relative(root, webDir)} with API ${parsedApiBase.origin}.`);
