export const normalizeNullToZero = <T extends Record<string, any>>(
  item: T,
  keys: string[],
): T => {
  const result: Record<string, any> = { ...item }

  keys.forEach((key) => {
    if (result[key] === null || result[key] === undefined) {
      result[key] = 0
    }
  })

  return result as T
}
