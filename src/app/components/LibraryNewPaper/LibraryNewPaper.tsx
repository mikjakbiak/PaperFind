'use client'

import Button from 'src/app/components/Button'
import StyledLink from 'src/app/components/StyledLink'
import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import { HiArrowLeft } from 'react-icons/hi'
import AddManually from './AddManually'
import Dropzone from '../Dropzone'
import { usePathname } from 'next/navigation'
import { ClientSideItem } from 'src/shared/db'
import { Paper } from '@prisma/client'
import AddFromPapers from './AddFromPapers'

type Props = {
  libraryId: string
  papers: ClientSideItem<Paper>[]
}

export default function LibraryNewPaper({ libraryId, papers }: Props) {
  const [addFromPapers, setAddFromPapers] = useState(false)
  const [addManually, setAddManually] = useState(false)
  const [previousPath, setPreviousPath] = useState('')
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname) return
    const pathParts = pathname.split('/')
    pathParts.pop()

    setPreviousPath(pathParts.join('/'))
  }, [pathname])

  return (
    <Main>
      <Back>
        <StyledLink href={previousPath}>
          <ArrowIcon />
          Back
        </StyledLink>
      </Back>
      <Content>
        <Dropzone />
        {addManually ? (
          <AddManually close={() => setAddManually(false)} to="library" libraryId={libraryId} />
        ) : addFromPapers ? (
          <AddFromPapers papers={papers} libraryId={libraryId} close={() => setAddFromPapers(false)} />
        ) : (
          <Buttons>
            <Button onClick={() => setAddFromPapers(true)}>Add From Papers</Button>
            <Button onClick={() => setAddManually(true)}>Add Manually</Button>
          </Buttons>
        )}
      </Content>
    </Main>
  )
}

const Main = styled.div`
  display: grid;
  grid-template-rows: min-content auto;
  grid-template-columns: 1fr 4fr;
  grid-template-areas:
    'back .'
    '. content';

  row-gap: 2rem;

  padding-right: 15%;
`
const Back = styled.div`
  grid-area: back;
  justify-self: start;

  > a {
    font-weight: bold;
  }
`

const Content = styled.div`
  grid-area: content;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  row-gap: 1rem;

  padding-bottom: 2rem;
`

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  column-gap: 1rem;
`

const ArrowIcon = styled(HiArrowLeft)`
  color: #14203d;
  background-color: #e6d840;

  border-radius: 50%;
  padding: 2px;
`
