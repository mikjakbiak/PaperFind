import { Author, Paper } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'src/shared/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    error: boolean
    data: (Paper & {
      authors: Author[]
    })[]
  }>
) {
  const userId = req.headers['user-id'] as string | undefined
  //? Should never happen
  if (!userId)
    return res.status(401).json({
      error: true,
      data: [],
    })

  const papers = await prisma.paper
    .findMany({
      where: {
        userId,
      },
      include: {
        authors: true,
      },
    })
    .then((papers) => {
      res.status(200)
      return {
        error: false,
        data: papers,
      }
    })
    .catch((e) => {
      console.error(e)
      res.status(500)
      return {
        error: true,
        data: [],
      }
    })

  res.json(papers)
}
