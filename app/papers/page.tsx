'use client'

import StyledLink from '@/components/StyledLink'
import styled from '@emotion/styled'
import { Author, Paper } from '@prisma/client'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { HiPlus } from 'react-icons/hi'

export default function PapersPage() {
  const [papers, setPapers] = useState<
    (Paper & {
      authors: Author[]
    })[]
  >([])
  useEffect(() => {
    axios
      .get<{
        error: boolean
        data: (Paper & {
          authors: Author[]
        })[]
      }>('/api/get-papers')
      .then((res) => {
        setPapers(res.data.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])

  return (
    <Main>
      <Navigation>
        <NavigationLink href="/papers" active>
          Papers
        </NavigationLink>
        <NavigationLink href="/papers/tags">Tags</NavigationLink>
      </Navigation>
      <AddNew>
        <StyledLink href="/papers/add-new">
          <Icon />
          Add Paper
        </StyledLink>
      </AddNew>
      <Content>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Journal</th>
              <th>Year</th>
            </tr>
          </thead>
          <tbody>
            {papers.map((paper, id) => (
              <tr key={id}>
                <td>{paper.title}</td>
                <td>
                  {paper.authors[0]?.fName} {paper.authors[0]?.lName}
                </td>
                <td>{paper.publication}</td>
                <td>{paper.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Content>
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

const NavigationLink = styled(Link)<{ active?: boolean }>`
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
