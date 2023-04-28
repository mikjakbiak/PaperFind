import { Group } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'src/shared/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
  const userId = req.headers['user-id'] as string
  //? Should never happen
  if (!userId) return res.status(401).end()

  const newGroup = req.body as Omit<Group, 'id' | 'userIds' | 'created' | 'updated'> & { userEmails: string[] }

  const userIds = (
    await prisma.user.findMany({
      where: {
        email: {
          in: newGroup.userEmails,
        },
      },
      select: {
        id: true,
      },
    })
  )
    .map((user) => user.id)
    .concat(userId)

  await prisma.group.create({
    data: {
      users: {
        connect: userIds.map((id) => ({ id })),
      },
      name: newGroup.name,
      libraries: {
        connect: newGroup.libraryIds?.map((id) => ({ id })) ?? [],
      },
      parentGroup: {
        connect: {
          id: newGroup.parentGroupId ?? undefined,
        },
      },
    },
  })

  res.status(200).end()
}
