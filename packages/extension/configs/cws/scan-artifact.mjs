import { readFile, readdir, rm, stat } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

const dist = new URL('../../dist/', import.meta.url);
const forbiddenFiles = [
  /\.map$/i,
  /^\.vite(?:\/|$)/,
  /stats\.html$/i,
  /^vendor\/trezor-/i,
  /^trezor-/i,
  /(?:^|[-_/])(ltc|doge)(?:[-_.\/]|$)/i,
];
const executableExtensions = new Set(['.js', '.mjs', '.cjs', '.html', '.json']);
const forbiddenCode = [
  { name: 'eval call', pattern: /\beval\s*\(/ },
  { name: 'Function constructor', pattern: /\bnew\s+Function\s*\(/ },
  { name: 'Function constructor call', pattern: /\bFunction\s*\(\s*['"`]/ },
  { name: 'remote importScripts', pattern: /importScripts\s*\(\s*['"`]https?:\/\//i },
  { name: 'remote dynamic import', pattern: /import\s*\(\s*['"`]https?:\/\//i },
  { name: 'remote script tag', pattern: /<script[^>]+src\s*=\s*['"]https?:\/\//i },
  { name: 'Amplitude telemetry', pattern: /(?:api2?|cdn|app|sr-client-cfg)\.(?:eu\.)?amplitude\.com|analytics-enkrypt\.mewwallet\.dev/i },
  { name: 'Massa code or endpoint', pattern: /@massalabs|(?:mainnet|buildnet|testnet)\.massa\.net|OperationStatus\.PendingInclusion/i },
  { name: 'disabled Polkadot or Substrate code', pattern: /@polkadot\/|polkadot\.network|substrate\.io/i },
  { name: 'disabled Solana code', pattern: /@solana\/|solana-mainnet|api\.mainnet-beta\.solana\.com/i },
  { name: 'disabled Kadena code', pattern: /@kadena\/|chainweb|pact-lang-api/i },
  { name: 'Trezor code', pattern: /connect\.trezor\.io|trezor-connect/i },
  { name: 'Litecoin code', pattern: /litecoin(?:space)?\.org|NetworkNames\.Litecoin/i },
  { name: 'Dogecoin code', pattern: /dogecoin\.com|NetworkNames\.Dogecoin/i },
  { name: 'MEW service endpoint', pattern: /(?:partners|nodes|broadcast|tokenbalance)\.mewapi\.io|backupstore\.enkrypt\.com/i },
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
await rm(new URL('trezor-usb-permissions.html', dist), { force: true });
await rm(new URL('vendor/trezor-content-script.js', dist), { force: true });
await rm(new URL('vendor/trezor-usb-permissions.js', dist), { force: true });

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
    failures.push(`${rel}: forbidden file or disabled-network asset`);
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
console.log(`CWS artifact validated: ${files.length} files; no dynamic code, disabled providers, telemetry, Trezor, Litecoin/Dogecoin or MEW service endpoints.`);
