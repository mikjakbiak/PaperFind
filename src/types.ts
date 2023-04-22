import { Author, Paper } from '@prisma/client'

//? hydration-error warning if we use boolean
export type NumBool = 0 | 1

export type PaperPopulated = Paper & {
  authors: Author[]
}
