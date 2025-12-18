import { GroupedPbjByAkunResponse } from '@/types/managerial/pbj'
import { baseUrl } from '@/urls/urls'
import axios from 'axios'
import React from 'react'

export const useRekapPBJPerAkun = (
  tahun?: number,
  tanggal?: string,
  kdsatker?: string,
): {
  data: GroupedPbjByAkunResponse
  loading: boolean
} => {
  const [data, setData] = React.useState<GroupedPbjByAkunResponse>([])
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    const fetchRekap = async () => {
      if (!tahun || !tanggal) return

      setLoading(true)
      try {
        const response = await axios.get<GroupedPbjByAkunResponse>(
          `${baseUrl}/api/pbj/getPBJGroupedByAkun`,
          {
            params: {
              tahun,
              tanggal,
              kdsatker,
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
  }, [tahun, tanggal, kdsatker])

  return { data, loading }
}
