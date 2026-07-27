import { execFileSync } from 'node:child_process';
import { mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const extensionRoot = resolve(here, '../..');
const dist = resolve(extensionRoot, 'dist');
const releaseDir = resolve(extensionRoot, 'release');
const zipPath = resolve(releaseDir, 'terenval-wallet-cws.zip');

const run = (command, args, options = {}) => {
  console.log(`> ${command} ${args.join(' ')}`);
  execFileSync(command, args, {
    cwd: extensionRoot,
    stdio: 'inherit',
    env: { ...process.env, ...options.env },
  });
};

await rm(dist, { recursive: true, force: true });
await rm(releaseDir, { recursive: true, force: true });
await mkdir(releaseDir, { recursive: true });

run('yarn', ['exec', 'vue-tsc', '--project', 'tsconfig.cws.json', '--noEmit']);
run('yarn', ['exec', 'vite', 'build'], {
  env: {
    BROWSER: 'chrome',
    NODE_ENV: 'production',
    CWS_RELEASE: 'true',
    NODE_OPTIONS: process.env.NODE_OPTIONS || '--max-old-space-size=8192',
  },
});
run('node', ['configs/cws/scan-artifact.mjs']);
run('zip', ['-X', '-q', '-r', zipPath, '.'], { env: process.env, cwd: dist });

console.log(`CWS release created: ${zipPath}`);
