export type CountStatsInstruktur = {
  bidangKeahlian: Record<string, number>
  jenjangJabatan: Record<string, number>
  pendidikanTerakhir: Record<string, number>
  status: Record<string, number>
  tot: number
  jenjangJabatanKelompok: Record<string, number>
}

export type Instruktur = {
  IdInstruktur: number
  nama: string
  id_lemdik: number
  jenis_pelatih: string
  jenjang_jabatan: string
  jenjang_jabatan_kelompok: string
  bidang_keahlian: string
  metodologi_pelatihan: string
  pelatihan_pelatih: string
  kompetensi_teknis: string
  management_of_training: string
  training_officer_course: string
  link_data_dukung_sertifikat: string
  status: string
  create_at: string
  update_at: string
  pendidikkan_terakhir: string
  no_telpon: string
  email: string
  nip: string
  eselon_1: string
  eselon_2: string
}
