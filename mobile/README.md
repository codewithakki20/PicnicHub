# 📱 PicnicHub Mobile App

A beautiful React Native mobile application for discovering picnic spots and sharing memories.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
cd mobile
npm install
```

### Running Locally

```bash
# Start Expo dev server
npx expo start

# Run on Android
npx expo start --android

# Run on iOS  
npx expo start --ios

# Run on web
npx expo start --web
```

Scan QR code with Expo Go app to test on physical device.

## 📁 Project Structure

```
mobile/
├── src/
│   ├── screens/          # App screens
│   ├── components/       # Reusable components
│   ├── navigation/       # Navigation configuration
│   ├── context/          # React Context providers
│   ├── services/         # API services
│   ├── theme/            # Theme and styling
│   └── utils/            # Utility functions
├── assets/               # Images, fonts, icons
├── app.json             # Expo configuration
├── eas.json             # EAS Build configuration
└── package.json
```

## 🔌 Configuration

### API URL
Update backend URL in `app.json`:
```json
"extra": {
  "apiUrl": "https://your-backend.onrender.com/api/v1"
}
```

Access in code:
```javascript
import Constants from 'expo-constants';
const API_URL = Constants.expoConfig?.extra?.apiUrl;
```

## 📱 Features

- 📸 **Photo Sharing**: Upload and share picnic memories
- 🎥 **Reels**: Short video content
- 📖 **Stories**: 24-hour temporary posts
- 🗺️ **Locations**: Discover picnic spots
- 👥 **Social**: Follow friends, like, comment
- 👤 **Profiles**: Customizable user profiles
- 🔔 **Notifications**: Real-time push notifications

## 🛠️ Tech Stack

- **Framework**: React Native (Expo)
- **Navigation**: React Navigation
- **State**: React Context + AsyncStorage
- **API**: Axios
- **UI**: Custom components + Moti animations
- **Forms**: Formik + Yup validation
- **Icons**: @expo/vector-icons + Lucide

## 📦 Deployment

### Quick Deploy
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Build for Android
eas build --platform android --profile production

# Build for iOS
eas build --platform ios --profile production
```

### Full Documentation
- 📘 [Complete Deployment Guide](./DEPLOYMENT.md)
- ✅ [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
- 🚀 [Quick Deploy Guide](./QUICK_DEPLOY.md)

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type checking (if using TypeScript)
npm run type-check
```

## 📱 App Store Links

**After deployment:**
- Google Play: [Coming Soon]
- App Store: [Coming Soon]

## 🔧 Environment Variables

See `.env.example` for required configuration.

## 📄 License

ISC

## 👥 Contributing

1. Fork the repository
2. Create feature branch  
3. Commit changes
4. Push to branch
5. Create Pull Request

---

**Built with ❤️ using Expo**
