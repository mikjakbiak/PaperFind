import { argon2id, argon2Verify, sha512 } from 'hash-wasm'
import cryptoRandomString from 'crypto-random-string'

export async function hashPassword(password: string) {
  const pepper = process.env.PEPPER

  //? Generate salt
  const salt = await sha512(cryptoRandomString({ length: 128 }))
  //? Hash password
  const passwordHash = await argon2id({
    password: pepper + password,
    salt,
    parallelism: 1,
    iterations: 2,
    memorySize: 19456,
    hashLength: 32,
    outputType: 'encoded',
  })

  return passwordHash
}

export async function verifyPassword(password: string, passwordHash: string) {
  const pepper = process.env.PEPPER

  //? Verify password
  return await argon2Verify({
    password: pepper + password,
    hash: passwordHash,
  })
}
