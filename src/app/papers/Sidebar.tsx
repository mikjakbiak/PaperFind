'use client'

import Button from 'src/app/components/Button'
import styled from '@emotion/styled'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import { NumBool } from 'src/types'

export default function Sidebar() {
  const searchParams = useSearchParams()
  const libraryId = searchParams?.get('id')

  return (
    <Main>
      <Button variant="sidebar-primary">New Library</Button>
      <Link href="/papers">
        <Button variant="sidebar-secondary" active={Number(!libraryId) as NumBool}>
          All Papers
        </Button>
      </Link>
      <Link href="/papers/libraries?id=0">
        <Button variant="sidebar-secondary" active={Number(libraryId === '0') as NumBool}>
          Library 1
        </Button>
      </Link>
      <Link href="/papers/libraries?id=1">
        <Button variant="sidebar-secondary" active={Number(libraryId === '1') as NumBool}>
          Library 2
        </Button>
      </Link>
      <Link href="/papers/libraries?id=2">
        <Button variant="sidebar-secondary" active={Number(libraryId === '2') as NumBool}>
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
