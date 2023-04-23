'use client'

import styled from '@emotion/styled'
import { useParams, usePathname, useRouter } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import { HiPlus } from 'react-icons/hi'
import { IoMdSettings } from 'react-icons/io'
import Icon from '../Icon'
import GroupSettingsModal from '../Modals/GroupSettingsModal'
import LibrarySettingsModal from '../Modals/LibrarySettingsModal'
import StyledLink from '../StyledLink'

type Props = {
  id: string
  name: string
  parentId: string | null
  libraries: { id: string; name: string }[]
}

export default function GroupHeader({ id, name, parentId, libraries }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const [showGroupSettingsModal, setShowGroupSettingsModal] = useState(false)
  const [showLibrarySettingsModal, setShowLibrarySettingsModal] = useState(false)
  const [libraryId, setLibraryId] = useState<string>('')

  const title = useMemo(() => {
    if (params?.libraryId) {
      setLibraryId(params.libraryId as string)

      const libraryName = libraries.find((library) => library.id === params.libraryId)?.name

      if (!libraryName) return

      return `${name} - ${libraryName}`
    } else {
      setLibraryId('')
      return name
    }
  }, [name, params?.libraryId])

  return (
    <Main>
      <Title>
        {title}
        {libraryId ? (
          <SettingsButton size={30} title="Library Settings" onClick={() => setShowLibrarySettingsModal(true)} />
        ) : parentId ? (
          <StyledLink href={`/groups/${parentId}`}>Go To Parent Group</StyledLink>
        ) : undefined}
      </Title>
      <Right>
        {!pathname?.includes('add-new') && (
          <AddNew>
            <StyledLink href={`/groups/${id}/papers/add-new`}>
              <Plus />
              Add Paper
            </StyledLink>
          </AddNew>
        )}
        {showGroupSettingsModal && (
          <GroupSettingsModal
            name={name}
            groupId={id}
            closeModal={() => setShowGroupSettingsModal(false)}
            refetch={(action: 'refresh' | 'redirect') =>
              action === 'refresh' ? router.refresh() : router.push('/groups')
            }
          />
        )}
        {showLibrarySettingsModal && (
          <LibrarySettingsModal libraryId={libraryId} closeModal={() => setShowLibrarySettingsModal(false)} />
        )}
        <SettingsButton size={40} title="Group Settings" onClick={() => setShowGroupSettingsModal(true)} />
      </Right>
    </Main>
  )
}

const Main = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 1rem;
`

const Title = styled.span`
  display: flex;
  align-items: center;

  font-size: 2rem;
  font-weight: bold;

  column-gap: 0.5rem;

  margin: 0;

  > a {
    font-size: 1rem;
  }
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
