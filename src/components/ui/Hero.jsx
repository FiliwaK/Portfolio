import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="hero-section" id="home">

      {/* Coin sup-gauche — eyebrow */}
      <motion.p
        className="hero-corner-tl"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        [ DIPLÔMÉ DEC · INFORMATIQUE · QUÉBEC ]
      </motion.p>

      {/* Bas-gauche — nom + rôle */}
      <div className="hero-corner-bl">
        <motion.h1
          className="hero-name"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="hero-name-solid">FABRICE</span>
          <span className="hero-name-outline">KOUAKOUI</span>
        </motion.h1>

        <motion.p
          className="hero-role"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.7 }}
        >
          Computer Vision · IA embarquée · Interfaces 3D
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <a href="#projects" className="btn-primary">Explorer les projets</a>
          <a href="mailto:kouakoufabrice7@gmail.com" className="btn-ghost">Contact</a>
        </motion.div>
      </div>

      {/* Bas-droite — scroll hint */}
      <motion.div
        className="hero-scroll-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
      >
        <span>SCROLL</span>
        <div className="scroll-line" />
      </motion.div>

      {/* Filigrane droit */}
      <motion.div
        className="hero-watermark"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <span>F</span>
        <span>·</span>
        <span>D</span>
        <span>·</span>
        <span>E</span>
        <span>·</span>
        <span>V</span>
      </motion.div>

    </section>
  )
}
