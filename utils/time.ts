// GENERATED YEARS
export const years = Array.from(
  { length: 6 },
  (_, i) => new Date().getFullYear() - i,
)

export const getYearColor = (year: any) => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  if (year <= currentYear) {
    return 'red'
  }

  if (year === currentYear + 1 && currentMonth >= 3) {
    return 'yellow'
  }

  return 'green'
}

export const isYearColor = (year: any) => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  if (year <= currentYear) {
    return null
  }
  if (year === currentYear + 1 && currentMonth >= 3) {
    return true
  }

  return false
}

export const getColorClass = (year: any) => {
  const color = getYearColor(year)
  switch (color) {
    case 'red':
      return 'text-red-500 bg-red-0'
    case 'yellow':
      return 'text-yellow-400 bg-yellow-0'
    case 'green':
      return 'text-green-500 bg-green-0'
    default:
      return ''
  }
}

export const parseIndonesianDate = (dateStr: string): Date | null => {
  const months: Record<string, number> = {
    januari: 0,
    februari: 1,
    maret: 2,
    april: 3,
    mei: 4,
    juni: 5,
    juli: 6,
    agustus: 7,
    september: 8,
    oktober: 9,
    november: 10,
    desember: 11,
  }

  const parts = dateStr.toLowerCase().split(' ')
  if (parts.length !== 3) return null

  const [dayStr, monthStr, yearStr] = parts
  const day = parseInt(dayStr)
  const month = months[monthStr]
  const year = parseInt(yearStr)

  if (isNaN(day) || isNaN(month) || isNaN(year)) return null

  return new Date(year, month, day)
}

export const getQuarterForFiltering = (dateString: string) => {
  const month = new Date(dateString).getMonth() + 1
  if (month >= 1 && month <= 3) return 'TW I'
  if (month >= 1 && month <= 6) return 'TW II'
  if (month >= 1 && month <= 9) return 'TW III'
  if (month >= 1 && month <= 12) return 'TW IV'
  return 'Unknown'
}

export function generateTanggalPelatihan(tanggal: string): string {
  if (tanggal != '') {
    const date = new Date(tanggal)

    const weekdays = [
      'Minggu',
      'Senin',
      'Selasa',
      'Rabu',
      'Kamis',
      'Jumat',
      'Sabtu',
    ]

    const months = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ]

    const dayOfWeek = weekdays[date.getUTCDay()]
    const day = date.getUTCDate()
    const month = months[date.getUTCMonth()]
    const year = date.getUTCFullYear()

    return `${day} ${month} ${year}`
  } else {
    return `-`
  }
}

export const tahunList = Array.from({ length: 16 }, (_, i) => 2015 + i)
