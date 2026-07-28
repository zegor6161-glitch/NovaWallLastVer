import { fileURLToPath, URL } from 'node:url';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { crx } from '@crxjs/vite-plugin';
import chromeManifest from './src/manifest/manifest.chrome';
import firefoxManifest from './src/manifest/manifest.firefox';
import operaManifest from './src/manifest/manifest.opera';
import assetsRewritePlugin from './configs/vite/assets-rewrite';
import transformManifest from './configs/vite/transform-manifest';
import transformCSInject from './configs/vite/transform-cs-inject';
import releaseScopePlugin from './configs/cws/release-scope-plugin';
import disabledFeatureStubPlugin from './configs/cws/disabled-feature-stub-plugin';
import { version } from './package.json';
import wasm from 'vite-plugin-wasm';

const BROWSER = process.env.BROWSER;
const IS_CWS_BUILD = process.env.CWS_RELEASE === 'true';
const local = (path: string) => fileURLToPath(new URL(path, import.meta.url));

const firefoxChunking = (id: string) => {
  if (id.includes('node_modules')) {
    const chunkName = id.match(/node_modules\/(.+?)\//);
    if (chunkName && chunkName.length > 1) return chunkName[1].replace('@', '');
    return 'vendor';
  }
};
const getManifest = () => {
  switch (BROWSER) {
    case 'firefox':
      return firefoxManifest;
    case 'opera':
      return operaManifest;
    default:
      return chromeManifest;
  }
};

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
    hmr: { port: 5173 },
  },
  define: {
    __PREFILL_PASSWORD__:
      process.env.NODE_ENV === 'development'
        ? JSON.stringify('test pass')
        : JSON.stringify(''),
    __PACKAGE_VERSION__: JSON.stringify(version),
    __IS_DEV__: process.env.NODE_ENV === 'development',
    __IS_FIREFOX__: BROWSER === 'firefox',
    __IS_OPERA__: BROWSER === 'opera',
    __IS_CHROME__: BROWSER === 'chrome',
    __IS_SAFARI__: BROWSER === 'safari',
    __BUILD_TIME__:
      BROWSER === 'firefox'
        ? JSON.stringify('FF-build')
        : JSON.stringify(new Date().toISOString()),
  },
  plugins: [
    ...(IS_CWS_BUILD ? [disabledFeatureStubPlugin()] : []),
    wasm(),
    nodePolyfills({
      include: ['crypto', 'buffer', 'util', 'stream', 'url', 'http', 'https', 'path', 'os'],
      protocolImports: true,
    }),
    vue(),
    assetsRewritePlugin,
    transformCSInject(),
    transformManifest(),
    ...(IS_CWS_BUILD ? [releaseScopePlugin()] : []),
    crx({
      manifest: getManifest(),
      browser: BROWSER === 'firefox' ? 'firefox' : 'chrome',
      contentScripts: { injectCss: false },
    }),
  ],
  worker: { plugins: () => [wasm()] },
  css: {
    preprocessorOptions: {
      less: { math: 'always', javascriptEnabled: true },
    },
  },
  build: {
    commonjsOptions: { transformMixedEsModules: true },
    emptyOutDir: true,
    sourcemap: IS_CWS_BUILD ? false : true,
    minify: IS_CWS_BUILD ? 'terser' : false,
    terserOptions: IS_CWS_BUILD
      ? {
          compress: { passes: 2, drop_debugger: true },
          format: { comments: false },
          mangle: true,
        }
      : undefined,
    rollupOptions: {
      external: [],
      input: { action: 'action.html', onboard: 'onboard.html', index: 'index.html' },
      output: {
        manualChunks: BROWSER === 'firefox' ? firefoxChunking : undefined,
      },
    },
  },
  optimizeDeps: {
    include: ['vue', '@vueuse/core', 'webextension-polyfill', 'crypto'],
    exclude: ['node:fs/promises', 'zlib', 'vue-demi'],
  },
  resolve: {
    alias: [
      ...(IS_CWS_BUILD
        ? [
            { find: /^@\/libs\/metrics$/, replacement: local('./src/config/cws-metrics-stub.ts') },
            { find: /^@\/libs\/analytics$/, replacement: local('./src/config/cws-analytics-stub.ts') },
            { find: /^@\/libs\/utils\/screening$/, replacement: local('./src/config/cws-screening-stub.ts') },
            { find: /^@\/libs\/name-resolver$/, replacement: local('./src/config/cws-name-resolver-stub.ts') },
            { find: /^@\/providers\/ethereum\/networks$/, replacement: local('./src/config/cws-ethereum-networks.ts') },
            { find: /^@\/providers\/bitcoin\/networks$/, replacement: local('./src/config/cws-bitcoin-networks.ts') },
            { find: /^@action\/views\/network-activity\/index\.vue$/, replacement: local('./src/config/cws-network-activity.vue') },
            { find: /^@action\/views\/network-assets\/index\.vue$/, replacement: local('./src/config/cws-network-assets.vue') },
            { find: 'js-sha256', replacement: local('./src/config/cws-js-sha256-stub.ts') },
            { find: 'vue3-lottie', replacement: local('./src/config/cws-lottie-stub.ts') },
            { find: 'lottie-web', replacement: local('./src/config/cws-lottie-stub.ts') },
            { find: '@enkryptcom/hw-wallets', replacement: local('./src/config/cws-hardware-wallets-stub.ts') },
            { find: '@enkryptcom/swap', replacement: local('./src/config/cws-swap-stub.ts') },
          ]
        : []),
      {
        find: '@/providers/solana/libs/accounts-state',
        replacement: local('./src/config/disabled-account-state.ts'),
      },
      {
        find: '@/providers/polkadot/libs/accounts-state',
        replacement: local('./src/config/disabled-account-state.ts'),
      },
      {
        find: '@/providers/kadena/libs/accounts-state',
        replacement: local('./src/config/disabled-account-state.ts'),
      },
      {
        find: '@/providers/kadena/types',
        replacement: local('./src/config/disabled-kadena-types.ts'),
      },
      { find: '@', replacement: local('./src') },
      { find: '@action', replacement: local('./src/ui/action') },
      { find: 'fs', replacement: './configs/vite/empty.js' },
      { find: 'tiny-secp256k1', replacement: '@bitcoinerlab/secp256k1' },
      {
        find: /^@noble\/curves\/(.*)\.js$/,
        replacement: local('../../crypto-libs-snapshot/@noble/curves/esm/$1.js'),
      },
      {
        find: /^@noble\/curves\/(.*)$/,
        replacement: local('../../crypto-libs-snapshot/@noble/curves/esm/$1.js'),
      },
    ],
  },
});
