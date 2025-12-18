import { RekapRealisasiSisaItem } from '@/types/managerial/anggaran'
import { baseUrl } from '@/urls/urls'
import axios from 'axios'
import React from 'react'

export const useRekapRealisasiSisa = (
  tahun?: number,
  tanggal?: string,
  kodeSatker?: string,
): {
  data: RekapRealisasiSisaItem | null
  loading: boolean
} => {
  const [data, setData] = React.useState<RekapRealisasiSisaItem | null>(null)
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    const fetchRekap = async () => {
      setLoading(true)
      try {
        const response = await axios.get<RekapRealisasiSisaItem>(
          `${baseUrl}/api/pendapatan/realisasi-sisa`,
          {
            params: {
              tahun,
              tanggal,
              ...(kodeSatker ? { kodeSatker } : {}),
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
  }, [tahun, tanggal, kodeSatker])

  return { data, loading }
}
