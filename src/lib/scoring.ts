import type { Option, QuizResult, Question, Archetype } from './types'

const MAX_STATS: Record<string, Record<string, number>> = {
  explorer: { biomes: 50, bases: 10, distance: 10000 },
  builder: { blocks: 50000, redesigns: 20 },
  miner: { ores: 1000, caves: 30 },
  redstone: { contraptions: 25, bugs: 20 },
  chaos: { explosions: 40, items: 128 },
}

function sumWeightsPerAxis(answers: Option[]): Record<string, number> {
  const scores: Record<string, number> = {}
  for (const answer of answers) {
    for (const [axis, weight] of Object.entries(answer.weights)) {
      scores[axis] = (scores[axis] ?? 0) + weight
    }
  }
  return scores
}

function computeMaxPossible(questions: Question[]): Record<string, number> {
  const maxPerAxis: Record<string, number> = {}
  for (const question of questions) {
    const axesInQuestion = new Set<string>()
    for (const option of question.options) {
      for (const axis of Object.keys(option.weights)) {
        axesInQuestion.add(axis)
      }
    }
    for (const axis of axesInQuestion) {
      const maxInQuestion = Math.max(
        ...question.options.map((o) => o.weights[axis] ?? 0)
      )
      maxPerAxis[axis] = (maxPerAxis[axis] ?? 0) + maxInQuestion
    }
  }
  return maxPerAxis
}

function normalizeScores(
  scores: Record<string, number>,
  maxPossible: Record<string, number>
): Record<string, number> {
  const normalized: Record<string, number> = {}
  for (const axis of Object.keys(maxPossible)) {
    const raw = scores[axis] ?? 0
    const max = maxPossible[axis]
    normalized[axis] = max > 0 ? Math.round((raw / max) * 100) : 0
  }
  return normalized
}

function findDominantAxis(
  normalized: Record<string, number>,
  archetypeOrder: string[]
): string {
  let bestAxis = ''
  let bestScore = -1
  for (const axis of archetypeOrder) {
    const score = normalized[axis] ?? 0
    if (score > bestScore) {
      bestScore = score
      bestAxis = axis
    }
  }
  return bestAxis
}

function generateStats(dominant: string, dominantScore: number): Record<string, number> {
  const stats: Record<string, number> = {}
  const maxes = MAX_STATS[dominant]
  if (!maxes) return stats
  for (const [key, max] of Object.entries(maxes)) {
    stats[key] = Math.round((dominantScore / 100) * max)
  }
  return stats
}

export function calculateResult(
  answers: Option[],
  questionsData?: Question[],
  archetypesData?: Archetype[]
): QuizResult {
  const scores = sumWeightsPerAxis(answers)
  const maxPossible = computeMaxPossible(questionsData ?? [])
  const normalized = normalizeScores(scores, maxPossible)

  const archetypeOrder = (archetypesData ?? []).map((a) => a.id)
  const dominant = findDominantAxis(normalized, archetypeOrder)
  const dominantScore = normalized[dominant] ?? 0
  const generatedStats = generateStats(dominant, dominantScore)

  return {
    scores: normalized,
    dominant,
    generatedStats,
  }
}