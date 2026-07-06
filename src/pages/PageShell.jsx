import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import './pages.css'

/* ============================================================
   PageShell — consistent layout + entrance for every section
   page. Provides the eyebrow/title block, a back-to-map link,
   and a subtle staggered fade-up on mount.
   ============================================================ */

export default function PageShell({ eyebrow, title, intro, children }) {
  return (
    <motion.main
      className="page shell"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to="/" className="page__back eyebrow">
        ← Star map
      </Link>

      <header className="page__head">
        {eyebrow && <p className="eyebrow page__eyebrow">{eyebrow}</p>}
        <h1 className="page__title">{title}</h1>
        {intro && <p className="page__intro">{intro}</p>}
      </header>

      <hr className="rule" />

      <div className="page__body">{children}</div>
    </motion.main>
  )
}
