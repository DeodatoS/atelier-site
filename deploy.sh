#!/bin/bash

# Quick deployment script for Elisa Sanna website
# Usage: ./deploy.sh "your commit message"

# Set default message if none provided
MESSAGE=${1:-"website updates"}

echo "🚀 Deploying changes..."
echo "📝 Commit message: $MESSAGE"

# Add all changes
git add .

# Commit with message
git commit -m "$MESSAGE"

# Push to GitHub (triggers auto-deployment)
git push

echo "✅ Deployment complete!"
echo "🌐 Your site will be live at: https://elisasanna.netlify.app"
