import React from 'react'
import ListCard from '@/components/ListCard'
import getLibraries from 'src/dbQueries/getLibraries'

type Props = {
  params: {
    groupId: string
  }
}

export default async function GroupLibrariesPage({ params }: Props) {
  const groupId = params.groupId

  const libraries = await getLibraries('group', groupId)

  return <ListCard card={{ title: 'Libraries', items: libraries }} isGroupPage />
}
