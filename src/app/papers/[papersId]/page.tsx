import React from 'react'
import { PaperPopulated } from 'src/types'
import { headers } from 'next/headers'
import AllPapers from '@/components/AllPapers'
import { ClientSideItem, prisma } from 'src/shared/db'
import { LibraryPopulated } from 'src/pages/api/get-many-groups'
import Library from '@/components/Library'
import { getPapers } from 'src/dbQueries/getPapers'

export default async function PapersPage({ params }: { params: { papersId: string } }) {
  const userId = headers().get('user-id')
  if (!userId) return null

  const id = params.papersId
  const libraryId = id.includes('lib') ? id.split('-')[1] : undefined

  const papers = await getPapers('user', userId)

  const library = (
    libraryId
      ? await prisma.library
          .findUnique({
            where: {
              id: libraryId,
            },

            include: {
              papers: {
                include: {
                  authors: true,
                },
              },
            },
          })
          .then((library) => {
            if (!library) return null
            return {
              ...library,
              created: library.created.toISOString(),
              updated: library.updated.toISOString(),
            }
          })
          .catch((e) => {
            console.error(e)
            return null
          })
      : null
  ) as ClientSideItem<LibraryPopulated> | null

  const libraryPapers = library?.papers.map<ClientSideItem<PaperPopulated>>((paper) => ({
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
  }))

  return libraryId && library && libraryPapers ? (
    <Library library={library} papers={libraryPapers} />
  ) : (
    <AllPapers papers={papers} />
  )
}
