import { PaperPopulated } from 'src/types'
import { ClientSideItem, prisma } from '../shared/db'

export async function getPapers(userId: string) {
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
