'use client'

import Button from 'src/app/components/Button'
import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { GroupPopulated } from 'src/pages/api/get-many-groups'
import axios from 'axios'
import CreateGroupModal from '@/components/CreateGroupModal'

export default function Sidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const groupId = searchParams.get('id')

  const [showModal, setShowModal] = useState(false)
  const [refetch, setRefetch] = useState(false)
  const [groups, setGroups] = useState<GroupPopulated[]>([])
  useEffect(() => {
    axios
      .get<{
        error: boolean
        data: GroupPopulated[]
      }>('/api/get-many-groups')
      .then((res) => {
        setGroups(res.data.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [refetch])

  useEffect(() => {
    if (groups.length) {
      if (!groupId) {
        router.push(`/groups?id=${groups[0].id}`)
      }
    }
  }, [groups, groupId])

  return (
    <Main>
      {showModal && <CreateGroupModal closeModal={() => setShowModal(false)} refetch={() => setRefetch(!refetch)} />}
      <Button variant="sidebar-primary" onClick={() => setShowModal(true)}>
        New Group
      </Button>
      {groups.map((group) => (
        <Link key={group.id} href={`/groups?id=${group.id}`}>
          <Button variant="sidebar-secondary" active={groupId === group.id}>
            {group.name}
          </Button>
        </Link>
      ))}
    </Main>
  )
}

const Main = styled.div`
  align-self: flex-start;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  row-gap: 1rem;

  > a {
    text-decoration: none;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  & button {
    width: 80%;
  }
`
