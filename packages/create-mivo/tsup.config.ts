import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: 'esm',
  target: 'node20',
  platform: 'node',
  clean: true,
  splitting: false,
  sourcemap: false,
  minify: false,
  shims: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
  // Native addons or packages that have native bindings
  external: ['better-sqlite3'],
});
