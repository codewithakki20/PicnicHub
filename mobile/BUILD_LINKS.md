# 📱 PicnicHub Mobile - Build Downloads

## Current Build (In Progress) ⏳

**Build ID**: eab9965e-ad83-4376-9c02-862d0b971e0d
**Status**: In Progress
**Started**: 19/12/2025, 10:58:57 am
**Backend URL**: https://picnichub.onrender.com/api/v1 ✅ (Production)

**Logs**: https://expo.dev/accounts/ankit020/projects/picnichub/builds/eab9965e-ad83-4376-9c02-862d0b971e0d

**Download Link**: Will be available when build completes (~5 minutes)

---

## Previous Successful Builds

### Preview APK (Dec 15, 2025) ✅

**Build ID**: 86a7074c-fe0e-4f10-850a-ae32e583d46b
**Status**: Finished
**Profile**: Preview (Internal testing)

📥 **Download APK**: https://expo.dev/artifacts/eas/hCoLPHdyVFi4B2r23ULFdp.apk

**How to Install**:
1. Download APK to Android device
2. Enable "Install from Unknown Sources" in Settings
3. Tap downloaded file to install
4. Open PicnicHub app

⚠️ **Note**: This build uses OLD backend URL (local development)

---

### Production AAB (Dec 15, 2025) ✅

**Build ID**: 813c408e-72de-4284-9199-814967d4a078
**Status**: Finished
**Profile**: Production (Google Play Store)

📥 **Download AAB**: https://expo.dev/artifacts/eas/gXAvkkPEZ1Su4q4m8zb4Ny.aab

**How to Submit to Play Store**:
```bash
eas submit --platform android --latest
```

Or manually:
1. Go to Google Play Console
2. Create app listing
3. Upload this AAB file
4. Complete store listing
5. Submit for review

⚠️ **Note**: This build uses OLD backend URL (local development)

---

## Check Build Status

```bash
# List all builds
eas build:list

# Check specific build
eas build:view eab9965e-ad83-4376-9c02-862d0b971e0d

# Check latest build status
eas build:list --limit 1
```

---

## Backend Configuration

### Current Production Backend
- **URL**: https://picnichub.onrender.com
- **API Endpoint**: https://picnichub.onrender.com/api/v1
- **Status**: ✅ Live

### What Changed
- **Before (Dec 15)**: `http://192.168.31.117:5000/api/v1` (local)
- **Now (Dec 19)**: `https://picnichub.onrender.com/api/v1` (production)

**Impact**: New builds will connect to production backend, old builds to local (won't work)

---

## Recommended Next Steps

### 1. **Wait for Current Build** (Recommended)
- Let current build complete (~5 minutes)
- Download fresh APK with production backend
- Test on Android device
- Share with testers

### 2. **Use Existing Preview APK** (Not Recommended)
- Only if you want to test the old version
- Won't connect to production backend
- Good for UI/UX testing only

### 3. **Build New Production AAB** (For Play Store)
After testing preview build:
```bash
eas build --platform android --profile production
```

Then submit:
```bash
eas submit --platform android --latest
```

---

## Testing Checklist

When you download the APK:

- [ ] Download APK to Android device
- [ ] Install and open app
- [ ] Test login/register
- [ ] Check API connection (should use production backend)
- [ ] Test creating memories/posts
- [ ] Test image uploads
- [ ] Test navigation between screens
- [ ] Test profile features
- [ ] Check for any crashes or errors

---

## Quick Commands

```bash
# Check current build
eas build:view eab9965e-ad83-4376-9c02-862d0b971e0d

# Build new preview
eas build --platform android --profile preview

# Build production
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android

# Create OTA update
eas update --branch production --message "Update"
```

---

**Last Updated**: 19/12/2025, 11:05 am
**Current Build**: In Progress ⏳
**Expected Completion**: ~5 minutes
