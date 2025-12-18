import { PesertaDidikDetail } from '@/types/peserta-didik'
import { baseUrl } from '@/urls/urls'
import axios from 'axios'
import React from 'react'

export function useFetchDataPesertaDidikDetail(
  id: string | number | null | undefined,
  opts?: { enabled?: boolean },
) {
  const enabled = opts?.enabled ?? true

  const [data, setData] = React.useState<PesertaDidikDetail | null>(null)
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!id) return

    const fetchStudent = async () => {
      if (!enabled || id == null) return
      setLoading(true)
      try {
        const res = await axios.get<PesertaDidikDetail>(
          `${baseUrl}/api/peserta-didiks/${id}`,
        )
        setData(res.data)
        setError(null)
        console.log({ res })
      } catch (err) {
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchStudent()
  }, [id, enabled])

  return { data, loading, error }
}
