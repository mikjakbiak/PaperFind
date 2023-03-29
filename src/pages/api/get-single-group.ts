import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'src/shared/db'
import { GroupPopulated } from './get-many-groups'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    error: boolean
    data: GroupPopulated | null
  }>
) {
  const groupId = req.query.id as string | undefined
  if (!groupId)
    return res.status(400).json({
      error: true,
      data: null,
    })

  const group = await prisma.group
    .findUnique({
      where: {
        id: groupId,
      },
      include: {
        users: true,
        libraries: {
          include: {
            papers: {
              include: {
                authors: true,
              },
            },
          },
        },
      },
    })
    .then((group) => {
      res.status(200)
      return {
        error: false,
        data: group,
      }
    })
    .catch((e) => {
      console.error(e)
      res.status(500)
      return {
        error: true,
        data: null,
      }
    })

  return res.json(group)
}
