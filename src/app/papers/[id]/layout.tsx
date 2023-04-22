import Sidebar from './Sidebar'

export default function PapersLayout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  const id = params.id

  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: ' 1fr 4fr',
        columnGap: '1.5rem',
      }}
    >
      {/* @ts-expect-error server component */}
      <Sidebar id={id} />
      {children}
    </section>
  )
}
