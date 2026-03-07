// pipeline/sync-to-windows.js — Sync key docs to Windows for Claude.ai upload
// Runs automatically at pipeline start. Target: C:\Users\roden\Downloads\cusslab\
// Add new files to SYNC_FILES as the project grows.

'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT       = path.join(__dirname, '..');
const WIN_TARGET  = '/mnt/c/Users/roden/Downloads/cusslab';
const WIN_TARGET2 = '/mnt/c/Users/roden/OneDrive/Pictures/Documents/GitHub/cusslab';

const SYNC_FILES = [
  // App — main HTML file
  'index.html',

  // Domain model and practices
  '.claude/practices/domain-model.md',
  '.claude/practices/waste-log.md',

  // Character docs
  'docs/characters-boardroom.md',
  'docs/characters-comedy.md',
  'docs/characters-sports.md',
  'docs/characters-summaries.md',
  'docs/characters-intensity.md',
  'docs/character-wandering.md',

  // Design and conflict docs
  'docs/needles-and-conflicts.md',
  'docs/perspectives.md',
  'docs/panel-context.md',

  // Claude.ai project instructions
  'docs/CLAUDE_AI_PROJECT_INSTRUCTIONS.md',
];

function syncToDir(target, label) {
  let ok = 0;
  let skip = 0;
  let fail = 0;

  if (!fs.existsSync(target)) {
    try {
      fs.mkdirSync(target, { recursive: true });
    } catch (e) {
      console.log(`  ! sync-to-windows: could not create ${label}: ${e.message}`);
      return;
    }
  }

  for (const rel of SYNC_FILES) {
    const src  = path.join(ROOT, rel);
    const dest = path.join(target, path.basename(rel));

    if (!fs.existsSync(src)) { skip++; continue; }

    try {
      fs.copyFileSync(src, dest);
      ok++;
    } catch (e) {
      console.log(`  ! sync-to-windows: failed to copy ${rel} to ${label}: ${e.message}`);
      fail++;
    }
  }

  console.log(`  Sync → ${label}  [${ok} files, ${skip} skipped, ${fail} failed]`);
}

function sync() {
  syncToDir(WIN_TARGET,  'C:\\Users\\roden\\Downloads\\cusslab\\');
  if (fs.existsSync(path.dirname(WIN_TARGET2))) {
    syncToDir(WIN_TARGET2, 'C:\\Users\\roden\\OneDrive\\...\\GitHub\\cusslab\\');
  }
}

sync();
