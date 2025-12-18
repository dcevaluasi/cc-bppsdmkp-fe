import { useQuery } from '@tanstack/react-query'
import { fetcher } from '@/utils/api'
import { baseUrl } from '@/urls/urls'
import {
  GapokkanPerProvinsi,
  GapokkanPerSatminkal,
} from '@/types/penyuluhan/kelompok'
import {
  GapokkanDetailResponse,
  KelompokLocationResponse,
} from '@/types/penyuluhan/summary'

type Params = {
  tahun?: number | string
  tw?: 'TW I' | 'TW II' | 'TW III' | 'TW IV' | string
  provinsi?: string
  kabupaten?: string
}

export const useGapokkanPerSatminkal = ({
  tahun,
  tw,
  provinsi,
  kabupaten,
}: Params) =>
  useQuery({
    queryKey: ['gapokkan-per-satminkal', tahun, tw, provinsi, kabupaten],
    queryFn: () =>
      fetcher<GapokkanPerSatminkal[]>(
        `${baseUrl}/api/gapokkan/per-satminkal?tahun=${tahun ?? ''}&tw=${
          tw ?? ''
        }&provinsi=${provinsi ?? ''}&kabupaten=${kabupaten ?? ''}`,
      ),
    enabled: Boolean(tahun && tw),
  })

export const useGapokkanPerProvinsi = ({
  tahun,
  tw,
  provinsi,
  kabupaten,
}: Params) =>
  useQuery({
    queryKey: ['gapokkan-per-provinsi', tahun, tw, provinsi, kabupaten],
    queryFn: () =>
      fetcher<GapokkanPerProvinsi[]>(
        `${baseUrl}/api/gapokkan/per-provinsi?tahun=${tahun ?? ''}&tw=${
          tw ?? ''
        }&provinsi=${provinsi ?? ''}&kabupaten=${kabupaten ?? ''}`,
      ),
    enabled: Boolean(tahun && tw),
  })

export const useGroupByLocations = ({
  tahun,
  tw,
  provinsi,
  kabupaten,
}: Params) =>
  useQuery({
    queryKey: ['locations', tahun, tw, provinsi, kabupaten],
    queryFn: () =>
      fetcher<KelompokLocationResponse[]>(
        `${baseUrl}/api/gapokkan/locations?tahun=${tahun ?? ''}&tw=${
          tw ?? ''
        }&provinsi=${provinsi ?? ''}&kabupaten=${kabupaten ?? ''}`,
      ),
    enabled: Boolean(tahun && tw),
  })

export const useGapokkanDetail = (no?: string) =>
  useQuery({
    queryKey: ['gapokkan', no],
    queryFn: () =>
      fetcher<GapokkanDetailResponse>(
        `${baseUrl}/api/gapokkan/detail?no=${no}`,
      ),
    enabled: Boolean(no),
  })
