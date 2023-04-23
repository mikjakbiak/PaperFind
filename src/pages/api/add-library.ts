import { Library } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'src/shared/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
  const userId = req.headers['user-id'] as string
  //? Should never happen
  if (!userId) return res.status(401).end()

  const newLibraryName = req.body.name as Library['name']
  const groupId = req.body.groupId as Library['groupId']

  const library = await prisma.library.create({
    data: {
      name: newLibraryName,
      userId: groupId ? undefined : userId,
      groupId,
    },
  })

  if (groupId) {
    await prisma.group.update({
      where: { id: groupId },
      data: {
        libraries: {
          connect: {
            id: library.id,
          },
        },
      },
    })
  } else {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        libraries: {
          connect: {
            id: library.id,
          },
        },
      },
    })
  }

  res.status(200).end()
}
