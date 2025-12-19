# 🌿 PicnicHub Frontend - Vercel Deployment Guide

## 📋 Prerequisites

1. **Vercel Account**: Create a free account at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Frontend code pushed to GitHub
3. **Backend Deployed**: Backend API already deployed (get the URL)
4. **Google Maps API Key**: Optional, for map features

## 🚀 Deployment Steps

### Method 1: Vercel CLI (Recommended)

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Login to Vercel
```bash
vercel login
```

#### 3. Deploy
```bash
cd e:\PicnicHub\frontend
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name?** → picnichub (or your choice)
- **Directory?** → ./
- **Want to override settings?** → No

#### 4. Production Deploy
```bash
vercel --prod
```

### Method 2: Vercel Dashboard (Easy)

#### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

#### 2. Import to Vercel
- Go to [vercel.com/new](https://vercel.com/new)
- Click **"Import Git Repository"**
- Select your **picnichub-frontend** repository
- Click **"Import"**

#### 3. Configure Project
Vercel auto-detects React app settings:
- **Framework Preset**: Create React App
- **Root Directory**: ./
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

#### 4. Add Environment Variables

Click **"Environment Variables"** and add:

| Name | Value | Note |
|------|-------|------|
| `REACT_APP_API_URL` | `https://your-backend.onrender.com/api/v1` | **Required** - Your deployed backend URL |
| `REACT_APP_GOOGLE_MAPS_KEY` | `your_google_maps_key` | Optional - For map features |

**Important**: Replace `your-backend.onrender.com` with your actual Render backend URL!

#### 5. Deploy!
Click **"Deploy"** and wait ~2-3 minutes

## 🌐 Your Deployed URLs

After deployment:
- **Production**: `https://picnichub.vercel.app`
- **Preview**: Auto-generated for each commit
- **Dashboard**: `https://vercel.com/your-username/picnichub`

## ⚙️ Configuration Files

### vercel.json (Already configured ✅)
```json
{
  "version": 2,
  "builds": [{
    "src": "package.json",
    "use": "@vercel/static-build",
    "config": { "distDir": "build" }
  }],
  "routes": [{
    "src": "/(.*)",
    "dest": "/index.html"
  }]
}
```

This handles:
- React Router client-side routing
- Static asset caching
- SPA fallback to index.html

## 🔄 Auto-Deploy

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main
```

Vercel will:
1. Detect the push
2. Build the project
3. Deploy automatically
4. Send you a notification

## 🧪 Testing

After deployment, test:

1. **Homepage**: `https://your-app.vercel.app`
2. **Login**: Test authentication
3. **API Connection**: Check Network tab for backend calls
4. **Image Uploads**: Test uploading memories
5. **Routing**: Navigate between pages

## 🔧 Environment Variables Management

### View/Edit Variables
1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**

### Update Variables
1. Edit in dashboard
2. Redeploy:
   ```bash
   vercel --prod
   ```

Or trigger redeploy from dashboard.

## 🚨 Common Issues & Solutions

### Build Fails

**Issue**: `npm ERR! code ELIFECYCLE`
**Solution**: 
- Check `package.json` scripts
- Ensure all dependencies are listed
- Review build logs in Vercel

### 404 on Routes

**Issue**: Refreshing page shows 404
**Solution**: `vercel.json` should have SPA fallback (already configured ✅)

### API Calls Fail (CORS)

**Issue**: Backend rejects requests
**Solution**:
1. Update backend `ALLOWED_ORIGINS` env var
2. Add: `https://your-app.vercel.app`
3. Redeploy backend on Render

### Images Don't Load

**Issue**: Images from backend don't display
**Solution**:
- Check `REACT_APP_API_URL` is correct
- Verify backend CORS settings
- Check browser console for errors

### Environment Variables Not Working

**Issue**: `process.env.REACT_APP_API_URL` is undefined
**Solution**:
- Environment variables must start with `REACT_APP_`
- Redeploy after adding variables
- Check they're set for production environment

## 🎨 Custom Domain (Optional)

### Add Custom Domain
1. Go to **Settings** → **Domains**
2. Add your domain (e.g., `picnichub.com`)
3. Update DNS records (Vercel provides instructions)
4. SSL certificate auto-generated

### Update Backend CORS
After adding custom domain, update backend:
```env
ALLOWED_ORIGINS=https://picnichub.com,https://picnichub.vercel.app
```

## 📊 Monitoring & Analytics

### Built-in Analytics
- Go to **Analytics** tab in dashboard
- View page views, top pages, devices
- Free for personal projects

### Performance
- Vercel provides Web Vitals
- Check **Speed Insights** tab
- Optimize based on recommendations

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit `.env` to Git
2. **API Keys**: Store in Vercel environment variables
3. **HTTPS**: Automatic on Vercel
4. **CSP Headers**: Configure in `vercel.json` if needed

## 💰 Pricing

### Free Tier (Hobby)
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ SSL certificates
- ✅ Custom domains
- ✅ 6000 build minutes/month
- ⏱️ 32s max serverless execution

**Perfect for PicnicHub!**

### Pro Features ($20/month)
- More bandwidth
- Longer execution time
- Team collaboration
- Advanced analytics

## 📝 Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Backend URL copied
- [ ] Vercel account created
- [ ] Code pushed to GitHub
- [ ] Project imported to Vercel
- [ ] `REACT_APP_API_URL` environment variable set
- [ ] Deployment successful
- [ ] Website tested and working
- [ ] Backend CORS updated with frontend URL
- [ ] Authentication working
- [ ] Image uploads working
- [ ] All routes accessible

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Custom Domains Guide](https://vercel.com/docs/concepts/projects/custom-domains)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Deployment Best Practices](https://vercel.com/docs/concepts/deployments/overview)

## 📞 Support

- Vercel Discussions: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- Vercel Support: Dashboard → Help button
- Documentation: [vercel.com/docs](https://vercel.com/docs)

---

**Deployment Time**: ~5 minutes
**Auto-Deploy**: Enabled ✅
**HTTPS**: Automatic ✅
**CDN**: Global Edge Network ✅
