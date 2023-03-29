'use client'

import Button from 'src/app/components/Button'
import styled from '@emotion/styled'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { GroupPopulated } from 'src/pages/api/get-groups'
import axios from 'axios'

export default function Sidebar() {
  const searchParams = useSearchParams()
  const groupId = searchParams.get('id')

  const [refetch, setRefetch] = useState(false)
  const [groups, setGroups] = useState<GroupPopulated[]>([])
  useEffect(() => {
    axios
      .get<{
        error: boolean
        data: GroupPopulated[]
      }>('/api/get-groups')
      .then((res) => {
        setGroups(res.data.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [refetch])

  function createGroup() {
    axios
      .post('/api/add-group', {
        name: 'Test2 Group',
        userEmails: ['w1782957@my.westminster.ac.uk'],
        libraryIds: [],
        parentGroupId: null,
      })
      .then(() => {
        setRefetch(!refetch)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  return (
    <Main>
      <Button variant="sidebar-primary" onClick={createGroup}>
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
