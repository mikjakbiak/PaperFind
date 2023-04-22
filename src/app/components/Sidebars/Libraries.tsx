'use client'

import Button from 'src/app/components/Button'
import styled from '@emotion/styled'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { NumBool } from 'src/types'
import { ClientSideItem } from 'src/shared/db'
import { LibraryPopulated } from 'src/pages/api/get-many-groups'
import axios from 'axios'
import CreateLibraryModal from '../Modals/CreateLibraryModal'
import { useRouter } from 'next/navigation'

type Props = {
  _libraries: ClientSideItem<LibraryPopulated>[]
  id: string
}

export default function Libraries({ _libraries, id }: Props) {
  const router = useRouter()
  const [refetch, setRefetch] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [libraries, setLibraries] = useState<ClientSideItem<LibraryPopulated>[]>(_libraries)

  useEffect(() => {
    router.prefetch('/papers/all')
    libraries.forEach((library) => {
      router.prefetch(`/papers/lib-${library.id}`)
    })
  }, [libraries])

  useEffect(() => {
    if (!refetch) return
    axios
      .get<{
        error: boolean
        data: ClientSideItem<LibraryPopulated>[]
      }>('/api/get-many-libraries')
      .then((res) => {
        setLibraries(res.data.data)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setRefetch(false)
      })
  }, [refetch])

  return (
    <Main>
      {showModal && <CreateLibraryModal closeModal={() => setShowModal(false)} refetch={() => setRefetch(!refetch)} />}
      <Button variant="sidebar-primary" onClick={() => setShowModal(true)}>
        New Library
      </Button>
      <Link href="/papers/all">
        <Button variant="sidebar-secondary" active={Number(id === 'all') as NumBool}>
          All Papers
        </Button>
      </Link>
      {libraries.map((library) => (
        <Link key={library.id} href={`/papers/lib-${library.id}`}>
          <Button variant="sidebar-secondary" active={Number(id.endsWith(library.id)) as NumBool}>
            {library.name}
          </Button>
        </Link>
      ))}
    </Main>
  )
}

const Main = styled.div`
  align-self: flex-start;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  row-gap: 1rem;

  > a {
    text-decoration: none;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  & button {
    width: 80%;
  }
`
