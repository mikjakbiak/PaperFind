'use-client'

import styled from '@emotion/styled'
import React from 'react'
import { DotLoader } from 'react-spinners'
import { NumBool } from 'src/types'

type Props = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  className?: string
  children: React.ReactNode
  variant?: 'default' | 'outline' | 'sidebar-primary' | 'sidebar-secondary'
  active?: NumBool //? hydration-error warning if boolean
  huge?: NumBool
  loading?: NumBool
  loaderColor?: string
}

export default function Button(props: Props) {
  const { children, loading, type, huge, variant = 'default', loaderColor } = props

  switch (variant) {
    case 'default':
      return (
        <Default {...props} type={loading ? 'button' : type}>
          {loading ? <DotLoader color={loaderColor ?? '#2F31A8'} size={huge ? '3.25rem' : '1.25rem'} /> : children}
        </Default>
      )
    case 'outline':
      return (
        <Outline {...props}>
          {loading ? <DotLoader color={loaderColor ?? '#e6d840'} size="1.25rem" /> : children}
        </Outline>
      )
    case 'sidebar-primary':
      return <SidebarPrimary {...props}>{children}</SidebarPrimary>
    case 'sidebar-secondary':
      return <SidebarSecondary {...props}>{children}</SidebarSecondary>
  }
}

const Default = styled.button<{ huge?: NumBool; loading?: NumBool }>`
  background-color: #e6d840;
  color: #14203d;
  font-family: inherit;

  border: none;
  border-radius: 12px;

  padding: ${({ huge }) => (huge ? '2.5rem 3rem' : '0.8rem 1rem')};

  font-weight: bold;
  font-size: ${({ huge }) => (huge ? '3rem' : '1rem')};

  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: ${({ loading }) => (loading ? 'not-allowed' : 'pointer')};
  }
`

const Outline = styled.button<{ loading?: NumBool }>`
  background-color: transparent;
  color: #e6d840;
  font-family: inherit;

  border: 2px solid #e6d840;
  border-radius: 12px;

  padding: 0.8rem 1rem;

  font-weight: bold;
  font-size: 1rem;

  &:hover {
    cursor: ${({ loading }) => (loading ? 'not-allowed' : 'pointer')};
  }
`

const SidebarPrimary = styled.button`
  background-color: #e6d840;
  color: #14203d;
  font-family: inherit;

  border: none;
  border-radius: 12px;

  padding: 0.8rem 1rem;

  font-weight: bold;
  font-size: 1rem;

  &:hover {
    cursor: pointer;
  }
`

const SidebarSecondary = styled.button<{ active?: NumBool }>`
  background-color: #19294d;
  color: #4d79e6;
  font-family: inherit;

  border: none;
  border-radius: 12px;

  padding: 0.8rem 1rem;

  font-weight: bold;
  font-size: 1rem;

  &:hover {
    cursor: pointer;
    background-color: #4d79e6;
    color: #19294d;
  }

  ${({ active }) => active && 'background-color: #4d79e6; color: #19294d;'}
`
