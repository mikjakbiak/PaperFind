import React from 'react'
import { ClientSideItem, prisma } from 'src/shared/db'
import { headers } from 'next/headers'
import AllGroups from '@/components/Groups/AllGroups'
import { GroupPopulated } from 'src/pages/api/get-many-groups'

export default async function GroupsPage() {
  const userId = headers().get('user-id')
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

  return <AllGroups groups={groups} />
}
