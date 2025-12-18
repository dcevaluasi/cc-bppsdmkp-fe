import { RekapPerSatkerItem } from '@/types/managerial/anggaran'
import { baseUrl } from '@/urls/urls'
import axios from 'axios'
import React from 'react'

export const useRekapSatker = (
  tahun?: number,
  tanggal?: string,
  type?: string,
): {
  data: RekapPerSatkerItem[] | null
  loading: boolean
} => {
  const [data, setData] = React.useState<RekapPerSatkerItem[] | null>(null)
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    const fetchRekap = async () => {
      setLoading(true)
      try {
        const response = await axios.get<RekapPerSatkerItem[]>(
          `${baseUrl}/api/rekap-per-pusat`,
          {
            params: {
              tahun,
              tanggal,
              type,
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
  }, [tahun, tanggal, type])

  return { data, loading }
}
