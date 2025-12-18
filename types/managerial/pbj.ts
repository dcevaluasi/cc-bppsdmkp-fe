export type PbjItem = {
  kdsatker: string
  nama_satker: string
  akun: string
  nama_akun: string
  nomor_kontrak: string
  tgl_kontrak: string
  uraian_kontrak: string
  supplier: string
  tgl_mulai: string
  tgl_akhir: string
  nilai_kontrak: number
  nilai_realisasi: number
  nilai_sisa: number
}

export type PbjAllDataResponse = PbjItem[]

export type GroupedPbjBySatkerItem = {
  nama_satker: string
  nilai_kontrak: number
  nilai_realisasi: number
  nilai_outstanding: number
  persentasi: number
  persentasi_outstanding: number
  persentasi_realisasi_pbj: number
  persentasi_outstanding_pbj: number
  nilai_outstanding_pbj: number
}

export type GroupPbjBySatkerDataResponse = GroupedPbjBySatkerItem[]

export type GroupedPbjByAkunItem = {
  uraian: string
  nilai_kontrak: number
  nilai_realisasi: number
  nilai_outstanding: number
  persentasi: number
  nilai_outstanding_pbj: number
  persentasi_realisasi_pbj: number
  persentasi_outstanding: number
}

export type GroupedPbjByAkunResponse = GroupedPbjByAkunItem[]
