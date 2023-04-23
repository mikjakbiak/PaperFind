import React from 'react'
import Libraries from '@/components/Sidebars/Libraries'
import { ClientSideItem, prisma } from 'src/shared/db'
import { headers } from 'next/headers'
import { LibraryPopulated } from 'src/pages/api/get-many-groups'

export default async function Sidebar({ id }: { id: string }) {
  const userId = headers().get('user-id')

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

  return <Libraries id={id} _libraries={libraries} />
}
