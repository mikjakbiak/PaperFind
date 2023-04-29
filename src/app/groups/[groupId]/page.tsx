import React from 'react'
import CardsGrid from '@/components/CardsGrid'
import { ClientSideItem, prisma } from 'src/shared/db'
import { GroupPopulated, LibraryPopulated } from 'src/pages/api/get-many-groups'
import { User } from '@prisma/client'
import { PaperPopulated } from 'src/types'
import { headers } from 'next/headers'

export default async function GroupPage({ params }: { params: { groupId: string } }) {
  const userId = headers().get('user-id')
  const groupId = params.groupId
  const group = await prisma.group
    .findUnique({
      where: {
        id: groupId,
      },
      include: {
        nestedGroups: true,
        users: true,
        libraries: true,
        papers: {
          include: {
            authors: true,
          },
        },
      },
    })
    .then((group) => {
      if (!group) return
      return {
        ...group,
        created: group.created.toISOString(),
        updated: group.updated.toISOString(),
      }
    })
    .catch((e) => {
      console.error(e)
      return
    })

  if (!group) return null

  const nestedGroups = group.nestedGroups
    .map((group) => ({
      ...group,
      created: group.created.toISOString(),
      updated: group.updated.toISOString(),
    }))
    .filter((group) => group.userIds.some((id) => id === userId)) as ClientSideItem<GroupPopulated>[]

  const libraries = group.libraries.map((library) => ({
    ...library,
    created: library.created.toISOString(),
    updated: library.updated.toISOString(),
  })) as ClientSideItem<LibraryPopulated>[]

  const papers = group.papers.map((paper) => ({
    ...paper,
    created: paper.created.toISOString(),
    updated: paper.updated.toISOString(),
    authors: paper.authors.map((author) => ({
      ...author,
      created: author.created.toISOString(),
      updated: author.updated.toISOString(),
    })),
  }))

  const users = group.users.map((user) => ({
    ...user,
    created: user.created.toISOString(),
    updated: user.updated.toISOString(),
  })) as ClientSideItem<User>[]

  return (
    <CardsGrid
      isGroupPage
      cards={[
        {
          title: 'Research Groups' as const,
          items: nestedGroups,
          nested: true,
        },
        {
          title: 'Libraries' as const,
          items: libraries,
        },
        {
          title: 'Papers' as const,
          items: papers as any as ClientSideItem<PaperPopulated>[],
        },
        {
          title: 'Members' as const,
          items: users,
          seeMore: false,
        },
      ]}
    />
  )
}
