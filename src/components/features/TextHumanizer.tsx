import React, { useState } from 'react'
import { apiService } from '@/services/api'
import { HumanizeTextResponse } from '@/types'
import { Button, Textarea, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Alert, AlertDescription, AlertTitle, Badge } from '@/components/ui'
import { Loader2, Copy, CheckCircle2, ArrowRight } from 'lucide-react'

export function TextHumanizer() {
  const [aiText, setAiText] = useState('')
  const [isHumanizing, setIsHumanizing] = useState(false)
  const [result, setResult] = useState<HumanizeTextResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleHumanize = async () => {
    if (!aiText.trim()) {
      setError('Please enter some AI-generated text to humanize')
      return
    }

    try {
      setIsHumanizing(true)
      setError(null)
      const response = await apiService.humanizeText({
        ai_text: aiText
      })
      setResult(response)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to humanize text'
      setError(errorMessage)
    } finally {
      setIsHumanizing(false)
    }
  }

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.humanized_text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Text Humanizer</CardTitle>
          <CardDescription>
            Transform AI-generated content into natural, human-like writing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste AI-generated text here to humanize it"
            value={aiText}
            onChange={(e) => setAiText(e.target.value)}
            rows={8}
            className="mb-4"
          />
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleHumanize} disabled={isHumanizing}>
            {isHumanizing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Humanizing...
              </>
            ) : (
              'Humanize Text'
            )}
          </Button>
        </CardFooter>
      </Card>

      {result && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Humanized Text</CardTitle>
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
              {result.humanized_text}
            </div>
            
            <div className="flex items-center justify-center gap-4 my-4">
              <div className="text-center">
                <p className="text-sm font-medium">AI Detection Risk Before</p>
                <Badge variant={result.before_after_comparison.ai_detection_risk_before > 0.5 ? "destructive" : "outline"} className="mt-1">
                  {(result.before_after_comparison.ai_detection_risk_before * 100).toFixed(1)}%
                </Badge>
              </div>
              
              <ArrowRight className="h-5 w-5" />
              
              <div className="text-center">
                <p className="text-sm font-medium">AI Detection Risk After</p>
                <Badge variant={result.before_after_comparison.ai_detection_risk_after > 0.5 ? "destructive" : "outline"} className="mt-1">
                  {(result.before_after_comparison.ai_detection_risk_after * 100).toFixed(1)}%
                </Badge>
              </div>
            </div>
            
            {result.improvements.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Improvements Made</h3>
                <ul className="list-disc pl-5">
                  {result.improvements.map((improvement, index) => (
                    <li key={index} className="text-sm mb-1">{improvement}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}