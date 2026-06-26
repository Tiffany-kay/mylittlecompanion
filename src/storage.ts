export type Category =
  | 'Exercise'
  | 'Meditate'
  | 'Job apps'
  | 'Build'
  | 'Cloud upskill'
  | 'Network'
  | 'Painting'
  | 'Outside'
  | 'Outreach'

export const CATEGORIES: Category[] = [
  'Exercise', 'Meditate', 'Job apps', 'Build',
  'Cloud upskill', 'Network', 'Painting', 'Outside', 'Outreach'
]

export type LogEntry = { at: string; category: Category; note?: string }

export type AppState = {
  topThree: [string, string, string]
  topThreeDate: string
  logs: LogEntry[]
  cycle: {
    lastPeriodStart: string | null
    cycleLength: number
    periodLength: number
  }
  settings: {
    morningTime: string
    name: string
  }
  nudgeShownDate: string | null
}

const KEY = 'mlc.state.v1'

export const defaultState: AppState = {
  topThree: ['', '', ''],
  topThreeDate: todayISO(),
  logs: [],
  cycle: {
    lastPeriodStart: null,
    cycleLength: 28,
    periodLength: 5
  },
  settings: {
    morningTime: '08:00',
    name: 'friend'
  },
  nudgeShownDate: null
}

export function todayISO(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...defaultState }
    const parsed = JSON.parse(raw) as Partial<AppState>
    return {
      ...defaultState,
      ...parsed,
      cycle: { ...defaultState.cycle, ...(parsed.cycle ?? {}) },
      settings: { ...defaultState.settings, ...(parsed.settings ?? {}) },
      topThree: (parsed.topThree ?? defaultState.topThree) as [string, string, string],
      logs: parsed.logs ?? []
    }
  } catch {
    return { ...defaultState }
  }
}

export function saveState(s: AppState) {
  localStorage.setItem(KEY, JSON.stringify(s))
}
