'use client'

import React, { useState } from 'react'
import Button from './Button'
import CreateGroupModal from './Modals/CreateGroupModal'

export default function ModalButton({ refetch }: { refetch?: () => void }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      {showModal && <CreateGroupModal closeModal={() => setShowModal(false)} refetch={refetch} />}
      <Button variant="sidebar-primary" onClick={() => setShowModal(true)}>
        New Group
      </Button>
    </>
  )
}
