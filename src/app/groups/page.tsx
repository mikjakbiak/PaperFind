'use client'

import Card from 'src/app/components/Card'
import StyledLink from 'src/app/components/StyledLink'
import styled from '@emotion/styled'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import { HiArrowRight } from 'react-icons/hi'
import { GroupPopulated } from 'src/pages/api/get-many-groups'
import { useSearchParams } from 'next/navigation'
import { PaperPopulated } from 'src/pages/api/get-papers'

export default function GroupsPage() {
  const searchParams = useSearchParams()
  const groupId = searchParams.get('id')
  const [group, setGroup] = useState<GroupPopulated>()
  useEffect(() => {
    axios
      .get<{
        error: boolean
        data: GroupPopulated
      }>(`/api/get-single-group?id=${groupId}`)
      .then((res) => {
        setGroup(res.data.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])

  const papers = useMemo(() => {
    if (!group) return []
    return group.libraries.reduce<PaperPopulated[]>((acc, library) => {
      return [...acc, ...library.papers]
    }, [])
  }, [group])

  return (
    <Main>
      <StyledCard>
        <Heading>Libraries</Heading>
        <CardBody>
          {group?.libraries.map((library) => (
            <Link key={library.id} href={`/papers/libraries?id=${library.id}`}>
              {library.name}
            </Link>
          ))}
        </CardBody>
        <StyledLink href="/papers/libraries">
          See more <HiArrowRight size={20} />
        </StyledLink>
      </StyledCard>
      <StyledCard>
        <Heading>Papers</Heading>
        <CardBody>
          {papers.map((paper) => (
            <Link key={paper.id} href={`/papers/${paper.id}`}>
              <span>{paper.title}</span>
              <span>
                <span>{paper.authors[0]?.fName}</span>
                <span>{paper.authors[0]?.lName}</span>
              </span>
            </Link>
          ))}
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
      <StyledCard>
        <Heading>Members</Heading>
        <CardBody>
          {group?.users.map((user) => (
            <Link key={user.id} href={`/groups?id=${user.id}`}>
              {user.firstName}
            </Link>
          ))}
        </CardBody>
        <StyledLink href="/groups">
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

    display: flex;
    justify-content: space-between;

    > span {
      display: flex;
      column-gap: 8px;
    }
  }
`
