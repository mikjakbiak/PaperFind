'use client'

import Card from '@/components/Card'
import StyledLink from '@/components/StyledLink'
import styled from '@emotion/styled'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import { HiArrowRight } from 'react-icons/hi'

export default function LibrariesPage() {
  const searchParams = useSearchParams()
  const libraryId = searchParams.get('id')

  return (
    <Main>
      <StyledCard>
        <Heading>Library {libraryId}</Heading>
        <CardBody>
          <Link href="/groups?id=0">Group 1</Link>
          <Link href="/groups?id=1">Group 2</Link>
          <Link href="/groups?id=2">Group 3</Link>
        </CardBody>
        <StyledLink href="/groups">
          See more <HiArrowRight size={20} />
        </StyledLink>
      </StyledCard>
      <StyledCard>
        <Heading>Libraries</Heading>
        <CardBody>
          <Link href="/papers/libraries?id=0">Library 1</Link>
          <Link href="/papers/libraries?id=1">Library 2</Link>
          <Link href="/papers/libraries?id=2">Library 3</Link>
        </CardBody>
        <StyledLink href="/papers/libraries">
          See more <HiArrowRight size={20} />
        </StyledLink>
      </StyledCard>
      <StyledCard>
        <Heading>Papers</Heading>
        <CardBody>
          <Link href="/papers?id=0">Paper 1</Link>
          <Link href="/papers?id=1">Paper 2</Link>
          <Link href="/papers?id=2">Paper 3</Link>
          <Link href="/papers?id=3">Paper 4</Link>
          <Link href="/papers?id=4">Paper 5</Link>
          <Link href="/papers?id=5">Paper 6</Link>
          <Link href="/papers?id=6">Paper 7</Link>
        </CardBody>
        <StyledLink href="/papers">
          See more <HiArrowRight size={20} />
        </StyledLink>
      </StyledCard>
      <StyledCard>
        <Heading>Tags</Heading>
        <CardBody>
          <Link href="/papers/tags?id=0">Tag 1</Link>
          <Link href="/papers/tags?id=1">Tag 2</Link>
          <Link href="/papers/tags?id=2">Tag 3</Link>
        </CardBody>
        <StyledLink href="/papers/tags">
          See more <HiArrowRight size={20} />
        </StyledLink>
      </StyledCard>
    </Main>
  )
}

const Main = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);

  grid-gap: 1.5rem;
`

const StyledCard = styled(Card)`
  display: grid;
  grid-template-rows: min-content auto min-content;
  grid-template-columns: 1fr;

  height: 34vh;

  > a {
    justify-self: end;
  }
`

const Heading = styled.h2`
  text-align: center;
  font-weight: 500;
`

// @ts-ignore
const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  height: 100%;
  overflow-y: scroll;

  row-gap: 16px;

  > a {
    text-decoration: none;
    color: #fff;
    width: 100%;
    padding: 0.5rem 1rem;

    box-sizing: border-box;

    border-radius: 12px;
    background-color: #282a8f;

    &:hover {
      background-color: #282a8f;
    }
  }
`
