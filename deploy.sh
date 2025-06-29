#!/bin/bash

echo "🚀 PayUp Deployment Script"
echo "=========================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    echo "   git remote add origin <your-github-repo-url>"
    echo "   git push -u origin main"
    exit 1
fi

# Check if changes are committed
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Please commit them first:"
    echo "   git add ."
    echo "   git commit -m 'Prepare for deployment'"
    echo "   git push"
    exit 1
fi

echo "✅ Git repository is ready"

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env file not found. Please create it with your production values:"
    echo "   cp backend/env.example backend/.env"
    echo "   # Then edit backend/.env with your actual values"
fi

if [ ! -f "frontend/.env" ]; then
    echo "⚠️  Frontend .env file not found. Please create it:"
    echo "   echo 'VITE_API_URL=https://your-backend-url.onrender.com/api' > frontend/.env"
fi

echo ""
echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. 🗄️  Set up MongoDB Atlas:"
echo "   - Go to https://www.mongodb.com/atlas"
echo "   - Create free cluster"
echo "   - Get connection string"
echo ""
echo "2. 🔧 Deploy Backend to Render:"
echo "   - Go to https://render.com"
echo "   - Connect GitHub repo"
echo "   - Create Web Service"
echo "   - Set environment variables"
echo ""
echo "3. 🎨 Deploy Frontend to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Connect GitHub repo"
echo "   - Deploy project"
echo "   - Set VITE_API_URL environment variable"
echo ""
echo "📖 For detailed instructions, see: DEPLOYMENT_GUIDE.md"
echo ""
echo "🎉 Good luck with your deployment!" 