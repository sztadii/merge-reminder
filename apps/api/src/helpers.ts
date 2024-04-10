// TODO Make convertJSONToToken and convertTokenToJSON decrypted

export function convertJSONToToken(json: Record<string, string>): string {
  const jsonString = JSON.stringify(json)
  const base64String = Buffer.from(jsonString).toString('base64')
  return base64String
}

export function convertTokenToJSON(token: string): Record<string, string> {
  const jsonString = Buffer.from(token, 'base64').toString('utf-8')
  return JSON.parse(jsonString)
}

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
  if (timeInHours < 24) {
    return `${timeInHours}h`
  } else if (timeInHours < 24 * 7) {
    const days = Math.floor(timeInHours / 24)
    const hours = timeInHours % 24
    if (hours === 0) {
      return `${days}d`
    } else {
      return `${days}d ${hours}h`
    }
  } else if (timeInHours < 24 * 7 * 4) {
    const weeks = Math.floor(timeInHours / (24 * 7))
    const days = Math.floor((timeInHours % (24 * 7)) / 24)
    if (days === 0) {
      return `${weeks}w`
    } else {
      return `${weeks}w ${days}d`
    }
  } else {
    const months = Math.floor(timeInHours / (24 * 7 * 4))
    const weeks = Math.floor((timeInHours % (24 * 7 * 4)) / (24 * 7))
    if (weeks === 0) {
      return `${months}m`
    } else {
      return `${months}m ${weeks}w`
    }
  }
}
