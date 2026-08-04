import { motion } from 'framer-motion'
import PixelSky from '../components/PixelSky'

export default function Home({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col items-center justify-center min-h-screen px-4 pb-2 sm:pb-8 overflow-hidden"
    >
      <PixelSky />

      <div className="mb-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, type: 'spring', bounce: 0.3 }}
          className="text-5xl font-display text-primary tracking-tight"
        >
          BLOCKTYPE
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center text-text-secondary text-sm font-mono mt-2 tracking-widest"
        >
          What kind of Minecraft player are you?
        </motion.p>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        onClick={onStart}
        className="px-8 py-4 bg-primary text-bg font-bold text-lg border-2 border-primary hover:bg-secondary hover:border-secondary active:scale-95 transition-all select-none tracking-wide rounded"
      >
        FIND MY TYPE →
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mt-4 text-xs text-text-secondary font-mono tracking-widest"
      >
        Takes about 2 minutes • 10 questions • No account required
      </motion.p>
    </motion.div>
  )
}
