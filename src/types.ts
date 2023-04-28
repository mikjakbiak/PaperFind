import { Author, Paper } from '@prisma/client'

//? hydration-error warning if we use boolean
export type NumBool = 0 | 1

export type PaperPopulated = Paper & {
  authors: Author[]
}

export type PaperType = 'Journal Article' | 'Book'

export type AnswerDto = {
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
