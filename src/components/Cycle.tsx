import { AppState } from '../storage'
import { CycleInfo, PHASE_TIPS } from '../cycle'

type Props = {
  state: AppState
  setState: React.Dispatch<React.SetStateAction<AppState>>
  cycle: CycleInfo
}

export default function Cycle({ state, setState, cycle }: Props) {
  const tip = PHASE_TIPS[cycle.phase]

  const update = (patch: Partial<AppState['cycle']>) => {
    setState(s => ({ ...s, cycle: { ...s.cycle, ...patch } }))
  }

  return (
    <div className="stack">
      <section className="card soft">
        <h2>your cycle</h2>
        {cycle.phase === 'unknown' ? (
          <p className="muted">add your last period start below to see your phase.</p>
        ) : (
          <>
            <p><strong>phase:</strong> {cycle.phase} (day {cycle.dayOfCycle})</p>
            <p><strong>next period:</strong> {cycle.nextPeriodDate}</p>
            <p><strong>ovulation (est.):</strong> {cycle.ovulationDate}</p>
            <p><strong>fertile window:</strong> {cycle.fertileStart} → {cycle.fertileEnd}</p>
            <p className={cycle.inFertileWindow ? 'flag-warn' : 'flag-ok'}>
              {cycle.inFertileWindow
                ? '⚠ you’re likely in your fertile window'
                : '✓ today is outside the predicted fertile window'}
            </p>
          </>
        )}
      </section>

      {cycle.phase !== 'unknown' && (
        <section className="card">
          <h2>for this phase</h2>
          <p><em>mood:</em> {tip.mood}</p>
          <p><em>lean into:</em> {tip.do}</p>
          {tip.ease && <p><em>be kind:</em> {tip.ease}</p>}
        </section>
      )}

      <section className="card">
        <h2>set your cycle</h2>
        <label className="field">
          last period start
          <input
            type="date"
            value={state.cycle.lastPeriodStart ?? ''}
            onChange={e => update({ lastPeriodStart: e.target.value || null })}
          />
        </label>
        <label className="field">
          cycle length (days)
          <input
            type="number" min={20} max={45}
            value={state.cycle.cycleLength}
            onChange={e => update({ cycleLength: Number(e.target.value) })}
          />
        </label>
        <label className="field">
          period length (days)
          <input
            type="number" min={1} max={10}
            value={state.cycle.periodLength}
            onChange={e => update({ periodLength: Number(e.target.value) })}
          />
        </label>
      </section>

      <section className="card disclaimer">
        <p>
          <strong>a gentle reminder:</strong> fertile-window predictions are estimates based on a 28-day model
          and do not replace contraception. cycles vary, and ovulation can shift. please don’t use this as
          birth control.
        </p>
      </section>
    </div>
  )
}
