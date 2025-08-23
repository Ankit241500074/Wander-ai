#!/usr/bin/env node

/**
 * Production build script for Render deployment
 * This script handles the build process without relying on npm scripts
 */

import { execSync } from 'child_process';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';

console.log('🚀 Starting production build...');

try {
  // Clean previous builds
  if (existsSync('dist')) {
    console.log('🧹 Cleaning previous build...');
    rmSync('dist', { recursive: true, force: true });
  }

  // Install all dependencies (including dev dependencies needed for build)
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Build client directly using vite
  console.log('🏗️ Building client...');
  try {
    execSync('npx vite build', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️ Direct vite build failed, trying npm script...');
    execSync('npm run build:client', { stdio: 'inherit' });
  }

  // Build server directly using vite
  console.log('🏗️ Building server...');
  try {
    execSync('npx vite build --config vite.config.server.ts', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️ Direct vite build failed, trying npm script...');
    execSync('npm run build:server', { stdio: 'inherit' });
  }

  // Verify build output
  console.log('✅ Verifying build output...');
  if (!existsSync('dist/spa/index.html')) {
    throw new Error('Client build failed - missing dist/spa/index.html');
  }
  if (!existsSync('dist/server/node-build.mjs')) {
    throw new Error('Server build failed - missing dist/server/node-build.mjs');
  }

  console.log('🎉 Production build completed successfully!');
  console.log('📁 Build output:');
  console.log('   - Client: dist/spa/');
  console.log('   - Server: dist/server/');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
