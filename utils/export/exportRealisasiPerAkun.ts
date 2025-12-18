import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

interface AkunRealisasiItem {
  akun: string
  pagu: number
  realisasi: number
  persentasi: number
}

export const exportRealisasiPerAkun = (
  data: AkunRealisasiItem[],
  tahun: number,
) => {
  if (!Array.isArray(data)) {
    console.error('Data bukan array atau undefined:', data)
    return
  }

  const worksheetData: any[][] = [['No', 'Akun', 'Pagu', 'Realisasi', '%']]

  data.forEach((item, index) => {
    worksheetData.push([
      index + 1,
      item.akun,
      item.pagu,
      item.realisasi,
      item.persentasi.toFixed(2),
    ])
  })

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, `Realisasi Akun ${tahun}`)

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  saveAs(
    new Blob([excelBuffer], { type: 'application/octet-stream' }),
    `Realisasi_Akun_${tahun}.xlsx`,
  )
}
