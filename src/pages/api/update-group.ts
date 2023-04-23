import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'src/shared/db'

export type UpdateGroupDto = {
  groupId: string
  name?: string
  userEmails?: string[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
  const { groupId, name, userEmails } = req.body as UpdateGroupDto

  const userIds = (
    await prisma.user.findMany({
      where: {
        email: {
          in: userEmails,
        },
      },
      select: {
        id: true,
      },
    })
  ).map((user) => user.id)

  const updateData = name
    ? userEmails
      ? {
          name,
          users: {
            connect: userIds.map((id) => ({ id })),
          },
        }
      : {
          name,
        }
    : {
        users: {
          connect: userIds.map((id) => ({ id })),
        },
      }

  await prisma.group.update({
    where: {
      id: groupId,
    },
    data: updateData,
  })

  res.status(200).end()
}
