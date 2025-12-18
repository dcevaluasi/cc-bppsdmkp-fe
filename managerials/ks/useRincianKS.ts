import {
  KerjaSamaItem,
  KerjaSamaRincianDataResponse,
} from '@/types/managerial/kerjasama'
import { baseUrl } from '@/urls/urls'
import axios from 'axios'
import React from 'react'

export const useRincianKS = (
  tahunMulai?: string,
  tahunSelesai?: string,
): {
  data: KerjaSamaItem[]
  loading: boolean
  refetch: () => void
} => {
  const [data, setData] = React.useState<KerjaSamaItem[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)

  const fetchRekap = React.useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get<KerjaSamaItem[]>(
        `${baseUrl}/api/kerja-sama/getRincianDataKS`,
        {
          params: {
            tahunMulai,
            tahunSelesai,
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
  }, [tahunMulai, tahunSelesai])

  React.useEffect(() => {
    fetchRekap()
  }, [fetchRekap])

  return { data, loading, refetch: fetchRekap }
}
