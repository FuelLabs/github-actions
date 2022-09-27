import { defineConfig } from 'tsup';

export default defineConfig(() => {
  return {
    minify: true,
    entry: ['src/main.ts'],
    outDir: 'dist',
    splitting: false,
    sourcemap: false,
    externals: [],
    noExternal: [/(.*)/gi],
    skipNodeModulesBundle: false,
  };
});
