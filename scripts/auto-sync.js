import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const isWatchMode = process.argv.includes('--watch');

function runGit(cmd) {
  try {
    return execSync(cmd, { cwd: rootDir, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (err) {
    if (err.stdout) console.log(err.stdout.trim());
    if (err.stderr) console.error(err.stderr.trim());
    return null;
  }
}

function syncToGitHub(trigger = 'manual') {
  try {
    const status = runGit('git status --porcelain');
    const currentBranch = runGit('git rev-parse --abbrev-ref HEAD') || 'main';

    if (!status) {
      console.log(`[Auto-Sync ${new Date().toLocaleTimeString()}] Working tree clean. Checking remote sync...`);
      runGit(`git push origin ${currentBranch}`);
      return;
    }

    console.log(`[Auto-Sync ${new Date().toLocaleTimeString()}] Changes detected (${trigger}). Uploading to GitHub...`);
    runGit('git add -A');
    
    const timestamp = new Date().toLocaleString('en-US', { hour12: false });
    const commitMsg = `Auto-sync: update project files [${timestamp}]`;
    runGit(`git commit -m "${commitMsg}"`);

    console.log(`[Auto-Sync] Pushing '${currentBranch}' to GitHub...`);
    const pushOutput = runGit(`git push origin ${currentBranch}`);
    if (pushOutput) console.log(pushOutput);

    // If on a feature branch, also fast-forward and sync main so GitHub default branch is always current
    if (currentBranch !== 'main') {
      try {
        runGit(`git push origin ${currentBranch}:main`);
        console.log(`[Auto-Sync] Synced 'main' on GitHub.`);
      } catch {
        // ignore fast-forward issues if any
      }
    }

    console.log(`✅ [Auto-Sync ${new Date().toLocaleTimeString()}] Successfully uploaded to GitHub!`);
  } catch (err) {
    console.error('[Auto-Sync Error]', err.message);
  }
}

if (!isWatchMode) {
  syncToGitHub('manual');
} else {
  console.log('🔄 Auto-Sync Watcher active. Monitoring files for changes...');
  syncToGitHub('initial');

  let debounceTimer = null;
  const ignoredDirs = new Set(['.git', 'node_modules', 'dist', '.gemini']);

  const watchOptions = { recursive: true };
  
  // Watch directories
  ['src', 'public'].forEach((subDir) => {
    const fullPath = path.join(rootDir, subDir);
    if (!fs.existsSync(fullPath)) return;

    fs.watch(fullPath, watchOptions, (eventType, filename) => {
      if (!filename) return;
      if (filename.includes('node_modules') || filename.includes('.git') || filename.includes('dist')) return;

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        syncToGitHub(`changed: ${filename}`);
      }, 5000); // 5s debounce
    });
  });

  // Watch root files (index.html, package.json, etc.)
  ['index.html', 'package.json', 'vite.config.js'].forEach((file) => {
    const fullPath = path.join(rootDir, file);
    if (!fs.existsSync(fullPath)) return;
    fs.watch(fullPath, () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        syncToGitHub(`changed: ${file}`);
      }, 5000);
    });
  });

  // Keep process alive
  setInterval(() => {}, 1000 * 60 * 60);
}
