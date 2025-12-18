import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

interface SatkerItem {
  kdsatker: string
  nama_satker: string
  pagu: number
  realisasi: number
  persen_realisasi: number
}

export const exportRealisasiPerSatkerToExcel = (data: any, tahun: number) => {
  const worksheetData: any[][] = [
    ['No', 'KDSatker', 'Nama Satker', 'Pagu', 'Realisasi', '%'],
  ]

  data.forEach((item: any, index: number) => {
    worksheetData.push([
      index + 1,
      item.kdsatker,
      item.nama_satker.toUpperCase(),
      item.pagu,
      item.realisasi,
      item.persen_realisasi.toFixed(2),
    ])
  })

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, `Realisasi Satker ${tahun}`)

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  saveAs(
    new Blob([excelBuffer], { type: 'application/octet-stream' }),
    `Realisasi_Satker_${tahun}.xlsx`,
  )
}
