// TODO Make convertJSONToToken and convertTokenToJSON decrypted

export function convertJSONToToken(
  json: Record<string, string>
): string | undefined {
  try {
    const jsonString = JSON.stringify(json)
    return Buffer.from(jsonString).toString('base64')
  } catch {
    return undefined
  }
}

export function convertTokenToJSON(
  token: string
): Record<string, string> | undefined {
  try {
    const jsonString = Buffer.from(token, 'base64').toString('utf-8')
    return JSON.parse(jsonString)
  } catch {
    return undefined
  }
}