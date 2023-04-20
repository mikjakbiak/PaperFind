import React from 'react'
import { prisma } from 'src/shared/db'
import { redirect } from 'next/navigation'

export default async function GroupsPage() {
  const groupId = await prisma.group
    .findFirst({
      select: {
        id: true,
      },
    })
    .then((group) => {
      if (!group) return
      return group.id
    })
    .catch((e) => {
      console.error(e)
      return
    })

  if (groupId) redirect('/groups/' + groupId)

  return (
    <div>
      <div>Groups</div>
      <p>No groups found.</p>
    </div>
  )
}
