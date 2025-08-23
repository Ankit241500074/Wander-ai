# Deploying Wander-ai on Render

This guide will walk you through deploying your Wander-ai project on Render, a cloud platform that offers free hosting for web services.

## Prerequisites

- A Render account ([sign up here](https://render.com))
- Your project pushed to a Git repository (GitHub, GitLab, etc.)
- API keys for Google Maps and DeepSeek (if you want full functionality)

## Step 1: Prepare Your Repository

1. Make sure your project is pushed to a Git repository
2. Ensure you have the following files in your root directory:
   - `package.json` (already exists)
   - `render.yaml` (created for you)
   - `env.example` (created for you)

## Step 2: Deploy Backend API

1. **Go to Render Dashboard**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Click "New +" and select "Web Service"

2. **Connect Repository**
   - Connect your Git repository
   - Select the repository containing your Wander-ai project

3. **Configure Service**
   - **Name**: `wander-ai-api` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Choose "Starter" (free tier)

4. **Set Environment Variables**
   - `NODE_ENV`: `production`
   - `GOOGLE_MAPS_API_KEY`: Your Google Maps API key
   - `DEEPSEEK_API_KEY`: Your DeepSeek API key
   - `JWT_SECRET`: A secure random string (Render can generate this)
   - `PORT`: `10000`

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your backend

## Step 3: Deploy Frontend

1. **Create Another Web Service**
   - Click "New +" and select "Web Service" again

2. **Configure Frontend Service**
   - **Name**: `wander-ai-frontend` (or your preferred name)
   - **Environment**: `Static Site`
   - **Build Command**: `npm install && npm run build:client`
   - **Publish Directory**: `dist/spa`
   - **Plan**: Choose "Starter" (free tier)

3. **Set Environment Variables**
   - `VITE_API_URL`: Your backend service URL (e.g., `https://wander-ai-api.onrender.com`)

4. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your frontend

## Step 4: Update Frontend API URL

After your backend is deployed, update the `VITE_API_URL` in your frontend service to point to your actual backend URL.

## Step 5: Test Your Deployment

1. **Backend Health Check**: Visit `https://your-backend-name.onrender.com/api/health`
2. **Frontend**: Visit your frontend service URL
3. **Test API Endpoints**: Try the demo endpoint at `/api/demo`

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | Yes | `production` |
| `GOOGLE_MAPS_API_KEY` | Google Maps API key | Yes* | `AIza...` |
| `DEEPSEEK_API_KEY` | DeepSeek API key | Yes* | `sk-...` |
| `JWT_SECRET` | JWT signing secret | Yes | Auto-generated |
| `PORT` | Server port | No | `10000` |
| `VITE_API_URL` | Backend API URL | Yes | `https://...` |

*Required for full functionality, but the app will run without them

## Troubleshooting

### Build Failures
- Check that all dependencies are in `package.json`
- Ensure Node.js version compatibility (your project uses Node 22)
- Verify build commands are correct

### Runtime Errors
- Check environment variables are set correctly
- Verify API keys are valid
- Check Render logs for detailed error messages

### CORS Issues
- Your backend already has CORS configured
- Ensure frontend URL is allowed in CORS settings if needed

## Cost Considerations

- **Starter Plan**: Free tier with limitations
  - 750 hours/month (enough for always-on service)
  - 512MB RAM
  - Shared CPU
- **Upgrade**: If you need more resources, consider paid plans

## Next Steps

1. Set up custom domains (optional)
2. Configure SSL certificates (automatic with Render)
3. Set up monitoring and alerts
4. Configure auto-deployment from your main branch

## Support

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- Check your service logs in the Render dashboard for debugging
