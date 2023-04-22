import React from 'react'
import CardsGrid from '@/components/CardsGrid'
import { ClientSideItem, prisma } from 'src/shared/db'
import { LibraryPopulated } from 'src/pages/api/get-many-groups'
import { User } from '@prisma/client'
import { PaperPopulated } from 'src/types'

export default async function GroupsPage({ params }: { params: { id: string } }) {
  const groupId = params.id
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

  const libraries = group.libraries.map((library) => ({
    ...library,
    created: library.created.toISOString(),
    updated: library.updated.toISOString(),
  })) as ClientSideItem<LibraryPopulated>[]

  const papers = group.libraries.reduce<ClientSideItem<PaperPopulated>[]>((acc, library) => {
    return [
      ...acc,
      ...library.papers.map<ClientSideItem<PaperPopulated>>((paper) => ({
        ...paper,
        created: paper.created.toISOString(),
        updated: paper.updated.toISOString(),
        authors: paper.authors.map(
          (author) =>
            ({
              ...author,
              created: author.created.toISOString(),
              updated: author.updated.toISOString(),
            } as any)
        ),
      })),
    ]
  }, [])

  const users = group.users.map((user) => ({
    ...user,
    created: user.created.toISOString(),
    updated: user.updated.toISOString(),
  })) as ClientSideItem<User>[]

  return (
    <section>
      <h1>{group.name}</h1>
      <CardsGrid
        cards={[
          {
            title: 'Libraries' as const,
            items: libraries,
          },
          {
            title: 'Papers' as const,
            items: papers,
          },
          // {
          //   title: 'Tags' as const,
          //   items: tags,
          // },
          {
            title: 'Members' as const,
            items: users,
          },
        ]}
      />
    </section>
  )
}
