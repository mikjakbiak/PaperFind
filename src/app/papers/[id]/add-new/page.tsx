import LibraryNewPaper from '@/components/LibraryNewPaper/LibraryNewPaper'
import { headers } from 'next/headers'
import React from 'react'
import { getPapers } from 'src/dbQueries/getPapers'

export default async function AddNewPage({ params }: { params: { id: string } }) {
  const libraryId = params.id.split('-')[1]
  const userId = headers().get('user-id')
  if (!userId) return null

  const papers = await getPapers(userId)

  return <LibraryNewPaper libraryId={libraryId} papers={papers} />
}
