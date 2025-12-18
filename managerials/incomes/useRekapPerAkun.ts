import { RekapRealisasiPendapatanAkunItem } from '@/types/managerial/anggaran'
import { baseUrl } from '@/urls/urls'
import axios from 'axios'
import React from 'react'

export const useRekapPerAkun = (
  tahun?: number,
  tanggal?: string,
): {
  data: RekapRealisasiPendapatanAkunItem[] | null
  loading: boolean
} => {
  const [data, setData] = React.useState<
    RekapRealisasiPendapatanAkunItem[] | null
  >(null)
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    const fetchRekap = async () => {
      setLoading(true)
      try {
        const response = await axios.get<RekapRealisasiPendapatanAkunItem[]>(
          `${baseUrl}/api/pendapatan/realisasi-akun`,
          {
            params: {
              tahun,
              tanggal,
            },
          },
        )
        setData(response.data)
      } catch (err) {
        setLoading(false)
        console.log({ err })
      } finally {
        setLoading(false)
      }
    }

    fetchRekap()
  }, [tahun, tanggal])

  return { data, loading }
}
