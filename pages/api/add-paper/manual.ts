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
      publication: req.body.journal,
      volume: parseInt(req.body.volume),
      issue: parseInt(req.body.issue),
      pages: [parseInt(req.body.pages.from), parseInt(req.body.pages.to)],
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
