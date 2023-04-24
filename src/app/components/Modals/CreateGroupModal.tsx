import React, { useState } from 'react'
import styled from '@emotion/styled'
import { useFieldArray, useForm } from 'react-hook-form'
import axios from 'axios'
import { UserResponse } from 'src/pages/api/is-email-available'
import Input from '../Input'
import Button from '../Button'
import { HiCheck, HiMinus, HiPlus } from 'react-icons/hi'
import Icon from '../Icon'
import { MdModeEdit } from 'react-icons/md'
import { NumBool } from 'src/types'
import BaseModal from './BaseModal'
import { useParams } from 'next/navigation'

interface ModalProps {
  closeModal: () => void
  refetch?: () => void
  createNestedGroup?: boolean
}

type Inputs = {
  title: string
  users: { email: string }[]
}

export default function CreateGroupModal({ closeModal, refetch, createNestedGroup }: ModalProps) {
  const params = useParams()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      title: 'Research Group',
      users: [{ email: '' }],
    },
  })
  const { fields, remove, append } = useFieldArray({
    name: 'users',
    control,
  })

  async function isEmailInDb(email: string) {
    return await axios
      .get<UserResponse>('/api/is-email-available?email=' + email)
      .then((res) => {
        return !res.data.isAvailable
      })
      .catch((err) => {
        console.error(err)
        return true
      })
  }

  async function onSubmit(data: Inputs) {
    setIsLoading(true)

    const parentGroupId = (createNestedGroup && params?.groupId) || null
    await axios
      .post('/api/add-group', {
        name: data.title,
        userEmails: data.users.map((user) => user.email),
        parentGroupId,
        libraryIds: [],
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
        <Head>
          {isEditing ? (
            <>
              <TitleInput
                {...register('title', { required: true, validate: () => !isEditing })}
                placeholder={watch('title')}
              />
              <CheckIcon size={20} onClick={() => setIsEditing(false)} />
            </>
          ) : (
            <>
              <Heading>{watch('title')}</Heading>
              <EditIcon size={20} onClick={() => setIsEditing(true)} />
            </>
          )}
        </Head>
        <Email>
          <Input
            {...register('users.0.email', {
              required: true,
              pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
              validate: async (value) => (await isEmailInDb(value)) || 'There is no user with this email',
            })}
            label="Members"
            placeholder="email@example.com"
            full
          />
          {fields.length > 1 && <MinusIcon onClick={() => remove(0)} />}
        </Email>
        {fields.slice(1).map((field, i) => (
          <Email key={field.id}>
            <Input
              {...register(`users.${i + 1}.email`, {
                required: true,
                pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                validate: async (value) => (await isEmailInDb(value)) || 'There is no user with this email',
              })}
              placeholder="email@example.com"
              full
            />
            <MinusIcon onClick={() => remove(i + 1)} />
          </Email>
        ))}
        <AddEmail type="button" onClick={() => append({ email: '' })}>
          <PlusIcon />
          Add Member
        </AddEmail>
        <StyledButton type="submit" loading={Number(isLoading) as NumBool}>
          Create
        </StyledButton>
      </StyledForm>
    </BaseModal>
  )
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  row-gap: 1rem;

  width: 100%;
`

const Heading = styled.h1`
  text-align: center;
  font-weight: 500;
`

const Head = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  column-gap: 1rem;
  width: 100%;
`

const TitleInput = styled(Input)`
  margin: 2rem 0;
`

const Email = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;

  width: 100%;

  > svg {
    position: absolute;
    cursor: pointer;
    right: -2rem;
    bottom: 0.4rem;
  }
`

const AddEmail = styled.button`
  justify-self: end;

  border: none;
  background-color: transparent;
  padding: 0;

  color: #e6d840;
  font-size: 1rem;
  font-family: inherit;
  font-weight: bold;

  display: flex;
  align-items: center;
  justify-content: flex-start;

  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  > svg {
    margin-left: 8px;
    margin-right: 8px;
  }
`

const StyledButton = styled(Button)`
  margin-top: 2rem;
`

const EditIcon = Icon(MdModeEdit)

const CheckIcon = styled(Icon(HiCheck))``

const MinusIcon = styled(Icon(HiMinus))``

const PlusIcon = styled(Icon(HiPlus))``
