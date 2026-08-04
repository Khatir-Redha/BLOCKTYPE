import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-border py-2 px-4 text-center z-40"
    >
      <p className="text-xs text-text-secondary">
        Unofficial fan project. Not affiliated with or endorsed by Mojang or Microsoft.
      </p>
    </motion.footer>
  )
}
