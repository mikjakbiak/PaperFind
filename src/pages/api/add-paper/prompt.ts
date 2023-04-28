import { ReferenceType } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'src/shared/db'
import { AnswerDto } from 'src/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
  const userId = req.headers['user-id'] as string
  //? Should never happen
  if (!userId) return res.status(401).end()

  const completion = req.body.completion as AnswerDto
  const groupId = req.body.groupId as string | undefined
  const libraryIds = req.body.libraryIds as string[] | undefined

  const userOrGroup = groupId ? { group: { connect: { id: groupId } } } : { user: { connect: { id: userId } } }

  //? Create paper in database
  await prisma.paper
    .create({
      data: {
        ...completion,
        type: completion.type === 'Journal Article' ? ReferenceType.ARTICLE : ReferenceType.BOOK,
        authors: {
          create: completion.authors?.map((author) => ({
            fName: author.fName,
            lName: author.lName,
          })),
        },
        pages: completion.pages ? [completion.pages.from, completion.pages.to] : undefined,
        ...userOrGroup,
        libraries: {
          connect: libraryIds?.map((id) => ({ id })),
        },
      },
    })
    .catch((error) => {
      console.error(error)
      return res.status(500).end()
    })

  res.status(200).end()
}
