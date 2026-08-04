import { useState, useEffect } from 'react'
import Home from './screens/Home'
import ChallengeScreen from './screens/ChallengeScreen'
import QuizScreen from './screens/QuizScreen'
import ResultScreen from './screens/ResultScreen'
import CompareScreen from './screens/CompareScreen'
import { getResultFromURL, shareResult, shareCompare } from './lib/share'
import type { QuizResult, Archetype } from './lib/types'
import archetypesData from './data/archetypes.json'
import Footer from './components/Footer'

type Screen = 'home' | 'quiz' | 'result' | 'compare' | 'challenge'

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [result, setResult] = useState<QuizResult | null>(null)
  const [challengeResult, setChallengeResult] = useState<QuizResult | null>(null)
  const [compareResults, setCompareResults] = useState<[QuizResult, QuizResult] | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const archetypes = archetypesData as Archetype[]

  useEffect(() => {
    const shared = getResultFromURL()
    if (shared) {
      if (shared.type === 'compare') {
        setCompareResults(shared.results)
        setScreen('compare')
      } else {
        setChallengeResult(shared.result)
        setScreen('challenge')
      }
    }
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleQuizResult = (r: QuizResult) => {
    if (challengeResult) {
      setCompareResults([challengeResult, r])
      setScreen('compare')
    } else {
      setResult(r)
      setScreen('result')
    }
  }

  return (
    <>
      {screen === 'home' && (
        <Home onStart={() => setScreen('quiz')} />
      )}
      {screen === 'challenge' && challengeResult && (
        <ChallengeScreen
          challengeResult={challengeResult}
          archetype={archetypes.find((a) => a.id === challengeResult.dominant)!}
          onStart={() => setScreen('quiz')}
          onBack={() => {
            setChallengeResult(null)
            setScreen('home')
          }}
        />
      )}
      {screen === 'quiz' && (
        <QuizScreen
          onBack={() => {
            setChallengeResult(null)
            setScreen('home')
          }}
          onResult={handleQuizResult}
        />
      )}
      {screen === 'result' && result && (
        <ResultScreen
          result={result}
          archetype={archetypes.find((a) => a.id === result.dominant)!}
          onTakeAgain={() => {
            try {
              sessionStorage.removeItem('blocktype_quiz_answers')
              sessionStorage.removeItem('blocktype_quiz_index')
            } catch {
              // ignore
            }
            setResult(null)
            setScreen('quiz')
          }}
          onShare={() => {
            shareResult(result).then(() => {
              showToast('Link copied!')
            })
          }}
        />
      )}
      {screen === 'compare' && compareResults && (
        <CompareScreen
          results={compareResults}
          onTakeAgain={() => {
            try {
              sessionStorage.removeItem('blocktype_quiz_answers')
              sessionStorage.removeItem('blocktype_quiz_index')
            } catch {
              // ignore
            }
            setCompareResults(null)
            setScreen('quiz')
          }}
          onShare={() => {
            shareCompare(compareResults).then(() => {
              showToast('Link copied!')
            })
          }}
        />
      )}
      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-800 border-2 border-gray-600 text-gray-200 text-sm font-bold z-50">
          {toast}
        </div>
      )}
      <Footer />
    </>
  )
}

export default App