import { BsPersonCircle } from 'react-icons/bs'
import React, { useState } from 'react'
import { IoLogOutOutline } from 'react-icons/io5'
import styled from '@emotion/styled'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function AccountDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  function logout() {
    axios.post('/api/auth/logout').then(() => {
      router.push('/')
    })
  }

  return (
    <Container>
      <BsPersonCircle size={40} onClick={() => setIsOpen((val) => !val)} />
      {isOpen && (
        <Dropdown>
          <DropdownItem onClick={logout}>
            Logout <IoLogOutOutline size={20} />
          </DropdownItem>
        </Dropdown>
      )}
    </Container>
  )
}

const Container = styled.div`
  position: relative;

  > svg {
    cursor: pointer;
    color: #e6d840;
  }
`

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  padding: 1rem 1.5rem;

  border-radius: 1rem;
  background-color: #282a8f;
`

const DropdownItem = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  column-gap: 0.5rem;
`
