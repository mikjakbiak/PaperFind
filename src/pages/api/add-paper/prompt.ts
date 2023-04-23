import { ReferenceType } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'src/shared/db'
import { formatChatAnswer } from 'src/utils/formatChatAnswer'
import { getCompletion } from 'src/utils/openAI'

type PaperType = 'Journal Article' | 'Book'

type AnswerDto = {
  type?: PaperType
  title?: string
  authors?: { fName: string; lName: string }[]
  abstract?: string
  year?: number
  month?: number
  day?: number
  publisher?: string
  publication?: string
  doi?: string
  volume?: number
  issue?: number
  pages?: { from: number; to: number }
}

const exampleAnswer: AnswerDto = {
  type: 'Journal Article',
  title: 'Some Title',
  authors: [
    {
      fName: 'John',
      lName: 'Doe',
    },
    {
      fName: 'Jane',
      lName: 'Doe',
    },
  ],
  abstract: 'This is an abstract. It is a short summary of the article.',
  year: 2015,
  month: 1,
  day: undefined,
  publisher: 'Some Publisher',
  publication: 'Name of a Journal',
  doi: undefined,
  volume: 3,
  issue: 12,
  pages: { from: 21, to: 37 },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
  const userId = req.headers['user-id'] as string
  //? Should never happen
  if (!userId) return res.status(401).end()

  const prompt = req.body.prompt
  const groupId = req.body.groupId as string | undefined
  const libraryIds = req.body.libraryIds as string[] | undefined

  let httpStatus
  //? Get completion from OpenAI. If it fails, log the error and return proper response
  const response = await getCompletion(prompt).catch((error) => {
    if (error.response) {
      httpStatus = error.response.status
      console.error(error.response.status)
      console.error(error.response.data)
    } else {
      console.error(error.message)
    }
  })
  if (!response) return res.status(httpStatus ?? 500).end()

  const answer = response.data.choices[0].message?.content
  if (!answer) return res.status(500).end()

  const completion = formatChatAnswer(JSON.parse(answer)) as AnswerDto

  const filteredCompletion = Object.keys(completion)
    .filter((key) => key in exampleAnswer)
    .reduce<AnswerDto>((obj, key) => {
      obj[key as keyof AnswerDto] = completion[key as keyof AnswerDto] as any
      return obj
    }, {})

  const userOrGroup = groupId ? { group: { connect: { id: groupId } } } : { user: { connect: { id: userId } } }

  //? Create paper in database
  await prisma.paper
    .create({
      data: {
        ...filteredCompletion,
        type: completion.type === 'Journal Article' ? ReferenceType.ARTICLE : ReferenceType.BOOK,
        authors: {
          create: completion.authors?.map((author) => ({
            fName: author.fName,
            lName: author.lName,
          })),
        },
        pages: completion.pages ? [completion.pages.from, completion.pages.to] : undefined,
        ...userOrGroup,
        libraries: {
          connect: libraryIds?.map((id) => ({ id })),
        },
      },
    })
    .catch((error) => {
      console.error(error)
      return res.status(500).end()
    })

  res.status(200).end()
}
