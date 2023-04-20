'use client'

import React, { useEffect, useState } from 'react'
import { GroupPopulated } from 'src/pages/api/get-many-groups'
import axios from 'axios'
import styled from '@emotion/styled'
import Button from './Button'
import Link from 'next/link'
import { ClientSideItem } from 'src/shared/db'
import { NumBool } from 'src/types'
import ModalButton from './ModalButton'

type Props = {
  _groups: ClientSideItem<GroupPopulated>[]
  groupId?: string
}

export default function Groups({ _groups, groupId }: Props) {
  const [refetch, setRefetch] = useState(false)
  const [groups, setGroups] = useState<ClientSideItem<GroupPopulated>[]>(_groups)

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
      <ModalButton refetch={() => setRefetch(!refetch)} />
      {groups.map((group) => (
        <Link key={group.id} href={`/groups/${group.id}`}>
          <Button variant="sidebar-secondary" active={Number(groupId === group.id) as NumBool}>
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
