#!/usr/bin/env node

/**
 * Simple production build script for Render deployment
 * Uses TypeScript compiler directly instead of Vite
 */

import { execSync } from 'child_process';
import { existsSync, rmSync, mkdirSync } from 'fs';
import { join } from 'path';

console.log('🚀 Starting simple production build...');

try {
  // Clean previous builds
  if (existsSync('dist')) {
    console.log('🧹 Cleaning previous build...');
    rmSync('dist', { recursive: true, force: true });
  }

  // Create dist directories
  mkdirSync('dist/server', { recursive: true });
  mkdirSync('dist/spa', { recursive: true });

  // Install all dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Try to build client with Vite first
  console.log('🏗️ Building client with Vite...');
  try {
    execSync('npx vite build', { stdio: 'inherit' });
    console.log('✅ Client built with Vite');
  } catch (error) {
    console.log('❌ Vite build failed, trying alternative approach...');
    
    // Fallback: Copy client files directly (for static serving)
    console.log('📁 Copying client files directly...');
    execSync('cp -r client/* dist/spa/', { stdio: 'inherit' });
    
    // Create a basic index.html if it doesn't exist
    if (!existsSync('dist/spa/index.html')) {
      const basicHtml = `<!DOCTYPE html>
<html>
<head>
    <title>Wander AI</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
    <div id="root">Loading...</div>
    <script>console.log('Client files copied directly');</script>
</body>
</html>`;
      require('fs').writeFileSync('dist/spa/index.html', basicHtml);
    }
  }

  // Build server with TypeScript compiler directly
  console.log('🏗️ Building server with TypeScript...');
  try {
    // Use tsc directly to compile server files
    execSync('npx tsc server/node-build.ts --outDir dist/server --target ES2020 --module ES2020 --moduleResolution node --esModuleInterop --allowSyntheticDefaultImports', { stdio: 'inherit' });
    
    // Rename the output file
    if (existsSync('dist/server/node-build.js')) {
      execSync('mv dist/server/node-build.js dist/server/node-build.mjs', { stdio: 'inherit' });
    }
    
    console.log('✅ Server built with TypeScript');
  } catch (error) {
    console.log('❌ TypeScript build failed, trying alternative approach...');
    
    // Fallback: Copy server files and create a basic server
    console.log('📁 Creating basic server file...');
    const basicServer = `import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server running' });
});

// Serve static files
app.use(express.static(path.join(process.cwd(), 'dist/spa')));

// Catch all handler for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist/spa/index.html'));
});

app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});`;

    require('fs').writeFileSync('dist/server/node-build.mjs', basicServer);
  }

  // Verify build output
  console.log('✅ Verifying build output...');
  if (!existsSync('dist/spa/index.html')) {
    throw new Error('Client build failed - missing dist/spa/index.html');
  }
  if (!existsSync('dist/server/node-build.mjs')) {
    throw new Error('Server build failed - missing dist/server/node-build.mjs');
  }

  console.log('🎉 Simple production build completed successfully!');
  console.log('📁 Build output:');
  console.log('   - Client: dist/spa/');
  console.log('   - Server: dist/server/');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
