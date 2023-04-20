import React from 'react'
import { prisma } from 'src/shared/db'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import ModalButton from '@/components/ModalButton'

export default async function GroupsPage() {
  const userId = headers().get('user-id')
  const groupId = await prisma.group
    .findFirst({
      where: {
        userIds: {
          has: userId,
        },
      },
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
      <ModalButton />
      <div>Groups</div>
      <p>No groups found.</p>
    </div>
  )
}
