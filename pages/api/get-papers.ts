import { Author, Paper } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'shared/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    error: boolean
    data: (Paper & {
      authors: Author[]
    })[]
  }>
) {
  const papers = await prisma.paper
    .findMany({
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
