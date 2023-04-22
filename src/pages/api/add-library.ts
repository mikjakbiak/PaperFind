import { Library } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'src/shared/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
  const userId = req.headers['user-id'] as string
  //? Should never happen
  if (!userId) return res.status(401).end()

  const newLibraryName = req.body.name as Library['name']

  const library = await prisma.library.create({
    data: {
      name: newLibraryName,
      userId,
    },
  })

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      libraryIds: {
        push: library.id,
      },
    },
  })

  res.status(200).end()
}
