# 📱 PicnicHub Mobile - Deployment Guide

## Overview

This guide covers deploying the PicnicHub mobile app to:
- 🤖 **Google Play Store** (Android)
- 🍎 **App Store** (iOS)
- 📦 **EAS Build** (Expo Application Services)

## Prerequisites

### Required Accounts
- [ ] **Expo Account** - [expo.dev](https://expo.dev) (Free)
- [ ] **Google Play Console** - $25 one-time fee (for Android)
- [ ] **Apple Developer** - $99/year (for iOS)

### Required Tools
- [ ] **Node.js** 18+ installed
- [ ] **EAS CLI** installed: `npm install -g eas-cli`
- [ ] **Expo CLI** installed: `npm install -g expo-cli`

### Backend Requirements
- [ ] Backend deployed and accessible
- [ ] Backend URL ready to configure

## 🚀 Quick Start - EAS Build

### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

### 2. Login to Expo
```bash
eas login
```

### 3. Configure Build
Already configured! ✅ The `eas.json` and `app.json` are ready.

### 4. Update API URL
Edit `app.json`:
```json
"extra": {
  "apiUrl": "https://your-backend.onrender.com/api/v1"
}
```

### 5. Build for Android
```bash
cd e:\PicnicHub\mobile
eas build --platform android --profile production
```

### 6. Build for iOS
```bash
eas build --platform ios --profile production
```

## 📋 Detailed Deployment Steps

### Part 1: EAS Build Configuration

#### Update app.json
```json
{
  "expo": {
    "name": "PicnicHub",
    "slug": "picnichub",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.picnichub.mobile"
    },
    "android": {
      "package": "com.picnichub.mobile"
    },
    "extra": {
      "apiUrl": "https://your-backend.onrender.com/api/v1"
    }
  }
}
```

#### Verify eas.json
```json
{
  "build": {
    "production": {
      "autoIncrement": true
    }
  }
}
```

### Part 2: Android Deployment

#### Step 1: Build AAB (Android App Bundle)
```bash
eas build --platform android --profile production
```

This creates an `.aab` file optimized for Google Play.

#### Step 2: Google Play Console Setup

1. **Create Application**:
   - Go to [Google Play Console](https://play.google.com/console)
   - Create new app
   - Fill in app details

2. **Store Listing**:
   - **App name**: PicnicHub
   - **Short description**: Share your picnic memories
   - **Full description**: 
     ```
     PicnicHub is your companion for discovering beautiful picnic spots 
     and sharing memorable moments with friends and family.
     
     Features:
     • Discover nearby picnic locations
     • Share photos and videos
     • Create stories and reels
     • Connect with nature lovers
     • Save favorite spots
     ```
   - **App icon**: 512×512 PNG
   - **Feature graphic**: 1024×500 PNG
   - **Screenshots**: At least 2 (1080×1920 recommended)
   - **Privacy Policy**: Link to your privacy policy

3. **Content Rating**:
   - Complete questionnaire
   - Get rating (likely Everyone/PEGI 3)

4. **Upload AAB**:
   - Go to Production → Create new release
   - Upload the `.aab` file from EAS build
   - Add release notes
   - Submit for review

#### Step 3: App Signing

EAS handles signing automatically! ✅

But if needed:
```bash
# Download keystore
eas credentials

# View signing key
eas credentials -p android
```

### Part 3: iOS Deployment

#### Step 1: Build IPA
```bash
eas build --platform ios --profile production
```

#### Step 2: App Store Connect Setup

1. **Create App**:
   - Go to [App Store Connect](https://appstoreconnect.apple.com)
   - Create new app
   - Bundle ID: `com.picnichub.mobile`

2. **App Information**:
   - **Name**: PicnicHub
   - **Subtitle**: Discover & Share Picnic Moments
   - **Category**: Social Networking / Lifestyle
   - **Content Rights**: Yes (original content)

3. **Pricing**: 
   - Free (or your choice)
   - Available in all countries

4. **App Privacy**:
   - Data collected: Email, Photos, Location (if using)
   - Privacy Policy URL required

5. **Prepare for Submission**:
   - **Screenshots** (required for all sizes):
     - 6.7" iPhone: 1290×2796
     - 6.5" iPhone: 1242×2688
     - 5.5" iPhone: 1242×2208
   - **App Preview** (optional): Video showcase

#### Step 3: Upload Build

Option A: EAS Submit (Recommended)
```bash
eas submit --platform ios --profile production
```

Option B: Manual Upload
1. Download `.ipa` from EAS build
2. Use Transporter app to upload
3. Wait for processing (~10-30 minutes)

#### Step 4: App Review Information
- **Contact info**: Your email
- **Demo account**: Create test account
- **Notes**: Any special instructions

### Part 4: Testing Before Submission

#### Internal Testing (Android)
1. Create internal testing track
2. Add testers' email addresses
3. Share test link
4. Gather feedback

#### TestFlight (iOS)
1. Build automatically appears in TestFlight
2. Add internal/external testers
3. Share invitation link
4. Collect feedback

### Part 5: Review & Publish

#### Android Review
- **Time**: 1-7 days (usually 1-3 days)
- **Status**: Check in Play Console
- **Common rejections**:
  - Privacy policy missing
  - Permissions not explained
  - Content rating incomplete

#### iOS Review
- **Time**: 1-3 days
- **Status**: Check in App Store Connect
- **Common rejections**:
  - Missing privacy descriptions
  - App doesn't match description
  - Crashes or bugs
  - Missing features

## 🔧 Configuration Checklist

### app.json Updates
- [ ] Update `name` to your app name
- [ ] Update `slug` (URL-friendly name)
- [ ] Set `version` to 1.0.0
- [ ] Update `icon` path
- [ ] Configure `bundleIdentifier` (iOS)
- [ ] Configure `package` (Android)
- [ ] Set `apiUrl` in `extra`

### Assets Required
- [ ] App icon (1024×1024 PNG)
- [ ] Splash screen image
- [ ] Android adaptive icon (foreground/background)
- [ ] Store screenshots
- [ ] Feature graphic (Android)
- [ ] Privacy policy URL

### Legal Requirements
- [ ] Privacy Policy created
- [ ] Terms of Service
- [ ] Content rating questionnaire completed
- [ ] Age restriction (if applicable)

## 📱 Build Commands Reference

### Development Build
```bash
# For testing on device
eas build --profile development --platform android
eas build --profile development --platform ios
```

### Preview Build
```bash
# For sharing with testers
eas build --profile preview --platform android
eas build --profile preview --platform ios
```

### Production Build
```bash
# For store submission
eas build --profile production --platform android
eas build --profile production --platform ios
```

### Both Platforms
```bash
# Build both at once
eas build --profile production --platform all
```

## 🔄 Updates & Maintenance

### OTA Updates (Over-The-Air)

For minor updates without app store review:
```bash
# Publish update
eas update --branch production --message "Bug fixes"
```

Users get updates automatically! ✅

### Full App Updates

For major changes requiring review:
1. Update version in `app.json`
2. Rebuild with EAS
3. Submit to stores

## 📊 Monitoring

### Expo Dashboard
- Build status
- Update deployments
- Error logs
- Download statistics

### Google Play Console
- Crash reports
- ANRs (App Not Responding)
- User reviews
- Install statistics

### App Store Connect
- Crash logs
- User reviews
- Sales and trends
- TestFlight feedback

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache
eas build:cancel
eas build --clear-cache --platform android
```

### Signing Issues
```bash
# Reset credentials
eas credentials
eas credentials:reset
```

### API Connection Issues
- Check `apiUrl` in `app.json`
- Verify backend is accessible
- Check backend CORS allows mobile app

### App Rejected
- Read rejection reason carefully
- Fix issues mentioned
- Resubmit with explanation

## 💰 Costs Summary

| Service | Cost | Frequency |
|---------|------|-----------|
| Expo/EAS | Free* | - |
| Google Play | $25 | One-time |
| Apple Developer | $99 | Annual |

*EAS Build free tier: 30 builds/month

## 📝 Privacy Policy Template

Required for both stores. Include:
- Data collected (email, photos, location)
- How data is used
- Data sharing practices
- User rights
- Contact information

Host on your website or use GitHub Pages.

## 🎯 Post-Launch Checklist

- [ ] App live on Google Play
- [ ] App live on App Store
- [ ] Analytics configured
- [ ] Crash reporting active
- [ ] Push notifications tested
- [ ] User feedback mechanism in place
- [ ] Support email set up
- [ ] Social media announcement
- [ ] Website updated with app links

## 📞 Support Resources

- [Expo Documentation](https://docs.expo.dev)
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [App Store Connect Help](https://developer.apple.com/support/app-store-connect/)
- [Expo Forums](https://forums.expo.dev)

---

**Estimated Time**: 
- First-time setup: 4-8 hours
- Subsequent updates: 30 minutes

**Difficulty**: 
- Technical: Medium
- Administrative: High (store setup)

**Success Rate**: 
- 95%+ with proper preparation
