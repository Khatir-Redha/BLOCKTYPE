export interface Option {
  text: string
  weights: Record<string, number>
}

export interface Question {
  id: string
  text: string
  options: Option[]
}

export interface Archetype {
  id: string
  name: string
  icon: string
  flavorTemplates: string[]
}

export interface QuizResult {
  scores: Record<string, number>
  dominant: string
  generatedStats: Record<string, number>
}