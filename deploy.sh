#!/bin/bash
# Green Dee Farm Deployment Script

echo "🌱 Green Dee Farm - Starting deployment..."

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm install --production --legacy-peer-deps

# 2. Build the application
echo "🔨 Building application..."
npm run build

# 3. Copy necessary files
echo "📁 Preparing deployment files..."

# Create deployment directory structure
mkdir -p deploy
mkdir -p deploy/.next
mkdir -p deploy/public
mkdir -p deploy/components
mkdir -p deploy/pages
mkdir -p deploy/json
mkdir -p deploy/styles
mkdir -p deploy/utils

# Copy built files
cp -r .next/* deploy/.next/
cp -r public/* deploy/public/
cp -r components/* deploy/components/
cp -r pages/* deploy/pages/
cp -r json/* deploy/json/
cp -r styles/* deploy/styles/
cp -r utils/* deploy/utils/

# Copy configuration files
cp server.js deploy/
cp package.json deploy/
cp .htaccess deploy/
cp web.config deploy/
cp next.config.js deploy/
cp .env.production deploy/

echo "✅ Deployment files ready in 'deploy' folder"
echo "📋 Upload contents of 'deploy' folder to your server"
echo ""
echo "🚀 Post-deployment steps:"
echo "1. Upload all files from 'deploy' folder to server"
echo "2. Run 'npm install --production' on server"
echo "3. Set Node.js startup file to 'server.js'"
echo "4. Restart the application"
echo ""
echo "🌿 Green Dee Farm deployment preparation complete!"