import styled from '@emotion/styled'
import Link from 'next/link'
import React from 'react'

type Props = {
  children: React.ReactNode
  href: string
}

export default function StyledLink({ children, href }: Props) {
  return <_StyledLink href={href}>{children}</_StyledLink>
}

const _StyledLink = styled(Link)`
  text-decoration: none;
  color: #e6d840;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }

  > svg {
    margin-left: 8px;
    margin-right: 8px;
  }
`
