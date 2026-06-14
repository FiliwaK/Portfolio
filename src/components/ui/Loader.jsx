import { useState, useEffect } from 'react'
import { useProgress } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'

// Reste visible jusqu'à ce que TOUS les assets soient chargés
// (~61MB total : Spartan 31MB + Hovercar 7MB + Space 23MB)
export default function Loader() {
  const { progress, active } = useProgress()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!active && progress >= 100) {
      const t = setTimeout(() => setReady(true), 500)
      return () => clearTimeout(t)
    }
  }, [active, progress])

  return (
    <AnimatePresence>
      {!ready && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: '#000008',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '18px',
          }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '44px', letterSpacing: '0.2em', color: '#00e5ff', textShadow: '0 0 30px rgba(0,229,255,0.6)' }}
          >
            FABRICE K
          </motion.div>

          <div style={{ color: 'rgba(0,229,255,0.35)', fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.3em' }}>
            [ CHARGEMENT DU MONDE 3D ]
          </div>

          {/* Barre de progression réelle */}
          <div style={{ width: '240px', height: '1px', background: 'rgba(0,229,255,0.12)', position: 'relative' }}>
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{ height: '100%', background: '#00e5ff', boxShadow: '0 0 10px #00e5ff' }}
            />
          </div>

          {/* Pourcentage */}
          <div style={{ color: 'rgba(0,229,255,0.5)', fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.15em' }}>
            {Math.round(progress)}%
          </div>

          {/* Message d'état */}
          <motion.div
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ color: 'rgba(255,255,255,0.2)', fontFamily: "'Space Mono', monospace", fontSize: '8px', letterSpacing: '0.2em', marginTop: '8px' }}
          >
            {active ? '▸ TÉLÉCHARGEMENT MODÈLES 3D...' : '▸ COMPILATION SHADERS...'}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
