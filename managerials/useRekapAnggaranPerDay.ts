import { DailyAnggaranResponse } from '@/types/managerial/anggaran'
import { baseUrl } from '@/urls/urls'
import axios from 'axios'
import React from 'react'

export const useRekapAnggaranPerDay = (
  year?: number,
  month?: number,
): {
  data: DailyAnggaranResponse
  loading: boolean
} => {
  const [data, setData] = React.useState<DailyAnggaranResponse>([])
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    const fetchRekap = async () => {
      if (!year || !month) return

      setLoading(true)
      try {
        const response = await axios.get<DailyAnggaranResponse>(
          `${baseUrl}/api/anggaran/realisasi-per-day`,
          {
            params: {
              year,
              month,
            },
          },
        )
        setData(response.data)
        console.log({ response })
      } catch (err) {
        console.error(err)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchRekap()
  }, [year, month])

  return { data, loading }
}
