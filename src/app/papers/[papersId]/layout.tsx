import Sidebar from './Sidebar'

export default function PapersLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { papersId: string }
}) {
  const id = params.papersId

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
