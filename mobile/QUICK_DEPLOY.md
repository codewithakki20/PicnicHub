# 🚀 Quick Deploy - PicnicHub Mobile

## Option 1: EAS Build (Recommended - 10 minutes)

### Prerequisites
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login
```

### Update API URL
Edit `app.json` line 66:
```json
"apiUrl": "https://your-backend.onrender.com/api/v1"
```

### Build & Deploy

**Android:**
```bash
cd e:\PicnicHub\mobile
eas build --platform android --profile production
```

**iOS:**
```bash
eas build --platform ios --profile production
```

**Both:**
```bash
eas build --platform all --profile production
```

### Submit to Stores

**Google Play:**
```bash
eas submit --platform android --profile production
```

**App Store:**
```bash
eas submit --platform ios --profile production
```

## Option 2: Development Build (Testing)

### For Quick Testing on Device

```bash
# Android
eas build --profile development --platform android

# iOS
eas build --profile development --platform ios
```

Download QR code → Scan with Expo Go → Install & Test

## Option 3: APK for Direct Install (Android Only)

```bash
# Build standalone APK
eas build --platform android --profile preview

# Download APK from build page
# Share with testers directly
```

## 🔧 Pre-Build Checklist

- [ ] Backend deployed and accessible
- [ ] API URL updated in `app.json`
- [ ] App icons present in `/assets`
- [ ] Splash screens configured
- [ ] Bundle IDs set correctly
- [ ] Version number correct (1.0.0)

## 📱 After Build

1. **Download builds** from [Expo Dashboard](https://expo.dev)
2. **Test thoroughly** before store submission
3. **Submit to stores** or share APK/IPA with testers

## ⚡ OTA Updates (No Rebuild Needed)

For minor updates:
```bash
eas update --branch production --message "Bug fixes"
```

Users get updates automatically without downloading from stores!

## 🐛 Quick Fixes

**Build fails?**
```bash
eas build --clear-cache --platform android
```

**Need to reset?**
```bash
eas credentials:reset
```

**Check build status:**
```bash
eas build:list
```

## 📊 Monitor Builds

View all builds: [expo.dev/accounts/[your-account]/projects/picnichub/builds](https://expo.dev)

## 💰 Costs

- **EAS Build**: Free (30 builds/month)
- **Google Play**: $25 one-time
- **Apple Store**: $99/year

## 📚 Full Documentation

- Complete guide: `DEPLOYMENT.md`
- Detailed checklist: `DEPLOYMENT_CHECKLIST.md`

---

**Time**: 10-15 minutes per platform
**Difficulty**: Easy
**Requirements**: Expo account (free)
