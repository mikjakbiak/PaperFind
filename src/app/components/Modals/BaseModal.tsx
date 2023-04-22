import styled from '@emotion/styled'
import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { IoClose } from 'react-icons/io5'
import Icon from '../Icon'

interface ModalProps {
  children: React.ReactNode
  closeModal: () => void
}

export default function BaseModal({ children, closeModal }: ModalProps) {
  const [isBrowser, setIsBrowser] = useState(false)

  const overlayRef = useRef<HTMLDivElement>(null)

  const backDropHandler = (e: MouseEvent) => {
    if (overlayRef.current === e.target) {
      closeModal()
    }
  }

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  useEffect(() => {
    if (isBrowser) {
      window.addEventListener('click', backDropHandler)
    }

    return () => window.removeEventListener('click', backDropHandler)
  }, [isBrowser])

  const modalContent = (
    <Overlay ref={overlayRef}>
      <Main>
        <CloseIcon onClick={closeModal} />
        {children}
      </Main>
    </Overlay>
  )

  if (isBrowser) {
    return ReactDOM.createPortal(modalContent, document.getElementById('modal-root')!)
  } else {
    return null
  }
}

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`

const Main = styled.div`
  box-sizing: border-box;

  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  row-gap: 1rem;

  background-color: #2f31a8;
  border-radius: 1rem;
  padding: 2rem 3rem;
`

const CloseIcon = styled(Icon(IoClose))`
  position: absolute;
  top: 1rem;
  right: 1rem;
`
