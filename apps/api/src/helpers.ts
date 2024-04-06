export async function wait(delay: number) {
  return new Promise(resolve => setTimeout(resolve, delay))
}

export async function handlePromise<T>(
  promise: Promise<T>
): Promise<[T?, string?]> {
  try {
    const value = await promise
    return [value]
  } catch (e) {
    const errorMessage = (e as Error)?.message || 'Something went wrong'
    return [undefined, errorMessage]
  }
}

export function isTruthy<T>(value?: T | undefined | null | false): value is T {
  return !!value
}
