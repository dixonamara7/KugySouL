import React, { useState } from 'react'
import { apiService } from '@/services/api'
import { CheckAIDetectionResponse } from '@/types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export function AIDetectionChecker() {
  const [text, setText] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<CheckAIDetectionResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCheck = async () => {
    if (!text.trim()) {
      setError('Please enter some text to check')
      return
    }

    try {
      setIsChecking(true)
      setError(null)
      const response = await apiService.checkAIDetection({
        text
      })
      setResult(response)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check AI detection'
      setError(errorMessage)
    } finally {
      setIsChecking(false)
    }
  }

  const getRiskLevel = (score: number) => {
    if (score < 0.3) return { label: 'Low Risk', color: 'text-green-500' }
    if (score < 0.7) return { label: 'Medium Risk', color: 'text-yellow-500' }
    return { label: 'High Risk', color: 'text-red-500' }
  }

  const getProgressColor = (score: number) => {
    if (score < 0.3) return 'bg-green-500'
    if (score < 0.7) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Detection Checker</CardTitle>
          <CardDescription>
            Check if your content is likely to be flagged as AI-generated
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter text to check for AI detection risk"
            value={text}
            onChange={(e) => setText(e.target.value)}
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
          <Button onClick={handleCheck} disabled={isChecking}>
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              'Check Detection Risk'
            )}
          </Button>
        </CardFooter>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Detection Results</CardTitle>
              <div className="flex items-center">
                {result.detection_risk > 0.5 ? (
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                )}
                <span className={getRiskLevel(result.detection_risk).color + " font-semibold"}>
                  {getRiskLevel(result.detection_risk).label}
                </span>
              </div>
            </div>
            <CardDescription>
              Human Likelihood Score: {(result.human_likelihood_score * 100).toFixed(1)}%
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">AI Detection Risk</span>
                <span className="text-sm font-medium">{(result.detection_risk * 100).toFixed(1)}%</span>
              </div>
              <Progress 
                value={result.detection_risk * 100} 
                className="h-2"
                indicatorClassName={getProgressColor(result.detection_risk)}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Risk Factors</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Vocabulary Uniformity</span>
                    <span className="text-sm">{(result.risk_factors.vocabulary_uniformity * 100).toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={result.risk_factors.vocabulary_uniformity * 100} 
                    className="h-1.5"
                    indicatorClassName={getProgressColor(result.risk_factors.vocabulary_uniformity)}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Structure Predictability</span>
                    <span className="text-sm">{(result.risk_factors.structure_predictability * 100).toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={result.risk_factors.structure_predictability * 100} 
                    className="h-1.5"
                    indicatorClassName={getProgressColor(result.risk_factors.structure_predictability)}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Emotional Flatness</span>
                    <span className="text-sm">{(result.risk_factors.emotional_flatness * 100).toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={result.risk_factors.emotional_flatness * 100} 
                    className="h-1.5"
                    indicatorClassName={getProgressColor(result.risk_factors.emotional_flatness)}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Unnatural Perfection</span>
                    <span className="text-sm">{(result.risk_factors.unnatural_perfection * 100).toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={result.risk_factors.unnatural_perfection * 100} 
                    className="h-1.5"
                    indicatorClassName={getProgressColor(result.risk_factors.unnatural_perfection)}
                  />
                </div>
              </div>
            </div>
            
            {result.improvement_suggestions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Improvement Suggestions</h3>
                <ul className="list-disc pl-5">
                  {result.improvement_suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm mb-1">{suggestion}</li>
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