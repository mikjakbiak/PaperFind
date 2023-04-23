'use client'

import Button from 'src/app/components/Button'
import StyledLink from 'src/app/components/StyledLink'
import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import { HiArrowLeft } from 'react-icons/hi'
import GroupAddPaperManually from './GroupAddPaperManually'
import Dropzone from '../Dropzone'
import { ClientSideItem } from 'src/shared/db'
import GroupAddFromPapers from './GroupAddFromPapers'
import { PaperPopulated } from 'src/types'
import { LibraryPopulated } from 'src/pages/api/get-many-groups'
import Checkbox from '../Checkbox'

type Props = {
  userPapers: ClientSideItem<PaperPopulated>[]
  groupPapers: ClientSideItem<PaperPopulated>[]
  libraries: ClientSideItem<LibraryPopulated>[]
  groupId: string
}

export default function GroupNewPaper({ userPapers, groupPapers, libraries, groupId }: Props) {
  const [addFromUserPapers, setAddFromUserPapers] = useState(false)
  const [addFromGroupPapers, setAddFromGroupPapers] = useState(false)
  const [addManually, setAddManually] = useState(false)
  const [chosenLibraries, setChosenLibraries] = useState<string[]>([])

  return (
    <Main>
      <Content>
        <Libraries>
          <Title>Add paper to selected libraries</Title>
          {libraries.length ? (
            libraries.map((library, i) => (
              <Checkbox
                key={library.id + i}
                onChange={(e) => {
                  const { value, checked } = e.target
                  if (checked) {
                    setChosenLibraries((prev) => [...prev, value])
                  } else {
                    setChosenLibraries((prev) => prev.filter((lib) => lib !== value))
                  }
                }}
                value={library.id}
                checkbox_title={library.name}
              />
            ))
          ) : (
            <p>No papers found</p>
          )}
        </Libraries>
        <Drop>
          <Title>Drop your paper</Title>
          <Dropzone
            color="#242580"
            infoText="Drop here a paper in the PDF format or click one of the buttons below to either choose a paper from already added papers or add it manually"
            groupId={groupId}
            libraryIds={chosenLibraries}
          />
        </Drop>
        {addManually ? (
          <GroupAddPaperManually close={() => setAddManually(false)} libraryIds={chosenLibraries} />
        ) : addFromUserPapers ? (
          <GroupAddFromPapers
            title="Select your papers"
            papers={userPapers}
            libraryIds={chosenLibraries}
            close={() => setAddFromUserPapers(false)}
          />
        ) : addFromGroupPapers && chosenLibraries.length > 0 ? (
          <GroupAddFromPapers
            title="Select group papers"
            papers={groupPapers}
            libraryIds={chosenLibraries}
            close={() => setAddFromGroupPapers(false)}
          />
        ) : (
          <Buttons>
            <Button onClick={() => setAddFromUserPapers(true)}>Add From Your Papers</Button>
            {chosenLibraries.length > 0 && (
              <Button onClick={() => setAddFromGroupPapers(true)}>Add From Group Papers</Button>
            )}
            <Button onClick={() => setAddManually(true)}>Add Manually</Button>
          </Buttons>
        )}
      </Content>
    </Main>
  )
}

const Main = styled.div`
  width: 100%;
  box-sizing: border-box;

  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  padding: 2rem 3rem;
  border-radius: 1rem;
  background-color: #2f31a8;

  > svg {
    position: absolute;
    top: 1rem;
    right: 1rem;
    cursor: pointer;
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  width: 100%;
  row-gap: 2.5rem;
`

const Libraries = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  max-height: 30vh;
  width: 100%;
  row-gap: 1rem;
`

const Drop = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  width: 100%;

  row-gap: 1rem;
`

const Title = styled.h1`
  font-size: 1.25rem;
  margin: 0;
`

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  column-gap: 1rem;
`
