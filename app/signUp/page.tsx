'use client'

import Button from '@/components/Button'
import Card from '@/components/Card'
import Input from '@/components/Input'
import StyledLink from '@/components/StyledLink'
import styled from '@emotion/styled'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { HiOutlineArrowNarrowLeft } from 'react-icons/hi'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const router = useRouter()

  useEffect(() => {
    console.log(email)
  }, [email])

  return (
    <Main>
      <StyledLink href="/">
        <HiOutlineArrowNarrowLeft size={25} />
        Back
      </StyledLink>
      <Card>
        <Header>Sign Up</Header>
        <Input
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
        />
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="****************"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          label="Confirm Password"
          type="password"
          name="passwordConfirmation"
          placeholder="****************"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />
        <StyledButton onClick={() => router.push('/home')}>Sign Up</StyledButton>
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

const StyledButton = styled(Button)`
  margin-top: 1rem;
`

const Header = styled.h1`
  font-size: 2.5rem;
`
