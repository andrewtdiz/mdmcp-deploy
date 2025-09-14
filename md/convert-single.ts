#!/usr/bin/env node
import { convertMdToTs } from './converter.js';

// Get the file path from command line arguments
const filePath = process.argv[2];

if (!filePath) {
  console.error('❌ Please provide a file path as an argument');
  process.exit(1);
}

if (!filePath.endsWith('.md')) {
  console.log(`⏭️ Skipping ${filePath} (not a markdown file)`);
  process.exit(0);
}

console.log(`🔄 Converting ${filePath}...`);

const generatedDir = './_generated';
const result = convertMdToTs(filePath, generatedDir);

if (result.success) {
  console.log(`✅ ${result.message}`);
} else {
  console.error(`❌ ${result.message}`);
  process.exit(1);
}