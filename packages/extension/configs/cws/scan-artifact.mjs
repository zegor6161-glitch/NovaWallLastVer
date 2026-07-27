import { readFile, readdir, rm, stat } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

const dist = new URL('../../dist/', import.meta.url);
const forbiddenFiles = [/\.map$/i, /^\.vite(?:\/|$)/, /stats\.html$/i];
const executableExtensions = new Set(['.js', '.mjs', '.cjs', '.html']);
const forbiddenCode = [
  { name: 'eval call', pattern: /\beval\s*\(/ },
  { name: 'Function constructor', pattern: /\bnew\s+Function\s*\(/ },
  { name: 'Function constructor call', pattern: /\bFunction\s*\(\s*['"`]/ },
  { name: 'remote importScripts', pattern: /importScripts\s*\(\s*['"`]https?:\/\//i },
  { name: 'remote dynamic import', pattern: /import\s*\(\s*['"`]https?:\/\//i },
  { name: 'remote script tag', pattern: /<script[^>]+src\s*=\s*['"]https?:\/\//i },
];

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir.pathname, entry.name);
    if (entry.isDirectory()) await walk(new URL(`${entry.name}/`, dir), out);
    else out.push(path);
  }
  return out;
}

await rm(new URL('.vite/', dist), { recursive: true, force: true });
await rm(new URL('stats.html', dist), { force: true });

const manifestUrl = new URL('manifest.json', dist);
const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'));
if (manifest.manifest_version !== 3) throw new Error('CWS artifact must use Manifest V3');
if (!String(manifest.name).startsWith('Terenval Wallet')) {
  throw new Error(`Unexpected extension name: ${manifest.name}`);
}

const files = await walk(dist);
const failures = [];
for (const file of files) {
  const rel = relative(dist.pathname, file).replaceAll('\\', '/');
  if (forbiddenFiles.some(pattern => pattern.test(rel))) {
    failures.push(`${rel}: forbidden packaging metadata`);
    continue;
  }
  if (!executableExtensions.has(extname(file))) continue;
  const source = await readFile(file, 'utf8');
  for (const check of forbiddenCode) {
    if (check.pattern.test(source)) failures.push(`${rel}: ${check.name}`);
  }
}

for (const iconPath of Object.values(manifest.icons ?? {})) {
  try {
    const iconStat = await stat(new URL(iconPath, dist));
    if (!iconStat.isFile()) throw new Error();
  } catch {
    failures.push(`manifest icon missing: ${iconPath}`);
  }
}

if (failures.length) {
  throw new Error(`CWS artifact validation failed:\n${failures.join('\n')}`);
}
console.log(`CWS artifact validated: ${files.length} files; no source maps, eval or Function constructors.`);
