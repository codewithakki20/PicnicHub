# 🚀 Render Deployment Checklist

## Before Deployment

### ✅ Code Preparation
- [ ] All features tested locally
- [ ] No console.logs or debug code
- [ ] Environment variables in `.env.example`
- [ ] `.gitignore` excludes sensitive files
- [ ] `package.json` has correct start script
- [ ] Health endpoint working (`/health`)

### ✅ External Services Setup

#### MongoDB Atlas
- [ ] Created free cluster
- [ ] Network Access: Added `0.0.0.0/0`
- [ ] Database user created with password
- [ ] Connection string copied and saved

#### Cloudinary
- [ ] Account created (free tier)
- [ ] Cloud Name noted
- [ ] API Key noted
- [ ] API Secret noted

#### Gmail (for emails)
- [ ] 2FA enabled on Gmail
- [ ] App password generated
- [ ] Email and password saved

### ✅ Git Repository
- [ ] Code pushed to GitHub/GitLab
- [ ] Main branch is up-to-date
- [ ] `.env` file NOT in repository
- [ ] `render.yaml` in repository root

## During Deployment

### ✅ Render Setup
- [ ] Render account created
- [ ] GitHub repository connected
- [ ] Blueprint or Web Service created
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Region selected (Singapore recommended)

### ✅ Environment Variables Set
Copy these to Render Dashboard → Environment tab:

- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000`
- [ ] `MONGODB_URI` = MongoDB Atlas connection string
- [ ] `JWT_SECRET` = Random 32+ character string
- [ ] `JWT_EXPIRES_IN` = `7d`
- [ ] `CLOUDINARY_CLOUD_NAME` = From Cloudinary dashboard
- [ ] `CLOUDINARY_API_KEY` = From Cloudinary dashboard
- [ ] `CLOUDINARY_API_SECRET` = From Cloudinary dashboard
- [ ] `EMAIL_SERVICE` = `gmail`
- [ ] `EMAIL_USER` = Your Gmail address
- [ ] `EMAIL_PASSWORD` = Gmail app-specific password
- [ ] `ALLOWED_ORIGINS` = Frontend URL (add after frontend deployment)
- [ ] `RATE_LIMIT_WINDOW_MS` = `900000`
- [ ] `RATE_LIMIT_MAX_REQUESTS` = `100`

## After Deployment

### ✅ Testing
- [ ] Health check: `https://your-app.onrender.com/health`
- [ ] API root: `https://your-app.onrender.com/api/v1`
- [ ] Test registration endpoint
- [ ] Test login endpoint
- [ ] Check Render logs for errors

### ✅ Frontend Integration
- [ ] Update frontend API base URL
- [ ] Update CORS allowed origins in Render
- [ ] Test from frontend
- [ ] Verify image uploads work
- [ ] Test authentication flow

### ✅ Monitoring
- [ ] Check Render dashboard for metrics
- [ ] Monitor logs for errors
- [ ] Test after first auto-deploy
- [ ] Bookmark Render dashboard

## 🎯 Your Deployed URLs

After deployment, save these:

```
Backend API: https://picnichub-backend.onrender.com
API Endpoint: https://picnichub-backend.onrender.com/api/v1
Health Check: https://picnichub-backend.onrender.com/health
```

Update in:
- [ ] Frontend environment variables
- [ ] Mobile app configuration
- [ ] Documentation
- [ ] README files

## ⚠️ Common Issues

### Build Fails
- Check Node version in `package.json`
- Verify all dependencies are listed
- Review build logs in Render

### 500 Errors
- Check environment variables are set
- Review application logs
- Verify MongoDB connection string
- Test Cloudinary credentials

### Slow First Load
- Normal for free tier (15 min timeout)
- Consider paid tier for production

## 📞 Support Resources

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Render Support](https://render.com/support)

---

**Last Updated**: Ready for deployment!
**Deployment Method**: Render Blueprint with `render.yaml`
**Estimated Time**: 10-15 minutes
