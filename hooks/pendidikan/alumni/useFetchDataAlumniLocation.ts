import { useEffect, useState } from 'react'
import axios from 'axios'
import { baseUrl } from '@/urls/urls'
import { AlumniDetail } from '@/types/alumnis'

export type AlumniLocationData = {
  name: string
  tahun_lulus: string
  program_studi: string
  latitude: string | null
  longitude: string | null
}

export type UseAlumniDataParams = {
  selectedYear?: string
  tingkatPendidikan?: string
}

export function useFetchDataAlumniLocation(params: UseAlumniDataParams) {
  const [data, setData] = useState<AlumniDetail[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await axios.get<AlumniDetail[]>(
          `${baseUrl}/api/alumnis/location`,
          {
            params: {
              selectedYear: params.selectedYear,
              tingkatPendidikan: params.tingkatPendidikan,
            },
          },
        )
        setData(response.data)
      } catch (err) {
        setError('Failed to fetch alumni data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.selectedYear, params.tingkatPendidikan])

  return { data, loading, error }
}
