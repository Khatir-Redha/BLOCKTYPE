import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import questionsData from '../data/questions.json'
import archetypesData from '../data/archetypes.json'
import { calculateResult } from '../lib/scoring'
import type { Option, QuizResult, Question, Archetype } from '../lib/types'

const STORAGE_KEY = 'blocktype_quiz_answers'
const STORAGE_INDEX_KEY = 'blocktype_quiz_index'

const questionThemes: Record<string, string> = {
  q1: 'theme-survival',
  q2: 'theme-building',
  q3: 'theme-shelter',
  q4: 'theme-danger',
  q5: 'theme-day',
  q6: 'theme-inventory',
  q7: 'theme-village',
  q8: 'theme-nether',
  q9: 'theme-building',
  q10: 'theme-achievement',
}

const themeColors: Record<string, string> = {
  'theme-survival': '#8BC34B',
  'theme-building': '#D2B48C',
  'theme-shelter': '#8B4513',
  'theme-danger': '#EF4444',
  'theme-day': '#FDE047',
  'theme-inventory': '#A855F7',
  'theme-village': '#38BDF8',
  'theme-nether': '#F97316',
  'theme-achievement': '#EC4899',
}

function loadAnswers(): (Option | null)[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return new Array(questionsData.length).fill(null)
}

function loadIndex(): number {
  try {
    const raw = sessionStorage.getItem(STORAGE_INDEX_KEY)
    if (raw) return parseInt(raw, 10)
  } catch {
    // ignore
  }
  return 0
}

function saveAnswers(answers: (Option | null)[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
  } catch {
    // ignore
  }
}

function saveIndex(index: number) {
  try {
    sessionStorage.setItem(STORAGE_INDEX_KEY, String(index))
  } catch {
    // ignore
  }
}

export default function QuizScreen({ onBack, onResult }: { onBack: () => void; onResult: (result: QuizResult) => void }) {
  const [answers, setAnswers] = useState<(Option | null)[]>(loadAnswers)
  const [currentIndex, setCurrentIndex] = useState(loadIndex)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const questions = questionsData as Question[]
  const archetypes = archetypesData as Archetype[]
  const total = questions.length
  const current = questions[currentIndex]
  const progress = ((currentIndex + 1) / total) * 100
  const themeKey = questionThemes[current.id] || 'theme-survival'
  const themeColor = themeColors[themeKey] || '#8BC34B'

  useEffect(() => {
    saveAnswers(answers)
    saveIndex(currentIndex)
  }, [answers, currentIndex])

  const selectOption = useCallback(
    (option: Option) => {
      const next = [...answers]
      next[currentIndex] = option
      setAnswers(next)
      saveAnswers(next)

      if (currentIndex < total - 1) {
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1)
          saveIndex(prev + 1)
        }, 150)
      } else {
        setTimeout(() => {
          const result = calculateResult(next.filter((a): a is Option => a !== null), questions, archetypes)
          onResult(result)
        }, 300)
      }
    },
    [answers, currentIndex, total, questions, archetypes, onResult]
  )

  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      const next = currentIndex - 1
      setCurrentIndex(next)
      saveIndex(next)
    }
  }, [currentIndex])

  const resetQuiz = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY)
    sessionStorage.removeItem(STORAGE_INDEX_KEY)
    setAnswers(new Array(total).fill(null))
    setCurrentIndex(0)
    saveIndex(0)
  }, [total])

  return (
    <div className="flex flex-col sm:pb-8 pb-4 min-h-screen bg-bg text-text">
      <div className="w-full max-w-lg mx-auto px-4 pt-6 pb-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm font-bold border-2 border-border text-text-secondary rounded hover:border-accent hover:text-accent active:scale-95 transition-all select-none"
        >
          Back
        </button>
        <span className="text-xs font-mono text-text-secondary tracking-wider">
          QUESTION {currentIndex + 1} OF {total}
        </span>
        <button
          onClick={resetQuiz}
          className="px-3 py-1 text-xs font-bold border border-border text-text-secondary rounded hover:text-accent active:scale-95 transition-all select-none"
        >
          RESET
        </button>
      </div>

      <div className="w-full max-w-lg mx-auto px-4 mb-6">
        <div className="w-full h-3 bg-card border-2 border-border relative overflow-hidden rounded">
          <motion.div
            className="h-full border-r-2"
            style={{ backgroundColor: themeColor, borderColor: themeColor }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.2 }}
          className="flex-1 flex flex-col items-center justify-center px-4 w-full max-w-lg mx-auto"
        >
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-xl font-bold text-center mb-8 leading-tight tracking-tight text-text"
          >
            {current.text}
          </motion.h2>

          <div className="w-full flex flex-col gap-3">
            {current.options.map((option, i) => (
              <motion.button
                key={i}
                onClick={() => selectOption(option)}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                whileHover={{
                  scale: 1.02,
                  y: -2,
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
                  transition: { duration: 0.15 },
                }}
                whileTap={{ scale: 0.96 }}
                animate={{
                  borderColor: hoveredIndex === i ? themeColor : 'var(--color-border)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="w-full px-5 py-4 bg-card text-left text-base font-bold text-text border-2 border-border hover:border-primary transition-all select-none tracking-wide rounded relative overflow-hidden"
              >
                <span
                  className="inline-block w-6 h-6 mr-3 text-center text-xs font-mono font-bold rounded"
                  style={{
                    backgroundColor: themeColor,
                    color: 'var(--color-bg)',
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="ml-1">{option.text}</span>
                {hoveredIndex === i && (
                  <motion.span
                    layoutId={`sparkle-${currentIndex}-${i}`}
                    className="absolute top-2 right-3 text-xs"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    ✨
                  </motion.span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="w-full max-w-lg mx-auto px-4 pt-4 pb-6 flex justify-between items-center">
        <button
          onClick={goBack}
          disabled={currentIndex === 0}
          className="px-4 py-2 text-sm font-bold border-2 border-border text-text-secondary rounded hover:border-accent hover:text-accent active:scale-95 transition-all select-none disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← PREV
        </button>
        <span className="text-xs font-mono text-text-secondary">
          {answers.filter((a) => a !== null).length}/{total} answered
        </span>
      </div>
    </div>
  )
}
