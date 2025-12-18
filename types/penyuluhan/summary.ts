// BASE TYPES
export type StatusResponse = {
  status: string
  total: number
}

export type JabatanResponse = {
  jabatan: string
  total: number
}

export type PendidikanResponse = {
  pendidikan: string
  total: number
}

export type KelompokUsiaResponse = {
  kelompok_usia: string
  total: number
}

export type JenisKelaminResponse = {
  kelamin: string
  total: number
}

// RESPONSE TYPES

export type PenyuluhByStatusResponse = {
  provinsi: string
  status: StatusResponse[]
}

export type PenyuluhByJabatanResponse = {
  provinsi: string
  jabatan: JabatanResponse[]
}

export type PenyuluhByPendidikanResponse = {
  provinsi: string
  pendidikan: PendidikanResponse[]
}

export type PenyuluhByKelompokUsiaResponse = {
  provinsi: string
  kelompok_usia: KelompokUsiaResponse[]
}

export type PenyuluhByJenisKelaminResponse = {
  provinsi: string
  kelamin: JenisKelaminResponse[]
}

export type PenyuluhLocationResponse = {
  no: number
  nama: string
  status: string
  satminkal: string
  latitude: string | null
  longitude: string | null
}

export type PenyuluhanTotalResponse = {
  total_penyuluh: number
  total_kelompok_disuluh: number
  total_kelompok_ditingkatkan: number
  total_kelompok_dibentuk: number
  total_gapokkan_didampingi: number
}

export type PenyuluhDetailResponse = {
  no: number
  provinsi: string
  kab_kota: string
  nama: string
  status: string
  nip_nik: string
  kelamin: 'L' | 'P' | string
  usia: number
  jabatan: string
  pendidikan: string
  prodi: string
  satminkal: string
  kode_provinsi: string
  kode_kab_kota: string
  asn: string
  kelompok_usia: string
  triwulan: string
  latitude: string
  longitude: string
}

export type KelompokDisuluhDetailResponse = {
  no: number
  satminkal: string
  provinsi: string
  kab_kota: string
  nama_kelompok: string
  nama_ketua: string
  nik: string
  kelamin_ketua: string
  kelas_kelompok: string
  skor_penilaian: number
  no_registrasi: string
  bidang_usaha: string
  jumlah_laki: number
  jumlah_perempuan: number
  jumlah_total: number
  alamat_sekretariat: string
  nama_penyuluh: string
  no_telp_penyuluh: string
  status_penyuluh: string
  link_profil: string
  link_pembentukan: string
  link_kelas_terakhir: string
  kode_provinsi: string
  kode_kab_kota: string
  triwulan: string
  latitude: string
  longitude: string
}

export type KelompokLocationResponse = {
  no: number
  nama_kelompok: string
  nama_ketua: string
  nik: string | null
  no_piagam: string | null
  no_ba_pembentukan: string | null
  nomor_ba: string | null
  satminkal: string
  latitude: string | null
  longitude: string | null
}

export type KelompokDitingkatkanDetailResponse = {
  no: number
  satminkal: string
  provinsi: string
  kab_kota: string
  nama_kelompok: string
  nama_ketua: string
  nik_ketua: string
  alamat_kelompok: string
  bidang_usaha: string
  no_piagam: string
  no_registrasi: string
  tanggal_pembentukan: string // comes as "45140.0" (Excel serial format), you may want to parse into Date
  skor_semula: string // "214.0" (stringified number)
  kelas_semula: string
  skor_menjadi: string // "289.0"
  kelas_menjadi: string
  no_piagam_kenaikan: string
  tanggal_piagam_kenaikan: string // also "45740.0"
  jabatan_pejabat: string
  link_piagam: string
  nama_penyuluh: string
  status_penyuluh: string
  no_telp_penyuluh: string
  progress: string
  kode_provinsi: string
  kode_kab_kota: string
  triwulan: string
  latitude: string
  longitude: string
}

export type KelompokDibentukDetailResponse = {
  no: number
  satminkal: string
  provinsi: string
  kab_kota: string
  nama_kelompok: string
  jumlah_laki: number
  jumlah_perempuan: number
  jumlah_total: number
  no_ba_pembentukan: string
  tanggal_pembentukan: string // "45708.0" (Excel serial date)
  link_ba: string
  alamat_kelompok: string
  bidang_usaha: string
  nama_penyuluh: string
  status_penyuluh: string
  no_telp_penyuluh: string
  kode_provinsi: string
  kode_kab_kota: string
  triwulan: string
  latitude: string
  longitude: string
}

export type GapokkanDetailResponse = {
  no: number
  satminkal: string
  provinsi: string
  kab_kota: string
  klasifikasi: string // always "GAPOKKAN"
  nama: string // name of Gapokkan
  nama_ketua: string
  nik: string
  kelamin_ketua: 'L' | 'P' // Laki-laki or Perempuan
  nomor_ba: string
  anggota_l: number
  anggota_p: number | string // sometimes "11.0" from DB, better normalize to number
  anggota_total: number
  alamat: string
  nama_penyuluh: string
  no_telp_penyuluh: string
  link_profil: string
  link_ba: string
  kode_provinsi: string
  kode_kab_kota: string
  triwulan: string
  latitude: string
  longitude: string
}
