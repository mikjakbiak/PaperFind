'use client'

import styled from '@emotion/styled'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { HiPlus } from 'react-icons/hi'
import { IoMdSettings } from 'react-icons/io'
import { LibraryPopulated } from 'src/pages/api/get-many-groups'
import { ClientSideItem } from 'src/shared/db'
import { PaperPopulated } from 'src/types'
import Icon from './Icon'
import ListCard from './ListCard'
import LibrarySettingsModal from './Modals/LibrarySettingsModal'
import StyledLink from './StyledLink'

type Props = {
  library: ClientSideItem<LibraryPopulated>
  papers: ClientSideItem<PaperPopulated>[]
}

export default function Library({ library, papers }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [refetch, setRefetch] = useState(false)

  useEffect(() => {
    if (refetch) {
      setRefetch(false)
      router.push('/papers/all')
    }
  }, [refetch])

  return (
    <section>
      {showModal && (
        <LibrarySettingsModal
          papers={papers}
          libraryId={library.id}
          closeModal={() => setShowModal(false)}
          refetch={() => setRefetch(true)}
        />
      )}
      <Head>
        <Title>{library.name}</Title>
        <Right>
          <AddNew>
            <StyledLink href={`${pathname}/add-new`}>
              <Plus />
              Add Paper
            </StyledLink>
          </AddNew>
          <SettingsButton title="Group Settings" size={40} onClick={() => setShowModal(true)} />
        </Right>
      </Head>
      <ListCard
        card={{
          title: 'Papers' as const,
          items: papers,
        }}
      />
    </section>
  )
}

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 1rem;
`

const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
`

const Right = styled.div`
  display: flex;
  align-items: center;

  column-gap: 2rem;
`

const AddNew = styled.div`
  justify-self: end;

  > a {
    font-weight: bold;
  }
`
const Plus = styled(Icon(HiPlus))``

const SettingsButton = styled(IoMdSettings)`
  cursor: pointer;

  color: #e7d740;
`
