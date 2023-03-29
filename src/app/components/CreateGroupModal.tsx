'use client'

import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import styled from '@emotion/styled'
import { useFieldArray, useForm } from 'react-hook-form'
import axios from 'axios'
import { UserResponse } from 'src/pages/api/is-email-available'
import Input from './Input'
import Button from './Button'
import { IoClose } from 'react-icons/io5'
import { HiCheck, HiMinus, HiPlus } from 'react-icons/hi'
import Icon from './Icon'
import { MdModeEdit } from 'react-icons/md'

interface ModalProps {
  closeModal: () => void
  refetch: () => void
}

type Inputs = {
  title: string
  users: { email: string }[]
}

export default function CreateGroupModal({ closeModal, refetch }: ModalProps) {
  const [isBrowser, setIsBrowser] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
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

  // create ref for the StyledModalWrapper component
  const modalWrapperRef = useRef<HTMLDivElement>(null)

  // check if the user has clickedinside or outside the modal
  const backDropHandler = (e: MouseEvent) => {
    if (!modalWrapperRef.current?.contains(e.target as Node)) {
      closeModal()
    }
  }

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  useEffect(() => {
    if (isBrowser) {
      window.addEventListener('click', backDropHandler)
    }

    return () => window.removeEventListener('click', backDropHandler)
  }, [isBrowser])

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

  function onSubmit(data: Inputs) {
    axios
      .post('/api/add-group', {
        name: data.title,
        userEmails: data.users.map((user) => user.email),
        libraryIds: [],
        parentGroupId: null,
      })
      .then(() => refetch())
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        closeModal()
      })
  }

  const modalContent = (
    <Overlay>
      <Main ref={modalWrapperRef}>
        <CloseIcon onClick={closeModal} />
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
          <StyledButton type="submit">Create</StyledButton>
        </StyledForm>
      </Main>
    </Overlay>
  )

  if (isBrowser) {
    return ReactDOM.createPortal(modalContent, document.getElementById('modal-root')!)
  } else {
    return null
  }
}
const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`

const Main = styled.div`
  box-sizing: border-box;

  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  row-gap: 1rem;

  background-color: #2f31a8;
  border-radius: 1rem;
  padding: 2rem 3rem;
`

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

const CloseIcon = styled(Icon(IoClose))`
  position: absolute;
  top: 1rem;
  right: 1rem;
`

const EditIcon = Icon(MdModeEdit)

const CheckIcon = styled(Icon(HiCheck))``

const MinusIcon = styled(Icon(HiMinus))``

const PlusIcon = styled(Icon(HiPlus))``
