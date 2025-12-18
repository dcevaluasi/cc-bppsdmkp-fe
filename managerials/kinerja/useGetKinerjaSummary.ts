import { useEffect, useState } from 'react'
import axios from 'axios'
import { KinerjaSummaryResponse } from '@/types/managerial/kinerja'
import { baseUrl } from '@/urls/urls'

export const useGetKinerjaSummary = (tahun: string, tw: string) => {
  const [data, setData] = useState<KinerjaSummaryResponse>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!tahun && !tw) return

    const fetchData = async () => {
      try {
        const response = await axios.get<KinerjaSummaryResponse>(
          `${baseUrl}/api/kinerja/summary`,
          {
            params: { tahun, tw },
          },
        )
        console.log({ response })
        setData(response.data)
      } catch (err) {
        console.error({ err })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [tahun, tw])

  return { data, loading, error }
}
