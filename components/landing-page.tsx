"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, MapPin, Dumbbell, BarChart3, Cloud, Network, Users, CheckCircle, ArrowRight, User, LogIn } from "lucide-react"
import AuthPage from "@/components/auth-page"

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  if (showAuth) {
    return <AuthPage />
  }

  const features = [
    {
      icon: Activity,
      title: "Workout Tracking",
      description: "Log and monitor your fitness activities with detailed metrics and progress tracking.",
      color: "text-emerald-600"
    },
    {
      icon: MapPin,
      title: "Commute Visualization",
      description: "Track your daily commutes and turn them into workout data with GPS mapping.",
      color: "text-teal-600"
    },
    {
      icon: BarChart3,
      title: "Progress Analytics",
      description: "Visualize your fitness journey with comprehensive charts and statistics.",
      color: "text-blue-600"
    },
    {
      icon: Cloud,
      title: "Weather Integration",
      description: "Get real-time weather updates to plan your outdoor activities effectively.",
      color: "text-sky-600"
    },
    {
      icon: Network,
      title: "Network Monitoring",
      description: "Track network quality during commutes and outdoor activities.",
      color: "text-orange-600"
    },
    {
      icon: Users,
      title: "Location Finder",
      description: "Discover nearby gyms and fitness facilities based on your current location.",
      color: "text-purple-600"
    }
  ]

  const benefits = [
    "Real-time GPS tracking for accurate distance and route mapping",
    "Comprehensive workout logging with calorie calculations",
    "Interactive maps with network quality visualization",
    "Weather-aware activity planning",
    "Secure cloud storage for all your fitness data",
    "Beautiful, responsive design that works on all devices"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100">
      {/* Navigation Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                FitTracker
              </h1>
              <p className="text-xs text-slate-500">Your Smart Fitness Companion</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setAuthMode('login')
                setShowAuth(true)
              }}
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setAuthMode('register')
                setShowAuth(true)
              }}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <User className="h-4 w-4 mr-2" />
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Transform Your
              </span>
              <br />
              <span className="text-slate-900">
                Fitness Journey
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Track workouts, visualize commutes, monitor progress, and discover fitness locations - all in one beautiful, intelligent platform.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Powerful Features for Every Fitness Goal
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From basic workout logging to advanced route visualization, FitTracker has everything you need to succeed.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-slate-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Why Choose FitTracker?
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Built with modern technology and designed for real-world fitness needs, FitTracker combines powerful features with beautiful design.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <p className="text-slate-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl p-8 shadow-2xl">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                      <Activity className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900">Today's Summary</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Workouts</span>
                      <span className="font-medium text-slate-900">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Distance</span>
                      <span className="font-medium text-slate-900">12.5 km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Calories</span>
                      <span className="font-medium text-slate-900">485</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Duration</span>
                      <span className="font-medium text-slate-900">2h 15m</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-900">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">FitTracker</h3>
          </div>
          <p className="text-slate-400 mb-6">
            Your smart fitness companion for a healthier lifestyle.
          </p>
          <div className="text-sm text-slate-500">
            © 2025 FitTracker. Your smart fitness companion.
          </div>
        </div>
      </footer>
    </div>
  )
}
