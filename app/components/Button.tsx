import styled from '@emotion/styled'
import React from 'react'

type Props = {
  className?: string
  children: React.ReactNode
  type?: 'default' | 'sidebar-primary' | 'sidebar-secondary'
  active?: boolean
  huge?: boolean
  onClick?: () => void
}

export default function Button({ className, children, huge, onClick, type = 'default', active }: Props) {
  switch (type) {
    case 'default':
      return <Default {...{ className, huge, onClick }}>{children}</Default>
    case 'sidebar-primary':
      return <SidebarPrimary {...{ className, onClick }}>{children}</SidebarPrimary>
    case 'sidebar-secondary':
      return <SidebarSecondary {...{ className, active, onClick }}>{children}</SidebarSecondary>
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
