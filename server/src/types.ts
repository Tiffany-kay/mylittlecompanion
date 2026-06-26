export type Slot =
  | 'wake' | 'focus' | 'midmorning' | 'midday'
  | 'afternoon' | 'evening' | 'winddown'

export type Phase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal' | 'unknown'
export type Sass = 'gentle' | 'medium' | 'spicy'

export interface PushSubscriptionRecord {
  endpoint: string
  keys: { p256dh: string; auth: string }
  addedAt: string
}

export interface UserSettings {
  name: string
  sass: Sass
  cycle: {
    lastPeriodStart: string | null
    cycleLength: number
    periodLength: number
  }
  schedule: Record<Slot, string>
  enabled: Record<Slot, boolean>
}

export interface ServerState {
  vapid: { publicKey: string; privateKey: string } | null
  subscriptions: PushSubscriptionRecord[]
  user: UserSettings
  lastFired: Partial<Record<Slot, string>>
}
