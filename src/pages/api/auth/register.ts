import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'src/shared/db'
import { hashPassword } from 'src/utils/crypto'
import { generateJWT } from 'src/utils/jwt'

export type RegisterDto = {
  email: string
  password: string
  firstName: string
  lastName: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<null>) {
  const { email, password, firstName, lastName } = req.body as RegisterDto

  if (!email || !password || !firstName || !lastName) {
    res.status(400).end()
    return
  }

  const { id } = await prisma.user.create({
    data: {
      email,
      passwordHash: await hashPassword(password),
      firstName,
      lastName,
    },
  })

  const token = await generateJWT(id)

  res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly`)
  res.status(200).end()
}
