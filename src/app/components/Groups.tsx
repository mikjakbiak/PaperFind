'use client'

import React, { useEffect, useState } from 'react'
import { GroupPopulated } from 'src/pages/api/get-many-groups'
import axios from 'axios'
import styled from '@emotion/styled'
import CreateGroupModal from './CreateGroupModal'
import Button from './Button'
import Link from 'next/link'
import { ClientSideItem } from 'src/shared/db'

type Props = {
  _groups: ClientSideItem<GroupPopulated>[]
  groupId?: string
}

export default function Groups({ _groups, groupId }: Props) {
  const [refetch, setRefetch] = useState(false)
  const [groups, setGroups] = useState<ClientSideItem<GroupPopulated>[]>(_groups)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (!refetch) return
    axios
      .get<{
        error: boolean
        data: GroupPopulated[]
      }>('/api/get-many-groups')
      .then((res) => {
        const data = res.data.data.map((group) => {
          return {
            ...group,
            created: group.created.toISOString(),
            updated: group.updated.toISOString(),
          }
        })
        setGroups(data)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [refetch])

  return (
    <Main>
      {showModal && <CreateGroupModal closeModal={() => setShowModal(false)} refetch={() => setRefetch(!refetch)} />}
      <Button variant="sidebar-primary" onClick={() => setShowModal(true)}>
        New Group
      </Button>
      {groups.map((group) => (
        <Link key={group.id} href={`/groups/${group.id}`}>
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
