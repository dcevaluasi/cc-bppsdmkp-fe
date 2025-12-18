export type TenagaPendidikGolonganSummary = {
    golongan: string
    count: number
}

export type TenagaPendidikProgramStudiSummary = {
    program_studi: string
    count: number
}

export type TenagaPendidikJabatanSummary = {
    jabatan: string
    count: number
}

export type TenagaPendidikStatusSertifikasiSummary = {
    status_sertifikasi: string
    count: number
}

export type TenagaPendidikSummary = {
    golongan_count: TenagaPendidikGolonganSummary[]
    total_golongan_count: number
    program_studi_count: TenagaPendidikProgramStudiSummary[]
    total_program_studi_count: number
    jabatan_count: TenagaPendidikJabatanSummary[]
    total_jabatan_count: number
    status_sertifikasi_count: TenagaPendidikStatusSertifikasiSummary[]
    total_status_sertifikasi_count: number
}