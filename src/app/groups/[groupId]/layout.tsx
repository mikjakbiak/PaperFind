import GroupHeader from '@/components/Groups/GroupHeader'
import { prisma } from 'src/shared/db'
import Sidebar from '../Sidebar'

export default async function GroupsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { groupId: string }
}) {
  const groupId = params.groupId

  const group = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
    include: {
      libraries: {
        select: {
          id: true,
          name: true,
        },
      },
    },
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
