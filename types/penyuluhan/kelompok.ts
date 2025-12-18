// 1. jumlah-per-satminkal
export type KelompokJumlahPerSatminkal = {
  satminkal: string
  jml_kelompok: number
}

// 2. jumlah-per-provinsi
export type KelompokJumlahPerProvinsi = {
  provinsi: string
  jml_kelompok: number
}

// 3. bidang-usaha-per-provinsi
export type KelompokBidangUsahaPerProvinsi = {
  provinsi: string
  BUDIDAYA?: number | null
  PENANGKAPAN?: number | null
  'PENGOLAHAN/PEMASARAN'?: number | null
  GARAM?: number | null
  PENGAWASAN?: number | null
  total: number
}

// 4. kelas-per-provinsi
export type KelompokKelasPerProvinsi = {
  provinsi: string
  LANJUT?: number | null
  MADYA?: number | null
  PEMULA?: number | null
  UTAMA?: number | null
  total: number
}

// 5. bidang-usaha-per-satminkal
export type KelompokBidangUsahaPerSatminkal = {
  satminkal: string
  BUDIDAYA?: number | null
  PENANGKAPAN?: number | null
  'PENGOLAHAN/PEMASARAN'?: number | null
  GARAM?: number | null
  PENGAWASAN?: number | null
  total: number
}

export type GapokkanPerSatminkal = {
  satminkal: string
  gapokkan: string // or number if backend returns it as number
  koperasi: string // or number
  total: number
}

export type GapokkanPerProvinsi = {
  provinsi: string
  gapokkan: string // or number
  koperasi: string // or number
  total: number
}
