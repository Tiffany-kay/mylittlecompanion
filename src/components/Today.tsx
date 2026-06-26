import { AppState, CATEGORIES, Category, todayISO } from '../storage'
import { CycleInfo, PHASE_TIPS } from '../cycle'

type Props = {
  state: AppState
  setState: React.Dispatch<React.SetStateAction<AppState>>
  cycle: CycleInfo
}

export default function Today({ state, setState, cycle }: Props) {
  const tip = PHASE_TIPS[cycle.phase]
  const today = todayISO()
  const todaysLogs = state.logs.filter(l => l.at.startsWith(today))

  const updateTop = (i: number, v: string) => {
    setState(s => {
      const next = [...s.topThree] as [string, string, string]
      next[i] = v
      return { ...s, topThree: next, topThreeDate: today }
    })
  }

  const logCategory = (c: Category) => {
    setState(s => ({
      ...s,
      logs: [{ at: new Date().toISOString(), category: c }, ...s.logs].slice(0, 500)
    }))
  }

  const filledCount = state.topThree.filter(t => t.trim()).length

  return (
    <div className="stack">
      <section className="card soft">
        <h2>your three for today</h2>
        <p className="muted small">{tip.do}</p>
        {[0, 1, 2].map(i => (
          <input
            key={i}
            className="big-input"
            placeholder={i === 0 ? 'the one thing…' : i === 1 ? 'and…' : 'and…'}
            value={state.topThree[i]}
            onChange={e => updateTop(i, e.target.value)}
          />
        ))}
        {filledCount >= 3 && (
          <div className="gentle-note">
            three is enough. close the app. begin.
          </div>
        )}
        {tip.ease && (
          <div className="ease-note">🤍 {tip.ease}</div>
        )}
      </section>

      <section className="card">
        <h2>i just…</h2>
        <p className="muted small">tap to log, no judgment.</p>
        <div className="chip-grid">
          {CATEGORIES.map(c => (
            <button key={c} className="chip" onClick={() => logCategory(c)}>{c}</button>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>today, so far</h2>
        {todaysLogs.length === 0 ? (
          <p className="muted">nothing logged yet — and that's okay.</p>
        ) : (
          <ul className="log-list">
            {todaysLogs.map((l, i) => (
              <li key={i}>
                <span className="dot" />
                <strong>{l.category}</strong>
                <span className="muted small"> · {new Date(l.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
