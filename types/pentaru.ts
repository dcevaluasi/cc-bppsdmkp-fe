export type Pendaftar = {
  RowID: number
  Tanggal_Data: number
  Is_Manual_Update: number
  Nama: string
  NIK: string
  No_Pendaftaran: string
  Gelombang: string
  Tanggal_Lahir: string
  Jenis_Kelamin: string
  Jalur_Pendaftaran: string
  Jalur: string
  Kampus_1: string
  Prodi_1: string
  Kampus_2: string
  Prodi_2: string
  Kampus_3: string
  Prodi_3: string
  Status_Lolos: string
  Register_Lat: string
  Register_Lon: string
  Provinsi: string
  Kabupaten: string
  Nomor_Kusuka: string
  Nomor_Kusuka_Profesi: string
}

export type GenderSummary = {
  Jenis_Kelamin: 'L' | 'P'
  total: number
}

export type ProdiSummary = {
  Prodi_1: string
  total: number
}

export type KampusSummary = {
  Kampus_1: string
  total: number
  prodis: ProdiSummary[]
}

export type PendaftarSummaryResponse = {
  total_data: number
  total_lolos: number
  total_lolos_adm: number
  gender_summary: GenderSummary[]
  kampus_summary: KampusSummary[]
}

export type CalonTaruna = {
  no: number
  no_pendaftaran: string
  jalur: string
  jalur_pendaftaran: string
  nama_lengkap: string
  no_nik: string
  nisn: number
  tanggal_lahir: string
  tempat_lahir: string
  jk: string
  agama: string
  provinsi: string
  kab_kota: string
  kecamatan: string
  kelurahan_desa: string
  kode_pos: number
  alamat: string
  nomor_telp: string
  email: string
  asal_sekolah: string
  nama_sekolah: string
  jurusan: string
  nama_ayah: string
  pekerjaan_ayah: string
  provinsi_ayah: string
  kab_kota_ayah: string
  kecamatan_ayah: string
  kelurahan_ayah: string
  telp_ayah: string
  nama_ibu: string
  pekerjaan_ibu: string
  provinsi_ibu: string
  kab_kota_ibu: string
  kecamatan_ibu: string
  kelurahan_ibu: string
  telp_ibu: string
  foto: string
  ijazah_sttb: string
  kartu_keluarga: string
  ktp_ortu: string
  bukti_transfer: string
  form_a: string
  akte_kelahiran: string
  kartu_nelayan: string
  form_c: string
  form_b: string
  nilai_rapor: string
  satdik_1: string
  kampus_1: string
  prodi_1: string
  satdik_2: string
  kampus_2: string
  prodi_2: string
  satdik_3: string
  kampus_3: string
  prodi_3: string
  tgl_verifikasi: string
  verifikator: string
  status_verifikasi: string
  status_administrasi: string
  tanggal_daftar: string
  bayar_registrasi: string
  bayar_seleksi: string
  lokasi_seleksi: string
  kode_provinsi: number
  kode_kab_kota: number
}
