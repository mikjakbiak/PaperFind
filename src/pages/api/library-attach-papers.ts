import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'src/shared/db'

export type UpdateLibraryDto = {
  libraryId: string
  paperIds: string[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
  const userId = req.headers['user-id'] as string
  //? Should never happen
  if (!userId) return res.status(401).end()

  const { libraryId, paperIds } = req.body as UpdateLibraryDto

  await prisma.library.update({
    where: {
      id: libraryId,
    },
    data: {
      papers: {
        connect: paperIds.map((id) => ({ id })),
      },
    },
  })

  res.status(200).end()
}
