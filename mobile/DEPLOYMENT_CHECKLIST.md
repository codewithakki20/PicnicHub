# 📱 Mobile App Deployment Checklist

## Pre-Deployment Setup

### ✅ Accounts & Access
- [ ] Expo account created - [expo.dev](https://expo.dev)
- [ ] Google Play Console account ($25) - [play.google.com/console](https://play.google.com/console)
- [ ] Apple Developer account ($99/year) - [developer.apple.com](https://developer.apple.com)
- [ ] EAS CLI installed: `npm install -g eas-cli`
- [ ] Logged into EAS: `eas login`

### ✅ Backend Configuration
- [ ] Backend deployed to Render
- [ ] Backend URL copied: `_________________________________`
- [ ] Health endpoint working: `/health`
- [ ] API base URL working: `/api/v1`

### ✅ App Configuration
- [ ] `app.json` updated:
  - [ ] `name`: "PicnicHub"
  - [ ] `slug`: "picnichub"
  - [ ] `version`: "1.0.0"
  - [ ] `apiUrl`: Backend URL set in `extra`
  - [ ] `bundleIdentifier`: "com.picnichub.mobile" (iOS)
  - [ ] `package`: "com.picnichub.mobile" (Android)
- [ ] `eas.json` configured (already done ✅)

### ✅ Assets Prepared
- [ ] App icon (1024×1024 PNG) - `assets/logo1.png`
- [ ] Splash screen - `assets/images/splash-icon.png`
- [ ] Android adaptive icon (foreground/background)
- [ ] Privacy Policy document created
- [ ] Terms of Service document created

## Build Process

### ✅ Android Build
- [ ] Start build: `eas build --platform android --profile production`
- [ ] Build completes successfully
- [ ] Download AAB file
- [ ] AAB file saved locally
- [ ] Build URL saved: `_________________________________`

### ✅ iOS Build  
- [ ] Start build: `eas build --platform ios --profile production`
- [ ] Build completes successfully
- [ ] Download IPA file (or use auto-submit)
- [ ] IPA file saved locally
- [ ] Build URL saved: `_________________________________`

## Testing

### ✅ Pre-Submission Testing
- [ ] **Installation test:**
  - [ ] APK installs on Android device
  - [ ] IPA installs via TestFlight
- [ ] **Authentication:**
  - [ ] Register new account
  - [ ] Verify OTP
  - [ ] Login works
  - [ ] Logout works
- [ ] **Core Features:**
  - [ ] Create memory/post
  - [ ] Upload photos
  - [ ] Record and upload reel
  - [ ] View feed
  - [ ] Like/comment on posts
  - [ ] Follow/unfollow users
  - [ ] Edit profile
  - [ ] View stories
- [ ] **Navigation:**
  - [ ] All screens accessible
  - [ ] Back navigation works
  - [ ] Bottom tabs work
- [ ] **Performance:**
  - [ ] App loads in <3 seconds
  - [ ] No crashes
  - [ ] Smooth scrolling
  - [ ] Images load properly
- [ ] **Offline Behavior:**
  - [ ] Graceful error messages
  - [ ] No crashes when offline

## Google Play Store Submission

### ✅ Store Listing Setup
- [ ] App name: "PicnicHub"
- [ ] Short description (80 chars):
  ```
  Discover picnic spots & share memorable moments with friends
  ```
- [ ] Full description (4000 chars max):
  ```
  PicnicHub is your companion for discovering beautiful picnic spots
  and sharing memorable moments with friends and family.
  
  Features:
  • Discover nearby picnic locations
  • Share photos and videos  
  • Create stories and reels
  • Connect with nature lovers
  • Save favorite spots
  • Follow friends and family
  • Get location recommendations
  ```
- [ ] App icon uploaded (512×512 PNG)
- [ ] Feature graphic uploaded (1024×500 PNG)
- [ ] Screenshots uploaded:
  - [ ] At least 2 screenshots
  - [ ] Recommended: 4-8 screenshots
  - [ ] Size: 1080×1920 or similar
- [ ] Privacy Policy URL: `_________________________________`
- [ ] Contact email: `_________________________________`
- [ ] Website (optional): `_________________________________`

### ✅ Content Rating
- [ ] Questionnaire completed
- [ ] Rating received (likely Everyone/PEGI 3)
- [ ] No content warnings needed

### ✅ App Content
- [ ] Target audience: All ages
- [ ] Ads: No (or Yes if applicable)
- [ ] In-app purchases: No (or configure if applicable)
- [ ] Content guidelines reviewed
- [ ] Sensitive permissions explained:
  - [ ] Camera: "To capture moments"
  - [ ] Photos: "To share memories"
  - [ ] Location (if used): "To discover nearby spots"

### ✅ Release
- [ ] Production track selected
- [ ] AAB file uploaded
- [ ] Release notes added:
  ```
  Initial release of PicnicHub
  - Discover picnic locations
  - Share photos and videos
  - Connect with friends
  ```
- [ ] Review started
- [ ] Submission confirmed

## App Store Submission

### ✅ App Store Connect Setup
- [ ] App created
- [ ] App name: "PicnicHub"
- [ ] Subtitle: "Discover & Share Picnic Moments"
- [ ] Category: Social Networking / Lifestyle
- [ ] Content rights confirmed

### ✅ Pricing & Availability
- [ ] Price: Free
- [ ] Availability: All countries
- [ ] Release: Manual (or automatic after approval)

### ✅ App Privacy
- [ ] Privacy policy URL added
- [ ] Data types declared:
  - [ ] Email address (for authentication)
  - [ ] Photos (user uploads)
  - [ ] User content (posts, comments)
  - [ ] Location (if using maps)
- [ ] Data usage explained
- [ ] Third-party data sharing disclosed

### ✅ App Information
- [ ] Screenshots uploaded (required sizes):
  - [ ] 6.7" iPhone (1290×2796): Minimum 1
  - [ ] 6.5" iPhone (1242×2688): Minimum 1
  - [ ] 5.5" iPhone (1242×2208): Optional
- [ ] App preview video (optional but recommended)
- [ ] Promotional text (170 chars):
  ```
  Find amazing picnic spots near you and share unforgettable moments with your community!
  ```
- [ ] Description:
  ```
  PicnicHub connects you with beautiful picnic locations and helps you create
  lasting memories with friends and family.
  
  DISCOVER
  • Find nearby picnic spots
  • Explore popular locations
  • Read reviews and tips
  
  SHARE
  • Post photos from your picnics
  • Create short video reels
  • Share stories that disappear after 24h
  
  CONNECT
  • Follow friends and family
  • Like and comment on posts
  • Build your picnic community
  
  Perfect for nature lovers, families, and anyone who enjoys outdoor gatherings!
  ```
- [ ] Keywords (100 chars):
  ```
  picnic,outdoor,nature,photos,social,spots,locations,memories,friends,family
  ```
- [ ] Support URL: `_________________________________`
- [ ] Marketing URL (optional): `_________________________________`

### ✅ Build Upload
- [ ] IPA uploaded via `eas submit` or Transporter
- [ ] Build processing complete
- [ ] Build appears in App Store Connect
- [ ] Build selected for submission

### ✅ App Review Information
- [ ] Contact information:
  - [ ] First name: `_________________`
  - [ ] Last name: `_________________`
  - [ ] Phone: `_________________`
  - [ ] Email: `_________________`
- [ ] Demo account credentials:
  - [ ] Username: `_________________`
  - [ ] Password: `_________________`
- [ ] Notes for reviewer:
  ```
  Thank you for reviewing PicnicHub. 
  
  To test the app:
  1. Use the provided demo account to login
  2. Browse the feed to see sample posts
  3. Try creating a new post (camera/photo upload)
  4. Test following/unfollowing users
  
  All features require backend API which is live at [your-backend-url]
  ```
- [ ] Attachments (if needed)

### ✅ Version Release
- [ ] Version: 1.0.0
- [ ] Copyright: © 2025 PicnicHub
- [ ] Release type: Manual release
- [ ] App encryption: No (or complete compliance)

### ✅ Submit for Review
- [ ] All sections complete (green checkmarks)
- [ ] "Submit for Review" clicked
- [ ] Submission confirmed
- [ ] Waiting for review status

## Post-Submission

### ✅ Monitoring
- [ ] Check Google Play Console daily
- [ ] Check App Store Connect daily
- [ ] Respond to review questions within 24h
- [ ] Monitor crash reports

### ✅ If Rejected

**Common rejection reasons:**
- [ ] Privacy policy missing/incomplete
- [ ] Permissions not explained
- [ ] App crashes on launch
- [ ] Features don't match description
- [ ] Missing legal compliance

**Action items:**
- [ ] Read rejection reason carefully
- [ ] Fix issues mentioned
- [ ] Test thoroughly
- [ ] Resubmit with explanation
- [ ] Add notes addressing changes

### ✅ After Approval

**Android:**
- [ ] App appears in Play Store
- [ ] Test install from Play Store
- [ ] Share Play Store link
- [ ] App URL: `_________________________________`

**iOS:**
- [ ] App appears in App Store
- [ ] Test install from App Store
- [ ] Share App Store link
- [ ] App URL: `_________________________________`

## Marketing & Launch

### ✅ App Store Optimization (ASO)
- [ ] Keywords optimized
- [ ] Screenshots compelling
- [ ] Description clear and engaging
- [ ] Reviews/ratings encouraged

### ✅ Announcement
- [ ] Social media posts prepared
- [ ] Website updated with app links
- [ ] Email announcement (if applicable)
- [ ] Press release (if desired)

### ✅ User Support
- [ ] Support email active: `_________________`
- [ ] FAQ page created
- [ ] In-app feedback mechanism
- [ ] Bug reporting process

## Maintenance

### ✅ Regular Updates
- [ ] OTA updates for minor fixes: `eas update`
- [ ] Store updates for major features
- [ ] Version number incremented
- [ ] Changelog maintained

### ✅ Monitoring
- [ ] Weekly crash report review
- [ ] Monthly analytics review
- [ ] User feedback monitoring
- [ ] Performance metrics tracked

## 🎯 URLs to Save

```
Expo Dashboard: https://expo.dev/accounts/[your-username]/projects/picnichub
Google Play Console: https://play.google.com/console
App Store Connect: https://appstoreconnect.apple.com
TestFlight: https://testflight.apple.com

Play Store Link: _________________________________
App Store Link: _________________________________
```

## 📊 Key Metrics to Track

- [ ] Daily Active Users (DAU)
- [ ] Installation stats
- [ ] Crash-free rate (target: >99%)
- [ ] Average session length
- [ ] User retention (Day 1,  7, 30)
- [ ] App Store rating (target: 4.0+)

---

**Status**: Ready for deployment! 📱
**Estimated Timeline**:
- Build: 15-30 minutes
- Testing: 2-4 hours
- Store setup: 2-4 hours
- Review: 1-7 days (Android), 1-3 days (iOS)

**Total**: 1-2 weeks from start to live app
