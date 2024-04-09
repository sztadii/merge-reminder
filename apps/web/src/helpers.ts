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
