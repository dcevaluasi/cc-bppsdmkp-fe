import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

interface RekapRealisasi {
  pagu: number
  realisasi: number
}

export const exportTotalRealisasiToExcel = (
  data: RekapRealisasi,
  tahun: number,
) => {
  const persentase = (data.realisasi / data.pagu) * 100

  const worksheetData = [
    ['Uraian', 'Pagu', 'Realisasi', '%'],
    ['Total', data.pagu, data.realisasi, persentase.toFixed(2)],
  ]

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, `Realisasi Total ${tahun}`)

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  saveAs(
    new Blob([excelBuffer], { type: 'application/octet-stream' }),
    `Realisasi_Total_${tahun}.xlsx`,
  )
}
