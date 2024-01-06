import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import dts from 'rollup-plugin-dts';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import tailwindcss from 'tailwindcss';
import copy from 'rollup-plugin-copy';

const packageJson = require('./package.json');
const tailwindConfig = require('./tailwind.config');

export default [
  {
    input: './index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      postcss({
        extensions: ['.css'],
        plugins: [tailwindcss(tailwindConfig)],
      }),
      typescript(),
      peerDepsExternal(),
      resolve(),
      commonjs(),
      json(),
      terser(),
      copy({
        targets: [
          {
            src: ['src/cli/infrastructure/*.js', '!**/*.spec.js'],
            dest: 'build/cli/infrastructure',
          },
          {
            src: ['src/cli/manifest/*.js', '!**/*.spec.js'],
            dest: 'build/cli/manifest'
          },
          {
            src: ['src/cli/init/*.js', '!**/*.spec.js'],
            dest: 'build/cli/init'
          },
          {
            src: ['src/cli/*.js'],
            dest: 'build/cli'
          },
        ],
      }),
    ],
  },
  {
    input: 'build/cjs/types/src/index.d.ts',
    output: [{ file: 'build/index.d.ts', format: 'esm' }],
    plugins: [dts.default()],
    external: [/\.css$/],
  },
];
