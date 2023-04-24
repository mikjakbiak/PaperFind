import styled from '@emotion/styled'
import React, { useState } from 'react'
import Button from '../Button'
import BaseModal from './BaseModal'
import { IoTrashBin } from 'react-icons/io5'
import axios from 'axios'
import { ClientSideItem } from 'src/shared/db'
import { PaperPopulated } from 'src/types'
import { getBibliography } from 'src/utils/getBibliography'

type Props = {
  papers: ClientSideItem<PaperPopulated>[]
  libraryId: string
  closeModal: () => void
  refetch?: () => void
}

export default function LibrarySettingsModal({ papers, libraryId, closeModal, refetch }: Props) {
  const [isCopied, setIsCopied] = useState(false)

  async function deleteLibrary() {
    const res = await axios
      .post('/api/delete-library', {
        libraryId,
      })
      .catch((err) => {
        console.error(err)
        return err?.response
      })

    if (res?.status === 200) {
      if (refetch) refetch()
      closeModal()
    }
  }

  function generateBibliography() {
    const bib = getBibliography(papers)
    navigator.clipboard.writeText(bib.join('\n'))
    setIsCopied(true)

    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  return (
    <BaseModal closeModal={closeModal}>
      <Body>
        <Heading>Library Settings</Heading>
        <Button onClick={generateBibliography}>{isCopied ? 'Copied to Clipboard!' : 'Generate Bibliography'}</Button>
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
