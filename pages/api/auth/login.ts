import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'shared/db'
import { verifyPassword } from 'utils/crypto'
import { generateJWT } from 'utils/jwt'

type LoginDto = {
  email: string
  password: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<null>) {
  const { email, password } = req.body as LoginDto

  if (!email || !password) {
    res.status(400).end()
    return
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (!user) {
    res.status(401).end()
    return
  }

  const { id, passwordHash } = user

  if (!(await verifyPassword(password, passwordHash))) {
    res.status(401).end()
    return
  }

  const token = await generateJWT(id)

  res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly`)
  res.status(200).end()
}
