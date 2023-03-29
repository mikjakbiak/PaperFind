import * as jose from 'jose'

type JwtPayload = {
  userId: string
  iat: number
  exp: number
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
  const { payload } = await jose.jwtVerify(token, encodedSecret)
  return payload as JwtPayload
}
