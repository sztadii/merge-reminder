// TODO Make convertJSONToToken and convertTokenToJSON decrypted

export function convertJSONToToken(
  json: Record<string, string | number>
): string | undefined {
  try {
    const jsonString = JSON.stringify(json)
    return Buffer.from(jsonString).toString('base64')
  } catch {
    return undefined
  }
}

export function convertTokenToJSON<T>(token: string): T | undefined {
  try {
    const jsonString = Buffer.from(token, 'base64').toString('utf-8')
    return JSON.parse(jsonString)
  } catch {
    return undefined
  }
}
