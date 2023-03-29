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

export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
  const userId = req.headers['user-id'] as string
  //? Should never happen
  if (!userId) return res.status(401).end()

  const prompt = req.body.prompt

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

  //? Create paper in database
  await prisma.paper.create({
    data: {
      ...completion,
      userId,
      type: completion.type === 'Journal Article' ? ReferenceType.ARTICLE : ReferenceType.BOOK,
      authors: {
        create: completion.authors?.map((author) => ({
          fName: author.fName,
          lName: author.lName,
        })),
      },
      pages: completion.pages ? [completion.pages.from, completion.pages.to] : undefined,
    },
  })

  res.status(200).end()
}
