import PageShell from './PageShell'
import { PROJECTS } from '../data/projects'

export default function Projects() {
  return (
    <PageShell
      eyebrow="Nessus · Selected work"
      title="Projects"
      intro="A few things I've built recently. Each one started as a real problem worth solving."
    >
      <div className="project-list">
        {PROJECTS.map((p) => (
          <article className="project" key={p.id}>
            <div>
              <h2 className="project__title">{p.title}</h2>
              <p className="project__summary">{p.summary}</p>
              <p className="project__detail">{p.detail}</p>

              <ul className="stack">
                {p.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>

              {p.links?.length > 0 && (
                <div className="project__links">
                  {p.links.map((l) => (
                    <a key={l.label} href={l.href}>
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="project__meta">
              <div>{p.year}</div>
              <div>{p.role}</div>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  )
}
