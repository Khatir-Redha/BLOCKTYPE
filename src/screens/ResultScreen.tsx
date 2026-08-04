import { motion, AnimatePresence } from 'framer-motion'
import type { QuizResult, Archetype } from '../lib/types'
import { archetypeImages } from '../lib/archetypeImages'

function substituteTemplate(template: string, stats: Record<string, number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const val = stats[key]
    return val !== undefined ? String(val) : `{${key}}`
  })
}

export default function ResultScreen({
  result,
  archetype,
  onTakeAgain,
  onShare,
}: {
  result: QuizResult
  archetype: Archetype
  onTakeAgain: () => void
  onShare: () => void
}) {
  const maxScore = Math.max(...Object.values(result.scores), 1)
  const flavorText = substituteTemplate(archetype.flavorTemplates[0], result.generatedStats)
  const archImg = archetypeImages[archetype.id]

  return (
    <div className="flex flex-col sm:pb-8 pb-4 min-h-screen bg-bg text-text">
      <div className="w-full max-w-lg mx-auto px-4 pt-10 pb-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5, type: 'spring', bounce: 0.4 }}
          >
            {archImg ? (
              <motion.img
                src={archImg}
                alt={archetype.name}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.4, type: 'spring', bounce: 0.5 }}
                className="w-24 h-24 mx-auto object-contain"
              />
            ) : (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.4, type: 'spring', bounce: 0.5 }}
                className="text-7xl block"
              >
                {archetype.icon}
              </motion.span>
            )}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              className="text-3xl font-display text-primary tracking-tight mt-2"
            >
              {archetype.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.3 }}
              className="text-xs font-mono text-text-secondary mt-1 tracking-widest"
            >
              DOMINANT ARCHETYPE
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.4 }}
        className="w-full max-w-lg mx-auto px-4 mb-6"
      >
        <div className="px-4 py-3 bg-card border-2 border-border rounded">
          <p className="text-sm text-text-secondary leading-relaxed">{flavorText}</p>
        </div>
      </motion.div>

      <div className="w-full max-w-lg mx-auto px-4 mb-6">
        <h3 className="text-xs font-mono text-text-secondary tracking-widest mb-3">SCORE BREAKDOWN</h3>
        <div className="flex flex-col gap-2">
          {Object.entries(result.scores).map(([axis, score]) => {
            const arch = archetype.id === axis ? archetype : undefined
            const pct = (score / maxScore) * 100
            return (
              <div key={axis} className="flex items-center gap-3">
                <span className="w-28 text-xs font-bold text-text-secondary truncate">
                  {arch?.name ?? axis}
                </span>
                <div className="flex-1 h-5 bg-card border-2 border-border rounded relative overflow-hidden">
                  <motion.div
                    className="h-full border-r-2 rounded"
                    style={{ backgroundColor: '#8BC34B', borderColor: '#FBBF24' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 1.3, duration: 0.8, ease: 'easeOut' }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-text">
                    {score}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="w-full max-w-lg mx-auto px-4 mb-6">
        <h3 className="text-xs font-mono text-text-secondary tracking-widest mb-3">YOUR STATS</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(result.generatedStats).map(([key, value]) => (
            <div key={key} className="px-3 py-2 bg-card border-2 border-border text-center rounded">
              <span className="text-lg font-black text-primary">{value}</span>
              <span className="block text-[10px] font-mono text-text-secondary uppercase tracking-wider mt-1">
                {key}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto w-full max-w-lg mx-auto px-4 pb-8 flex flex-col gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onShare}
          className="w-full px-6 py-4 bg-primary text-bg font-bold text-lg border-2 border-primary hover:bg-secondary hover:border-secondary active:scale-[0.98] transition-all select-none tracking-wide rounded"
        >
          SHARE MY RESULT
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onTakeAgain}
          className="w-full px-6 py-3 bg-card text-text-secondary font-bold text-sm border-2 border-border hover:border-accent hover:text-accent active:scale-[0.98] transition-all select-none rounded"
        >
          PLAY AGAIN
        </motion.button>
      </div>
    </div>
  )
}
