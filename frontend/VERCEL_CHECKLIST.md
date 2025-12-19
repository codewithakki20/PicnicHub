# 🚀 Vercel Deployment Checklist

## Pre-Deployment

### ✅ Backend Requirements
- [ ] Backend deployed to Render
- [ ] Backend health check working: `https://your-backend.onrender.com/health`
- [ ] Backend URL saved: `_______________________________`
- [ ] CORS configured on backend

### ✅ Code Preparation
- [ ] All features working locally
- [ ] No console.logs or debug code in production
- [ ] Build succeeds locally: `npm run build`
- [ ] Environment variables documented in `.env.example`
- [ ] `.gitignore` excludes `.env` file
- [ ] Code committed to GitHub

### ✅ External Services
- [ ] Google Maps API key (if using maps) - [Get it here](https://console.cloud.google.com/)
- [ ] API key restrictions set (HTTP referrers)

## Deployment Setup

### ✅ Vercel Account
- [ ] Account created at [vercel.com](https://vercel.com)
- [ ] GitHub account connected
- [ ] Email verified

### ✅ Project Import
- [ ] Repository imported to Vercel
- [ ] Framework detected: **Create React App**
- [ ] Build settings confirmed:
  - Build Command: `npm run build`
  - Output Directory: `build`
  - Install Command: `npm install`

### ✅ Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

**Required:**
- [ ] `REACT_APP_API_URL`
  - Value: `https://your-backend.onrender.com/api/v1`
  - Environment: Production, Preview, Development

**Optional:**
- [ ] `REACT_APP_GOOGLE_MAPS_KEY`
  - Value: `your_google_maps_api_key`
  - Environment: Production, Preview, Development

## Deployment

### ✅ Initial Deploy
- [ ] Click "Deploy" button
- [ ] Build completes successfully (check logs)
- [ ] Deployment succeeds
- [ ] Production URL generated
- [ ] Production URL saved: `__________________________________`

## Post-Deployment Testing

### ✅ Functionality Tests
- [ ] **Homepage loads**: Visit `https://your-app.vercel.app`
- [ ] **Authentication works**:
  - [ ] Register new account
  - [ ] Verify OTP
  - [ ] Login
  - [ ] Logout
- [ ] **API Connection**:
  - [ ] Open DevTools → Network tab
  - [ ] Check API calls go to correct backend
  - [ ] No CORS errors
- [ ] **Core Features**:
  - [ ] Create memory/post
  - [ ] Upload images
  - [ ] View reels
  - [ ] Comment on posts
  - [ ] Follow/unfollow users
  - [ ] Edit profile
- [ ] **Routing**:
  - [ ] All pages accessible
  - [ ] Browser back/forward works
  - [ ] Direct URL access works
  - [ ] Refresh on route works

### ✅ Visual Tests
- [ ] UI renders correctly  
- [ ] Images load properly
- [ ] No layout breaks
- [ ] Mobile responsive
- [ ] Proper loading states
- [ ] Error messages shown appropriately

### ✅ Performance
- [ ] Page loads in <3 seconds
- [ ] No console errors
- [ ] No warning messages
- [ ] Lighthouse score >90 (optional)

## Backend Configuration

### ✅ Update Backend CORS
After frontend deployment, update backend on Render:

1. Go to Re Render Dashboard
2. Select backend service
3. Go to Environment → Add variable
4. Update `ALLOWED_ORIGINS`:
   ```
   https://your-app.vercel.app,http://localhost:3000
   ```
5. Save and redeploy backend

### ✅ Test After CORS Update
- [ ] Login from frontend works
- [ ] API calls succeed
- [ ] No CORS errors in console

## Auto-Deploy Setup

### ✅ Configure Auto-Deploy
- [ ] Connect Git repository
- [ ] Enable auto-deploy from `main` branch
- [ ] Test: Make a change, push, verify auto-deploy

```bash
# Test auto-deploy
git add .
git commit -m "Test auto-deploy"
git push origin main
# Check Vercel dashboard for deployment
```

## Optional Enhancements

### ✅ Custom Domain (Optional)
- [ ] Domain purchased
- [ ] Domain added in Vercel Settings → Domains
- [ ] DNS records configured
- [ ] SSL certificate active
- [ ] Backend CORS updated with custom domain

### ✅ Analytics (Optional)
- [ ] Vercel Analytics enabled
- [ ] Google Analytics added (if needed)

### ✅ Performance Monitoring
- [ ] Speed Insights enabled
- [ ] Web Vitals reviewed

## Documentation

### ✅ Update Project Docs
- [ ] README updated with live URL
- [ ] API endpoints documented
- [ ] Environment variables listed
- [ ] Deployment steps documented

## Troubleshooting Reference

### If Build Fails:
1. Check build logs in Vercel
2. Run `npm run build` locally
3. Check `package.json` dependencies
4. Verify Node version compatibility

### If API Calls Fail:
1. Check `REACT_APP_API_URL` is set correctly
2. Verify backend is running
3. Check backend CORS allows frontend URL
4. Check Network tab for error details

### If Routes Don't Work:
1. Verify `vercel.json` has correct SPA config
2. Check it matches the template
3. Redeploy after fixing

### If Images Don't Load:
1. Check Cloudinary configuration on backend
2. Verify backend URL is correct
3. Check CORS settings

## 🎯 Your URLs

After deployment, save these:

```
Frontend URL: https://________________.vercel.app
Backend URL: https://________________.onrender.com
API Endpoint: https://________________.onrender.com/api/v1
```

## 📊 Monitoring

### Daily Checks (First Week)
- [ ] Check error logs in Vercel
- [ ] Monitor backend logs on Render
- [ ] Check analytics for traffic
- [ ] Test critical features

### Weekly Checks
- [ ] Review analytics
- [ ] Check performance metrics
- [ ] Monitor build times
- [ ] Review user feedback

## ✅ Final Verification

- [ ] All tests passing
- [ ] No console errors
- [ ] Performance acceptable  
- [ ] CORS configured correctly
- [ ] Auto-deploy working
- [ ] Documentation updated
- [ ] Team notified
- [ ] URLs bookmarked

---

**Status**: Ready for deployment! 🚀
**Estimated Time**: 10-15 minutes
**Difficulty**: Easy

**Next Steps**: Follow the deployment guide in `VERCEL_DEPLOYMENT.md`
