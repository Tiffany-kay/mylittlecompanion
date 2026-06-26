export type Slot =
  | 'wake' | 'focus' | 'midmorning' | 'midday'
  | 'afternoon' | 'evening' | 'winddown'

export type Sass = 'gentle' | 'medium' | 'spicy'

export interface ServerUser {
  name: string
  sass: Sass
  cycle: { lastPeriodStart: string | null; cycleLength: number; periodLength: number }
  schedule: Record<Slot, string>
  enabled: Record<Slot, boolean>
}

export interface ServerSettings {
  user: ServerUser
  subscriptionsCount: number
  lastFired: Partial<Record<Slot, string>>
}

const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')
const u = (path: string) => API_BASE + path

async function j<T>(p: Promise<Response>): Promise<T> {
  const r = await p
  if (!r.ok) throw new Error(`api ${r.status}`)
  return r.json() as Promise<T>
}

export const api = {
  vapidPublic: () => j<{ key: string }>(fetch(u('/api/vapid-public'))),
  subscribe: (subscription: PushSubscriptionJSON) =>
    j<{ ok: true }>(fetch(u('/api/subscribe'), {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ subscription })
    })),
  unsubscribe: (endpoint: string) =>
    j<{ ok: true }>(fetch(u('/api/unsubscribe'), {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ endpoint })
    })),
  getSettings: () => j<ServerSettings>(fetch(u('/api/settings'))),
  patchSettings: (patch: Partial<ServerUser>) =>
    j<{ ok: true; user: ServerUser }>(fetch(u('/api/settings'), {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify(patch)
    })),
  testNudge: (slot: Slot) =>
    j<{ ok: true; sent: number }>(fetch(u('/api/test-nudge'), {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ slot })
    }))
}

function urlBase64ToArrayBuffer(b64: string): ArrayBuffer {
  const pad = '='.repeat((4 - b64.length % 4) % 4)
  const base64 = (b64 + pad).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const buf = new ArrayBuffer(raw.length)
  const view = new Uint8Array(buf)
  for (let i = 0; i < raw.length; i++) view[i] = raw.charCodeAt(i)
  return buf
}

export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null
  const reg = await navigator.serviceWorker.ready
  let sub = await reg.pushManager.getSubscription()
  if (!sub) {
    const { key } = await api.vapidPublic()
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToArrayBuffer(key)
    })
  }
  await api.subscribe(sub.toJSON() as PushSubscriptionJSON)
  return sub
}

export async function unsubscribeFromPush(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) return false
  const reg = await navigator.serviceWorker.getRegistration()
  const sub = await reg?.pushManager.getSubscription()
  if (!sub) return false
  await api.unsubscribe(sub.endpoint)
  await sub.unsubscribe()
  return true
}

export async function getPushState(): Promise<{ subscribed: boolean; endpoint?: string }> {
  if (!('serviceWorker' in navigator)) return { subscribed: false }
  const reg = await navigator.serviceWorker.getRegistration()
  const sub = await reg?.pushManager.getSubscription()
  if (!sub) return { subscribed: false }
  return { subscribed: true, endpoint: sub.endpoint }
}
