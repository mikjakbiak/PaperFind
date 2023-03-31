import { Quicksand } from "next/font/google"
import Header from './components/Header'
import { Providers } from './providers'

const quicksand = Quicksand({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={quicksand.className}>
      <head />
      <body
        style={{
          minHeight: '100vh',
          margin: 0,
          backgroundColor: '#14203d',
          color: '#fff',

          display: 'grid',
          gridTemplateRows: 'min-content auto',
        }}
      >
        <Providers>
          <Header />
          <div
            style={{
              position: 'relative',
              margin: '5vh 5% 0 5%',
            }}
          >
            {children}
          </div>
        </Providers>
        <div id="modal-root"></div>
      </body>
    </html>
  )
}
