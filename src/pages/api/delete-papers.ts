import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'src/shared/db'

export type DeletePapersDto = {
  paperIds: string[]
  groupId?: string
  libraryId?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
  const userId = req.headers['user-id'] as string
  //? Should never happen
  if (!userId) return res.status(401).end()

  const { paperIds, groupId, libraryId } = req.body as DeletePapersDto

  const data = groupId
    ? {
        groups: {
          disconnect: {
            id: groupId,
          },
        },
      }
    : libraryId
    ? {
        libraries: {
          disconnect: {
            id: libraryId,
          },
        },
      }
    : {
        user: {
          disconnect: true,
        },
      }

  await Promise.all(
    paperIds.map((paperId) => {
      return prisma.paper.update({
        where: { id: paperId },
        data,
      })
    })
  )

  res.status(200).end()
}
