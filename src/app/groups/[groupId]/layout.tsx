import GroupHeader from '@/components/Groups/GroupHeader'
import { ClientSideItem, prisma } from 'src/shared/db'
import { PaperPopulated } from 'src/types'
import Sidebar from '../Sidebar'

export default async function GroupsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { groupId: string }
}) {
  const groupId = params.groupId

  const group = await prisma.group
    .findUnique({
      where: {
        id: groupId,
      },
      include: {
        libraries: {
          select: {
            id: true,
            name: true,
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
      if (!group) return null
      return {
        ...group,
        libraries: group.libraries.map<{ id: string; name: string; papers: ClientSideItem<PaperPopulated>[] }>(
          (library) => ({
            ...library,
            papers: library.papers.map((paper) => ({
              ...paper,
              created: paper.created.toISOString(),
              updated: paper.updated.toISOString(),
              authors: paper.authors.map((author) => ({
                ...author,
                created: author.created.toISOString(),
                updated: author.updated.toISOString(),
              })),
            })) as any as ClientSideItem<PaperPopulated>[],
          })
        ),
      }
    })

  if (!group) return null

  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: ' 1fr 4fr',
        columnGap: '1.5rem',
      }}
    >
      {/* @ts-expect-error server component */}
      <Sidebar groupId={groupId} />
      <section>
        <GroupHeader name={group.name} id={groupId} libraries={group.libraries} parentId={group.parentGroupId} />
        {children}
      </section>
    </section>
  )
}
