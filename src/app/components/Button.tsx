import styled from '@emotion/styled'
import React from 'react'

type Props = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  className?: string
  children: React.ReactNode
  variant?: 'default' | 'sidebar-primary' | 'sidebar-secondary'
  active?: boolean
  huge?: boolean
}

export default function Button(props: Props) {
  const { children, variant = 'default' } = props
  switch (variant) {
    case 'default':
      return <Default {...props}>{children}</Default>
    case 'sidebar-primary':
      return <SidebarPrimary {...props}>{children}</SidebarPrimary>
    case 'sidebar-secondary':
      return <SidebarSecondary {...props}>{children}</SidebarSecondary>
  }
}

const Default = styled.button<{ huge?: boolean }>`
  background-color: #e6d840;
  color: #14203d;
  font-family: inherit;

  border: none;
  border-radius: 12px;

  padding: ${({ huge }) => (huge ? '2.5rem 3rem' : '0.8rem 1rem')};

  font-weight: bold;
  font-size: ${({ huge }) => (huge ? '3rem' : '1rem')};

  &:hover {
    cursor: pointer;
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

const SidebarSecondary = styled.button<{ active?: boolean }>`
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
