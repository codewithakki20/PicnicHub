# PicnicHub Backend - Render Deployment Guide

## 📋 Prerequisites

1. **GitHub Repository**: Ensure your backend code is pushed to GitHub
2. **Render Account**: Create a free account at [render.com](https://render.com)
3. **MongoDB Atlas**: Set up a MongoDB cluster (free tier available)
4. **Cloudinary Account**: For image storage (free tier available)

## 🚀 Deployment Steps

### Option 1: Using render.yaml (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Connect to Render**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click **"New +" → "Blueprint"**
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml`

3. **Set Environment Variables**:
   Render will prompt you to set these variables (marked with `sync: false`):
   
   - `MONGODB_URI`: Your MongoDB connection string from Atlas
   - `CLOUDINARY_CLOUD_NAME`: From Cloudinary dashboard
   - `CLOUDINARY_API_KEY`: From Cloudinary dashboard
   - `CLOUDINARY_API_SECRET`: From Cloudinary dashboard  
   - `EMAIL_USER`: Your Gmail address
   - `EMAIL_PASSWORD`: Gmail app-specific password
   - `ALLOWED_ORIGINS`: Your frontend URL (add after frontend deployment)

4. **Deploy**: Click "Apply" and Render will build and deploy!

### Option 2: Manual Web Service Creation

1. **Create Web Service**:
   - Go to Render Dashboard
   - Click **"New +" → "Web Service"**
   - Connect your GitHub repo

2. **Configure Service**:
   - **Name**: `picnichub-backend`
   - **Region**: Singapore (or closest to you)
   - **Branch**: `main`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Add Environment Variables** (Go to Environment tab):
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=<your_mongodb_uri>
   JWT_SECRET=<generate_secure_32+_char_string>
   JWT_EXPIRES_IN=7d
   CLOUDINARY_CLOUD_NAME=<your_cloudinary_name>
   CLOUDINARY_API_KEY=<your_api_key>
   CLOUDINARY_API_SECRET=<your_api_secret>
   EMAIL_SERVICE=gmail
   EMAIL_USER=<your_gmail>
   EMAIL_PASSWORD=<app_specific_password>
   ALLOWED_ORIGINS=https://your-frontend.onrender.com
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Deploy**: Click "Create Web Service"

## 🔐 Setting Up External Services

### MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. **Network Access**: Add `0.0.0.0/0` (allow from anywhere)
4. **Database Access**: Create a user with password
5. **Connect**: Get connection string → Replace `<password>` with your password
6. Use format: `mongodb+srv://username:password@cluster.mongodb.net/picnichub`

### Cloudinary

1. Go to [Cloudinary](https://cloudinary.com)
2. Create free account
3. Dashboard shows: Cloud Name, API Key, API Secret
4. Copy these to Render environment variables

### Gmail App Password

1. Enable 2-Factor Authentication on Gmail
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Generate password for "Mail"
4. Use this password (not your regular password)

## ✅ Verification

After deployment, test these endpoints:

1. **Health Check**:
   ```
   https://your-app.onrender.com/health
   ```
   Should return: `{"status":"OK"}`

2. **API Base**:
   ```
   https://your-app.onrender.com/api/v1
   ```

3. **Test Registration**:
   ```bash
   curl -X POST https://your-app.onrender.com/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com","password":"test123"}'
   ```

## 🔄 Auto-Deploy

Render automatically deploys when you push to `main` branch:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

## 📊 Monitoring

- **Logs**: View in Render Dashboard → Logs tab
- **Metrics**: Dashboard shows CPU, Memory usage
- **Health**: Render pings `/health` endpoint every few minutes

## ⚠️ Important Notes

1. **Free Tier Limitations**:
   - Service sleeps after 15 min inactivity
   - First request after sleep takes ~30 sec
   - 750 hours/month free

2. **CORS**: Update `ALLOWED_ORIGINS` after deploying frontend

3. **Database**: Ensure MongoDB Atlas has proper network access

4. **Uploads**: Images are stored in Cloudinary, not on Render

## 🐛 Troubleshooting

### Build Fails
- Check Node version compatibility
- Ensure all dependencies in `package.json`

### 500 Errors
- Check Render logs
- Verify all environment variables are set
- Test MongoDB connection

### CORS Errors
- Add frontend URL to `ALLOWED_ORIGINS`
- Format: `https://frontend.com` (no trailing slash)

## 📝 Environment Variables Checklist

- [ ] `MONGODB_URI` - From MongoDB Atlas
- [ ] `JWT_SECRET` - Min 32 characters, random
- [ ] `CLOUDINARY_CLOUD_NAME`
- [ ] `CLOUDINARY_API_KEY`
- [ ] `CLOUDINARY_API_SECRET`
- [ ] `EMAIL_USER` - Your Gmail
- [ ] `EMAIL_PASSWORD` - Gmail app password
- [ ] `ALLOWED_ORIGINS` - Frontend URL (after deployment)

## 🌐 Your Backend URL

After deployment, your API will be at:
```
https://picnichub-backend.onrender.com/api/v1
```

Update this in your frontend's API configuration!

---

**Need help?** Check [Render Docs](https://render.com/docs) or [Contact Support](https://render.com/support)
