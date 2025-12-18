import { useState, useEffect } from 'react'
import axios from 'axios'
import { baseUrl } from '@/urls/urls'

export type SummaryItem = {
  total: number
  [key: string]: string | number
}

export type ResultSummary = {
  status: SummaryItem[]
  jabatan: SummaryItem[]
  pendidikan: SummaryItem[]
  usia: SummaryItem[]
  kelamin: SummaryItem[]
  satminkal: { satminkal: string; total: number }[]
}

type UseResultSummaryOptions = {
  tahun?: any
  tw?: string
  provinsi?: string
  kabupaten?: string
}

export const useResultSummary = ({
  tahun,
  tw,
  provinsi,
  kabupaten,
}: UseResultSummaryOptions = {}) => {
  const [data, setData] = useState<ResultSummary | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Skip jika tahun atau tw tidak ada
    if (!tahun || !tw) {
      setData(null)
      return
    }

    const fetchSummary = async () => {
      setLoading(true)
      setError(null)

      try {
        // Build params object, hanya include yang ada nilainya
        const params: Record<string, string> = { tahun, tw }
        if (provinsi) params.provinsi = provinsi
        if (kabupaten) params.kabupaten = kabupaten

        const response = await axios.get<ResultSummary>(
          `${baseUrl}/api/penyuluh/summary`,
          { params },
        )

        setData(response.data)
        console.log({ response })
      } catch (err) {
        setError('Failed to fetch summary')
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [tahun, tw, provinsi, kabupaten])

  return { data, loading, error }
}
