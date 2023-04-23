'use client'

import styled from '@emotion/styled'
import React, { useMemo } from 'react'
import { GroupPopulated, LibraryPopulated } from 'src/pages/api/get-many-groups'
import Card from 'src/app/components/Card'
import StyledLink from 'src/app/components/StyledLink'
import { HiArrowRight } from 'react-icons/hi'
import Link from 'next/link'
import { User } from '@prisma/client'
import { ClientSideItem } from 'src/shared/db'
import { PaperPopulated } from 'src/types'
import { usePathname } from 'next/navigation'

type GeneralCard = {
  seeMore?: boolean
}

type LibraryCard = {
  title: 'Libraries'
  items: ClientSideItem<LibraryPopulated>[]
}

type GroupCard = {
  title: 'Research Groups'
  items: ClientSideItem<GroupPopulated>[]
  nested?: boolean
}

type PaperCard = {
  title: 'Papers'
  items: ClientSideItem<PaperPopulated>[]
}

type TagCard = {
  title: 'Tags'
  items: any[]
  // items: TagPopulated[]
}

type MemberCard = {
  title: 'Members'
  items: ClientSideItem<User>[]
  // items: MembersPopulated[]
}

export type CardType = GeneralCard & (LibraryCard | GroupCard | PaperCard | TagCard | MemberCard)

type Props = {
  cards: CardType[]
  isGroupPage?: boolean
}

export default function CardsGrid({ cards, isGroupPage }: Props) {
  const pathname = usePathname()

  const cardsUI = cards.map((card) => {
    const seeMoreHref = useMemo(() => {
      card.title === 'Libraries'
        ? isGroupPage
          ? `${pathname}/libraries`
          : card.items.length
          ? `/papers/lib-${card.items[0].id}`
          : '/papers/all'
        : card.title === 'Research Groups'
        ? '/groups'
        : '/papers/all'

      switch (card.title) {
        case 'Libraries':
          if (isGroupPage) {
            return `${pathname}/libraries`
            //? If there is any library, go to the first one since we don't have a general library page
          } else if (card.items.length) {
            return `/papers/lib-${card.items[0].id}`
          } else {
            return '/papers/all'
          }
        case 'Research Groups':
          return isGroupPage ? `${pathname}/groups` : '/groups'
        case 'Papers':
          return isGroupPage ? `${pathname}/papers` : '/papers/all'
        case 'Tags':
          return isGroupPage ? `${pathname}/tags` : '/papers/tags'
        case 'Members':
          return isGroupPage ? `${pathname}/members` : '/groups/members'
        default:
          return ''
      }
    }, [isGroupPage])

    return (
      <StyledCard key={card.title} cardsCount={cards.length}>
        <Heading>{card.title}</Heading>
        <CardBody>
          {card.title === 'Libraries'
            ? card.items.map((item, i) => (
                <Link
                  key={item.id + i}
                  href={isGroupPage ? `${pathname}/libraries/${item.id}` : `/papers/lib-${item.id}`}
                >
                  {item.name}
                </Link>
              ))
            : card.title === 'Research Groups'
            ? card.items.map((item, i) => (
                <Link key={item.id + i} href={`/groups/${item.id}`}>
                  {item.name}
                </Link>
              ))
            : card.title === 'Papers'
            ? card.items.map((item, i) => (
                <Link key={item.id + i} href={isGroupPage ? `${pathname}/papers` : '/papers/all'}>
                  <span>{item.title}</span>
                  <span>
                    <span>{item.authors[0]?.fName}</span>
                    <span>{item.authors[0]?.lName}</span>
                  </span>
                </Link>
              ))
            : card.title === 'Tags'
            ? card.items.map((item, i) => (
                <Link key={item.id + i} href={`/tags?id=${item.id}`}>
                  {item.name}
                </Link>
              ))
            : card.title === 'Members'
            ? card.items.map((user, i) => (
                <div key={user.id + i}>
                  {user.firstName} {user.lastName}
                </div>
              ))
            : null}
        </CardBody>
        {(card.seeMore ?? true) && (
          <StyledLink href={seeMoreHref}>
            See more <HiArrowRight size={20} />
          </StyledLink>
        )}
      </StyledCard>
    )
  })
  return <Main cardsCount={cards.length}>{cardsUI}</Main>
}

const Main = styled.div<{ cardsCount: number }>`
  display: grid;
  grid-template-columns: repeat(${({ cardsCount }) => (cardsCount === 1 ? cardsCount : 2)}, 1fr);
  grid-template-rows: repeat(${(props) => Math.ceil(props.cardsCount / 2)}, 1fr);

  grid-gap: 1.5rem;
`

const StyledCard = styled(Card)<{ cardsCount: number }>`
  display: grid;
  grid-template-rows: min-content auto min-content;
  grid-template-columns: 1fr;

  height: ${({ cardsCount }) => (cardsCount === 1 || cardsCount === 2 ? '68vh' : '32vh')};

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
      background-color: #242580;
    }

    display: flex;
    justify-content: space-between;

    > span {
      display: flex;
      column-gap: 8px;
    }
  }

  > div {
    text-decoration: none;
    color: #fff;
    width: 100%;
    padding: 0.5rem 1rem;

    box-sizing: border-box;

    border-radius: 12px;
    background-color: #282a8f;
  }
`
