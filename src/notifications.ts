export async function ensurePermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied'
  if (Notification.permission === 'default') {
    return await Notification.requestPermission()
  }
  return Notification.permission
}

export async function showNudge(title: string, body: string) {
  const perm = await ensurePermission()
  if (perm !== 'granted') return false
  try {
    const reg = await navigator.serviceWorker?.getRegistration()
    if (reg) {
      await reg.showNotification(title, {
        body,
        icon: '/icon.svg',
        badge: '/icon.svg',
        tag: 'morning-nudge'
      })
    } else {
      new Notification(title, { body, icon: '/icon.svg' })
    }
    return true
  } catch {
    return false
  }
}

export function isAfterMorningTime(morningTime: string): boolean {
  const [h, m] = morningTime.split(':').map(Number)
  const now = new Date()
  const target = new Date()
  target.setHours(h, m, 0, 0)
  return now >= target
}
