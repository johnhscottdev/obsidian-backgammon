const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  outfile: 'main.js',
  format: 'cjs',
  target: ['es2020'],
  platform: 'node',
  external: ['obsidian']
}).then(() => {
  console.log('✅ Build succeeded');
}).catch((err) => {
  console.error('❌ Build failed:', err.message);
  console.error(err.errors || err);
  process.exit(1);
});
