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
import { IoTrashBin } from 'react-icons/io5'
import { TiUserDelete } from 'react-icons/ti'

interface ModalProps {
  name: string
  groupId: string
  closeModal: () => void
  refetch?: (action: 'refresh' | 'redirect') => void
}

type Inputs = {
  title: string
  users: { email: string }[]
}

export default function GroupSettingsModal({ name, groupId, closeModal, refetch }: ModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>()
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

  async function leaveGroup() {
    setIsLeaving(true)

    await axios
      .post('/api/leave-group', {
        groupId,
      })
      .then(() => refetch?.('redirect'))
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setIsLeaving(false)
        closeModal()
      })
  }

  async function deleteGroup() {
    setIsDeleting(true)

    await axios
      .post('/api/delete-group', {
        groupId,
      })
      .then(() => refetch?.('redirect'))
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setIsDeleting(false)
        closeModal()
      })
  }

  async function onSubmit(data: Inputs) {
    const { title, users } = data
    setIsLoading(true)

    const body = title
      ? users[0].email
        ? {
            groupId,
            name: data.title,
            userEmails: data.users.map((user) => user.email),
          }
        : {
            groupId,
            name: data.title,
          }
      : {
          groupId,
          userEmails: data.users.map((user) => user.email),
        }

    await axios
      .post('/api/update-group', body)
      .then(() => refetch?.('refresh'))
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
        <Heading>Group Settings</Heading>
        <Input {...register('title')} label="Rename Group" placeholder={name} full />
        <Email>
          <Input
            {...register('users.0.email', {
              pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
              validate: async (value) =>
                (value ? await isEmailInDb(value) : true) || 'There is no user with this email',
            })}
            label="Add More Members"
            placeholder="email@example.com"
            full
          />
          {fields.length > 1 && <MinusIcon onClick={() => remove(0)} />}
        </Email>
        {fields.slice(1).map((field, i) => (
          <Email key={field.id}>
            <Input
              {...register(`users.${i + 1}.email`, {
                pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                validate: async (value) =>
                  (value ? await isEmailInDb(value) : true) || 'There is no user with this email',
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
          Update
        </StyledButton>
      </StyledForm>
      <DangerZone>
        <DangerTitle>Danger Zone</DangerTitle>
        <DangerButton
          variant="outline"
          loaderColor="#f44336"
          onClick={leaveGroup}
          loading={Number(isLeaving) as NumBool}
        >
          <TiUserDelete size={25} />
          Leave Group
        </DangerButton>
        <DangerButton
          variant="outline"
          loaderColor="#f44336"
          onClick={deleteGroup}
          loading={Number(isDeleting) as NumBool}
        >
          <IoTrashBin size={25} />
          Delete Group
        </DangerButton>
      </DangerZone>
    </BaseModal>
  )
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  row-gap: 1rem;

  width: 100%;

  margin-bottom: 2rem;
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

const DangerZone = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
`

const DangerTitle = styled.span`
  font-weight: bold;
  font-size: 1.2rem;
`

const DangerButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  column-gap: 1rem;

  color: #f44336;
  border-color: #f44336;
`

const EditIcon = Icon(MdModeEdit)

const CheckIcon = styled(Icon(HiCheck))``

const MinusIcon = styled(Icon(HiMinus))``

const PlusIcon = styled(Icon(HiPlus))``
