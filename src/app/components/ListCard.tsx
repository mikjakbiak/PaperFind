'use client'

import styled from '@emotion/styled'
import axios from 'axios'
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { IoTrashBin } from 'react-icons/io5'
import { NumBool } from 'src/types'
import { sortAlphabetically } from 'src/utils/sortAlphabetically'
import Button from './Button'
import Card from './Card'
import { CardTypeWithoutGeneral } from './CardsGrid'
import Checkbox from './Checkbox'
import CreateGroupModal from './Modals/CreateGroupModal'
import CreateLibraryModal from './Modals/CreateLibraryModal'

type Props = {
  card: CardTypeWithoutGeneral
  isGroupPage?: boolean
  showNewItemButton?: boolean
}

type Inputs = {
  selectedPapers: string[]
}

export default function ListCard({ card, isGroupPage, showNewItemButton = true }: Props) {
  const { title, items } = card
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()
  const [showModal, setShowModal] = useState(false)
  const [isSelecting, setIsSelecting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      selectedPapers: [],
    },
  })

  async function deleteSelected(data: Inputs) {
    if (!data.selectedPapers.length) return setIsSelecting(false)

    setIsLoading(true)

    const body = params?.libraryId
      ? {
          paperIds: data.selectedPapers,
          libraryId: params.libraryId,
        }
      : params?.groupId
      ? {
          paperIds: data.selectedPapers,
          groupId: params.groupId,
        }
      : params?.papersId && params?.papersId !== 'all'
      ? {
          paperIds: data.selectedPapers,
          libraryId: (params.papersId as string).split('-')[1],
        }
      : {
          paperIds: data.selectedPapers,
        }

    await axios
      .post('/api/delete-papers', body)
      .then(() => {
        router.refresh()
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setIsLoading(false)
        setIsSelecting(false)
      })
  }

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
        {title === 'Libraries' ? (
          items
            .sort((a, b) => sortAlphabetically(a, b, 'name'))
            .map((item, i) => (
              <Link key={item.id + i} href={isGroupPage ? `${pathname}/${item.id}` : `/papers/lib-${item.id}`}>
                {item.name}
              </Link>
            ))
        ) : title === 'Research Groups' ? (
          items
            .sort((a, b) => sortAlphabetically(a, b, 'name'))
            .map((item, i) => (
              <Link key={item.id + i} href={`/groups/${item.id}`}>
                {item.name}
              </Link>
            ))
        ) : title === 'Papers' ? (
          <StyledForm onSubmit={handleSubmit(deleteSelected)}>
            <>
              {title === 'Papers' && isSelecting ? (
                <DeleteButtons>
                  <Button variant="outline" onClick={() => setIsSelecting(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" loading={Number(isLoading) as NumBool}>
                    Delete
                  </Button>
                </DeleteButtons>
              ) : (
                <DeleteButton size={30} onClick={() => setIsSelecting(true)} />
              )}
              {items
                .sort((a, b) => sortAlphabetically(a, b, 'title'))
                .map((item, i) =>
                  isSelecting ? (
                    <Checkbox
                      {...register('selectedPapers')}
                      key={item.id + i}
                      value={item.id}
                      checkbox_title={item.title}
                    />
                  ) : (
                    <Link key={item.id + i} href={isGroupPage ? `${pathname}` : '/papers/all'}>
                      <span>{item.title}</span>
                      <span>
                        <span>{item.authors[0]?.fName}</span>
                        <span>{item.authors[0]?.lName}</span>
                      </span>
                    </Link>
                  )
                )}
            </>
          </StyledForm>
        ) : title === 'Tags' ? (
          items.map((item, i) => (
            <Link key={item.id + i} href={`/tags?id=${item.id}`}>
              {item.name}
            </Link>
          ))
        ) : title === 'Members' ? (
          items
            .sort((a, b) => sortAlphabetically(a, b, 'firstName'))
            .map((user, i) => (
              <div key={user.id + i}>
                {user.firstName} {user.lastName}
              </div>
            ))
        ) : null}
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

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  height: 100%;
  width: 100%;

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
`

const DeleteButton = styled(IoTrashBin)`
  position: absolute;
  top: 1.5rem;
  right: 5rem;

  color: #e6d840;
  cursor: pointer;
`

const DeleteButtons = styled.div`
  position: absolute;
  top: 1rem;
  right: 3rem;

  display: flex;
  justify-content: flex-end;
  align-items: center;

  column-gap: 1rem;
`
