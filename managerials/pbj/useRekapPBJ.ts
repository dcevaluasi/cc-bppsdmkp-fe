import { PbjAllDataResponse } from '@/types/managerial/pbj'
import { baseUrl } from '@/urls/urls'
import axios from 'axios'
import React from 'react'

export const useRekapPBJ = (
  tahun?: number,
  tanggal?: string,
): {
  data: PbjAllDataResponse
  loading: boolean
} => {
  const [data, setData] = React.useState<PbjAllDataResponse>([])
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    const fetchRekap = async () => {
      if (!tahun || !tanggal) return

      setLoading(true)
      try {
        const response = await axios.get<PbjAllDataResponse>(
          `${baseUrl}/api/pbj/getAllDataPbj`,
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
        console.error(err)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchRekap()
  }, [tahun, tanggal])

  return { data, loading }
}
