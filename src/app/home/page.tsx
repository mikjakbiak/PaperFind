import React from 'react'
import CardsGrid from '@/components/CardsGrid'
import { headers } from 'next/headers'
import { prisma } from 'src/shared/db'
import { GroupPopulated, LibraryPopulated } from 'src/pages/api/get-many-groups'
import { ClientSideItem } from 'src/shared/db'
import { PaperPopulated } from 'src/types'

export default async function HomePage() {
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

  const libraries = (await prisma.library
    .findMany({
      where: {
        userId,
      },
      include: {
        papers: {
          include: {
            authors: true,
          },
        },
      },
    })
    .then((libraries) => {
      return libraries.map((library) => ({
        ...library,
        created: library.created.toISOString(),
        updated: library.updated.toISOString(),
        papers: library.papers.map((paper) => ({
          ...paper,
          created: paper.created.toISOString(),
          updated: paper.updated.toISOString(),
          authors: paper.authors.map((author) => ({
            ...author,
            created: author.created.toISOString(),
            updated: author.updated.toISOString(),
          })),
        })),
      }))
    })
    .catch((e) => {
      console.error(e)
      return []
    })) as ClientSideItem<LibraryPopulated>[]

  const papers = (await prisma.paper
    .findMany({
      where: {
        userId,
      },
      include: {
        authors: true,
      },
    })
    .then((papers) => {
      return papers.map((paper) => {
        return {
          ...paper,
          created: paper.created.toISOString(),
          updated: paper.updated.toISOString(),
          authors: paper.authors.map((author) => ({
            ...author,
            created: author.created.toISOString(),
            updated: author.updated.toISOString(),
          })),
        }
      })
    })
    .catch((e) => {
      console.error(e)
      return []
    })) as ClientSideItem<PaperPopulated>[]

  return (
    <CardsGrid
      cards={[
        {
          title: 'Research Groups' as const,
          items: groups,
        },
        {
          title: 'Libraries' as const,
          items: libraries,
        },
        {
          title: 'Papers' as const,
          items: papers,
        },
        //? Tags are not implemented yet
        {
          title: 'Tags' as const,
          items: [],
        },
      ]}
    />
  )
}
