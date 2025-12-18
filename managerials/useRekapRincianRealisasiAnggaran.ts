import { RekapRincianRealisasiAnggaranItem } from '@/types/managerial/anggaran'
import { baseUrl } from '@/urls/urls'
import axios from 'axios'
import React from 'react'

export const useRekapRincianRealisasiAnggaran = (
  tahun?: number,
  tanggal?: string,
): {
  data: RekapRincianRealisasiAnggaranItem | null
  loading: boolean
} => {
  const [
    data,
    setData,
  ] = React.useState<RekapRincianRealisasiAnggaranItem | null>(null)
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    const fetchRekap = async () => {
      setLoading(true)
      try {
        const response = await axios.get<RekapRincianRealisasiAnggaranItem>(
          `${baseUrl}/api/anggaran/rincian-realisasi`,
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
