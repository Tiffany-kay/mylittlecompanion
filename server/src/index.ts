import express from 'express'
import cors from 'cors'
import webpush from 'web-push'
import { load, mutate } from './db.js'
import { start as startScheduler, fireSlot } from './scheduler.js'
import type { Slot } from './types.js'

function ensureVapid() {
  const envPub = process.env.VAPID_PUBLIC_KEY
  const envPriv = process.env.VAPID_PRIVATE_KEY
  if (envPub && envPriv) {
    const keys = { publicKey: envPub, privateKey: envPriv }
    mutate(s => { s.vapid = keys })
    console.log('VAPID keys loaded from environment')
    return keys
  }
  const s = load()
  if (s.vapid) return s.vapid
  const keys = webpush.generateVAPIDKeys()
  mutate(st => { st.vapid = keys })
  console.log('generated new VAPID keys (saved to data/state.json)')
  console.log('IMPORTANT: in production set VAPID_PUBLIC_KEY + VAPID_PRIVATE_KEY env vars so keys survive redeploys.')
  return keys
}

const allowList = (process.env.FRONTEND_ORIGIN ?? '*')
  .split(',').map(s => s.trim()).filter(Boolean)

const app = express()
app.use(cors({
  origin: allowList.includes('*') ? true : allowList
}))
app.use(express.json({ limit: '64kb' }))

app.get('/api/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }))

app.get('/api/vapid-public', (_req, res) => {
  const v = ensureVapid()
  res.json({ key: v.publicKey })
})

app.post('/api/subscribe', (req, res) => {
  const sub = req.body?.subscription
  if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) {
    return res.status(400).json({ error: 'invalid subscription' })
  }
  mutate(s => {
    const existing = s.subscriptions.findIndex(x => x.endpoint === sub.endpoint)
    const record = { endpoint: sub.endpoint, keys: sub.keys, addedAt: new Date().toISOString() }
    if (existing >= 0) s.subscriptions[existing] = record
    else s.subscriptions.push(record)
  })
  res.json({ ok: true })
})

app.post('/api/unsubscribe', (req, res) => {
  const endpoint = req.body?.endpoint
  if (!endpoint) return res.status(400).json({ error: 'missing endpoint' })
  mutate(s => { s.subscriptions = s.subscriptions.filter(x => x.endpoint !== endpoint) })
  res.json({ ok: true })
})

app.get('/api/settings', (_req, res) => {
  const s = load()
  res.json({ user: s.user, subscriptionsCount: s.subscriptions.length, lastFired: s.lastFired })
})

app.post('/api/settings', (req, res) => {
  const patch = req.body ?? {}
  mutate(s => {
    if (patch.name !== undefined) s.user.name = String(patch.name).slice(0, 40) || 'friend'
    if (patch.sass) s.user.sass = patch.sass
    if (patch.cycle) s.user.cycle = { ...s.user.cycle, ...patch.cycle }
    if (patch.schedule) s.user.schedule = { ...s.user.schedule, ...patch.schedule }
    if (patch.enabled) s.user.enabled = { ...s.user.enabled, ...patch.enabled }
  })
  const s = load()
  res.json({ ok: true, user: s.user })
})

app.post('/api/test-nudge', async (req, res) => {
  const slot = (req.body?.slot ?? 'focus') as Slot
  const sent = await fireSlot(slot, { force: true })
  res.json({ ok: true, sent })
})

const PORT = Number(process.env.PORT ?? 4000)
ensureVapid()
startScheduler()
app.listen(PORT, '0.0.0.0', () => {
  console.log(`server up on port ${PORT}`)
  if (!allowList.includes('*')) console.log(`CORS allow: ${allowList.join(', ')}`)
})
