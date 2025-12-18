import { useState, useEffect } from 'react'
import axios from 'axios'

export const useGetIku = (tahun?: string) => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/kinerja/iku`,
          {
            params: { tahun },
          },
        )
        setData(response.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [tahun])

  return { data, loading }
}
