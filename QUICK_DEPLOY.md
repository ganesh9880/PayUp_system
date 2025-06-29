# ⚡ Quick Deploy Guide

## 🚀 Deploy in 10 Minutes

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare for deployment"
git push
```

### Step 2: Deploy Backend (Render.com)
1. Go to [Render.com](https://render.com) → Sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Name**: `payup-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://ganeshbonu16:Dhwpb2560q@cluster0.gcrkzsz.mongodb.net/payup?retryWrites=true&w=majority
   JWT_SECRET=payup_super_secret_key_2024_secure_and_random
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```
6. Deploy and copy the URL

### Step 3: Deploy Frontend (Vercel)
1. Go to [Vercel.com](https://vercel.com) → Sign up
2. Click "New Project"
3. Import your GitHub repo
4. Configure:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
6. Deploy

### Step 4: Update CORS
1. Go back to Render
2. Update `FRONTEND_URL` with your Vercel URL
3. Redeploy

## 🎉 Done!

Your app is now live at your Vercel URL!

## 🔧 If You Need Help

1. Check `DEPLOYMENT_GUIDE.md` for detailed instructions
2. Run `./deploy.sh` for a deployment check
3. Check the troubleshooting section in the main guide 