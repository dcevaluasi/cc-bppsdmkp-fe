import {
  GroupPbjBySatkerDataResponse,
  PbjAllDataResponse,
} from '@/types/managerial/pbj'
import { baseUrl } from '@/urls/urls'
import axios from 'axios'
import React from 'react'

export const useRekapPBJPerSatker = (
  tahun?: number,
  tanggal?: string,
  kdsatker?: string,
): {
  data: GroupPbjBySatkerDataResponse
  loading: boolean
} => {
  const [data, setData] = React.useState<GroupPbjBySatkerDataResponse>([])
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    const fetchRekap = async () => {
      if (!tahun || !tanggal) return

      setLoading(true)
      try {
        const response = await axios.get<GroupPbjBySatkerDataResponse>(
          `${baseUrl}/api/pbj/getGroupedPbjBySatker`,
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
