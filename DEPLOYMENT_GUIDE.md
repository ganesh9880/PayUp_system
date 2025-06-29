# 🚀 PayUp Deployment Guide

This guide will help you deploy your PayUp application to production.

## 📋 Prerequisites

1. **GitHub Account** - to host your code
2. **MongoDB Atlas Account** - for database (free tier available)
3. **Render.com Account** - for backend hosting (free tier available)
4. **Vercel Account** - for frontend hosting (free tier available)
5. **Twilio Account** - for WhatsApp reminders (optional)

## 🗄️ Step 1: Set Up MongoDB Atlas

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (free tier)
4. Set up database access (username/password)
5. Set up network access (allow all IPs: 0.0.0.0/0)

### 1.2 Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your actual password
5. Add database name: `?retryWrites=true&w=majority&appName=PayUp`

## 🔧 Step 2: Deploy Backend to Render

### 2.1 Prepare Your Code
1. Push your code to GitHub
2. Make sure your backend folder structure is correct

### 2.2 Deploy on Render
1. Go to [Render.com](https://render.com)
2. Sign up and connect your GitHub account
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - **Name**: `payup-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 2.3 Set Environment Variables
In Render dashboard, go to your service → Environment → Add the following:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/payup?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=whatsapp:+14155238886
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### 2.4 Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Copy your service URL (e.g., `https://payup-backend.onrender.com`)

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Prepare Frontend
1. Create `.env` file in frontend folder:
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### 3.2 Deploy on Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Sign up and connect your GitHub account
3. Click "New Project"
4. Import your GitHub repository
5. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.3 Set Environment Variables
In Vercel dashboard, go to your project → Settings → Environment Variables:

```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### 3.4 Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Copy your frontend URL (e.g., `https://payup-frontend.vercel.app`)

## 🔄 Step 4: Update Backend CORS

After getting your frontend URL, update the backend environment variable:

1. Go back to Render dashboard
2. Update `FRONTEND_URL` to your actual Vercel URL
3. Redeploy the backend service

## 🧪 Step 5: Test Your Deployment

1. **Test Backend**: Visit `https://your-backend-url.onrender.com/api/health`
2. **Test Frontend**: Visit your Vercel URL
3. **Test Full Flow**: Register, login, create groups, add expenses

## 🔧 Alternative Deployment Options

### Railway (Paid)
- Similar to Render but with better performance
- Good for production apps

### Heroku (Paid)
- Classic choice for Node.js apps
- Good documentation and add-ons

### DigitalOcean App Platform (Paid)
- More control over infrastructure
- Good for scaling

## 🚨 Important Notes

### Security
- Use strong JWT secrets
- Never commit `.env` files
- Use HTTPS in production
- Set up proper CORS

### Performance
- Enable MongoDB indexes
- Use connection pooling
- Monitor your app performance

### Monitoring
- Set up error tracking (Sentry)
- Monitor API response times
- Set up uptime monitoring

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check FRONTEND_URL in backend environment
   - Ensure URLs match exactly

2. **MongoDB Connection Issues**
   - Verify connection string
   - Check network access settings
   - Ensure database user has proper permissions

3. **Build Failures**
   - Check package.json scripts
   - Verify all dependencies are listed
   - Check Node.js version compatibility

4. **Environment Variables**
   - Ensure all variables are set
   - Check for typos in variable names
   - Restart services after changing variables

## 📞 Support

If you encounter issues:
1. Check the deployment logs
2. Verify environment variables
3. Test locally first
4. Check the troubleshooting section above

## 🎉 Success!

Once deployed, your PayUp app will be available at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`

Share your app with friends and start managing group expenses! 🚀 