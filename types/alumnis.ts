export type AlumniAbsorptionSummary = {
  absorption: string
  count: number
}

export type AlumniCompanyCountrySummary = {
  company_country: string
  count: number
}

export type AlumniWorkStatusSummary = {
  work_status: string
  count: number
}

export type AlumniStudyProgramHasWork = {
  study_program: string
  count: number
}

export type AlumniEmploymentByYearSummary = {
  year: string
  count: number
}

export type AlumniPerYearSUmmary = {
  year: string
  count: number
}

export type AlumniTopJobFieldSummary = {
  job_field: string
  count: number
}

export type AlumniSummary = {
  absorption_count: AlumniAbsorptionSummary[]
  total_absorption_count: number
  company_country_count: AlumniCompanyCountrySummary[]
  total_company_country_count: number
  income_range_count: AlumniIncomeRangeSummary[]
  total_income_range_count: number
  gender_count: AlumniGenderSummary[]
  total_gender_count: number
  study_program_count_has_work: AlumniStudyProgramHasWork[]
  total_study_program_count_has_work: number
  work_status_count: AlumniWorkStatusSummary[]
  total_work_status_count: number
  employment_by_year_count: AlumniEmploymentByYearSummary[]
  total_employment_by_year_count: number
  alumni_per_year_count: AlumniPerYearSUmmary[]
  total_alumni_per_year_count: number
  top_job_fields: AlumniTopJobFieldSummary[]
  total_top_job_fields_count: number
  nama_satdik_count: AlumniSatdikSummary[]
}

export type AlumniIncomeRangeSummary = {
  income_range: string
  count: number
}

export type AlumniSatdikSummary = {
  nama_satdik: string
  count: number
}

export type AlumniGenderSummary = {
  gender: string
  count: number
}

export type PesertaDidikGenderSummary = {
  gender: string
  count: number
}

export type PesertaDidikReligionSummary = {
  religion: string
  count: number
}

export type PesertaDidikProvinceSummary = {
  province_name: string
  count: number
}

export type PesertaDidikSatdikSummary = {
  satdik_name: string
  count: number
}

export type PesertaDidikProdiSummary = {
  prodis: string
  count: number
}

export type PesertaDidikOriginSummary = {
  origin: string
  count: number
}

export type PesertaDidikParentJobSummary = {
  parent_job: string
  count: number
}

export type PesertaDidikEnrollYearSummary = {
  enroll_year: string
  count: number
}

export type PesertaDidikLevelSummary = {
  level: string
  count: number
}

export type PesertaDidikStatusSummary = {
  status: string
  count: number
}

export type GlobalPesertaDidikSummary = {
  pendidikan_tinggi: PesertaDidikSummary
  pendidikan_menengah: PesertaDidikSummary
}

export type PesertaDidikSummary = {
  total_count: number
  gender_count: PesertaDidikGenderSummary[]
  religion_count: PesertaDidikReligionSummary[]
  province_count: PesertaDidikProvinceSummary[]
  satdik_count: PesertaDidikSatdikSummary[]
  prodis_count: PesertaDidikProdiSummary[]
  origin_count: PesertaDidikOriginSummary[]
  parent_job_count: PesertaDidikParentJobSummary[]
  enroll_year_count: PesertaDidikEnrollYearSummary[]
  level_count: PesertaDidikLevelSummary[]
  status_count: PesertaDidikStatusSummary[]
}

export type PesertaDidiks = {
  id: number
  name: string
  gender: string
  religion: string
  province_name: string
  satdik_name: string
  prodis: string
  origin: string
  parent_job: string
  enroll_year: string
  level: string
  status: string
  latitude: string
  longitude: string
}

export type Alumnis = {
  id: number
  name: string
  nik: string
  avatar: string | null
  gender: 'P' | 'L' // Assuming 'P' for female and 'L' for male
  origin: string
  year: string
  nis: string
  study_program: string
  address: string
  village: string
  district_name: string | null
  city_name: string
  zipcode: string
  email: string
  phone: string
  certificate: string
  work_status: string
  occupation: string
  absorption: string
  absorption_id: number
  job_field: string
  job_title: string | null
  company_name: string
  company_address: string
  company_phone: string | null
  company_country: string
  company_state: string | null
  company_district: string | null
  income_range: string
  satdik_id: number
  district_id: number | null
  city_id: number
  province_id: number
  company_province: string | null
  company_city: string | null
  latitude: string
  longitude: string
  pesdik_ref: number
  elatar_profil_id: number | null
  created_at: string // Use Date if you plan to convert it to a Date object
}

export type AlumniDetail = {
  id_alumni: number
  id_satdik: number
  id_program_studi: number
  satdik_id: number
  id_kampus: number
  name: string
  nisn: string
  nit: string
  nik: string
  jenis_kelamin: 'L' | 'P' | string
  asal: string
  tahun_lulus: string
  program_studi: string
  satuan_pendidikan: string
  alamat: string
  desa: string
  kecamatan: string
  kota_kabupaten: string
  provinsi: string
  kode_pos: string
  email: string
  phone: string
  sertifikat: string
  absorption: string
  pekerjaan: string
  bidang_pekerjaan: string
  jabatan: string
  nama_perusahaan: string
  alamat_perusahaan: string
  provinsi_perusahan: string
  kota_perusahaan: string
  perusahaan_pengirim: string
  perusahaan_penerima: string
  telp_perusahaan: string
  negara: string
  penghasilan: string
  status_pekerjaan: string
  create_at: string
  update_at: string
  jabatan_lainnya: string
  waktu_tunggu: string
  alamat_perusahaan_pengirim: string
  telp_perusahaan_pengirim: number
  catatan: string
  keselarasan_program_studi: string
  saran_peningkatan_mutu: string
  masukan_peningkatan_mutu: string
  no_ijazah: string
  latitude: string
  longitude: string
}
