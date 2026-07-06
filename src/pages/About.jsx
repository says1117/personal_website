import PageShell from './PageShell'

export default function About() {
  return (
    <PageShell
      eyebrow="Europa · Profile"
      title="About"
      intro="I'm Steven Yodice-Smith — a software engineer who likes building things that are fast, legible, and genuinely useful."
    >
      <div className="grid-2">
        <div className="cell">
          <div className="cell__k">How I work</div>
          <div className="cell__v">
            Start from the user's problem, ship a sharp first version, then
            iterate with real feedback. I care about details that hold up.
          </div>
        </div>
        <div className="cell">
          <div className="cell__k">What I reach for</div>
          <div className="cell__v">
            React & TypeScript on the frontend, Python for ML, and whatever
            backend fits the job.
          </div>
        </div>
        <div className="cell">
          <div className="cell__k">Beyond code</div>
          <div className="cell__v">
            Accessibility-minded design and a long-running interest in tools
            that make communication easier.
          </div>
        </div>
        <div className="cell">
          <div className="cell__k">Get in touch</div>
          <div className="cell__v">
            <a
              href="mailto:saysschool4321@gmail.com"
              style={{ color: 'var(--accent)' }}
            >
              saysschool4321@gmail.com
            </a>
          </div>
        </div>
      </div>

      <p className="page__credit">
        Planet textures ©{' '}
        <a
          href="https://www.solarsystemscope.com/textures/"
          target="_blank"
          rel="noreferrer noopener"
        >
          Solar System Scope
        </a>{' '}
        (CC BY 4.0), derived from NASA imagery. Planet art rendered originally
        in WebGL. Experience-page dusk parallax art and sci-fi props by{' '}
        <a href="https://opengameart.org/content/mountain-at-dusk-background" target="_blank" rel="noreferrer noopener">
          ansimuz
        </a>{' '}
        (CC0); Utahraptor run cycle —{' '}
        <a href="https://opengameart.org/content/2d-raptor-running-fbx-animation" target="_blank" rel="noreferrer noopener">
          animation by kestrelm, artwork by Fred Wierum
        </a>{' '}
        (CC BY-SA 4.0, via OpenGameArt).
      </p>
    </PageShell>
  )
}
