import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'src/shared/db'

export type UserResponse = {
  isAvailable: boolean
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<UserResponse>) {
  const user = await prisma.user.findUnique({
    where: {
      email: req.query.email as string,
    },
  })

  if (user) {
    res.status(200).json({
      isAvailable: false,
    })
  } else {
    res.status(200).json({
      isAvailable: true,
    })
  }
}
