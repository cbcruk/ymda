import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['index.tsx'],
  format: ['esm'],
  target: 'node20',
  platform: 'node',
  dts: false,
  clean: true,
  outDir: 'dist',
  external: ['@libsql/client'],
  esbuildOptions(options) {
    options.jsx = 'automatic'
  },
})
