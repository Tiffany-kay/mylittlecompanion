import type { Phase, Sass, Slot } from './types.js'

interface Template {
  slot: Slot
  sass: Sass[]
  phases?: Phase[]
  title: string
  body: string
}

// {name} placeholder is replaced at send time.
const BANK: Template[] = [
  // ---------- WAKE 05:00 ----------
  { slot: 'wake', sass: ['spicy'], title: '5am.', body: 'up. yes, you. don\'t make this weird, {name}.' },
  { slot: 'wake', sass: ['spicy'], title: 'oh hey.', body: 'we agreed on 5. it is 5. respect the contract.' },
  { slot: 'wake', sass: ['spicy'], title: 'rise.', body: '{name}. the soft life still requires getting up.' },
  { slot: 'wake', sass: ['spicy'], phases: ['follicular'], title: '5am + follicular.', body: 'this is your villain origin arc, {name}. up.' },
  { slot: 'wake', sass: ['spicy'], phases: ['ovulatory'], title: 'magnetic week.', body: 'people respond to you better right now. don\'t sleep through it. literally.' },
  { slot: 'wake', sass: ['spicy'], phases: ['menstrual'], title: 'gentle 5am.', body: 'tea, slow stretch, no scroll. you can do hard things later, {name}.' },
  { slot: 'wake', sass: ['spicy'], phases: ['luteal'], title: 'soft start.', body: 'luteal taper is real. ten min stretch, then we go, {name}.' },
  { slot: 'wake', sass: ['medium'], title: 'good morning, {name}.', body: 'world isn\'t going to organize itself. ten minutes to feet on floor.' },
  { slot: 'wake', sass: ['medium'], title: 'up.', body: 'water first. phone last. you know the order.' },
  { slot: 'wake', sass: ['gentle'], title: 'soft hello, {name}.', body: 'one slow breath. one stretch. then we begin.' },
  { slot: 'wake', sass: ['gentle'], title: 'morning.', body: 'take your time waking. i\'ll be here.' },

  // ---------- FOCUS 06:00 (top three) ----------
  { slot: 'focus', sass: ['spicy'], title: 'pick three.', body: 'open the app, name your top three, close it, start one. that\'s the whole move, {name}.' },
  { slot: 'focus', sass: ['spicy'], title: 'don\'t freestyle today.', body: 'three things. or the day picks them for you and you won\'t like it.' },
  { slot: 'focus', sass: ['spicy'], phases: ['follicular'], title: 'hard things window.', body: 'cold outreach goes ON the list, {name}. not "later." today.' },
  { slot: 'focus', sass: ['spicy'], phases: ['ovulatory'], title: 'send the scary email.', body: 'you know which one. this is the week. put it on the three.' },
  { slot: 'focus', sass: ['spicy'], phases: ['menstrual'], title: 'soft three.', body: 'meditation goes before the job apps today. trust the body.' },
  { slot: 'focus', sass: ['spicy'], phases: ['luteal'], title: 'finish, don\'t start.', body: 'pick three things to CLOSE today. no new openings, {name}.' },
  { slot: 'focus', sass: ['medium'], title: 'morning focus.', body: 'name your three. small ones count.' },
  { slot: 'focus', sass: ['medium'], title: 'top three.', body: 'pick what would feel good to finish today. that\'s the bar.' },
  { slot: 'focus', sass: ['gentle'], title: 'gentle focus.', body: 'what would today feel like if it went well? pick one of those.' },

  // ---------- MIDMORNING 10:00 ----------
  { slot: 'midmorning', sass: ['spicy'], title: 'four hours in.', body: 'what have we actually done besides exist, {name}?' },
  { slot: 'midmorning', sass: ['spicy'], title: 'creator app check.', body: 'the build isn\'t going to build itself, babe.' },
  { slot: 'midmorning', sass: ['spicy'], title: 'cloud tabs.', body: 'your unfinished cloud course is crying. open one module. fifteen min.' },
  { slot: 'midmorning', sass: ['spicy'], title: 'move now.', body: 'exercise window closes if you keep saying "in a sec." get up, {name}.' },
  { slot: 'midmorning', sass: ['spicy'], phases: ['follicular'], title: 'use this energy.', body: 'follicular = momentum is free. spend it on the hardest thing on your list.' },
  { slot: 'midmorning', sass: ['spicy'], phases: ['ovulatory'], title: 'send it.', body: 'DM the brand. apply to the job. post the thing. confidence is on tap right now.' },
  { slot: 'midmorning', sass: ['medium'], title: 'mid-morning check.', body: 'which of your three are you on, {name}? if zero — pick the easiest, just start it.' },
  { slot: 'midmorning', sass: ['gentle'], title: 'how\'s it going?', body: 'no pressure. just checking. one small win counts.' },

  // ---------- MIDDAY 13:00 ----------
  { slot: 'midday', sass: ['spicy'], title: 'lunch.', body: 'real food. not vibes. not coffee with hope, {name}.' },
  { slot: 'midday', sass: ['spicy'], title: 'hydrated or delulu?', body: 'check. drink water. then we talk.' },
  { slot: 'midday', sass: ['spicy'], title: 'body check.', body: 'one word: body. one word: mood. one word: energy. tell yourself the truth.' },
  { slot: 'midday', sass: ['medium'], title: 'midday pause.', body: 'eat. step outside if you can. ten minutes resets a lot.' },
  { slot: 'midday', sass: ['gentle'], title: 'lunch, love.', body: 'something warm if you can. you\'re doing fine.' },

  // ---------- AFTERNOON 15:00 ----------
  { slot: 'afternoon', sass: ['spicy'], title: '3pm slump alert.', body: 'five min outside OR ten pushups. pick one, {name}. don\'t doom-scroll through it.' },
  { slot: 'afternoon', sass: ['spicy'], title: 'still time.', body: 'one thing. doesn\'t need to be big. you\'re not done with today yet.' },
  { slot: 'afternoon', sass: ['spicy'], title: 'job apps.', body: 'what\'s the smallest possible move right now? open a tab. paste your resume. that\'s it.' },
  { slot: 'afternoon', sass: ['spicy'], phases: ['ovulatory'], title: 'go networking.', body: 'reply to someone. send the dm. you\'re at peak charm this week.' },
  { slot: 'afternoon', sass: ['spicy'], phases: ['luteal'], title: 'close one loop.', body: 'pick something already in progress and finish it. don\'t open new tabs, {name}.' },
  { slot: 'afternoon', sass: ['medium'], title: 'afternoon push.', body: 'one focused 25 min. then a real break. you got this.' },
  { slot: 'afternoon', sass: ['gentle'], title: 'soft afternoon.', body: 'painting? journaling? a walk? whichever fits.' },

  // ---------- EVENING 18:00 ----------
  { slot: 'evening', sass: ['spicy'], title: 'evening, honest check.', body: 'what did you actually do today, {name}? be honest, not mean.' },
  { slot: 'evening', sass: ['spicy'], title: 'celebrate something.', body: 'you logged a meditate? incredible. you sent one email? historic. count the wins.' },
  { slot: 'evening', sass: ['spicy'], title: 'pre-pick tomorrow.', body: 'pick tomorrow\'s top three now while you remember. morning-you will thank present-you.' },
  { slot: 'evening', sass: ['spicy'], phases: ['follicular','ovulatory'], title: 'one more move?', body: 'good energy today. one quick networking message before dinner? send and forget.' },
  { slot: 'evening', sass: ['medium'], title: 'evening review.', body: 'what worked today? what to repeat? what to leave behind?' },
  { slot: 'evening', sass: ['gentle'], title: 'soft evening.', body: 'wind it down slowly. nothing is on fire.' },

  // ---------- WINDDOWN 21:00 ----------
  { slot: 'winddown', sass: ['spicy'], title: 'close the laptop.', body: 'you\'re not solving capitalism tonight, {name}.' },
  { slot: 'winddown', sass: ['spicy'], title: 'phone away.', body: 'read something. dim the lights. you know the drill.' },
  { slot: 'winddown', sass: ['spicy'], title: 'skincare. water. bed.', body: 'nothing more is happening tonight. lights out.' },
  { slot: 'winddown', sass: ['spicy'], phases: ['luteal','menstrual'], title: 'sleep earlier tonight.', body: 'don\'t fight your body, {name}. you need it.' },
  { slot: 'winddown', sass: ['medium'], title: 'wind down.', body: 'one small grateful thought. tomorrow is fresh.' },
  { slot: 'winddown', sass: ['gentle'], title: 'rest now, love.', body: 'you did enough today. just by being here.' }
]

function shuffle<T>(a: T[]): T[] {
  return a.slice().sort(() => Math.random() - 0.5)
}

export function pickMessage(slot: Slot, sass: Sass, phase: Phase, name: string): { title: string; body: string } {
  // pool 1: matches slot + sass + phase
  let pool = BANK.filter(t => t.slot === slot && t.sass.includes(sass) && t.phases?.includes(phase))
  // pool 2: matches slot + sass + no phase requirement
  if (!pool.length) pool = BANK.filter(t => t.slot === slot && t.sass.includes(sass) && !t.phases)
  // pool 3: any sass for the slot, no phase requirement
  if (!pool.length) pool = BANK.filter(t => t.slot === slot && !t.phases)
  // pool 4: anything in the slot
  if (!pool.length) pool = BANK.filter(t => t.slot === slot)
  if (!pool.length) return { title: 'hey.', body: 'check in with yourself, {name}.'.replace('{name}', name) }
  const pick = shuffle(pool)[0]
  return {
    title: pick.title.replaceAll('{name}', name),
    body: pick.body.replaceAll('{name}', name)
  }
}
