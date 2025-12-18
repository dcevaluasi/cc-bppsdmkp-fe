import { DailyPendapatanResponse } from '@/types/managerial/pendatapan'
import { baseUrl } from '@/urls/urls'
import axios from 'axios'
import React from 'react'

export const useRekapPendapatanPerDay = (
  tahun?: number,
  tanggal?: string,
  type?: string,
): {
  data: DailyPendapatanResponse
  loading: boolean
} => {
  const [data, setData] = React.useState<DailyPendapatanResponse>([])
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    const fetchRekap = async () => {
      if (!tahun || !tanggal) return

      setLoading(true)
      try {
        const response = await axios.get<DailyPendapatanResponse>(
          `${baseUrl}/api/pendapatan/realisasi-per-day`,
          {
            params: {
              tahun,
              tanggal,
              type,
            },
          },
        )
        setData(response.data)
        setLoading(false)
        console.log({ response })
      } catch (err) {
        console.error(err)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchRekap()
  }, [tahun, tanggal, type])

  return { data, loading }
}
