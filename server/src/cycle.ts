import type { Phase } from './types.js'

const MS_DAY = 86_400_000

function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d); r.setDate(r.getDate() + n); return r
}

export function computePhase(
  lastPeriodStart: string | null,
  cycleLength: number,
  periodLength: number
): Phase {
  if (!lastPeriodStart) return 'unknown'
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let start = parseDate(lastPeriodStart)
  if (Number.isNaN(start.getTime())) return 'unknown'
  while (addDays(start, cycleLength) <= today) start = addDays(start, cycleLength)
  const dayOfCycle = Math.floor((today.getTime() - start.getTime()) / MS_DAY) + 1
  const ovulation = addDays(start, cycleLength - 14)
  if (dayOfCycle <= periodLength) return 'menstrual'
  if (today < addDays(ovulation, -1)) return 'follicular'
  if (today <= addDays(ovulation, 1)) return 'ovulatory'
  return 'luteal'
}
