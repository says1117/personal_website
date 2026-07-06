import PageShell from './PageShell'
import { PROJECTS } from '../data/projects'

export default function Dashboard() {
  return (
    <PageShell
      eyebrow="Tower · Command center"
      title="Dashboard"
      intro="A quick read on what I'm building, where I am, and what's next."
    >
      <div className="grid-2">
        <div className="cell">
          <div className="cell__k">Status</div>
          <div className="cell__v">
            Open to software engineering roles. Currently shipping an
            ASL-to-TTS model and refining NextPlay.
          </div>
        </div>
        <div className="cell">
          <div className="cell__k">Focus</div>
          <div className="cell__v">
            Frontend architecture, applied ML, and accessible product design.
          </div>
        </div>
        <div className="cell">
          <div className="cell__k">Active projects</div>
          <div className="cell__v">{PROJECTS.length} in flight</div>
        </div>
        <div className="cell">
          <div className="cell__k">Location</div>
          <div className="cell__v">Remote / open to relocate</div>
        </div>
      </div>
    </PageShell>
  )
}
