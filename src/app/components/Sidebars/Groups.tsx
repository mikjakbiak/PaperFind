'use client'

import React, { useEffect, useState } from 'react'
import { GroupPopulated } from 'src/pages/api/get-many-groups'
import axios from 'axios'
import styled from '@emotion/styled'
import Button from '../Button'
import Link from 'next/link'
import { ClientSideItem } from 'src/shared/db'
import { NumBool } from 'src/types'
import ModalButton from '../ModalButton'
import { useParams } from 'next/navigation'

type Props = {
  _groups: ClientSideItem<GroupPopulated>[]
}

export default function Groups({ _groups }: Props) {
  const [refetch, setRefetch] = useState(false)
  const [groups, setGroups] = useState<ClientSideItem<GroupPopulated>[]>(_groups)
  const params = useParams()

  useEffect(() => {
    if (!refetch) return
    axios
      .get<{
        error: boolean
        data: ClientSideItem<GroupPopulated>[]
      }>('/api/get-many-groups')
      .then((res) => {
        setGroups(res.data.data)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setRefetch(false)
      })
  }, [refetch])

  if (!params?.groupId) return null

  return (
    <Main>
      <ModalButton refetch={() => setRefetch(!refetch)} />
      {groups.map((group) => (
        <Link key={group.id} href={`/groups/${group.id}`}>
          <Button variant="sidebar-secondary" active={Number(params.groupId === group.id) as NumBool}>
            {group.name}
          </Button>
        </Link>
      ))}
    </Main>
  )
}

const Main = styled.div`
  flex-grow: 1;
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
