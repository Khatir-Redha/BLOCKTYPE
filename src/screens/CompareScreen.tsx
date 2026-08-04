import { motion } from 'framer-motion'
import type { QuizResult, Archetype } from '../lib/types'
import archetypesData from '../data/archetypes.json'
import { archetypeImages } from '../lib/archetypeImages'
import { generateComparisonLine } from '../lib/share'

export default function CompareScreen({
  results,
  onTakeAgain,
  onShare,
}: {
  results: [QuizResult, QuizResult]
  onTakeAgain: () => void
  onShare: () => void
}) {
  const archetypes = archetypesData as Archetype[]
  const [r1, r2] = results
  const comparisonLine = generateComparisonLine(r1, r2, archetypes)
  const maxScore = Math.max(
    ...Object.values(r1.scores).concat(Object.values(r2.scores)),
    1
  )

  return (
    <div className="flex flex-col sm:pb-8 pb-4 min-h-screen bg-bg text-text">
      <div className="w-full max-w-4xl mx-auto px-4 pt-8 pb-4 text-center">
        <motion.h1
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-4xl font-display text-primary tracking-tight"
        >
          VS SHOWDOWN
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-sm font-mono text-text-secondary mt-1 tracking-widest"
        >
          SIDE-BY-SIDE COMPARISON
        </motion.p>
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {[r1, r2].map((result, idx) => {
          const arch = archetypes.find((a) => a.id === result.dominant) ?? archetypes[idx]
          const archImg = archetypeImages[result.dominant]
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.15, duration: 0.4 }}
              className="bg-card border-2 border-border p-4 rounded"
            >
              <div className="text-center mb-4">
                {archImg ? (
                  <motion.img
                    src={archImg}
                    alt={arch.name}
                    className="w-16 h-16 mx-auto object-contain"
                  />
                ) : (
                  <span className="text-5xl block">{arch.icon}</span>
                )}
                <h2 className="text-xl font-display text-primary mt-2">{arch.name}</h2>
                <p className="text-xs font-mono text-text-secondary tracking-widest">
                  {result.dominant.toUpperCase()}
                </p>
              </div>

              <div className="flex flex-col gap-2 mb-4">
                {Object.entries(result.scores).map(([axis, score]) => {
                  const pct = (score / maxScore) * 100
                  return (
                    <div key={axis} className="flex items-center gap-2">
                      <span className="w-20 text-[10px] font-bold text-text-secondary truncate">
                        {axis}
                      </span>
                      <div className="flex-1 h-3 bg-bg border-2 border-border rounded relative overflow-hidden">
                        <motion.div
                          className="h-full border-r-2 rounded"
                          style={{ backgroundColor: '#8BC34B', borderColor: '#FBBF24' }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.5 + idx * 0.1, duration: 0.6, ease: 'easeOut' }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono font-bold text-text">
                          {score}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="grid grid-cols-2 gap-2">
                {Object.entries(result.generatedStats).map(([key, value]) => (
                  <div key={key} className="px-2 py-1 bg-bg border-2 border-border text-center rounded">
                    <span className="text-sm font-black text-primary">{value}</span>
                    <span className="block text-[9px] font-mono text-text-secondary uppercase">
                      {key}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="w-full max-w-4xl mx-auto px-4 mb-6"
      >
        <div className="px-4 py-3 bg-card border-2 border-accent text-center rounded">
          <p className="text-sm text-accent font-bold">{comparisonLine}</p>
        </div>
      </motion.div>

      <div className="mt-auto w-full max-w-4xl mx-auto px-4 pb-8 flex flex-col sm:flex-row gap-3 justify-center">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onShare}
          className="px-6 py-3 bg-primary text-bg font-bold text-sm border-2 border-primary hover:bg-secondary hover:border-secondary active:scale-[0.98] transition-all select-none rounded"
        >
          SHARE COMPARISON
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onTakeAgain}
          className="px-6 py-3 bg-card text-accent font-bold text-sm border-2 border-border hover:border-accent active:scale-[0.98] transition-all select-none rounded"
        >
          TAKE AGAIN
        </motion.button>
      </div>
    </div>
  )
}
