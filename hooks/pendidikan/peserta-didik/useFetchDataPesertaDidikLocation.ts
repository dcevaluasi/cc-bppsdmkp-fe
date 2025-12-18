import { useEffect, useState } from 'react'
import axios from 'axios'
import { PesertaDidikDetail } from '@/types/peserta-didik'
import { baseUrl } from '@/urls/urls'

interface UseFetchDataPesertaDidikLocationResult {
  pesertaDidiks: PesertaDidikDetail[]
  isFetching: boolean
  error: string | null
  refetch: () => void
}

export const useFetchDataPesertaDidikLocation = (
  tingkatPendidikan: string,
  provinsi?: string,
  kabupaten?: string,
  name?: string,
): UseFetchDataPesertaDidikLocationResult => {
  const [pesertaDidiks, setPesertaDidiks] = useState<PesertaDidikDetail[]>([])
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setIsFetching(true)
    try {
      const params: any = { tingkatPendidikan }

      if (provinsi && provinsi !== 'All') {
        params.provinsi = provinsi
      }

      if (kabupaten && kabupaten !== 'All') {
        params.kabupaten = kabupaten
      }

      if (name) {
        params.name = name
      }

      const response = await axios.get(
        `${baseUrl}/api/peserta-didiks/getStudentWithLocation`,
        { params },
      )
      setPesertaDidiks(response.data)
      setError(null)
    } catch (err) {
      console.error({ error: err })
      setError(null)
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [tingkatPendidikan, provinsi, kabupaten, name])

  return {
    pesertaDidiks,
    isFetching,
    error,
    refetch: fetchData,
  }
}
