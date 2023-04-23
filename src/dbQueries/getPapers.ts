import { PaperPopulated } from 'src/types'
import { ClientSideItem, prisma } from '../shared/db'

export async function getPapers(of: 'user' | 'group' | 'library', id: string) {
  const where = (() => {
    switch (of) {
      case 'group':
        return {
          group: {
            id,
          },
        }
      case 'library':
        return {
          libraries: {
            some: {
              id,
            },
          },
        }
      case 'user':
        return {
          user: {
            id,
          },
        }
    }
  })()

  const papers = (await prisma.paper
    .findMany({
      where,
      include: {
        authors: true,
      },
    })
    .then((papers) => {
      return papers.map((paper) => ({
        ...paper,
        created: paper.created.toISOString(),
        updated: paper.updated.toISOString(),
        authors: paper.authors.map((author) => ({
          ...author,
          created: author.created.toISOString(),
          updated: author.updated.toISOString(),
        })),
      }))
    })
    .catch((e) => {
      console.error(e)
      return []
    })) as ClientSideItem<PaperPopulated>[]

  return papers
}
