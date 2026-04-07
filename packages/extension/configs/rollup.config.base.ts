import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import inject from '@rollup/plugin-inject';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import packageJson from '../package.json' with { type: 'json' };
import { RollupOptions } from 'rollup';

const base: RollupOptions = {
  logLevel: 'silent',
  watch: {
    exclude: /node_modules/,
  },
  output: {
    dir: 'scripts',
    format: 'iife',
    // Some rollup/plugin combinations can emit an IIFE call-site that references
    // `window$1` in the final bundle, for example `})(window$1);`.
    // `banner` is emitted before the wrapper, so the alias exists at call-site.
    banner:
      'var window$1 = typeof window !== "undefined" ? window : globalThis;',
    sourcemap: true,
  },
  plugins: [
    replace({
      preventAssignment: true,
      __VERSION__: JSON.stringify(packageJson.version),
      __IS_OPERA__: process.env.BROWSER === 'opera',
    }),
    typescript({
      exclude: [/node_modules/],
      tsconfig: './configs/tsconfig.rollup.json',
      rootDir: '../../',
    }),
    commonjs(),
    json(),
    inject({
      Buffer: ['buffer', 'Buffer'],
    }),
    nodeResolve({ preferBuiltins: false }),
  ],
};

export default base;
