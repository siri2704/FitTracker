FitTracker

FitTracker is a modern, full-featured fitness tracker web application built using Next.js, React, Firebase, and Tailwind CSS.

Features
	•	User Authentication using Firebase Auth
	•	Workout Logging with persistent storage via Firestore
	•	Commute Visualization with real-time GPS tracking
	•	Progress Analytics including charts and statistics
	•	Weather Integration via Open-Meteo API
	•	Location Finder using OpenStreetMap
	•	Network Quality Monitoring
	•	Responsive, Modern User Interface built with Tailwind CSS and Lucide Icons

Tech Stack
	•	Next.js 15 (App Router, TypeScript)
	•	React 19
	•	Firebase (Authentication, Firestore)
	•	Tailwind CSS
	•	Lucide React Icons
	•	Deployment-ready for Vercel and Render

Getting Started

1. Clone the Repository

git clone https://github.com/siri2704/FitTracker.git
cd FitTracker

2. Install Dependencies

pnpm install
# or
yarn install
# or
npm install

3. Configure Environment Variables

Copy the .env.example file to .env and provide your Firebase credentials:

cp .env.example .env

4. Run the Application Locally

pnpm dev
# or
yarn dev
# or
npm run dev

Then open http://localhost:3000 in your browser.

Deployment
	•	Recommended platforms: Vercel or Render
	•	Refer to DEPLOYMENT_GUIDE.md for detailed deployment instructions.

Security
	•	Firestore rules are configured to restrict access to authenticated users only.
	•	Do not commit your actual .env file to public repositories.

Project Structure

components/        - UI and feature components  
app/               - Next.js app directory (pages, layouts)  
hooks/             - Custom React hooks  
lib/               - Firebase and utility libraries  
public/            - Static assets  
styles/            - Global styles  

Screenshots

Acknowledgements
	•	Next.js
	•	Firebase
	•	Tailwind CSS
	•	Lucide Icons
	•	Open-Meteo
	•	OpenStreetMap
