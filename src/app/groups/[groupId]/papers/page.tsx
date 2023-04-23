import ListCard from '@/components/ListCard'
import React from 'react'
import { getPapers } from 'src/dbQueries/getPapers'

type Props = {
  params: { groupId: string }
}

export default async function GroupPapersPage({ params }: Props) {
  const papers = await getPapers('group', params.groupId)

  return <ListCard card={{ title: 'Papers', items: papers }} isGroupPage />
}
