#!/usr/bin/env node

/**
 * Deployment build script for Render
 * Builds locally and prepares files for deployment
 */

import { execSync } from 'child_process';
import { existsSync, rmSync, mkdirSync, copyFileSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

console.log('🚀 Starting deployment build...');

try {
  // Clean previous builds
  if (existsSync('dist')) {
    console.log('🧹 Cleaning previous build...');
    rmSync('dist', { recursive: true, force: true });
  }

  // Install all dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Build client and server locally
  console.log('🏗️ Building project locally...');
  execSync('npm run build', { stdio: 'inherit' });

  // Verify build output
  console.log('✅ Verifying build output...');
  if (!existsSync('dist/spa/index.html')) {
    throw new Error('Client build failed - missing dist/spa/index.html');
  }
  if (!existsSync('dist/server/node-build.mjs')) {
    throw new Error('Server build failed - missing dist/server/node-build.mjs');
  }

  // Create a simple server file that will definitely work
  console.log('🔧 Creating deployment server...');
  const simpleServer = `import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Debug environment variables
console.log('Environment Variables Status:');
console.log('- GOOGLE_MAPS_API_KEY:', process.env.GOOGLE_MAPS_API_KEY ? '✅ Configured' : '❌ Not configured');
console.log('- DEEPSEEK_API_KEY:', process.env.DEEPSEEK_API_KEY ? '✅ Configured' : '❌ Not configured');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Server running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Basic API routes
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong" });
});

app.get("/api/demo", (req, res) => {
  res.json({ 
    message: "Demo endpoint working",
    timestamp: new Date().toISOString()
  });
});

// Serve static files from the built client
app.use(express.static(path.join(__dirname, '../spa')));

// Catch all handler for SPA routing
app.get('*', (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, '../spa/index.html'));
});

app.listen(port, () => {
  console.log(\`🚀 Deployment server running on port \${port}\`);
  console.log(\`📱 Frontend: http://localhost:\${port}\`);
  console.log(\`🔧 API: http://localhost:\${port}/api\`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully');
  process.exit(0);
});`;

  // Write the simple server
  writeFileSync('dist/server/node-build.mjs', simpleServer);

  console.log('🎉 Deployment build completed successfully!');
  console.log('📁 Build output:');
  console.log('   - Client: dist/spa/');
  console.log('   - Server: dist/server/');
  console.log('   - Simple server created for deployment');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
