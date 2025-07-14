# FitTracker

A modern, full-featured fitness tracker web app built with Next.js, React, Firebase, and Tailwind CSS.

## 🚀 Features
- **User Authentication** (Firebase Auth)
- **Workout Logging** with persistent storage (Firestore)
- **Commute Visualization** with live GPS tracking
- **Progress Analytics** (charts, stats)
- **Weather Integration** (Open-Meteo API)
- **Location Finder** (OpenStreetMap)
- **Network Quality Monitoring**
- **Responsive, Modern UI** (Tailwind CSS, Lucide Icons)

## 🖥️ Tech Stack
- Next.js 15 (App Router, TypeScript)
- React 19
- Firebase (Auth, Firestore)
- Tailwind CSS
- Lucide React Icons
- Vercel/Render ready

## 🛠️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/siri2704/FitTracker.git
cd FitTracker
```

### 2. Install dependencies
```bash
pnpm install
# or
yarn install
# or
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your Firebase credentials:
```bash
cp .env.example .env
```

### 4. Run Locally
```bash
pnpm dev
# or
yarn dev
# or
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment
- **Vercel**: [vercel.com](https://vercel.com/)
- **Render**: [render.com](https://render.com/)
- See `DEPLOYMENT_GUIDE.md` for full instructions

## 🔒 Security
- Firestore rules restrict data access to authenticated users only
- Never commit your real `.env` file to public repositories

## 📂 Project Structure
```
components/        # UI and feature components
app/               # Next.js app directory (pages, layouts)
hooks/             # Custom React hooks
lib/               # Firebase and utility libraries
public/            # Static assets
styles/            # Global styles
```

## 📸 Screenshots
![Homepage](public/placeholder.jpg)

## 🙏 Credits
- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Open-Meteo](https://open-meteo.com/)
- [OpenStreetMap](https://www.openstreetmap.org/)

---

**FitTracker** - Your smart fitness companion for a healthier lifestyle.
