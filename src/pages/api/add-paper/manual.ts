import { ReferenceType } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'src/shared/db'

export type AddNewPaperManualDto = {
  referenceType: ReferenceType
  title: string
  abstract: string
  year: string
  month: string
  day: string
  journal: string
  volume: string
  issue: string
  pages: {
    from: string
    to: string
  }
  groupId?: string
  libraryIds?: string[]
  authors: {
    fName: string
    lName: string
  }[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
  const userId = req.headers['user-id'] as string
  //? Should never happen
  if (!userId) return res.status(401).end()

  const body = req.body as AddNewPaperManualDto
  const authors = body.authors

  const userOrGroup = body.groupId
    ? { group: { connect: { id: body.groupId } } }
    : { user: { connect: { id: userId } } }

  await prisma.paper.create({
    data: {
      ...userOrGroup,
      type: body.referenceType,
      title: body.title,
      abstract: body.abstract,
      year: parseInt(body.year),
      month: parseInt(body.month),
      day: parseInt(body.day),
      publication: body.journal,
      volume: parseInt(body.volume),
      issue: parseInt(body.issue),
      pages: [parseInt(body.pages.from), parseInt(body.pages.to)],
      authors: {
        create: authors.map((author: { fName: string; lName: string }) => ({
          fName: author.fName,
          lName: author.lName,
        })),
      },
      libraries: {
        connect: body.libraryIds?.map((id) => ({ id })),
      },
    },
  })

  res.status(200).end()
}
