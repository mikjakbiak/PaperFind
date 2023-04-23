import GroupNewPaper from '@/components/Groups/GroupNewPaper'
import { headers } from 'next/headers'
import React from 'react'
import getLibraries from 'src/dbQueries/getLibraries'
import { getPapers } from 'src/dbQueries/getPapers'

type Props = {
  params: { groupId: string }
}

export default async function AddNewGroupPaperPage({ params: { groupId } }: Props) {
  const userId = headers().get('user-id')
  if (!userId) return null

  const userPapers = await getPapers('user', userId)
  const groupPapers = await getPapers('group', groupId)
  const libraries = await getLibraries('group', groupId)

  return <GroupNewPaper userPapers={userPapers} groupPapers={groupPapers} libraries={libraries} groupId={groupId} />
}
