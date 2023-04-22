import styled from '@emotion/styled'
import React from 'react'
import Button from '../Button'
import BaseModal from './BaseModal'
import { IoTrashBin } from 'react-icons/io5'
import axios from 'axios'

type Props = {
  libraryId: string
  closeModal: () => void
  refetch?: () => void
}

export default function LibrarySettingsModal({ libraryId, closeModal, refetch }: Props) {
  async function deleteLibrary() {
    const res = await axios.post('/api/delete-library', {
      libraryId,
    })

    if (res.status === 200) {
      if (refetch) refetch()
      closeModal()
    }
  }

  return (
    <BaseModal closeModal={closeModal}>
      <Body>
        <Heading>Library Settings</Heading>
        <DeleteButton variant="outline" loaderColor="#f44336" onClick={deleteLibrary}>
          <IoTrashBin size={20} />
          Delete Library
        </DeleteButton>
      </Body>
    </BaseModal>
  )
}

const Heading = styled.h1`
  text-align: center;
  font-weight: 500;
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 1rem;

  width: 100%;
`

const DeleteButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;

  column-gap: 1rem;

  margin-top: 2rem;

  color: #f44336;
  border-color: #f44336;
`
