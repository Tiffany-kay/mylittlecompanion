export type Phase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal' | 'unknown'

export type CycleInfo = {
  phase: Phase
  dayOfCycle: number | null
  nextPeriodDate: string | null
  fertileStart: string | null
  fertileEnd: string | null
  ovulationDate: string | null
  inFertileWindow: boolean
}

const MS_DAY = 24 * 60 * 60 * 1000

function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function formatDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

export function computeCycle(
  lastPeriodStart: string | null,
  cycleLength: number,
  periodLength: number
): CycleInfo {
  if (!lastPeriodStart) {
    return {
      phase: 'unknown',
      dayOfCycle: null,
      nextPeriodDate: null,
      fertileStart: null,
      fertileEnd: null,
      ovulationDate: null,
      inFertileWindow: false
    }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let start = parseDate(lastPeriodStart)
  // advance start to most recent cycle start
  while (addDays(start, cycleLength) <= today) {
    start = addDays(start, cycleLength)
  }
  const dayOfCycle = Math.floor((today.getTime() - start.getTime()) / MS_DAY) + 1
  const ovulation = addDays(start, cycleLength - 14)
  const fertileStart = addDays(ovulation, -5)
  const fertileEnd = addDays(ovulation, 1)
  const nextPeriod = addDays(start, cycleLength)

  let phase: Phase
  if (dayOfCycle <= periodLength) phase = 'menstrual'
  else if (today < addDays(ovulation, -1)) phase = 'follicular'
  else if (today <= addDays(ovulation, 1)) phase = 'ovulatory'
  else phase = 'luteal'

  return {
    phase,
    dayOfCycle,
    nextPeriodDate: formatDate(nextPeriod),
    fertileStart: formatDate(fertileStart),
    fertileEnd: formatDate(fertileEnd),
    ovulationDate: formatDate(ovulation),
    inFertileWindow: today >= fertileStart && today <= fertileEnd
  }
}

export const PHASE_TIPS: Record<Phase, { mood: string; do: string; ease: string }> = {
  menstrual: {
    mood: 'Low energy is normal. Be kinder to yourself today.',
    do: 'Gentle movement, journaling, painting, planning.',
    ease: 'Skip the hard cold-outreach today if you can.'
  },
  follicular: {
    mood: 'Energy is climbing. This is your "hard things" window.',
    do: 'Job apps, cold outreach, deep build sessions, networking.',
    ease: 'Strike while the iron is hot — schedule the scary stuff here.'
  },
  ovulatory: {
    mood: 'Peak social energy and confidence.',
    do: 'Network, interviews, brand outreach, going outside.',
    ease: 'You will feel more capable than usual — trust it.'
  },
  luteal: {
    mood: 'Energy taper. Focus narrows, irritation rises.',
    do: 'Finish what you started. Cloud study, painting, admin.',
    ease: 'Avoid starting new big things. Eat well, sleep early.'
  },
  unknown: {
    mood: 'Set your last period date in Settings to unlock tips.',
    do: 'Anything that feels right today.',
    ease: ''
  }
}
