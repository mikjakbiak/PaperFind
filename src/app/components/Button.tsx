'use-client'

import styled from '@emotion/styled'
import React from 'react'
import { DotLoader } from 'react-spinners'
import { NumBool } from 'src/types'

type Props = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  className?: string
  children: React.ReactNode
  variant?: 'default' | 'sidebar-primary' | 'sidebar-secondary'
  active?: NumBool //? hydration-error warning if boolean
  huge?: boolean
  loading?: boolean
}

export default function Button(props: Props) {
  const { children, loading, type, huge, variant = 'default' } = props
  switch (variant) {
    case 'default':
      return (
        <Default {...props} type={loading ? 'button' : type}>
          {loading ? <DotLoader color="#2F31A8" size={huge ? '3.25rem' : '1.25rem'} /> : children}
        </Default>
      )
    case 'sidebar-primary':
      return <SidebarPrimary {...props}>{children}</SidebarPrimary>
    case 'sidebar-secondary':
      return <SidebarSecondary {...props}>{children}</SidebarSecondary>
  }
}

const Default = styled.button<{ huge?: boolean; loading?: boolean }>`
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
