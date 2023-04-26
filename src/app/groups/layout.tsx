import Sidebar from './Sidebar'

export default async function GroupsLayout({ children }: { children: React.ReactNode }) {
  return (
    <section
      style={{
        display: 'flex',
        width: '100%',
        columnGap: '1.5rem',
      }}
    >
      {/* @ts-expect-error server component */}
      <Sidebar />
      {children}
    </section>
  )
}
