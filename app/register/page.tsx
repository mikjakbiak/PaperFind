'use client'

import Button from '@/components/Button'
import Card from '@/components/Card'
import Input from '@/components/Input'
import StyledLink from '@/components/StyledLink'
import styled from '@emotion/styled'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { HiOutlineArrowNarrowLeft } from 'react-icons/hi'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { UserResponse } from 'pages/api/is-email-available'

type Inputs = {
  fName: string
  lName: string
  email: string
  password: string
  passwordConfirmation: string
}

export default function SignUpPage() {
  const [authError, setAuthError] = useState('')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()

  async function isEmailAvailable(email: string) {
    return await axios
      .get<UserResponse>('/api/is-email-available?email=' + email)
      .then((res) => {
        return res.data.isAvailable
      })
      .catch((err) => {
        console.error(err)
        return false
      })
  }

  function onSubmit(data: Inputs) {
    axios
      .post('/api/auth/register', {
        email: data.email,
        password: data.password,
        firstName: data.fName,
        lastName: data.lName,
      })
      .then(() => {
        setAuthError('')
        router.push('/home')
      })
      .catch((err) => {
        console.error(err)
        setAuthError('Something went wrong')
      })
  }

  return (
    <Main>
      <StyledLink href="/">
        <HiOutlineArrowNarrowLeft size={25} />
        Back
      </StyledLink>
      <Card>
        <Header>Sign Up</Header>
        <StyledForm onSubmit={handleSubmit(onSubmit)}>
          <Input {...register('fName', { required: true })} label="First Name" placeholder="first name" />
          <Input {...register('lName', { required: true })} label="Last Name" placeholder="last name" />
          <Input
            {...register('email', {
              required: true,
              pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
              validate: async (value) => (await isEmailAvailable(value)) || 'Email is already in use',
            })}
            label="Email"
            placeholder="example@test.com"
          />
          <Input
            {...register('password', { required: true, pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/ })}
            label="Password"
            placeholder="********"
            type="password"
          />
          <Input
            {...register('passwordConfirmation', {
              required: true,
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
              validate: (value) => value === watch('password'),
            })}
            label="Confirm Password"
            placeholder="********"
            type="password"
          />
          <StyledButton type="submit">Sign Up</StyledButton>
        </StyledForm>
        {authError && <p>{authError}</p>}
      </Card>
    </Main>
  )
}

const Main = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  flex-direction: column;

  > a {
    position: absolute;
    top: 0;
    left: 0;
  }
`

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
`

const StyledButton = styled(Button)`
  margin-top: 1rem;
`

const Header = styled.h1`
  font-size: 2.5rem;
`
