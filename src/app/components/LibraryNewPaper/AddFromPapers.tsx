import styled from '@emotion/styled'
import { Paper } from '@prisma/client'
import axios from 'axios'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { IoClose } from 'react-icons/io5'
import { ClientSideItem } from 'src/shared/db'
import { NumBool } from 'src/types'
import Button from '../Button'
import Checkbox from '../Checkbox'
import Icon from '../Icon'

type Props = {
  libraryId: string
  papers: ClientSideItem<Paper>[]
  close: () => void
}

type Inputs = {
  chosePapers: string[]
}

export default function AddFromPapers({ libraryId, papers, close }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [previousPath, setPreviousPath] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      chosePapers: [],
    },
  })

  useEffect(() => {
    if (!pathname) return
    const pathParts = pathname.split('/')
    pathParts.pop()

    setPreviousPath(pathParts.join('/'))
  }, [pathname])

  async function onSubmit(data: Inputs) {
    setIsLoading(true)

    const res = await axios
      .post('/api/library-attach-papers', {
        libraryIds: [libraryId],
        paperIds: data.chosePapers,
      })
      .catch((err) => {
        console.error(err)
        return err.response
      })
      .finally(() => {
        setIsLoading(false)
      })

    if (res?.status === 200) {
      router.push(previousPath)
    }
  }

  return (
    <Main>
      <CloseIcon onClick={close} />
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        {papers.map((paper, i) => (
          <Checkbox {...register('chosePapers')} key={paper.id + i} value={paper.id} checkbox_title={paper.title} />
        ))}
        <StyledButton type="submit" loading={Number(isLoading) as NumBool}>
          Submit
        </StyledButton>
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

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  height: 100%;
  overflow-y: scroll;

  row-gap: 16px;
`

const StyledButton = styled(Button)`
  align-self: end;
  margin-top: 2rem;
`

const CloseIcon = styled(Icon(IoClose))``
