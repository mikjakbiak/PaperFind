import styled from '@emotion/styled'
import axios from 'axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { NumBool } from 'src/types'
import Button from '../Button'
import Input from '../Input'
import BaseModal from './BaseModal'

type Props = {
  closeModal: () => void
  refetch?: () => void
}

type Inputs = {
  name: string
}

export default function CreateLibraryModal({ closeModal, refetch }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  function onSubmit(data: Inputs) {
    setIsLoading(true)

    axios
      .post('/api/add-library', {
        name: data.name,
        libraryIds: [],
        parentGroupId: null,
      })
      .then(() => refetch?.())
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setIsLoading(false)
        closeModal()
      })
  }

  return (
    <BaseModal closeModal={closeModal}>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <Heading>New Library</Heading>
        <Input
          {...register('name', {
            required: true,
          })}
          label="Library Name"
          placeholder="New Library"
          full
        />
        <StyledButton type="submit" loading={Number(isLoading) as NumBool}>
          Create
        </StyledButton>
      </StyledForm>
    </BaseModal>
  )
}

const Heading = styled.h1`
  text-align: center;
  font-weight: 500;
`

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  row-gap: 1rem;

  width: 100%;
`

const StyledButton = styled(Button)`
  margin-top: 2rem;
`
