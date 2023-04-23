import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'src/shared/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
  const { groupId } = req.body as { groupId: string }

  await prisma.group.delete({
    where: {
      id: groupId,
    },
  })

  res.status(200).end()
}
