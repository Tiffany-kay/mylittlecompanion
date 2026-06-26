import { useEffect, useState } from 'react'
import { AppState } from '../storage'
import {
  api, getPushState, subscribeToPush, unsubscribeFromPush,
  ServerSettings, Sass, Slot
} from '../api'

type Props = {
  state: AppState
  setState: React.Dispatch<React.SetStateAction<AppState>>
  onRequestPerm: () => Promise<void>
  onTestNudge: () => Promise<void>
}

const SLOT_LABEL: Record<Slot, string> = {
  wake: 'wake up',
  focus: 'morning focus',
  midmorning: 'mid-morning',
  midday: 'lunch / body check',
  afternoon: 'afternoon push',
  evening: 'evening reflect',
  winddown: 'wind down'
}

const SASS_OPTIONS: { value: Sass; label: string; sub: string }[] = [
  { value: 'gentle', label: 'gentle', sub: 'soft. no edges. your friend who listens.' },
  { value: 'medium', label: 'medium', sub: 'warm but direct. your level-headed bestie.' },
  { value: 'spicy', label: 'spicy', sub: 'tough love. teases you. loves you anyway.' }
]

export default function Settings({ state, setState, onRequestPerm, onTestNudge }: Props) {
  const perm = typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  const [server, setServer] = useState<ServerSettings | null>(null)
  const [pushSub, setPushSub] = useState<{ subscribed: boolean; endpoint?: string }>({ subscribed: false })
  const [busy, setBusy] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const updateLocal = (patch: Partial<AppState['settings']>) => {
    setState(s => ({ ...s, settings: { ...s.settings, ...patch } }))
  }

  const refresh = async () => {
    try {
      const [s, ps] = await Promise.all([api.getSettings(), getPushState()])
      setServer(s)
      setPushSub(ps)
      setErr(null)
    } catch (e: any) {
      setErr('backend not reachable. is the server running on :4000?')
    }
  }

  useEffect(() => { void refresh() }, [])

  // mirror local cycle + name to server whenever they change
  useEffect(() => {
    if (!server) return
    void api.patchSettings({
      name: state.settings.name,
      cycle: state.cycle
    }).then(() => refresh()).catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.settings.name, state.cycle.lastPeriodStart, state.cycle.cycleLength, state.cycle.periodLength])

  const enablePush = async () => {
    setBusy('enable')
    try {
      if (perm !== 'granted') await onRequestPerm()
      await subscribeToPush()
      await refresh()
    } catch (e: any) {
      setErr(e?.message ?? 'failed to subscribe')
    } finally { setBusy(null) }
  }

  const disablePush = async () => {
    setBusy('disable')
    try { await unsubscribeFromPush(); await refresh() } finally { setBusy(null) }
  }

  const setSass = async (sass: Sass) => {
    await api.patchSettings({ sass })
    await refresh()
  }

  const setSlotTime = async (slot: Slot, time: string) => {
    await api.patchSettings({ schedule: { [slot]: time } as any })
    await refresh()
  }

  const toggleSlot = async (slot: Slot, enabled: boolean) => {
    await api.patchSettings({ enabled: { [slot]: enabled } as any })
    await refresh()
  }

  const testSlot = async (slot: Slot) => {
    setBusy('test-' + slot)
    try { await api.testNudge(slot) } finally { setBusy(null) }
  }

  return (
    <div className="stack">
      <section className="card soft">
        <h2>about you</h2>
        <label className="field">
          what should i call you?
          <input
            value={state.settings.name}
            onChange={e => updateLocal({ name: e.target.value })}
            placeholder="friend"
          />
        </label>
      </section>

      <section className="card">
        <h2>push notifications</h2>
        <p className="muted small">browser permission: {perm}</p>
        <p className="muted small">
          subscribed devices: {server?.subscriptionsCount ?? '—'}{pushSub.subscribed ? ' (this one is in)' : ''}
        </p>
        {err && <p className="flag-warn small">{err}</p>}
        <div className="row">
          {!pushSub.subscribed ? (
            <button onClick={enablePush} disabled={busy === 'enable'}>
              {busy === 'enable' ? 'enabling…' : 'enable nudges on this device'}
            </button>
          ) : (
            <button onClick={disablePush} disabled={busy === 'disable'} className="danger">
              {busy === 'disable' ? 'disabling…' : 'disable on this device'}
            </button>
          )}
          <button onClick={onTestNudge}>test local notification</button>
        </div>
        <p className="muted small">
          push nudges fire even when this app is closed, as long as your phone has internet.
          you can subscribe multiple devices.
        </p>
      </section>

      {server && (
        <>
          <section className="card">
            <h2>vibe</h2>
            <div className="sass-grid">
              {SASS_OPTIONS.map(s => (
                <button
                  key={s.value}
                  className={`sass ${server.user.sass === s.value ? 'on' : ''}`}
                  onClick={() => setSass(s.value)}
                >
                  <div className="sass-label">{s.label}</div>
                  <div className="sass-sub">{s.sub}</div>
                </button>
              ))}
            </div>
          </section>

          <section className="card">
            <h2>nudge schedule</h2>
            <p className="muted small">toggle each one on/off. set the time. send a test.</p>
            {(Object.keys(SLOT_LABEL) as Slot[]).map(slot => (
              <div className="slot-row" key={slot}>
                <label className="slot-toggle">
                  <input
                    type="checkbox"
                    checked={server.user.enabled[slot]}
                    onChange={e => toggleSlot(slot, e.target.checked)}
                  />
                  <span>{SLOT_LABEL[slot]}</span>
                </label>
                <input
                  type="time"
                  value={server.user.schedule[slot]}
                  onChange={e => setSlotTime(slot, e.target.value)}
                  disabled={!server.user.enabled[slot]}
                />
                <button
                  className="ghost"
                  onClick={() => testSlot(slot)}
                  disabled={busy === 'test-' + slot}
                >test</button>
              </div>
            ))}
          </section>
        </>
      )}

      <section className="card">
        <h2>data</h2>
        <p className="muted small">local logs live on this device. push subscription + schedule live on the server.</p>
        <button
          className="danger"
          onClick={() => {
            if (confirm('clear local data on this device? (push subscription stays — disable that separately)')) {
              localStorage.clear()
              location.reload()
            }
          }}
        >clear local data</button>
      </section>
    </div>
  )
}
