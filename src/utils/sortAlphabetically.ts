export function sortAlphabetically(a: any, b: any, key?: 'title' | 'name' | 'firstName') {
  //? Remove all non-alphanumeric characters for precise sorting
  const one = key ? (a[key] as string)?.replace(/[^A-Z0-9]+/gi, '') ?? '' : a
  const two = key ? (b[key] as string)?.replace(/[^A-Z0-9]+/gi, '') ?? '' : b

  if (one < two) return -1
  if (one > two) return 1
  return 0
}
