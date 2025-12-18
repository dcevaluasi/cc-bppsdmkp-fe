export type PesertaDidikLocation = {
  id_peserta_didik: number
  nama_lengkap: string
  latitude: string
  longitude: string
}

export type PesertaDidikLocationResponse = PesertaDidikLocation[]

export type PesertaDidikDetail = {
  id_peserta_didik: number
  no_ktp: string | null
  nomor_kusuka: string
  nomor_kusuka_valid: string
  nomor_kusuka_nama: string
  nomor_kusuka_profesi: string
  nama_lengkap: string
  kelamin: string | null
  id_agama: string
  tempat_lahir: string
  tanggal_lahir: string
  alamat: string
  telp: string
  email: string
  nisn: string
  tahun_daftar: string
  id_angkatan: string | null
  id_program_studi: string
  sekolah_asal: string
  text_sekolah_asal: string | null
  id_program_studi_sekolah_asal: string | null
  program_studi_sekolah_asal: string
  asal_sekolah_jurusan: string
  tahun_lulus_smu: string
  tahun_lulus: string
  id_tahun_ajaran: string
  id_provinsi: string
  id_kabupaten: string
  kecamatan: string
  kelurahan: string
  kode_pos: string
  nama_ortu: string | null
  alamat_ortu: string
  id_provinsi_ortu: string
  id_kabupaten_ortu: string
  kabupaten_ortu: string
  kecamatan_ortu: string
  kelurahan_ortu: string
  kode_pos_ortu: string
  telp_ortu: string
  id_pekerjaan_ortu: string
  text_pekerjaan_ortu: string
  nama_ibu: string
  alamat_ibu: string | null
  id_provinsi_ibu: string | null
  id_kabupaten_ibu: string | null
  kecamatan_ibu: string | null
  pekerjaan_sambilan_ortu: string | null
  kelurahan_ibu: string | null
  kode_pos_ibu: string | null
  telp_ibu: string | null
  id_pekerjaan_ibu: string | null
  text_pekerjaan_ibu: string | null
  status: string
  create_at: string
  update_at: string
  id_satdik: string
  id_kampus: string
  nit: string
  nama_prodi: string
  nik: string
  gender: string
  angkatan: string
  level: string
  jenjang_pendidikan: string
  tanggal_do: string
  file_sk_do: string
  file_tunda: string
  tanggal_tunda: string
  semester: number
  asal: string
  nama_ayah: string
  provinsi_ortu: string
  tingkat: string
  is_alih_jenjang: string
  is_tugas_belajar: string
  kampus: string
  satuan_pendidikan: string
  program_studi: string
  agama: string
  provinsi: string
  kabupaten: string
  pekerjaan_orang_tua: string
  no_ijazah: string
  status_pembelajaran: string
  latitude: string
  longitude: string
  alt_kabupaten: string
}
