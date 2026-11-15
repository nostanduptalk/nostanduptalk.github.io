import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';

// Generated deliverable: one offline HTML, including scripts, styles and the App icon.
const root = path.dirname(fileURLToPath(import.meta.url));
const [template, css, zip, app, icon] = await Promise.all([
  readFile(path.join(root, 'index.html'), 'utf8'),
  readFile(path.join(root, 'style.css'), 'utf8'),
  readFile(path.join(root, 'zip.js'), 'utf8'),
  readFile(path.join(root, 'app.js'), 'utf8'),
  readFile(path.join(root, 'assets/tabi-app-icon.webp')),
]);
const iconUri = `data:image/webp;base64,${icon.toString('base64')}`;
const script = value => value.replace(/<\/script/gi, '<\\/script');
const html = template
  .replace('  <link rel="stylesheet" href="style.css">', () => `  <style>\n${css}\n  </style>`)
  .replace('  <script src="zip.js" defer></script>', '')
  .replace('  <script src="app.js" defer></script>', '')
  .replaceAll('assets/tabi-app-icon.webp', iconUri)
  .replace('</body>', () => `  <script>\n${script(zip)}\n  </script>\n  <script>\n${script(app)}\n  </script>\n</body>`);

const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
if (/<(?:script|link)[^>]+(?:src|href)="(?!data:|#)/i.test(markup)) {
  throw new Error('Single-file output still references an external script or stylesheet.');
}
if (/<img[^>]+src="(?!data:|blob:)/i.test(markup)) {
  throw new Error('Single-file output still references an external image.');
}
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
if (scripts.length !== 2) throw new Error('Expected both complete inline scripts.');
for (const [, code] of scripts) new Script(code);
const dist = path.join(root, 'dist');
await mkdir(dist, { recursive: true });
const destination = path.join(dist, 'TABIframe-互動展示.html');
await writeFile(destination, html);
console.log(`Created ${destination} (${Buffer.byteLength(html).toLocaleString()} bytes)`);
