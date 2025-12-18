import { TanggalOmspanResponse } from '@/types/managerial/anggaran'
import { baseUrl } from '@/urls/urls'
import axios from 'axios'
import React from 'react'

export const useGetTanggalOmspan = (): {
  data: TanggalOmspanResponse | null
  loading: boolean
} => {
  const [data, setData] = React.useState<TanggalOmspanResponse | null>(null)
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    const fetchRekap = async () => {
      setLoading(true)
      try {
        const response = await axios.get<TanggalOmspanResponse>(
          `${baseUrl}/api/tanggal-omspan`,
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
  }, [])

  return { data, loading }
}
