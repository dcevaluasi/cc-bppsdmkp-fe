export const simplifySatkerName = (namaSatker: string): string => {
  if (/pusat/i.test(namaSatker)) {
    return namaSatker
  }

  // Step 1: Remove anything inside parentheses
  const cleanedName = namaSatker.replace(/\s*\([^)]*\)/g, '').trim()

  // Step 2: Custom keyword replacements
  const replacements: { keyword: RegExp; replacement: string }[] = [
    {
      keyword: /politeknik\s+kelautan\s+dan\s+perikanan/i,
      replacement: 'Poltek KP',
    },
    {
      keyword: /balai\s+pelatihan\s+dan\s+penyuluhan\s+perikanan/i,
      replacement: 'BPPP',
    },
    {
      keyword: /politeknik\s+kp/i,
      replacement: 'Poltek KP',
    },
    {
      keyword: /sekolah\s+usaha\s+perikanan\s+menengah\s+\(supm\)/i,
      replacement: 'SUPM',
    },
    {
      keyword: /sekolah\s+usaha\s+perikanan\s+menengah/i,
      replacement: 'SUPM',
    },
    {
      keyword: /politeknik\s+aup/i,
      replacement: 'Poltek AUP',
    },
    {
      keyword: /politeknik\s+ahli\s+usaha\s+perikanan/i,
      replacement: 'Poltek AUP',
    },
    {
      keyword: /akademi\s+komunitas\s+kelautan\s+dan\s+perikanan/i,
      replacement: 'AK-KP',
    },
  ]

  for (const { keyword, replacement } of replacements) {
    if (keyword.test(cleanedName)) {
      return cleanedName.replace(keyword, replacement).trim()
    }
  }

  // Step 3: If no match, return acronym of initials (excluding stop words like "dan", "yang", etc.)
  const stopWords = ['dan', 'yang', 'di', 'ke', 'dari']
  const initials = cleanedName
    .split(/\s+/)
    .filter((word) => !stopWords.includes(word.toLowerCase()))
    .map((word) => word[0]?.toUpperCase())
    .join('')

  return initials
}

export const formatToShortRupiah = (value: any): string => {
  if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(0)}M`
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(0)}Juta`
  if (value >= 1_000) return `Rp ${(value / 1_000).toFixed(0)}K`
  return `Rp ${value}`
}

export function splitCityAndDate(
  input: string,
): { city: string; date: string } {
  const regex = /^([A-Za-z\s]+?)(\d{1,2}\s+[A-Za-z]+\s+\d{4})$/
  const match = input.match(regex)

  if (!match) {
    throw new Error(
      "Invalid format. Expected something like 'Sidoarjo13 October 2000'",
    )
  }

  const [, city, date] = match
  return {
    city: city.trim(),
    date: date.trim(),
  }
}
