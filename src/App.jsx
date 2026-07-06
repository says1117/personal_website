import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { TransitionProvider } from './context/TransitionContext'
import NavBar from './components/NavBar'
import TransitionOverlay from './components/TransitionOverlay'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Projects from './pages/Projects'
import Experience from './pages/Experience'

/* ============================================================
   App — top-level composition.

   <TransitionProvider> must live INSIDE the router (it uses
   useNavigate) — BrowserRouter wraps <App> in main.jsx.

   Routing model:
     "/"            → Landing (the interactive star map)
     "/dashboard"   → Dashboard
     "/about"       → About
     "/projects"    → Projects
     "/experience"  → Experience

   <AnimatePresence> drives per-page enter/exit. The masked
   "fly to planet" transition is handled separately by
   <TransitionOverlay>, which sits above everything.
   ============================================================ */

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      {/* keyed on pathname so each page mounts/unmounts cleanly */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/experience" element={<Experience />} />
        {/* Unknown routes fall back to the star map */}
        <Route path="*" element={<Landing />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <TransitionProvider>
      <NavBar />
      <AnimatedRoutes />

      {/* Masking layer for planet → page travel. Above all content. */}
      <TransitionOverlay />
    </TransitionProvider>
  )
}
