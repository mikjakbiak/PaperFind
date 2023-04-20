import { Group, Library, User } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'src/shared/db'
import { PaperPopulated } from './get-papers'

export type LibraryPopulated = Library & {
  papers: PaperPopulated[]
}

export type GroupPopulated = Group & {
  users: User[]
  libraries: LibraryPopulated[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    error: boolean
    data: GroupPopulated[]
  }>
) {
  const userId = req.headers['user-id'] as string | undefined
  //? Should never happen
  if (!userId)
    return res.status(401).json({
      error: true,
      data: [],
    })

  const groups = await prisma.group
    .findMany({
      where: {
        userIds: {
          has: userId,
        },
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
    .then((groups) => {
      res.status(200)
      return {
        error: false,
        data: groups,
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

  res.json(groups)
}
