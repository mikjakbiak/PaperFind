import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'src/shared/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
  const userId = req.headers['user-id'] as string
  //? Should never happen
  if (!userId) return res.status(401).end()

  const { groupId } = req.body as { groupId: string }

  await prisma.group.update({
    where: {
      id: groupId,
    },
    data: {
      users: {
        disconnect: {
          id: userId,
        },
      },
    },
  })

  res.status(200).end()
}
