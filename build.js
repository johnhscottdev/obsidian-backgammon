const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Load .env.local if it exists
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key] = value;
    }
  });
}

const OBSIDIAN_PLUGINS_PATH = process.env.OBSIDIAN_PLUGINS_PATH;
const PLUGIN_ID = JSON.parse(fs.readFileSync('manifest.json', 'utf8')).id;
// `node build.js --vault` also installs into the review vault (npm run vault)
const VAULT_PLUGIN_PATH = process.argv.includes('--vault')
  ? path.join(__dirname, 'test-vault', '.obsidian', 'plugins', PLUGIN_ID)
  : null;

function copyPluginTo(dest, label) {
  try {
    fs.mkdirSync(dest, { recursive: true });
    for (const file of ['main.js', 'manifest.json', 'styles.css']) {
      fs.copyFileSync(file, path.join(dest, file));
    }
    console.log(`📁 Files copied to ${label}: ${dest}`);
  } catch (error) {
    console.error(`❌ Failed to copy files to ${label}:`, error.message);
    process.exitCode = 1;
  }
}

function copyToObsidian() {
  if (VAULT_PLUGIN_PATH) {
    copyPluginTo(VAULT_PLUGIN_PATH, 'review vault');
  }
  if (!OBSIDIAN_PLUGINS_PATH) {
    console.log('ℹ️  Skipping copy to Obsidian (OBSIDIAN_PLUGINS_PATH not set)');
    return;
  }
  copyPluginTo(OBSIDIAN_PLUGINS_PATH, 'Obsidian plugins folder');
}

// Run TypeScript type checking first
console.log('🔍 Type checking...');
try {
  execSync('npx tsc --noEmit --strict --noImplicitAny --noImplicitReturns --noUnusedLocals --noUnusedParameters --pretty --noErrorTruncation', { stdio: 'inherit' });
  console.log('✅ Type checking passed');
} catch (error) {
  console.error('❌ Type checking failed');
  process.exit(1);
}

// Then run esbuild
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
