import { LibraryPopulated } from 'src/pages/api/get-many-groups'
import { ClientSideItem, prisma } from 'src/shared/db'

export default async function getLibraries(of: 'user' | 'group', id: string) {
  const where = of === 'user' ? { userId: id } : { groupId: id }

  const libraries = (await prisma.library
    .findMany({
      where,
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

  return libraries
}
