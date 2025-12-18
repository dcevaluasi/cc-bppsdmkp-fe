import { RekapPerPusatGroupedItem } from '@/types/managerial/anggaran'
import { baseUrl } from '@/urls/urls'
import axios from 'axios'
import React from 'react'

export const useRincianDipaPerPusat = (
  tahun?: number,
  tanggal?: string,
): {
  data: RekapPerPusatGroupedItem[] | null
  loading: boolean
} => {
  const [data, setData] = React.useState<RekapPerPusatGroupedItem[] | null>(
    null,
  )
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await axios.get<RekapPerPusatGroupedItem[]>(
          `${baseUrl}/api/anggaran/rincian-pusat`,
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
        console.error({ err })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [tahun, tanggal])

  return { data, loading }
}
