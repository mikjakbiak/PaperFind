'use client'

import Button from '@/components/Button'
import StyledLink from '@/components/StyledLink'
import styled from '@emotion/styled'
import React, { useState } from 'react'
import { HiArrowLeft } from 'react-icons/hi'
import AddManually from './AddManually'
import Dropzone from './Dropzone'

export default function AddNewPage() {
  const [addManually, setAddManually] = useState(false)

  return (
    <Main>
      <Back>
        <StyledLink href="/papers">
          <ArrowIcon />
          Back
        </StyledLink>
      </Back>
      <Content>
        <Dropzone />
        {addManually ? (
          <AddManually close={() => setAddManually(false)} />
        ) : (
          <Button onClick={() => setAddManually(true)}>Add Manually</Button>
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

const ArrowIcon = styled(HiArrowLeft)`
  color: #14203d;
  background-color: #e6d840;

  border-radius: 50%;
  padding: 2px;
`
