export type PendapatanDetail = {
  output: string
  pagu: number
  realisasi: number
  percentage: number
}

export type PendapatanResponseItem = {
  nama_satker: string
  pagu: number
  realisasi: number
  percentage: number
  details: PendapatanDetail[]
}

export type PendapatanPerSatkrePerAkunResponse = PendapatanResponseItem[]

export type DailyPendapatan = {
  nama_satker: string
  pagu: number
  realisasi_amount: number
}

export type DailyPendapatanResponse = DailyPendapatan[]
