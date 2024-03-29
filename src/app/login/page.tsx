'use client'

import Button from 'src/app/components/Button'
import Card from 'src/app/components/Card'
import Input from 'src/app/components/Input'
import StyledLink from 'src/app/components/StyledLink'
import styled from '@emotion/styled'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { HiOutlineArrowNarrowLeft } from 'react-icons/hi'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { NumBool } from 'src/types'

type Inputs = {
  fName: string
  lName: string
  email: string
  password: string
  passwordConfirmation: string
}

export default function SignUpPage() {
  const [authError, setAuthError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const prompt = searchParams?.get('prompt') === 'true' ? true : false

  const {
    register,
    handleSubmit,
    //TODO: errors
    formState: { errors },
  } = useForm<Inputs>()

  useEffect(() => {
    router.prefetch('/home')
  }, [])

  async function onSubmit(data: Inputs) {
    if (isLoading) return

    setIsLoading(true)

    await axios
      .post('/api/auth/login', {
        email: data.email,
        password: data.password,
      })
      .then(() => {
        setAuthError('')
        //? We're using window.location.href instead of router.push because router.push has some unidentified bug
        window.location.href = '/home'
      })
      .catch((err) => {
        if (err.response.status === 401) {
          setAuthError('Invalid email or password')
        } else {
          console.error(err)
          setAuthError('Something went wrong')
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <Main>
      <StyledLink href="/">
        <HiOutlineArrowNarrowLeft size={25} />
        Back
      </StyledLink>
      <Card>
        <Header>Sign In</Header>
        <StyledForm onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register('email', {
              required: true,
            })}
            label="Email"
            placeholder="example@test.com"
          />
          <Input
            {...register('password', { required: true })}
            label="Password"
            placeholder="********"
            type="password"
          />
          <StyledButton type="submit" loading={Number(isLoading) as NumBool}>
            Sign In
          </StyledButton>
        </StyledForm>
        {authError && <p>{authError}</p>}
      </Card>
      {prompt && (
        <Prompt>
          <b>NOTE:</b> You need to be signed in to go further 😉
        </Prompt>
      )}
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

const Prompt = styled.p`
  margin-top: 3rem;
`

const Header = styled.h1`
  font-size: 2.5rem;
`
