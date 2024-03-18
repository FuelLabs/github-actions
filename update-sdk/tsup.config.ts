import type { Options } from 'tsup';

const options: Options = {
  minify: true,
  entry: ['src/index.ts'],
  outDir: 'dist',
  splitting: false,
  sourcemap: false,
  format: ['cjs'],
};

export default options;
