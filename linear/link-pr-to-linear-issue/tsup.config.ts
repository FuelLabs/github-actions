import type { Options } from 'tsup';

const options: Options = {
  entry: ['src/index.ts'],
  outDir: 'dist',
  minify: false,
  splitting: false,
  sourcemap: false,
  format: ['cjs'],
  noExternal: ['@actions/core', '@actions/github', '@linear/sdk']
};

export default options;
