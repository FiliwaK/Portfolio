import { motion } from 'framer-motion'
import { PROJECTS } from '../../constants/index.jsx'
import { Spotlight } from './Spotlight.jsx'

export default function Projects() {
  return (
    <section className="section" id="projects">
      <div className="section-inner">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <p className="section-eyebrow">[ EXPLORATIONS ]</p>
          <h2 className="section-title">PROJETS</h2>
        </motion.div>

        <div className="projects-grid">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, index }) {
  const techList = project.tech.split(' · ')

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="project-card"
    >
      <Spotlight size={280} color={`${project.color}18`} />

      {/* Accent top border */}
      <div className="project-card-top" style={{ background: `linear-gradient(to right, ${project.color}66, transparent)` }} />

      <div className="project-card-body">
        {/* Header */}
        <div className="project-card-header">
          <div className="planet-dot" style={{ background: project.color, boxShadow: `0 0 8px ${project.color}` }} />
          <span className="planet-label">{project.planet}</span>
        </div>

        <h3 className="project-name">{project.name}</h3>
        <p className="project-desc">{project.description}</p>

        {/* Tech chips */}
        <div className="tech-chips">
          {techList.map(t => (
            <span key={t} className="tech-chip">{t}</span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="project-card-footer">
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link"
            style={{ color: project.color }}
          >
            VOIR LE CODE →
          </a>
        )}
      </div>

      {/* Bottom glow line */}
      <div className="project-glow" style={{ background: `linear-gradient(to right, transparent, ${project.color}33, transparent)` }} />
    </motion.article>
  )
}
