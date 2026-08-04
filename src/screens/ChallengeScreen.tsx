import { motion } from 'framer-motion'
import type { QuizResult, Archetype } from '../lib/types'
import { archetypeImages } from '../lib/archetypeImages'

export default function ChallengeScreen({
  challengeResult,
  archetype,
  onStart,
  onBack,
}: {
  challengeResult: QuizResult
  archetype: Archetype
  onStart: () => void
  onBack: () => void
}) {
  const challengeScore = challengeResult.scores[challengeResult.dominant] ?? 0
  const challengeImg = archetypeImages[archetype.id]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col sm:pb-8 pb-4 items-center justify-center min-h-screen px-4 overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_30%,rgba(139,195,75,0.08),transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8 text-center"
      >
        {challengeImg ? (
          <motion.img
            src={challengeImg}
            alt={archetype.name}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4, type: 'spring', bounce: 0.4 }}
            className="w-20 h-20 mx-auto mb-4 object-contain"
          />
        ) : (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4, type: 'spring', bounce: 0.4 }}
            className="text-6xl block mb-4"
          >
            {archetype.icon}
          </motion.span>
        )}
        <h1 className="text-3xl font-display text-primary tracking-tight">
          {archetype.name}
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-8 max-w-md text-center"
      >
        <p className="text-lg text-text-secondary leading-relaxed">
          <span className="font-bold text-accent">{archetype.name}</span> scored{' '}
          <span className="font-bold text-accent">{challengeScore}%</span>. Think you're different? Take the quiz.
        </p>
      </motion.div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        onClick={onStart}
        className="px-8 py-4 bg-primary text-bg font-bold text-lg border-2 border-primary hover:bg-secondary hover:border-secondary active:scale-95 transition-all select-none tracking-wide rounded"
      >
        TAKE THE QUIZ
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        onClick={onBack}
        className="mt-6 px-4 py-2 text-sm font-bold text-text-secondary border-2 border-border hover:border-accent hover:text-accent active:scale-95 transition-all select-none rounded"
      >
        SKIP, JUST BROWSE
      </motion.button>
    </motion.div>
  )
}
