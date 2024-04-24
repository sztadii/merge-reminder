import crypto from 'crypto'

import { config } from '../config'

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
    const jsonString = decrypt(token)
    return JSON.parse(jsonString)
  } catch {
    return undefined
  }
}

function encrypt(text: string) {
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(config.token.encryptionKey),
    Buffer.from(config.token.initVector)
  )
  let crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

function decrypt(text: string) {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(config.token.encryptionKey),
    Buffer.from(config.token.initVector)
  )
  let dec = decipher.update(text, 'hex', 'utf8')
  dec += decipher.final('utf8')
  return dec
}
