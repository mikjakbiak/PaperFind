import { ClientSideItem } from 'src/shared/db'
import { PaperPopulated } from 'src/types'
import { sortAlphabetically } from './sortAlphabetically'

export function getBibliography(papers: ClientSideItem<PaperPopulated>[]): string[] {
  return papers
    .map((paper) => {
      const lastAuthorIndex = paper.authors.length - 1
      const authorNames = paper.authors
        .map((author, index) => {
          const name = `${author.lName}, ${author.fName.charAt(0)}.`
          if (index === lastAuthorIndex - 1) {
            return `${name} and`
          } else if (index !== lastAuthorIndex) {
            return `${name},`
          }
          return name
        })
        .join(' ')

      const publicationYear = paper.year ? `(${paper.year})` : ''

      const title = paper.title ? `\'${paper.title}\'` : ''

      const journal = paper.publication ? `, ${paper.publication}` : ''

      const volume = paper.volume ? `, ${paper.volume}` : ''

      const issue = paper.issue ? `(${paper.issue})` : ''

      const pages = paper.pages.length > 1 ? `, pp. ${paper.pages[0]}-${paper.pages[1]}` : ''

      const doi = paper.doi
        ? ` Available at: ${paper.doi.includes('http') ? paper.doi : `https://doi.org/${paper.doi}`}`
        : ''

      return `${authorNames} ${publicationYear} ${title}${journal}${volume}${issue}${pages}.${doi}`
    })
    .sort(sortAlphabetically)
}
