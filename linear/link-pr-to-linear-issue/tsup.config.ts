import type { Options } from 'tsup';

const options: Options = {
  entry: ['src/index.ts'],
  outDir: 'dist',
  minify: true,
  splitting: false,
  sourcemap: false,
  format: ['cjs'],
};

export default options;
