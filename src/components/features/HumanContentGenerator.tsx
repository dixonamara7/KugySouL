import React, { useState } from 'react'
import { apiService } from '@/services/api'
import { GenerateHumanContentResponse } from '@/types'
import { Button, Textarea, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Alert, AlertDescription, AlertTitle, Slider } from '@/components/ui'
import { Loader2, Copy, CheckCircle2 } from 'lucide-react'

export function HumanContentGenerator() {
  const [prompt, setPrompt] = useState('')
  const [length, setLength] = useState(500)
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<GenerateHumanContentResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    try {
      setIsGenerating(true)
      setError(null)
      const response = await apiService.generateHumanContent({
        prompt,
        length
      })
      setResult(response)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate content'
      setError(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Human Content Generator</CardTitle>
          <CardDescription>
            Generate human-like content that passes AI detection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Your Prompt</label>
            <Textarea
              placeholder="Enter your content prompt or topic"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="mb-4"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Content Length (words): {length}
            </label>
            <div className="flex items-center gap-4">
              <span className="text-sm">100</span>
              <Slider
                value={[length]}
                min={100}
                max={2000}
                step={100}
                onValueChange={(value) => setLength(value[0])}
                className="flex-1"
              />
              <span className="text-sm">2000</span>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Human Content'
            )}
          </Button>
        </CardFooter>
      </Card>

      {result && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Generated Content</CardTitle>
              <CardDescription>
                Human Likelihood Score: {(result.human_likelihood * 100).toFixed(1)}%
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={handleCopy}>
              {copied ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-md p-4 whitespace-pre-wrap">
              {result.content}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-md p-3">
                <h4 className="font-medium">Word Count</h4>
                <p className="text-2xl font-bold">{result.content_stats.word_count}</p>
              </div>
              
              <div className="border rounded-md p-3">
                <h4 className="font-medium">Readability Score</h4>
                <p className="text-2xl font-bold">{result.content_stats.readability_score.toFixed(1)}</p>
              </div>
              
              <div className="border rounded-md p-3">
                <h4 className="font-medium">Style Match</h4>
                <p className="text-2xl font-bold">{(result.style_match_score * 100).toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}