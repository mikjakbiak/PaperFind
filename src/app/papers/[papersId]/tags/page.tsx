'use client'

import styled from '@emotion/styled'
import Link from 'next/link'
import React from 'react'
import { NumBool } from 'src/types'

export default function TagsPage() {
  return (
    <Main>
      <Navigation>
        <NavigationLink href="/papers/all">Papers</NavigationLink>
        <NavigationLink href="/papers/tag/tags" active={1}>
          Tags
        </NavigationLink>
      </Navigation>
      <Content>
        <span>Tag 1</span>
        <span>Tag 2</span>
        <span>Tag 3</span>
      </Content>
    </Main>
  )
}

const Main = styled.div`
  display: grid;
  grid-template-rows: min-content auto;
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

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`
