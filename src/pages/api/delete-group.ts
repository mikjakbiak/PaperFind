import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'src/shared/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
  const { groupId } = req.body as { groupId: string }

  const group = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
    select: {
      nestedGroups: {
        select: {
          id: true,
        },
      },
    },
  })

  if (group?.nestedGroups.length) {
    return res.status(400).json({
      error: 'Cannot delete group with nested groups',
    })
  }

  await prisma.group.delete({
    where: {
      id: groupId,
    },
  })

  res.status(200).end()
}
