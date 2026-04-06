import { defineManifest, ManifestV3Export } from '@crxjs/vite-plugin';
import { chromeManifest } from './manifest.chrome';
const operaManifest = {
  ...chromeManifest,
  host_permissions: ['http://*/*', 'https://*/*'],
  permissions: [
    'storage',
    'unlimitedStorage',
    'tabs',
    'clipboardWrite',
    'scripting',
  ],
} as ManifestV3Export;

export default defineManifest(operaManifest);
