import cron from 'node-cron'
import webpush from 'web-push'
import { load, mutate } from './db.js'
import { computePhase } from './cycle.js'
import { pickMessage } from './messages.js'
import type { Slot } from './types.js'

function todayISO(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function currentHHMM(): string {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export async function fireSlot(slot: Slot, options: { force?: boolean } = {}) {
  const state = load()
  if (!state.vapid) { console.warn('no VAPID keys configured'); return 0 }
  if (!state.subscriptions.length) { console.warn(`[${slot}] no subscriptions`); return 0 }

  const phase = computePhase(
    state.user.cycle.lastPeriodStart,
    state.user.cycle.cycleLength,
    state.user.cycle.periodLength
  )
  const msg = pickMessage(slot, state.user.sass, phase, state.user.name)

  webpush.setVapidDetails(
    'mailto:nudge@mylittlecompanion.local',
    state.vapid.publicKey,
    state.vapid.privateKey
  )

  const payload = JSON.stringify({ ...msg, slot, url: '/' })
  const dead: string[] = []
  let sent = 0
  await Promise.all(state.subscriptions.map(async sub => {
    try {
      await webpush.sendNotification({ endpoint: sub.endpoint, keys: sub.keys }, payload)
      sent++
    } catch (err: any) {
      console.warn(`[${slot}] push failed for ${sub.endpoint.slice(0, 40)}…`, err?.statusCode || err?.message)
      if (err?.statusCode === 404 || err?.statusCode === 410) dead.push(sub.endpoint)
    }
  }))
  if (dead.length) {
    mutate(s => { s.subscriptions = s.subscriptions.filter(x => !dead.includes(x.endpoint)) })
  }
  if (!options.force) {
    mutate(s => { s.lastFired[slot] = todayISO() })
  }
  console.log(`[${slot}] sent ${sent} push(es) :: ${msg.title} — ${msg.body}`)
  return sent
}

export function start() {
  cron.schedule('* * * * *', async () => {
    const state = load()
    const hhmm = currentHHMM()
    const today = todayISO()
    for (const [slot, time] of Object.entries(state.user.schedule) as [Slot, string][]) {
      if (!state.user.enabled[slot]) continue
      if (time !== hhmm) continue
      if (state.lastFired[slot] === today) continue
      await fireSlot(slot)
    }
  })
  console.log('cron started — checking every minute')
}
