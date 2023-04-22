import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'src/shared/db'
import { LibraryPopulated } from './get-many-groups'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    error: boolean
    data: LibraryPopulated[]
  }>
) {
  const userId = req.headers['user-id'] as string | undefined
  //? Should never happen
  if (!userId)
    return res.status(401).json({
      error: true,
      data: [],
    })

  const libraries = await prisma.library
    .findMany({
      where: {
        userId,
      },
      include: {
        papers: {
          include: {
            authors: true,
          },
        },
      },
    })
    .then((libraries) => {
      res.status(200)
      return {
        error: false,
        data: libraries,
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

  res.json(libraries)
}
