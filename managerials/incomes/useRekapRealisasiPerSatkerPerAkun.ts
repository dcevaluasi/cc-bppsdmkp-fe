import { RekapRealisasiPendapatanAkunItem } from '@/types/managerial/anggaran'
import { PendapatanPerSatkrePerAkunResponse } from '@/types/managerial/pendatapan'
import { baseUrl } from '@/urls/urls'
import axios from 'axios'
import React from 'react'

export const useRekapRealisasiPerSatkerPerAkun = (
  tahun?: number,
  tanggal?: string,
): {
  data: PendapatanPerSatkrePerAkunResponse | null
  loading: boolean
} => {
  const [
    data,
    setData,
  ] = React.useState<PendapatanPerSatkrePerAkunResponse | null>(null)
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    const fetchRekap = async () => {
      setLoading(true)
      try {
        const response = await axios.get<PendapatanPerSatkrePerAkunResponse>(
          `${baseUrl}/api/pendapatan/per-satker-per-akun`,
          {
            params: {
              tahun,
              tanggal,
            },
          },
        )
        setData(response.data)
      } catch (err) {
        setLoading(false)
        console.log({ err })
      } finally {
        setLoading(false)
      }
    }

    fetchRekap()
  }, [tahun, tanggal])

  return { data, loading }
}
