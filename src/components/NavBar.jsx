import { NavLink, useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '../data/destinations'
import GlitchHeadline from './GlitchHeadline'
import './NavBar.css'

/* ============================================================
   NavBar — persistent header with the name, the cycling glitch
   one-liner, and the section nav. The brand links home (the
   star map). Nav uses NavLink so the active section is marked.
   ============================================================ */

export default function NavBar() {
  const { pathname } = useLocation()
  const onLanding = pathname === '/'

  return (
    <header className={`nav${onLanding ? ' nav--overlay' : ''}`}>
      <div className="shell nav__inner">
        <NavLink to="/" className="nav__brand" aria-label="Home — star map">
          <span className="nav__name">Steven Yodice-Smith</span>
          <span className="nav__tag">
            <GlitchHeadline />
          </span>
        </NavLink>

        <nav className="nav__links" aria-label="Sections">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.route}
              to={item.route}
              className={({ isActive }) =>
                `nav__link${isActive ? ' is-active' : ''}`
              }
            >
              {item.section}
            </NavLink>
          ))}
        </nav>
      </div>
      {!onLanding && <hr className="rule" />}
    </header>
  )
}
