import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import type { ServerState } from './types.js'

const FILE = resolve(process.cwd(), 'data', 'state.json')

const defaults: ServerState = {
  vapid: null,
  subscriptions: [],
  user: {
    name: 'friend',
    sass: 'spicy',
    cycle: { lastPeriodStart: null, cycleLength: 28, periodLength: 5 },
    schedule: {
      wake: '05:00',
      focus: '06:00',
      midmorning: '10:00',
      midday: '13:00',
      afternoon: '15:00',
      evening: '18:00',
      winddown: '21:00'
    },
    enabled: {
      wake: true,
      focus: true,
      midmorning: true,
      midday: false,
      afternoon: false,
      evening: true,
      winddown: true
    }
  },
  lastFired: {}
}

let cache: ServerState | null = null

export function load(): ServerState {
  if (cache) return cache
  if (!existsSync(FILE)) {
    mkdirSync(dirname(FILE), { recursive: true })
    cache = structuredClone(defaults)
    save(cache)
    return cache
  }
  const raw = readFileSync(FILE, 'utf-8')
  const parsed = JSON.parse(raw) as Partial<ServerState>
  cache = {
    ...defaults,
    ...parsed,
    user: { ...defaults.user, ...(parsed.user ?? {}),
      cycle: { ...defaults.user.cycle, ...((parsed.user as any)?.cycle ?? {}) },
      schedule: { ...defaults.user.schedule, ...((parsed.user as any)?.schedule ?? {}) },
      enabled: { ...defaults.user.enabled, ...((parsed.user as any)?.enabled ?? {}) }
    },
    subscriptions: parsed.subscriptions ?? [],
    lastFired: parsed.lastFired ?? {}
  } as ServerState
  return cache
}

export function save(state: ServerState) {
  cache = state
  mkdirSync(dirname(FILE), { recursive: true })
  writeFileSync(FILE, JSON.stringify(state, null, 2))
}

export function mutate(fn: (s: ServerState) => void) {
  const s = load()
  fn(s)
  save(s)
  return s
}
