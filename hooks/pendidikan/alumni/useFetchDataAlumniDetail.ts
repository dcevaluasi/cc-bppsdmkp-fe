import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { baseUrl } from '@/urls/urls'
import { AlumniDetail, Alumnis } from '@/types/alumnis'

export function useFetchDataAlumniDetail(
  id_alumni: number | null | undefined,
  opts?: { enabled?: boolean },
) {
  const enabled = opts?.enabled ?? true

  const [data, setData] = useState<AlumniDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDetail = useCallback(async () => {
    if (!enabled || id_alumni == null) return
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get<AlumniDetail>(
        `${baseUrl}/api/alumnis/${id_alumni}`,
      )
      setData(res.data)
      console.log({ res })
    } catch (err) {
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [id_alumni, enabled])

  useEffect(() => {
    fetchDetail()
  }, [fetchDetail])

  return { data, loading, error, refetch: fetchDetail }
}
