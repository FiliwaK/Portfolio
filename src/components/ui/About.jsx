import { motion } from 'framer-motion'
import { Spotlight } from './Spotlight.jsx'

const STACK = [
  { cat: 'Computer Vision', items: ['MediaPipe', 'OpenCV', 'YOLO', 'OpenVINO', 'ONNX'] },
  { cat: 'Hardware',        items: ['RealSense D455', 'Intel Iris Xe', 'Caméra stéréo'] },
  { cat: 'Développement',   items: ['Python', 'C#', 'WPF', 'WinForms', 'React', 'Three.js'] },
  { cat: 'Protocoles',      items: ['TCP/IP', 'COM PowerPoint', 'HelixToolkit 3D'] },
]

export default function About() {
  return (
    <section className="section" id="about">
      <div className="section-inner">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="section-header"
        >
          <p className="section-eyebrow">[ TRANSMISSION REÇUE ]</p>
          <h2 className="section-title">À PROPOS</h2>
        </motion.div>

        <div className="about-grid">

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="about-bio-card"
          >
            <Spotlight size={320} color="rgba(0,229,255,0.08)" />

            <p className="about-eyebrow">FABRICE KOUAKOUI</p>

            <p className="about-bio">
              Diplômé en Techniques de l'informatique du Cégep de
              Beauce-Appalaches (Québec). Spécialisé en Computer Vision
              et IA embarquée — je construis des interfaces qui effacent
              la frontière entre le corps humain et la machine.
            </p>
            <p className="about-bio" style={{ marginTop: '1rem' }}>
              Mes projets tournent autour d'une obsession : donner aux
              gestes le pouvoir de piloter des systèmes complexes, en
              temps réel, avec précision millimétrique.
            </p>

            <div className="about-tag-row">
              <span className="about-tag">Québec, Canada</span>
              <span className="about-tag">DEC Diplômé</span>
              <span className="about-tag">Computer Vision</span>
            </div>

            {/* Lien GitHub */}
            <a
              href="https://github.com/FiliwaK"
              target="_blank"
              rel="noreferrer"
              className="about-github"
            >
              GitHub · FiliwaK →
            </a>
          </motion.div>

          {/* Stack */}
          <div className="about-stack-grid">
            {STACK.map(({ cat, items }, i) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="stack-card"
              >
                <Spotlight size={200} color="rgba(123,47,255,0.07)" />
                <p className="stack-cat">{cat}</p>
                <div className="stack-items">
                  {items.map(it => (
                    <span key={it} className="stack-item">{it}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
