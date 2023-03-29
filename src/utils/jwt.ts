import * as jose from 'jose'

type JwtPayload = {
  userId: string
  iat: number
  exp: number
  error: 'expired' | 'invalid' | 'unknown' | false
}

export async function generateJWT(userId: string) {
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) throw new Error('JWT_SECRET is not defined')

  const encodedSecret = new TextEncoder().encode(jwtSecret)
  const token = await new jose.SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(encodedSecret)
  return token
}

export async function verifyJWT(token: string): Promise<JwtPayload> {
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) throw new Error('JWT_SECRET is not defined')
  const encodedSecret = new TextEncoder().encode(jwtSecret)
  const payload = await jose
    .jwtVerify(token, encodedSecret)
    .then((res) => ({ ...res.payload, error: false }))
    .catch((e) => {
      if (e instanceof jose.errors.JWTExpired) {
        return {
          userId: '',
          iat: 0,
          exp: 0,
          error: 'expired',
        }
      } else if (e instanceof jose.errors.JWTClaimValidationFailed) {
        return {
          userId: '',
          iat: 0,
          exp: 0,
          error: 'invalid',
        }
      } else {
        return {
          userId: '',
          iat: 0,
          exp: 0,
          error: 'unknown',
        }
      }
    })
  return payload as JwtPayload
}
