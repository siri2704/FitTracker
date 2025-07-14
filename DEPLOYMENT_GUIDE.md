# 🚀 Deployment Guide - FitTracker

## ✅ Files Created for Deployment

- `.env` - Production environment variables
- `.env.example` - Template for environment variables
- Updated `firebase.ts` - Now supports environment variables

## 🔧 Pre-Deployment Checklist

- [x] Firebase security rules deployed
- [x] Environment variables configured
- [x] Firebase configuration updated
- [x] Build errors fixed

## 🌐 Deploy to Vercel

### Method 1: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project directory
cd /Users/apple/Desktop/fitness-tracker
vercel

# Follow the prompts:
# ? Set up and deploy "~/Desktop/fitness-tracker"? [Y/n] y
# ? Which scope do you want to deploy to? [Your Account]
# ? Link to existing project? [y/N] n
# ? What's your project's name? fitness-tracker
# ? In which directory is your code located? ./
```

### Method 2: GitHub + Vercel Dashboard
1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com/)
   - Click "Add New Project"
   - Import from your GitHub repository
   - Configure environment variables (see below)

### Environment Variables in Vercel
In your Vercel dashboard, add these environment variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyClHWfH7C1ZGN67sQZN9bDIoasKxgy5k3s
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=route-app-bcfc2.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=route-app-bcfc2
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=route-app-bcfc2.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=296525995945
NEXT_PUBLIC_FIREBASE_APP_ID=1:296525995945:web:cc0b5d2a6fd68295586eb8
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-0H1Z447WF6
NODE_ENV=production
```

## 🚀 Deploy to Render

### Method 1: GitHub + Render Dashboard
1. **Push to GitHub** (same as above)

2. **Connect to Render**:
   - Go to [render.com](https://render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure Build Settings**:
   - **Build Command**: `pnpm build`
   - **Start Command**: `pnpm start`
   - **Node Version**: `18` or `20`

### Environment Variables in Render
In your Render service settings, add these environment variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyClHWfH7C1ZGN67sQZN9bDIoasKxgy5k3s
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=route-app-bcfc2.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=route-app-bcfc2
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=route-app-bcfc2.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=296525995945
NEXT_PUBLIC_FIREBASE_APP_ID=1:296525995945:web:cc0b5d2a6fd68295586eb8
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-0H1Z447WF6
NODE_ENV=production
```

## 📦 Build Configuration

Your `package.json` already includes the necessary scripts:
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "dev": "next dev"
  }
}
```

## 🔥 Firebase Configuration for Production

### Update Firebase Authorized Domains
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `route-app-bcfc2`
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your production domains:
   - `your-app.vercel.app` (for Vercel)
   - `your-app.onrender.com` (for Render)

### CORS Configuration
If you encounter CORS issues, add your production domain to Firebase:
1. **Firestore**: Already configured with your security rules
2. **Authentication**: Add domains in Firebase Console

## 🧪 Testing Production Build Locally

Before deploying, test the production build:

```bash
# Build the app
pnpm build

# Start production server
pnpm start

# Visit http://localhost:3000
```

## 🔍 Post-Deployment Checklist

After successful deployment:

- [ ] Visit your live URL
- [ ] Test user registration/login
- [ ] Test workout logging
- [ ] Test commute tracking
- [ ] Verify Firebase data persistence
- [ ] Check browser console for errors
- [ ] Test on mobile devices

## 🆘 Common Issues & Solutions

### Build Errors
- **Module not found**: Check import paths
- **Type errors**: Run `pnpm build` locally first

### Firebase Issues
- **Auth domain error**: Add production domain to Firebase
- **Firestore permissions**: Rules already deployed
- **API key issues**: Double-check environment variables

### Environment Variables
- **Variables not loading**: Ensure `NEXT_PUBLIC_` prefix
- **Build-time vs runtime**: All Firebase vars need `NEXT_PUBLIC_`

## 🎉 Your App is Ready!

Your FitTracker app includes:
- ✅ User authentication
- ✅ Workout logging with Firebase persistence
- ✅ Interactive commute tracking
- ✅ Weather integration
- ✅ Location services
- ✅ Beautiful responsive UI
- ✅ Production-ready configuration

Choose either **Vercel** (recommended for Next.js) or **Render** for deployment!
