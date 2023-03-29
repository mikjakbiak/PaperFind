import Sidebar from './Sidebar'

export default function PapersLayout({ children }: { children: React.ReactNode }) {
  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: ' 1fr 4fr',
        columnGap: '1.5rem',
      }}
    >
      <Sidebar />
      {children}
    </section>
  )
}
