import { CrxPlugin } from '@crxjs/vite-plugin';

function transFormManifest(): CrxPlugin {
  return {
    name: 'crx:enkrypt:transform-manifest',
    enforce: 'post',
    renderCrxManifest(manifest) {
      manifest.content_scripts = [
        {
          matches: ['http://*/*', 'https://*/*'],
          js: ['scripts/contentscript.js'],
          run_at: 'document_start',
          all_frames: false,
        },
        {
          matches: ['*://connect.trezor.io/*/*'],
          js: ['vendor/trezor-content-script.js'],
          run_at: 'document_start',
        },
      ] as any;
      if (process.env.BROWSER !== 'opera') {
        manifest.content_scripts?.push({
          matches: ['http://*/*', 'https://*/*'],
          js: ['scripts/inject.js'],
          run_at: 'document_start',
          all_frames: false,
          world: 'MAIN',
        } as any);
      }
      manifest.web_accessible_resources?.push({
        resources: ['scripts/inject.js', 'scripts/contentscript.js'],
        use_dynamic_url: false,
        matches: ['http://*/*', 'https://*/*'],
      });
      return manifest;
    },
  };
}
export default transFormManifest;
