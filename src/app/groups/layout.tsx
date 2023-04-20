import Sidebar from './Sidebar'

export default function GroupsLayout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  console.log('Layout', { groupId: params.id })
  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: ' 1fr 4fr',
        columnGap: '1.5rem',
      }}
    >
      {/* @ts-expect-error server component */}
      <Sidebar groupId={params.id} />
      {children}
    </section>
  )
}
