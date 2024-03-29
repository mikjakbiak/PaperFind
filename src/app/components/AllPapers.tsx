'use client'

import styled from '@emotion/styled'
import Link from 'next/link'
import React from 'react'
import { HiPlus } from 'react-icons/hi'
import { ClientSideItem } from 'src/shared/db'
import { NumBool, PaperPopulated } from 'src/types'
import ListCard from './ListCard'
import StyledLink from './StyledLink'

type Props = {
  papers: ClientSideItem<PaperPopulated>[]
}

export default function AllPapers({ papers }: Props) {
  return (
    <Main>
      <Navigation>
        <NavigationLink href="/papers/all" active={1}>
          Papers
        </NavigationLink>
        <NavigationLink href="/papers/tag/tags">Tags</NavigationLink>
      </Navigation>
      <AddNew>
        <StyledLink href="/papers/add-new">
          <Icon />
          Add Paper
        </StyledLink>
      </AddNew>
      <ListCard card={{ title: 'Papers', items: papers }} />
    </Main>
  )
}

const Main = styled.div`
  display: grid;
  grid-template-rows: min-content min-content auto;

  row-gap: 2rem;
`

const Navigation = styled.div`
  justify-self: center;

  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 60%;
`

const NavigationLink = styled(Link)<{ active?: NumBool }>`
  text-decoration: none;
  color: white;
  font-size: 1.2rem;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }

  ${({ active }) =>
    active &&
    `
    font-weight: bold;
    text-decoration: underline;
    color: #5485FF;
  `}
`

const AddNew = styled.div`
  justify-self: end;

  > a {
    font-weight: bold;
  }
`

const Icon = styled(HiPlus)`
  color: #14203d;
  background-color: #e6d840;

  border-radius: 50%;
  padding: 2px;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  > table {
    width: 100%;
  }
`
