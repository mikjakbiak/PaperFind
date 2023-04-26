'use client'

import styled from '@emotion/styled'
import { useRouter } from 'next/navigation'
import React from 'react'
import { GroupPopulated } from 'src/pages/api/get-many-groups'
import { ClientSideItem } from 'src/shared/db'
import ListCard from '../ListCard'

type Props = {
  groups: ClientSideItem<GroupPopulated>[]
}

export default function AllGroups({ groups }: Props) {
  const router = useRouter()

  //TODO: Make it a table: title | papers | libraries | members
  return (
    <Main>
      <ListCard
        card={{
          title: 'Research Groups' as const,
          items: groups,
        }}
      />
    </Main>
  )
}

const Main = styled.div`
  width: 100%;
  display: grid;
  row-gap: 1rem;

  > button {
    justify-self: end;
  }
`
