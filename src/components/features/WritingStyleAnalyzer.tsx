import React, { useState } from 'react'
import { apiService } from '@/services/api'
import { AnalyzeWritingStyleResponse } from '@/types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

export function WritingStyleAnalyzer() {
  const [textSample, setTextSample] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalyzeWritingStyleResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!textSample.trim()) {
      setError('Please enter some text to analyze')
      return
    }

    try {
      setIsAnalyzing(true)
      setError(null)
      const response = await apiService.analyzeWritingStyle({
        text_samples: [textSample]
      })
      setResult(response)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze writing style'
      setError(errorMessage)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Writing Style Analyzer</CardTitle>
          <CardDescription>
            Analyze your writing style to understand its unique characteristics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter a sample of your writing (at least 200 words for best results)"
            value={textSample}
            onChange={(e) => setTextSample(e.target.value)}
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
          <Button onClick={handleAnalyze} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Style'
            )}
          </Button>
        </CardFooter>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              Your writing style profile based on the provided sample
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Summary</h3>
              <p>{result.analysis_summary}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">Style Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">Formality Level</h4>
                  <p className="text-sm text-muted-foreground">
                    {result.style_profile.formality_level < 0.3 
                      ? 'Casual/Informal' 
                      : result.style_profile.formality_level < 0.7 
                        ? 'Balanced/Neutral' 
                        : 'Formal/Professional'}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${result.style_profile.formality_level * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">Vocabulary Complexity</h4>
                  <p className="text-sm text-muted-foreground">
                    Score: {result.style_profile.vocabulary_complexity.complexity_score.toFixed(2)}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${result.style_profile.vocabulary_complexity.complexity_score * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">Sentence Structure</h4>
                  <p className="text-sm">
                    Average Length: {result.style_profile.sentence_structure.avg_sentence_length.toFixed(1)} words
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Variety: {result.style_profile.sentence_structure.structure_variety.toFixed(2)}
                  </p>
                </div>
                
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">Emotional Tone</h4>
                  <p className="text-sm">
                    Primary: {result.style_profile.emotional_tone.primary_emotions.join(', ')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Range: {result.style_profile.emotional_tone.emotional_range.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            
            {result.style_profile.writing_quirks.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold">Writing Quirks</h3>
                <ul className="list-disc pl-5 mt-2">
                  {result.style_profile.writing_quirks.map((quirk, index) => (
                    <li key={index} className="text-sm">{quirk}</li>
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