import styled from '@emotion/styled'
import { Paper } from '@prisma/client'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { IoClose } from 'react-icons/io5'
import { ClientSideItem } from 'src/shared/db'
import { NumBool } from 'src/types'
import Button from '../Button'
import Checkbox from '../Checkbox'
import Icon from '../Icon'

type Props = {
  title: string
  libraryIds: string[]
  papers: ClientSideItem<Paper>[]
  close: () => void
}

type Inputs = {
  chosePapers: string[]
}

export default function GroupAddFromPapers({ title, libraryIds, papers, close }: Props) {
  const router = useRouter()
  const params = useParams()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      chosePapers: [],
    },
  })

  async function onSubmit(data: Inputs) {
    setIsLoading(true)

    const res = await axios.post('/api/library-attach-papers', {
      libraryIds,
      paperIds: data.chosePapers,
      groupId: params?.groupId as string,
    })

    if (res.status === 200 && params?.groupId) {
      router.push(`/groups/${params.groupId}`)
    }
  }

  return (
    <Main>
      <CloseIcon onClick={close} />
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <Title>{title}</Title>
        {papers.length ? (
          <>
            {papers.map((paper, i) => (
              <Checkbox {...register('chosePapers')} key={paper.id + i} value={paper.id} checkbox_title={paper.title} />
            ))}
            <StyledButton type="submit" loading={Number(isLoading) as NumBool}>
              Submit
            </StyledButton>
          </>
        ) : (
          <p>No papers found</p>
        )}
      </StyledForm>
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

  row-gap: 1rem;

  border-radius: 1rem;
  background-color: #2f31a8;

  > svg {
    position: absolute;
    top: 0.25rem;
    right: 1rem;
    cursor: pointer;
  }
`

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  height: 100%;
  width: 100%;
  overflow-y: scroll;

  row-gap: 16px;
`

const Title = styled.h1`
  font-size: 1.25rem;
  margin: 0;
`

const StyledButton = styled(Button)`
  align-self: end;
  margin-top: 2rem;
`

const CloseIcon = styled(Icon(IoClose))``
