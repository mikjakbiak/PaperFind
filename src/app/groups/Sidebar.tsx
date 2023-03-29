'use client'

import Button from 'src/app/components/Button'
import styled from '@emotion/styled'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React from 'react'

export default function Sidebar() {
  const searchParams = useSearchParams()
  const libraryId = searchParams.get('id')

  return (
    <Main>
      <Button variant="sidebar-primary">New Library</Button>
      <Link href="/papers">
        <Button variant="sidebar-secondary" active={!libraryId}>
          All Papers
        </Button>
      </Link>
      <Link href="/papers/libraries?id=0">
        <Button variant="sidebar-secondary" active={libraryId === '0'}>
          Library 1
        </Button>
      </Link>
      <Link href="/papers/libraries?id=1">
        <Button variant="sidebar-secondary" active={libraryId === '1'}>
          Library 2
        </Button>
      </Link>
      <Link href="/papers/libraries?id=2">
        <Button variant="sidebar-secondary" active={libraryId === '2'}>
          Library 3
        </Button>
      </Link>
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
