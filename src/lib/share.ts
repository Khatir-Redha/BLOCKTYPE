import type { QuizResult, Archetype } from './types'

export function encodeResult(result: QuizResult): string {
  return btoa(JSON.stringify(result))
}

export function decodeResult(encoded: string): QuizResult | null {
  try {
    return JSON.parse(atob(encoded)) as QuizResult
  } catch {
    return null
  }
}

export function encodeChallenge(results: [QuizResult, QuizResult]): string {
  return btoa(JSON.stringify(results))
}

export function decodeChallenge(encoded: string): [QuizResult, QuizResult] | null {
  try {
    const decoded = JSON.parse(atob(encoded))
    if (Array.isArray(decoded) && decoded.length === 2) {
      return decoded as [QuizResult, QuizResult]
    }
    return null
  } catch {
    return null
  }
}

export function getResultFromURL(): { type: 'challenge'; result: QuizResult } | { type: 'compare'; results: [QuizResult, QuizResult] } | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  const encoded = params.get('r')
  if (!encoded) return null

  const decoded = decodeChallenge(encoded)
  if (decoded) {
    return { type: 'compare', results: decoded }
  }

  const single = decodeResult(encoded)
  if (single) {
    return { type: 'challenge', result: single }
  }

  return null
}

export function buildShareURL(result: QuizResult): string {
  const encoded = encodeResult(result)
  const url = new URL(window.location.href)
  url.searchParams.set('r', encoded)
  return url.toString()
}

export function buildCompareURL(results: [QuizResult, QuizResult]): string {
  const encoded = encodeChallenge(results)
  const url = new URL(window.location.href)
  url.searchParams.set('r', encoded)
  return url.toString()
}

export async function shareResult(result: QuizResult): Promise<void> {
  const url = buildShareURL(result)
  const title = 'BlockType Quiz Result'
  const text = `I scored as "${result.dominant}" on BlockType!`

  if (navigator.share) {
    try {
      await navigator.share({ title, text, url })
      return
    } catch {
      // User cancelled or share failed, fall through to clipboard
    }
  }

  await navigator.clipboard.writeText(url)
}

export async function shareCompare(results: [QuizResult, QuizResult]): Promise<void> {
  const url = buildCompareURL(results)
  const title = 'BlockType Comparison'
  const text = `Check out our BlockType archetype comparison!`

  if (navigator.share) {
    try {
      await navigator.share({ title, text, url })
      return
    } catch {
      // Fall through to clipboard
    }
  }

  await navigator.clipboard.writeText(url)
}

export function generateComparisonLine(
  result1: QuizResult,
  result2: QuizResult,
  archetypes: Archetype[]
): string {
  const arch1 = archetypes.find((a) => a.id === result1.dominant)
  const arch2 = archetypes.find((a) => a.id === result2.dominant)
  const name1 = arch1?.name ?? result1.dominant
  const name2 = arch2?.name ?? result2.dominant
  const score1 = result1.scores[result1.dominant] ?? 0
  const score2 = result2.scores[result2.dominant] ?? 0
  const diff = score1 - score2

  if (Math.abs(diff) < 5) {
    return `You're pretty similar — both lean ${name1}!`
  }

  const stronger = diff > 0 ? name1 : name2
  return `You're way more ${stronger} than they are!`
}