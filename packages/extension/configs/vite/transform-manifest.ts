import { CrxPlugin } from '@crxjs/vite-plugin';

function transFormManifest(): CrxPlugin {
  return {
    name: 'crx:terenval:transform-manifest',
    enforce: 'post',
    renderCrxManifest(manifest) {
      // Universal dApp discovery requires packaged bridge scripts on web pages.
      // No hardware-wallet vendor script or remote executable code is injected.
      manifest.content_scripts = [
        {
          matches: ['http://localhost/*', 'http://127.0.0.1/*', 'https://*/*'],
          js: ['scripts/contentscript.js'],
          run_at: 'document_start',
          all_frames: false,
        },
      ] as any;
      if (process.env.BROWSER !== 'opera') {
        manifest.content_scripts?.push({
          matches: ['http://localhost/*', 'http://127.0.0.1/*', 'https://*/*'],
          js: ['scripts/inject.js'],
          run_at: 'document_start',
          all_frames: false,
          world: 'MAIN',
        } as any);
      }
      manifest.web_accessible_resources?.push({
        resources: ['scripts/inject.js'],
        use_dynamic_url: false,
        matches: ['http://localhost/*', 'http://127.0.0.1/*', 'https://*/*'],
      });
      return manifest;
    },
  };
}
export default transFormManifest;
