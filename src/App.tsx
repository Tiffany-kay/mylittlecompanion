import { useEffect, useMemo, useState } from 'react'
import { loadState, saveState, todayISO, AppState } from './storage'
import { computeCycle, PHASE_TIPS } from './cycle'
import { showNudge, isAfterMorningTime, ensurePermission } from './notifications'
import Today from './components/Today'
import Cycle from './components/Cycle'
import Settings from './components/Settings'

type Tab = 'today' | 'cycle' | 'settings'

export default function App() {
  const [state, setState] = useState<AppState>(() => loadState())
  const [tab, setTab] = useState<Tab>('today')

  useEffect(() => { saveState(state) }, [state])

  const cycle = useMemo(
    () => computeCycle(state.cycle.lastPeriodStart, state.cycle.cycleLength, state.cycle.periodLength),
    [state.cycle]
  )

  // morning nudge: fire once per day after the configured time, if permission granted
  useEffect(() => {
    const today = todayISO()
    if (state.nudgeShownDate === today) return
    if (!isAfterMorningTime(state.settings.morningTime)) return
    const tip = PHASE_TIPS[cycle.phase]
    const name = state.settings.name || 'friend'
    const title = `good morning, ${name} 🌷`
    const body = tip.mood + (state.topThree[0] ? `  Top of the list: ${state.topThree[0]}` : '  What is the one thing today?')
    showNudge(title, body).then(ok => {
      if (ok) setState(s => ({ ...s, nudgeShownDate: today }))
    })
  }, [state.settings.morningTime, state.nudgeShownDate, cycle.phase, state.settings.name, state.topThree])

  // reset top three when day rolls over
  useEffect(() => {
    const today = todayISO()
    if (state.topThreeDate !== today) {
      setState(s => ({ ...s, topThree: ['', '', ''], topThreeDate: today }))
    }
  }, [state.topThreeDate])

  const greeting = useMemo(() => {
    const h = new Date().getHours()
    if (h < 12) return 'good morning'
    if (h < 17) return 'good afternoon'
    return 'good evening'
  }, [])

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-text">
          <h1>{greeting}, {state.settings.name} 🌷</h1>
          <p className="phase-line">
            {cycle.phase === 'unknown'
              ? 'no cycle set yet — peek at Settings whenever you’re ready'
              : `you’re in the ${cycle.phase} phase (day ${cycle.dayOfCycle}) — ${PHASE_TIPS[cycle.phase].mood.toLowerCase()}`}
          </p>
        </div>
      </header>

      <nav className="tabs">
        <button className={tab==='today'?'on':''} onClick={() => setTab('today')}>today</button>
        <button className={tab==='cycle'?'on':''} onClick={() => setTab('cycle')}>cycle</button>
        <button className={tab==='settings'?'on':''} onClick={() => setTab('settings')}>settings</button>
      </nav>

      <main>
        {tab === 'today' && <Today state={state} setState={setState} cycle={cycle} />}
        {tab === 'cycle' && <Cycle state={state} setState={setState} cycle={cycle} />}
        {tab === 'settings' && (
          <Settings
            state={state}
            setState={setState}
            onRequestPerm={async () => { await ensurePermission() }}
            onTestNudge={async () => {
              const name = state.settings.name || 'friend'
              await showNudge(`hi ${name} 🌷`, 'this is what your morning nudge will feel like.')
            }}
          />
        )}
      </main>

      <footer className="foot">made with care · v0.1</footer>
    </div>
  )
}
