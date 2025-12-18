import { useState } from 'react'
import axios from 'axios'

export const useAddSasaran = () => {
  const [loading, setLoading] = useState(false)

  const addSasaran = async (data: any) => {
    setLoading(true)
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/kinerja/sasaran`,
        data,
      )
    } finally {
      setLoading(false)
    }
  }

  return { addSasaran, loading }
}

export const useAddIku = () => {
  const [loading, setLoading] = useState(false)

  const addIku = async (data: any) => {
    setLoading(true)
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/kinerja/iku`, data)
    } finally {
      setLoading(false)
    }
  }

  return { addIku, loading }
}

export const useAddOutput = () => {
  const [loading, setLoading] = useState(false)

  const addOutput = async (data: any) => {
    setLoading(true)
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/kinerja/output`,
        data,
      )
    } finally {
      setLoading(false)
    }
  }

  return { addOutput, loading }
}
