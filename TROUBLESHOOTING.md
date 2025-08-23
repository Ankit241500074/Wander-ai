# Render Deployment Troubleshooting Guide

If your Render deployment is failing, follow these steps to identify and fix the issue.

## Common Deployment Failures & Solutions

### 1. Build Failures

#### Error: "Build failed" or "Build timeout"
**Solution**: Check the build logs in Render dashboard

**Common Causes**:
- Missing dependencies
- Node.js version incompatibility
- Build command errors

**Fix**: 
```bash
# Ensure all dependencies are in package.json
npm install --save-dev @types/node

# Check if build works locally
npm run build
```

#### Error: "Cannot find module" during build
**Solution**: Verify all imports and dependencies

**Check**:
- All imports in your code exist
- `package.json` has all required dependencies
- No missing peer dependencies

### 2. Runtime Failures

#### Error: "Application failed to start"
**Solution**: Check the start command and server configuration

**Common Issues**:
- Wrong start command
- Port configuration issues
- Missing environment variables

**Fix**: 
```bash
# Test locally with production build
npm run build
npm start

# Check if server starts on correct port
```

#### Error: "Port already in use" or "EADDRINUSE"
**Solution**: Render sets PORT automatically, don't hardcode it

**Fix**: Ensure your server uses `process.env.PORT`:
```typescript
const port = process.env.PORT || 3000;
```

### 3. Environment Variable Issues

#### Error: "Environment variable not found"
**Solution**: Set all required environment variables in Render

**Required Variables**:
- `NODE_ENV`: `production`
- `GOOGLE_MAPS_API_KEY`: Your API key
- `DEEPSEEK_API_KEY`: Your API key
- `JWT_SECRET`: Let Render generate this

### 4. File Path Issues

#### Error: "Cannot find file" or "Module not found"
**Solution**: Check build output paths

**Verify**:
- `dist/server/` contains your server files
- `dist/spa/` contains your frontend files
- All imports use correct relative paths

### 5. CORS Issues

#### Error: "CORS policy" in browser console
**Solution**: Update CORS configuration for production

**Fix**: Ensure your backend allows your frontend domain:
```typescript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.onrender.com']
    : ['http://localhost:3000']
}));
```

## Step-by-Step Debugging

### Step 1: Check Build Logs
1. Go to Render dashboard
2. Click on your service
3. Go to "Logs" tab
4. Look for build errors

### Step 2: Test Locally
```bash
# Test build process
npm run build

# Test server start
npm start

# Check if files exist
ls -la dist/
```

### Step 3: Verify Dependencies
```bash
# Check for missing dependencies
npm ls

# Install any missing ones
npm install --save-dev @types/node
```

### Step 4: Check File Structure
Ensure your build outputs:
```
dist/
├── server/
│   ├── node-build.mjs
│   └── ... (other server files)
└── spa/
    ├── index.html
    ├── assets/
    └── ... (other frontend files)
```

## Quick Fixes for Common Issues

### Issue: "npm start" not found
**Fix**: Update start command to:
```yaml
startCommand: node dist/server/node-build.mjs
```

### Issue: Build timeout
**Fix**: Optimize build process:
```yaml
buildCommand: npm ci --only=production && npm run build
```

### Issue: Port conflicts
**Fix**: Remove hardcoded ports, use environment variable:
```typescript
const port = process.env.PORT || 3000;
```

### Issue: Missing environment variables
**Fix**: Set all required variables in Render dashboard:
- Go to Environment tab
- Add missing variables
- Redeploy

## Alternative: Use Combined Service

If separate services continue to fail, try the combined approach:

1. Use `render-combined.yaml` instead
2. Deploy as single Node.js service
3. Serves both API and frontend from same service

## Getting Help

1. **Check Render Logs**: Most detailed error information
2. **Test Locally**: Reproduce issue on your machine
3. **Render Community**: [community.render.com](https://community.render.com)
4. **Render Support**: Available for paid plans

## Common Success Patterns

- Use `npm ci` instead of `npm install` for faster, reliable builds
- Specify Node.js version explicitly
- Test build process locally before deploying
- Use health check endpoints for monitoring
- Set all environment variables before deployment
