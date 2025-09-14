#!/usr/bin/env node
import path from 'path';
import { convertMdToTs, getFilesWithExtension } from './converter.js';
import fs from 'fs';

console.log('🚀 Starting complete conversion process...\n');

console.log('📝 Step 1: Converting TypeScript files to Markdown...');
const mdDir = './md';

// Create the _generated directory if it doesn't exist
const generatedDir = './md/_generated';
if (!fs.existsSync(generatedDir)) {
  fs.mkdirSync(generatedDir, { recursive: true });
  console.log('Created md/_generated directory');
}

// Get all .md files in the md directory (exclude _generated subfolder)
const mdFiles = getFilesWithExtension(mdDir, '.md', ['_generated']);

console.log(`Found ${mdFiles.length} markdown files to convert...`);

let mdConversions = 0;
mdFiles.forEach((file: string) => {
  const filePath = path.join(mdDir, file);
  const result = convertMdToTs(filePath, generatedDir);

  if (result.success) {
    console.log(`  ✅ ${result.message}`);
    mdConversions++;
  } else {
    console.log(`  ❌ ${result.message}`);
  }
});

console.log(`\n🎉 Conversion complete!`);
console.log(`   - ${mdConversions} Markdown files converted to TypeScript`);

// List the generated files
console.log('\n📋 Generated files:');
const generatedFiles = fs.readdirSync(generatedDir);
generatedFiles.forEach((file: string) => {
  console.log(`   - ${file}`);
});