import { KROAnggaranItem } from '@/types/managerial/anggaran'
import { baseUrl } from '@/urls/urls'
import axios from 'axios'
import React from 'react'

export const useKROAnggaran = (
  tahun?: number,
  tanggal?: string,
): {
  data: KROAnggaranItem[] | null
  loading: boolean
} => {
  const [data, setData] = React.useState<KROAnggaranItem[] | null>(null)
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    const fetchRekap = async () => {
      setLoading(true)
      try {
        const response = await axios.get<KROAnggaranItem[]>(
          `${baseUrl}/api/anggaran/realisasi-grouped`,
          {
            params: {
              tahun,
              tanggal,
            },
          },
        )
        setData(response.data)
        console.log({ response })
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
