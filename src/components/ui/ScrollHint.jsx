import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { scrollRef } from '../../store/scrollRef.jsx'

export default function ScrollHint() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let raf
    const check = () => {
      setVisible(scrollRef.current < 0.5)
      raf = requestAnimationFrame(check)
    }
    raf = requestAnimationFrame(check)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="scroll-hint"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <span>SCROLL</span>
          <div className="scroll-line" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
