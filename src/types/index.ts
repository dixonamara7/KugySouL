export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  type?: 'text' | 'code' | 'error' | 'success'
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  status: 'active' | 'completed' | 'error'
}

export interface ApiConfig {
  APP_MODE: string
  GITHUB_CLIENT_ID: string
  POSTHOG_CLIENT_KEY: string
  FEATURE_FLAGS: {
    ENABLE_BILLING: boolean
    HIDE_LLM_SETTINGS: boolean
  }
}

export interface CreateConversationRequest {
  initial_user_msg: string
}

export interface CreateConversationResponse {
  conversation_id: string
  status: string
  message: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface AgentStatus {
  status: 'idle' | 'thinking' | 'executing' | 'error'
  currentTask?: string
  progress?: number
}

// Login types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  status: string
  message: string
  session_id?: string
  user?: {
    email: string
    name?: string
  }
}

// Writing Style Analysis types
export interface AnalyzeWritingStyleRequest {
  text_samples: string[]
}

export interface AnalyzeWritingStyleResponse {
  style_profile: {
    formality_level: number
    vocabulary_complexity: {
      unique_words_ratio: number
      advanced_terms_frequency: number
      complexity_score: number
    }
    sentence_structure: {
      avg_sentence_length: number
      structure_variety: number
      complexity_patterns: string[]
    }
    emotional_tone: {
      primary_emotions: string[]
      emotional_range: number
      sentiment_balance: number
    }
    writing_quirks: string[]
    descriptive_density: number
  }
  analysis_summary: string
  style_fingerprint: string
}

// Human Content Generation types
export interface GenerateHumanContentRequest {
  prompt: string
  style_profile?: Record<string, unknown>
  length?: number
}

export interface GenerateHumanContentResponse {
  content: string
  style_match_score: number
  human_likelihood: number
  content_stats: {
    word_count: number
    readability_score: number
    descriptive_elements: number
  }
}

// Text Humanization types
export interface HumanizeTextRequest {
  ai_text: string
  style_profile?: Record<string, unknown>
}

export interface HumanizeTextResponse {
  humanized_text: string
  improvements: string[]
  human_likelihood: number
  before_after_comparison: {
    ai_detection_risk_before: number
    ai_detection_risk_after: number
  }
}

// AI Detection Check types
export interface CheckAIDetectionRequest {
  text: string
}

export interface CheckAIDetectionResponse {
  detection_risk: number
  risk_factors: {
    vocabulary_uniformity: number
    structure_predictability: number
    emotional_flatness: number
    unnatural_perfection: number
  }
  improvement_suggestions: string[]
  human_likelihood_score: number
}