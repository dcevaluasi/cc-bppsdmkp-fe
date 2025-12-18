import { RekapPerSatkerItem } from '@/types/managerial/anggaran'
import { KerjasamaSummaryResponse } from '@/types/managerial/kerjasama'
import { baseUrl } from '@/urls/urls'
import axios from 'axios'
import React from 'react'

export const useSummaryKS = (
  tahunMulai?: string,
  tahunSelesai?: string,
): {
  data: KerjasamaSummaryResponse | null
  loading: boolean
} => {
  const [data, setData] = React.useState<KerjasamaSummaryResponse | null>(null)
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    const fetchRekap = async () => {
      setLoading(true)
      try {
        const response = await axios.get<KerjasamaSummaryResponse>(
          `${baseUrl}/api/kerja-sama/getSummaryChartKS`,
          {
            params: {
              tahunMulai,
              tahunSelesai,
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
  }, [tahunMulai, tahunSelesai])

  return { data, loading }
}
