// build.js
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/main.ts'], // your plugin's entry point
  bundle: true,
  outfile: 'main.js',
  format: 'cjs',
  target: ['es2020'],
  platform: 'node',
  external: ['obsidian'], // don't bundle the Obsidian API
}).catch(() => process.exit(1));
