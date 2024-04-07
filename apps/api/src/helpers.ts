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
