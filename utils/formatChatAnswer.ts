interface StringObject {
  [key: string]: string | StringObject
}

//? This function is used to format the answers from the chatGPT-3 model
export function formatChatAnswer(obj: StringObject): any {
  const formattedObject: any = Array.isArray(obj) ? [] : {}
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      switch (value) {
        case 'undefined':
          formattedObject[key] = undefined
          break
        case 'null':
          formattedObject[key] = null
          break
        case 'true':
          formattedObject[key] = true
          break
        case 'false':
          formattedObject[key] = false
          break
        default:
          const numValue = Number(value)
          formattedObject[key] = isNaN(numValue) ? value : numValue
          break
      }
    } else if (typeof value === 'object' && value !== null) {
      formattedObject[key] = Array.isArray(value)
        ? value.map(formatChatAnswer)
        : formatChatAnswer(value as StringObject)
    } else {
      formattedObject[key] = value
    }
  }
  return formattedObject
}
