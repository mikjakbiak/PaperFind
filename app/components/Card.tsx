import styled from '@emotion/styled'
import React from 'react'

type Props = {
  className?: string
  children: React.ReactNode
}

export default function Card({ className, children }: Props) {
  return <_Card className={className}>{children}</_Card>
}

const _Card = styled.div`
  background-color: #2f31a8;
  border-radius: 48px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  row-gap: 1rem;

  padding: 0 3rem 2rem;
`
