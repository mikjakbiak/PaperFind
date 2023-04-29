'use client'

import styled from '@emotion/styled'
import { useParams, usePathname, useRouter } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import { HiPlus } from 'react-icons/hi'
import { IoMdSettings } from 'react-icons/io'
import { ClientSideItem } from 'src/shared/db'
import { PaperPopulated } from 'src/types'
import Icon from '../Icon'
import GroupSettingsModal from '../Modals/GroupSettingsModal'
import LibrarySettingsModal from '../Modals/LibrarySettingsModal'
import StyledLink from '../StyledLink'

type Props = {
  id: string
  name: string
  parentId: string | null
  libraries: { id: string; name: string; papers: ClientSideItem<PaperPopulated>[] }[]
}

export default function GroupHeader({ id, name, parentId, libraries }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const [showGroupSettingsModal, setShowGroupSettingsModal] = useState(false)
  const [showLibrarySettingsModal, setShowLibrarySettingsModal] = useState(false)
  const [library, setLibrary] = useState<{ id: string; name: string; papers: ClientSideItem<PaperPopulated>[] } | null>(
    null
  )

  const title = useMemo(() => {
    if (params?.libraryId) {
      const library = libraries.find((library) => library.id === params.libraryId)

      if (!library) return

      setLibrary(library)

      if (!library.name) return

      return `${name} - ${library.name}`
    } else {
      setLibrary(null)
      return name
    }
  }, [name, params?.libraryId])

  return (
    <Main>
      <Title>
        {title}
        {library ? (
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
        {showLibrarySettingsModal && library && (
          <LibrarySettingsModal
            libraryId={library.id}
            papers={library.papers}
            closeModal={() => setShowLibrarySettingsModal(false)}
            refetch={(action: 'refresh' | 'redirect') => {
              if (!pathname) return
              const array = pathname.split('/')
              const url = array.slice(0, array.length - 1).join('/')
              action === 'refresh' ? router.refresh() : router.push(url)
            }}
          />
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
