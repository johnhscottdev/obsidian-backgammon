const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const OBSIDIAN_PLUGINS_PATH = '/mnt/f/ObsidianVault/.obsidian/plugins/obsidian-backgammon-xgid';

function copyToObsidian() {
  try {
    // Ensure the plugin directory exists
    if (!fs.existsSync(OBSIDIAN_PLUGINS_PATH)) {
      fs.mkdirSync(OBSIDIAN_PLUGINS_PATH, { recursive: true });
    }

    // Copy main.js
    fs.copyFileSync('main.js', path.join(OBSIDIAN_PLUGINS_PATH, 'main.js'));
    
    // Copy manifest.json
    fs.copyFileSync('manifest.json', path.join(OBSIDIAN_PLUGINS_PATH, 'manifest.json'));
    
    console.log('📁 Files copied to Obsidian plugins folder');
  } catch (error) {
    console.error('❌ Failed to copy files to Obsidian:', error.message);
  }
}

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
  copyToObsidian();
}).catch((err) => {
  console.error('❌ Build failed:', err.message);
  console.error(err.errors || err);
  process.exit(1);
});
