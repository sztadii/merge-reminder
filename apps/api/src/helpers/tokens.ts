import crypto from 'crypto'

import { config } from '../config'

class TokenCache {
  private values: Record<string, unknown> = {}
  private size: number = 0
  private maxSize = 100

  public getValue(key: string): unknown | undefined {
    return this.values[key]
  }

  public setValue(key: string, value: unknown): void {
    this.cleanIfNeeded()

    this.values[key] = value
    this.size = this.size + 1
  }

  private cleanIfNeeded(): void {
    if (this.size < this.maxSize) return

    this.values = {}
    this.size = 0
  }
}

const tokenCache = new TokenCache()

export function convertJSONToToken(
  json: Record<string, string | number>
): string | undefined {
  try {
    const jsonString = JSON.stringify(json)
    return encrypt(jsonString)
  } catch {
    return undefined
  }
}

export function convertTokenToJSON<T>(token: string): T | undefined {
  try {
    const cachedToken = tokenCache.getValue(token) as T
    if (cachedToken) return cachedToken

    const jsonString = decrypt(token)
    const jsonValue = JSON.parse(jsonString)

    tokenCache.setValue(token, jsonValue)

    return jsonValue
  } catch {
    return undefined
  }
}

function encrypt(text: string) {
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(config.auth.encryptionKey),
    Buffer.from(config.auth.initVector)
  )
  let crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

function decrypt(text: string) {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(config.auth.encryptionKey),
    Buffer.from(config.auth.initVector)
  )
  let dec = decipher.update(text, 'hex', 'utf8')
  dec += decipher.final('utf8')
  return dec
}
