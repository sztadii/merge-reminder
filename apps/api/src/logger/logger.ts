// Right now nothing complicated
// Later we can make something more advance

export class Logger {
  log(message?: any, ...optionalParams: any[]) {
    console.log(message, ...optionalParams)
  }

  error(message?: any, ...optionalParams: any[]) {
    console.error(message, ...optionalParams)
  }

  warn(message?: any, ...optionalParams: any[]) {
    console.warn(message, ...optionalParams)
  }
}
