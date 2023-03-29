import { ReferenceType } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'shared/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
  const authors = req.body.authors
  const refType = req.body.referenceType === 'Journal Article' ? ReferenceType.ARTICLE : ReferenceType.BOOK

  await prisma.paper.create({
    data: {
      type: refType,
      title: req.body.title,
      abstract: req.body.abstract,
      year: parseInt(req.body.year),
      month: parseInt(req.body.month),
      day: parseInt(req.body.day),
      journal: req.body.journal,
      volume: req.body.volume,
      issue: req.body.issue,
      pages: [req.body.pages.from as string, req.body.pages.to as string],
      authors: {
        create: authors.map((author: { fName: string; lName: string }) => ({
          fName: author.fName,
          lName: author.lName,
        })),
      },
    },
  })

  res.status(200).end()
}
