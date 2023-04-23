import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'src/shared/db'

export type UpdateLibraryDto = {
  libraryIds: string[]
  paperIds: string[]
  groupId?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
  const userId = req.headers['user-id'] as string
  //? Should never happen
  if (!userId) return res.status(401).end()

  const { libraryIds, paperIds, groupId } = req.body as UpdateLibraryDto

  await Promise.all(
    paperIds.map((paperId) => {
      const libraries = {
        libraries: {
          connect: libraryIds.map((libraryId) => ({ id: libraryId })),
        },
      }
      const data = groupId
        ? {
            ...libraries,
            groups: {
              connect: {
                id: groupId,
              },
            },
          }
        : libraries
      return prisma.paper.update({
        where: { id: paperId },
        data,
      })
    })
  )

  res.status(200).end()
}
