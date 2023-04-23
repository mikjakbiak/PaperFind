import ListCard from '@/components/ListCard'
import React from 'react'
import { GroupPopulated } from 'src/pages/api/get-many-groups'
import { ClientSideItem, prisma } from 'src/shared/db'

type Props = {
  params: {
    groupId: string
  }
}

export default async function GroupGroupsPage({ params: { groupId } }: Props) {
  const groups = (await prisma.group.findMany({
    where: {
      parentGroupId: groupId,
    },
    select: {
      id: true,
      name: true,
      papers: true,
      libraries: true,
      users: true,
    },
  })) as any as ClientSideItem<GroupPopulated>[]

  return <ListCard card={{ title: 'Research Groups', items: groups }} isGroupPage />
}
