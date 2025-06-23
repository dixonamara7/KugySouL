import React, { useState } from 'react'
import { apiService } from '@/services/api'
import { LoginResponse } from '@/types'
import { Button, Input, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Alert, AlertDescription, AlertTitle, Label } from '@/components/ui'
import { Loader2 } from 'lucide-react'

interface LoginFormProps {
  onLoginSuccess?: (response: LoginResponse) => void
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password')
      return
    }

    try {
      setIsLoggingIn(true)
      setError(null)
      const response = await apiService.login({
        email,
        password
      })
      
      if (response.status === 'success') {
        // Store session ID in localStorage or cookies if needed
        if (response.session_id) {
          localStorage.setItem('sessionId', response.session_id)
        }
        
        // Call the success callback if provided
        if (onLoginSuccess) {
          onLoginSuccess(response)
        }
      } else {
        setError(response.message || 'Login failed')
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      setError(errorMessage)
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Sign in to access premium human-like writing features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Button type="submit" className="w-full" disabled={isLoggingIn}>
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account? Contact support for access.
        </p>
      </CardFooter>
    </Card>
  )
}