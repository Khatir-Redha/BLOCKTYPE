import { describe, it, expect } from 'vitest'
import { calculateResult } from './scoring'
import type { Option, Question, Archetype } from './types'

const testQuestions: Question[] = [
  {
    id: 'q1',
    text: 'Test question',
    options: [
      { text: 'A', weights: { explorer: 3, chaos: 1 } },
      { text: 'B', weights: { builder: 3 } },
      { text: 'C', weights: { miner: 3, chaos: 2 } },
      { text: 'D', weights: { redstone: 3 } },
    ],
  },
  {
    id: 'q2',
    text: 'Test question 2',
    options: [
      { text: 'A', weights: { builder: 3 } },
      { text: 'B', weights: { explorer: 2, chaos: 1 } },
      { text: 'C', weights: { chaos: 3 } },
      { text: 'D', weights: { redstone: 3 } },
    ],
  },
]

const testArchetypes: Archetype[] = [
  { id: 'explorer', name: 'The Explorer', icon: '🧭', flavorTemplates: [] },
  { id: 'builder', name: 'The Builder', icon: '🏛️', flavorTemplates: [] },
  { id: 'miner', name: 'The Miner', icon: '⛏️', flavorTemplates: [] },
  { id: 'redstone', name: 'The Redstone Engineer', icon: '🔴', flavorTemplates: [] },
  { id: 'chaos', name: 'Agent of Chaos', icon: '🌀', flavorTemplates: [] },
]

describe('calculateResult', () => {
  it('normalizes scores to 0-100 based on max possible per axis', () => {
    const answers: Option[] = [
      { text: 'A', weights: { explorer: 3, chaos: 1 } },
      { text: 'A', weights: { builder: 3 } },
    ]
    const result = calculateResult(answers, testQuestions, testArchetypes)
    expect(result.scores).toBeDefined()
    for (const score of Object.values(result.scores)) {
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(100)
    }
  })

  it('gives 100% when all max weights are selected for an axis', () => {
    const answers: Option[] = [
      { text: 'C', weights: { miner: 3, chaos: 2 } },
      { text: 'C', weights: { chaos: 3 } },
    ]
    const result = calculateResult(answers, testQuestions, testArchetypes)
    expect(result.scores.chaos).toBe(100)
  })

  it('breaks ties by archetypes.json order', () => {
    const answers: Option[] = [
      { text: 'A', weights: { explorer: 3 } },
      { text: 'A', weights: { builder: 3 } },
    ]
    const result = calculateResult(answers, testQuestions, testArchetypes)
    expect(result.dominant).toBe('explorer')
  })

  it('returns the first archetype when all scores are zero', () => {
    const answers: Option[] = []
    const result = calculateResult(answers, testQuestions, testArchetypes)
    expect(result.dominant).toBe('explorer')
  })

  it('generates stats keys matching the dominant archetype', () => {
    const answers: Option[] = [
      { text: 'A', weights: { explorer: 3, chaos: 1 } },
      { text: 'A', weights: { explorer: 3 } },
    ]
    const result = calculateResult(answers, testQuestions, testArchetypes)
    expect(result.dominant).toBe('explorer')
    expect(Object.keys(result.generatedStats)).toContain('biomes')
    expect(Object.keys(result.generatedStats)).toContain('bases')
    expect(Object.keys(result.generatedStats)).toContain('distance')
  })
})