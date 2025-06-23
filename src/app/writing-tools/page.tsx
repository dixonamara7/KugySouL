'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { WritingStyleAnalyzer } from '@/components/features/WritingStyleAnalyzer'
import { HumanContentGenerator } from '@/components/features/HumanContentGenerator'
import { TextHumanizer } from '@/components/features/TextHumanizer'
import { AIDetectionChecker } from '@/components/features/AIDetectionChecker'
import { LoginForm } from '@/components/features/LoginForm'
import { LoginResponse } from '@/types'

export default function WritingToolsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null)

  // Check if user is already logged in (session ID in localStorage)
  React.useEffect(() => {
    const sessionId = localStorage.getItem('sessionId')
    if (sessionId) {
      setIsLoggedIn(true)
      // You could also fetch user details here if needed
    }
  }, [])

  const handleLoginSuccess = (response: LoginResponse) => {
    setIsLoggedIn(true)
    if (response.user) {
      setUser(response.user)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Premium Writing Tools</h1>
        <p className="text-center mb-8 text-muted-foreground">
          Please log in to access our premium human-like writing tools
        </p>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2 text-center">Premium Writing Tools</h1>
      {user && (
        <p className="text-center mb-8 text-muted-foreground">
          Welcome, {user.name || user.email}
        </p>
      )}

      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="generator">Content Generator</TabsTrigger>
          <TabsTrigger value="humanizer">Text Humanizer</TabsTrigger>
          <TabsTrigger value="analyzer">Style Analyzer</TabsTrigger>
          <TabsTrigger value="detector">AI Detector</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator">
          <HumanContentGenerator />
        </TabsContent>
        
        <TabsContent value="humanizer">
          <TextHumanizer />
        </TabsContent>
        
        <TabsContent value="analyzer">
          <WritingStyleAnalyzer />
        </TabsContent>
        
        <TabsContent value="detector">
          <AIDetectionChecker />
        </TabsContent>
      </Tabs>
    </div>
  )
}