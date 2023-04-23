import ListCard from '@/components/ListCard'
import React from 'react'
import { getPapers } from 'src/dbQueries/getPapers'

type Props = {
  params: {
    libraryId: string
  }
}

export default async function LibraryPapersPage({ params }: Props) {
  const libraryId = params.libraryId

  const papers = await getPapers('library', libraryId)

  return (
    <section>
      <ListCard
        card={{
          title: 'Papers' as const,
          items: papers,
        }}
        isGroupPage
      />
    </section>
  )
}
