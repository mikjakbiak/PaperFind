export function sortAlphabetically(a: any, b: any, key: 'title' | 'name' | 'firstName') {
  //? Remove all non-alphanumeric characters for precise sorting
  const one = (a[key] as string).replace(/[^A-Z0-9]+/gi, '')
  const two = (b[key] as string).replace(/[^A-Z0-9]+/gi, '')

  if (one < two) return -1
  if (one > two) return 1
  return 0
}
