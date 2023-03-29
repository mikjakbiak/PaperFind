import { Author, Paper } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'shared/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    (Paper & {
      authors: Author[]
    })[]
  >
) {
  const papers = await prisma.paper.findMany({
    include: {
      authors: true,
    },
  })

  res.status(200).json(papers)
}
