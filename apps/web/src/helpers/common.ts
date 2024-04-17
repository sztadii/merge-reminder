export function removeSearchParamsFromURL(): void {
  const currentUrl = window.location.href
  const url = new URL(currentUrl)
  url.search = ''
  window.history.replaceState({}, '', url.toString())
}

export function trimObjectValues<T>(obj: T): T {
  if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      return obj.map(item => trimObjectValues(item)) as any
    } else {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
          key,
          trimObjectValues(value)
        ])
      ) as any
    }
  } else if (typeof obj === 'string') {
    return obj.trim() as any
  } else {
    return obj
  }
}
