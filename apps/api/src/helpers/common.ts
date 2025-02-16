import { format } from 'date-fns'

export async function wait(delay: number) {
  return new Promise(resolve => setTimeout(resolve, delay))
}

type HandlePromiseError = {
  message: string
  status?: number
}

export async function handlePromise<T>(
  promise: Promise<T>
): Promise<[T?, HandlePromiseError?]> {
  try {
    const value = await promise
    return [value]
  } catch (e) {
    const err = e as HandlePromiseError
    const error = {
      message: err.message || 'Something went wrong',
      status: err.status
    }
    return [undefined, error]
  }
}

export function isTruthy<T>(value?: T | undefined | null | false): value is T {
  return !!value
}

export function convertHoursToReadableFormat(timeInHours: number) {
  const hoursInDay = 24
  const hoursInWeek = hoursInDay * 7
  const hoursInMonth = hoursInWeek * 4

  const months = Math.floor(timeInHours / hoursInMonth)
  const weeks = Math.floor((timeInHours % hoursInMonth) / hoursInWeek)
  const days = Math.floor((timeInHours % hoursInWeek) / hoursInDay)
  const hours = timeInHours % hoursInDay

  const parts = []
  if (months) parts.push(`${months}m`)
  if (weeks) parts.push(`${weeks}w`)
  if (days) parts.push(`${days}d`)
  if (hours) parts.push(`${hours}h`)

  return parts.slice(0, 2).join(' ') || '0h'
}

export function getCurrentFormattedDate() {
  const date = new Date()
  return format(date, 'MMMM d')
}
