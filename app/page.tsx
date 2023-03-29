'use client'

import styled from '@emotion/styled'
import { useRouter } from 'next/navigation'
import Button from './components/Button'

export default function LandingPage() {
  const router = useRouter()

  return (
    <Main>
      <BigText>Collaborate and share your findings</BigText>
      <Button huge onClick={() => router.push('/signUp')}>
        START SHARING
      </Button>
    </Main>
  )
}

const Main = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  flex-direction: column;
`

const BigText = styled.h1`
  font-size: 5rem;

  text-align: center;
`
