export type KerjasamaSummaryResponse = {
  substansi: Record<string, number>
  lingkup: Record<string, number>
  pemrakarsa: Record<string, number>
  jenis_dokumen: Record<string, number>
  tingkatan: Record<string, number>
}

export type KerjaSamaItem = {
  ID: number
  Judul_Kerja_Sama: string
  Ruang_Lingkup: string
  Substansi: string
  Pemrakarsa: string
  Jenis_Dokumen: string
  Lingkup: string
  Tingkatan: string
  Pihak_KKP: string
  Pihak_Mitra: string
  Informasi_Penandatanganan: string
  Mulai: number
  Selesai: number
  Pembiayaan: string
  Keterangan: string
  File_Dokumen: string
  Created_By: string
  When_Created: string // ISO date string, or use Date if parsed
  Updated_By: string
  When_Updated: string
}

export type KerjaSamaRincianDataResponse = KerjaSamaItem[]
