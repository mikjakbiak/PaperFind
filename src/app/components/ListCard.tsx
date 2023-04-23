'use client'

import styled from '@emotion/styled'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import { HiPlus } from 'react-icons/hi'
import { sortAlphabetically } from 'src/utils/sortAlphabetically'
import Button from './Button'
import Card from './Card'
import { CardTypeWithoutGeneral } from './CardsGrid'
import Icon from './Icon'
import CreateGroupModal from './Modals/CreateGroupModal'
import CreateLibraryModal from './Modals/CreateLibraryModal'

type Props = {
  card: CardTypeWithoutGeneral
  isGroupPage?: boolean
  showNewItemButton?: boolean
}

export default function ListCard({ card, isGroupPage, showNewItemButton = true }: Props) {
  const { title, items } = card
  const pathname = usePathname()
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)

  const newItemText = useMemo(() => {
    switch (title) {
      case 'Libraries':
        return 'New Library'
      case 'Research Groups':
        return isGroupPage ? 'New Nested Group' : 'New Group'
      case 'Papers':
        return 'New Paper'
      case 'Tags':
        return 'New Tag'
      case 'Members':
        return 'New Member'
      default:
        return 'Add New'
    }
  }, [title, isGroupPage])
  const Modal = useMemo(() => {
    switch (title) {
      case 'Libraries':
        return <CreateLibraryModal closeModal={() => setShowModal(false)} refetch={() => router.refresh()} />
      case 'Research Groups':
        return (
          <CreateGroupModal closeModal={() => setShowModal(false)} refetch={() => router.refresh()} createNestedGroup />
        )
      default:
        return null
    }
  }, [title])

  return (
    <StyledCard key={title}>
      <Heading>{title}</Heading>
      {showNewItemButton && Modal && (
        <>
          {showModal && Modal}
          <StyledButton onClick={() => setShowModal(true)}>{newItemText}</StyledButton>
        </>
      )}
      <CardBody>
        {title === 'Libraries'
          ? items
              .sort((a, b) => sortAlphabetically(a, b, 'name'))
              .map((item, i) => (
                <Link key={item.id + i} href={isGroupPage ? `${pathname}/${item.id}` : `/papers/lib-${item.id}`}>
                  {item.name}
                </Link>
              ))
          : title === 'Research Groups'
          ? items
              .sort((a, b) => sortAlphabetically(a, b, 'name'))
              .map((item, i) => (
                <Link key={item.id + i} href={`/groups/${item.id}`}>
                  {item.name}
                </Link>
              ))
          : title === 'Papers'
          ? items
              .sort((a, b) => sortAlphabetically(a, b, 'title'))
              .map((item, i) => (
                <Link key={item.id + i} href={isGroupPage ? `${pathname}` : '/papers/all'}>
                  <span>{item.title}</span>
                  <span>
                    <span>{item.authors[0]?.fName}</span>
                    <span>{item.authors[0]?.lName}</span>
                  </span>
                </Link>
              ))
          : title === 'Tags'
          ? items.map((item, i) => (
              <Link key={item.id + i} href={`/tags?id=${item.id}`}>
                {item.name}
              </Link>
            ))
          : title === 'Members'
          ? items
              .sort((a, b) => sortAlphabetically(a, b, 'firstName'))
              .map((user, i) => (
                <div key={user.id + i}>
                  {user.firstName} {user.lastName}
                </div>
              ))
          : null}
      </CardBody>
    </StyledCard>
  )
}

const StyledCard = styled(Card)`
  position: relative;

  display: grid;
  grid-template-rows: min-content auto min-content;
  grid-template-columns: 1fr;

  height: 68vh;

  > a {
    justify-self: end;
  }
`

const Heading = styled.h2`
  text-align: center;
  font-weight: 500;
`

const StyledButton = styled(Button)`
  position: absolute;
  top: 1rem;
  right: 3rem;
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

    column-gap: 8px;
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
const Plus = styled(Icon(HiPlus))``
