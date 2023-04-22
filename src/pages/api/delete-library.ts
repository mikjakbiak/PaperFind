import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'src/shared/db'

export type DeleteLibraryDto = {
  libraryId: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
  const { libraryId } = req.body as DeleteLibraryDto

  await prisma.library.delete({
    where: {
      id: libraryId,
    },
  })

  res.status(200).end()
}
