import React from 'react'
import Groups from '@/components/Sidebars/Groups'
import { headers } from 'next/headers'
import { prisma } from 'src/shared/db'
import { GroupPopulated } from 'src/pages/api/get-many-groups'
import { ClientSideItem } from 'src/shared/db'

export default async function Sidebar({ groupId }: { groupId?: string }) {
  const userId = headers().get('user-id')
  //? Should never happen
  if (!userId) return null

  const groups = (await prisma.group
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
      return groups.map((group) => {
        return {
          ...group,
          created: group.created.toISOString(),
          updated: group.updated.toISOString(),
          users: group.users.map((user) => ({
            ...user,
            created: user.created.toISOString(),
            updated: user.updated.toISOString(),
          })),
        }
      })
    })
    .catch((e) => {
      console.error(e)
      return []
    })) as ClientSideItem<GroupPopulated>[]

  return <Groups groupId={groupId} _groups={groups} />
}
