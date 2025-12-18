export type KinerjaSummaryResponse = Sasaran[]

export type Sasaran = {
  sasaran: string
  tahun: string
  indikator_kinerja: IndikatorKinerja[]
}

export type IndikatorKinerja = {
  nama: string
  unit_pj: string
  output: Output[]
}

export type Output = {
  nama: string
  kode: string
  alokasi_anggaran: number
  realisasi_anggaran: number
  satuan_target: string
  t_tw: number
  r_tw: number
  tw: string
}
