# 🚀 Quick Deploy to Vercel

## Current Configuration ✅

- **Backend URL**: `https://picnichub.onrender.com`
- **API Endpoint**: `https://picnichub.onrender.com/api/v1`
- **Build Status**: ✅ Successful
- **Vercel CLI**: ✅ Installed (v50.1.2)

## Deployment Methods

### Method 1: Vercel CLI (Current)

#### Step 1: Login (In Progress)
```bash
vercel login
```
→ Complete the login in your browser

#### Step 2: Deploy to Production
```bash
vercel --prod
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No (first time) / Yes (if exists)
- **Project name?** → picnichub-frontend
- **Directory?** → ./ (keep default)
- **Override settings?** → No

#### Step 3: Set Environment Variables

After deployment, add environment variables:

```bash
# Set production API URL
vercel env add REACT_APP_API_URL production

# When prompted, enter:
https://picnichub.onrender.com/api/v1
```

Or set via Vercel Dashboard:
1. Go to your project on vercel.com
2. Settings → Environment Variables
3. Add: `REACT_APP_API_URL` = `https://picnichub.onrender.com/api/v1`
4. Select: Production, Preview, Development
5. Redeploy: `vercel --prod`

---

### Method 2: Vercel Dashboard (Easier)

#### 1. Push to GitHub
```bash
git add .
git commit -m "Deploy frontend to Vercel"
git push origin main
```

#### 2. Import to Vercel
- Go to [vercel.com/new](https://vercel.com/new)
- Click "Import Git Repository"
- Select your repository
- Click "Import"

#### 3. Configure
- **Framework**: Create React App (auto-detected)
- **Root Directory**: ./
- **Build Command**: `npm run build`
- **Output Directory**: `build`

#### 4. Add Environment Variables
| Variable | Value |
|----------|-------|
| `REACT_APP_API_URL` | `https://picnichub.onrender.com/api/v1` |

#### 5. Deploy
Click "Deploy" and wait ~2-3 minutes

---

## Post-Deployment

### 1. Update Backend CORS

After deployment, update your backend on Render:

1. Go to Render Dashboard
2. Select your PicnicHub backend service
3. Environment → Add variable
4. Update `ALLOWED_ORIGINS`:
   ```
   https://your-app.vercel.app,http://localhost:3000
   ```
5. Save and redeploy

### 2. Test Your Deployment

Visit your Vercel URL and test:
- ✅ Homepage loads
- ✅ Login/Register works
- ✅ API calls succeed (check Network tab)
- ✅ Images load
- ✅ All routes work

### 3. Save Your URLs

```
Frontend: https://_____________.vercel.app
Backend: https://picnichub.onrender.com
API: https://picnichub.onrender.com/api/v1
```

---

## Troubleshooting

### Build Fails
- Run `npm run build` locally first
- Check build logs in Vercel
- Verify all dependencies in package.json

### API Calls Fail
- Verify `REACT_APP_API_URL` is set correctly
- Check backend CORS settings
- Check Network tab for specific errors

### 404 on Routes
- Verify `vercel.json` exists (✅ already configured)
- Check it has SPA fallback routes

---

## Auto-Deploy

Once connected to GitHub, Vercel auto-deploys on push:

```bash
git add .
git commit -m "Update feature"
git push origin main
# Vercel automatically deploys!
```

---

**Estimated Time**: 5-10 minutes  
**Status**: Ready to deploy 🚀
