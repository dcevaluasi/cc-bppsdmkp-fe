export type TblDipaBelanja = {
  kdsatker?: string
  nama_satker?: string
  kegiatan?: string
  kegiatan_name?: string
  output?: string
  output_name?: string
  akun?: string
  nama_akun?: string
  amount?: number
  tanggal_omspan?: string
}

export type TblDipaPendapatan = {
  kdsatker?: string
  nama_satker?: string
  akun?: string
  nama_akun?: string
  amount?: number
  tanggal_omspan?: string
}

export type TblRealisasiBelanja = {
  kdsatker?: string
  nama_satker?: string
  kegiatan?: string
  kegiatan_name?: string
  output?: string
  output_name?: string
  akun?: string
  nama_akun?: string
  tanggal?: string
  amount?: number
  tanggal_omspan?: string
}

export type TblRealisasiPendapatan = {
  kdsatker?: string
  nama_satker?: string
  akun?: string
  nama_akun?: string
  tanggal?: string
  amount?: number
  tanggal_omspan?: string
}

export type RekapPerSatkerItem = {
  kdsatker: string
  nama_satker: string
  pagu: number
  outstanding: number
  blokir: number
  realisasi: number
  realisasi_sampai_tanggal: number
  persen_realisasi: number // e.g. 9.33 (%)
}

export type RekapRealisasiSisaItem = {
  tahun: number
  tanggal: string
  pagu: number
  realisasi: number
  sisa: number
  persentasi?: number
}

export type RekapRealisasiPendapatanAkunItem = {
  no: number
  akun: string
  pagu: number
  realisasi: number
  persentasi: number
}

export type RekapRincianRealisasiAnggaranItem = {
  tahun: number
  tanggal: string
  pagu: number
  realisasi: number
  persentase: number
  persentase_sisa: number
  sisa: number
  akun: RekapAkunRealisasiAnggaranItem[]
}

export type RekapAkunRealisasiAnggaranItem = {
  name: string
  pagu: number
  realisasi: number
  sisa: number
  persentase: number
  persentase_sisa: number
}

export type KROAnggaranItem = {
  kegiatan: string
  kegiatan_name: string
  pagu: number
  realisasi: number
  percentage: number
  outstanding: number
  blokir: number
  items: OuputKROAnggaranItem[]
}

export type OuputKROAnggaranItem = {
  output: string
  output_name: string
  pagu: number
  realisasi: number
  outstanding: number
  blokir: number
  percentage: number
}

export type DailyAnggaran = {
  date: string // e.g. "2025-04-01"
  'Belanja Pegawai': number
  'Belanja Barang dan Jasa': number
  'Belanja Modal': number
  Lainnya: number
}

export type DailyAnggaranResponse = DailyAnggaran[]

export type TanggalOmspan = {
  tanggal_omspan: string[]
}

export type TanggalOmspanResponse = TanggalOmspan

export interface RekapPerPusatGroupedItem {
  group: string
  nama_satker: string
  pagu: number
  realisasi: number
  persen_realisasi: number
}

export function transformRekapPerSatker(
  apiData: any,
): RekapPerPusatGroupedItem[] {
  const result: RekapPerPusatGroupedItem[] = []

  if (!apiData) return result

  Object.entries(apiData).forEach(([group, value]: any) => {
    if (!value) return

    // Case 1: value is object of satkers (Kantor Pusat & Daerah)
    if (typeof value === 'object' && !('pagu' in value)) {
      Object.entries(value).forEach(([nama_satker, stats]: any) => {
        result.push({
          group: group as RekapPerPusatGroupedItem['group'],
          nama_satker,
          pagu: stats?.pagu ?? 0,
          realisasi: stats?.realisasi ?? 0,
          persen_realisasi: stats?.persen_realisasi ?? 0,
        })
      })
    }

    // Case 2: UPT Sekretariat, Pendidikan, etc. (no sub keys)
    else {
      result.push({
        group: group as RekapPerPusatGroupedItem['group'],
        nama_satker: group,
        pagu: value?.pagu ?? 0,
        realisasi: value?.realisasi ?? 0,
        persen_realisasi: value?.persen_realisasi ?? 0,
      })
    }
  })

  return result
}
