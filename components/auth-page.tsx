"use client"

import { useState } from "react"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Activity, Mail, Chrome } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleEmailAuth = async (isSignUp: boolean) => {
    setLoading(true)
    try {
      console.log(`Attempting ${isSignUp ? 'sign up' : 'sign in'} with email:`, email)
      if (isSignUp) {
        const result = await createUserWithEmailAndPassword(auth, email, password)
        console.log('Sign up successful:', result.user.uid)
        toast({ title: "Account created successfully!" })
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password)
        console.log('Sign in successful:', result.user.uid)
        toast({ title: "Signed in successfully!" })
      }
    } catch (error: any) {
      console.error(`Auth error (${isSignUp ? 'sign up' : 'sign in'}):`, error)
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
    setLoading(false)
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    try {
      console.log('Attempting Google sign in...')
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      console.log('Google sign in successful:', result.user.uid)
      toast({ title: "Signed in with Google successfully!" })
    } catch (error: any) {
      console.error('Google auth error:', error)
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              FitTracker
            </CardTitle>
            <CardDescription className="text-slate-600">Track your fitness journey with smart insights</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 bg-slate-100">
              <TabsTrigger value="email" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                <Mail className="h-4 w-4 mr-1" />
                Email
              </TabsTrigger>
              <TabsTrigger value="google" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                <Chrome className="h-4 w-4 mr-1" />
                Google
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-slate-200 focus:border-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-slate-200 focus:border-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Button
                  onClick={() => handleEmailAuth(false)}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => handleEmailAuth(true)}
                  disabled={loading}
                  variant="outline"
                  className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  Create Account
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="google" className="space-y-4">
              <Button
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              >
                <Chrome className="h-4 w-4 mr-2" />
                Continue with Google
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
