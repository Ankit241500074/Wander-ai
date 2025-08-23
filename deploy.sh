#!/bin/bash

echo "🚀 Preparing Wander-ai for Render deployment..."

# Check if build works locally
echo "📦 Testing local build..."
if npm run build; then
    echo "✅ Local build successful!"
else
    echo "❌ Local build failed! Fix issues before deploying."
    exit 1
fi

# Check if dist directory structure is correct
echo "📁 Checking build output..."
if [ -d "dist/server" ] && [ -d "dist/spa" ]; then
    echo "✅ Build output structure correct"
    echo "   - Server files: dist/server/"
    echo "   - Frontend files: dist/spa/"
else
    echo "❌ Build output structure incorrect!"
    echo "   Expected: dist/server/ and dist/spa/"
    exit 1
fi

# Check environment variables
echo "🔑 Checking environment variables..."
if [ -f "env.template" ]; then
    echo "✅ env.template file exists"
    echo "   Make sure to set these in Render:"
    cat env.template | grep -E "^[A-Z_]+=" | sed 's/^/   - /'
else
    echo "❌ env.template file missing!"
fi

echo ""
echo "🎯 Ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Push changes to Git: git add . && git commit -m 'Fix npm deployment and Express compatibility' && git push"
echo "2. Go to [dashboard.render.com](https://dashboard.render.com)"
echo "3. Create new Web Service (for backend)"
echo "4. Create new Static Site (for frontend)"
echo "5. Use render.yaml configuration"
echo ""
echo "📚 See DEPLOYMENT.md for detailed instructions"
echo "🔧 See TROUBLESHOOTING.md if deployment fails"
echo ""
echo "💡 Note: Now using npm instead of pnpm for better Render compatibility"
