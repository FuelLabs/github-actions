import type { Options } from 'tsup';

const options: Options = {
  minify: true,
  entry: ['src/index.ts'],
  outDir: 'dist',
  splitting: false,
  sourcemap: false,
  noExternal: ['@actions/core'],
  format: ['cjs'],
};

export default options;
