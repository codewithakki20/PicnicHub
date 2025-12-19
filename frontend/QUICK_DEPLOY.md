# 🚀 Quick Deploy to Vercel

## One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/picnichub-frontend)

## Manual Deploy (5 minutes)

### 1. Push to GitHub
```bash
cd e:\PicnicHub\frontend
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your repository
3. Add environment variable:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://your-backend.onrender.com/api/v1`
4. Click **Deploy**

### 3. Update Backend CORS
Add your Vercel URL to backend's `ALLOWED_ORIGINS`:
```env
ALLOWED_ORIGINS=https://your-app.vercel.app
```

### 4. Test!
Visit `https://your-app.vercel.app`

## Environment Variables

**Required:**
- `REACT_APP_API_URL` - Your backend API URL

**Optional:**
- `REACT_APP_GOOGLE_MAPS_KEY` - For map features

## Full Documentation

- 📘 [Complete Deployment Guide](./VERCEL_DEPLOYMENT.md)
- ✅ [Deployment Checklist](./VERCEL_CHECKLIST.md)

## Troubleshooting

**Build fails?**
- Run `npm run build` locally first
- Check build logs in Vercel

**API calls fail?**
- Verify `REACT_APP_API_URL` is set correctly
- Check backend CORS allows your Vercel URL

**Routes don't work?**
- `vercel.json` should have SPA configuration (already included ✅)

## Auto-Deploy

Vercel automatically redeploys when you push to `main`:
```bash
git push origin main
```

## Support

- [Vercel Docs](https://vercel.com/docs)
- [Issues](https://github.com/yourusername/picnichub/issues)

---
**Time**: ~5 minutes | **Cost**: Free | **Auto-Deploy**: ✅
