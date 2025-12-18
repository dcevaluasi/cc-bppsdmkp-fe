import { useQuery } from '@tanstack/react-query'
import { fetcher } from '@/utils/api'
import { baseUrl } from '@/urls/urls'
import {
  KelompokBidangUsahaPerProvinsi,
  KelompokBidangUsahaPerSatminkal,
} from '@/types/penyuluhan/kelompok'
import {
  KelompokDibentukDetailResponse,
  KelompokLocationResponse,
} from '@/types/penyuluhan/summary'

type Params = {
  tahun?: number | string
  tw?: 'TW I' | 'TW II' | 'TW III' | 'TW IV' | string
  provinsi?: string
  kabupaten?: string
}

export const useKelompokBidangUsahaPerProvinsi = ({
  tahun,
  tw,
  provinsi,
  kabupaten,
}: Params) =>
  useQuery({
    queryKey: [
      'kelompok-bidang-usaha-per-provinsi',
      tahun,
      tw,
      provinsi,
      kabupaten,
    ],
    queryFn: () =>
      fetcher<KelompokBidangUsahaPerProvinsi[]>(
        `${baseUrl}/api/kelompok-dibentuk/bidang-usaha-per-provinsi?tahun=${
          tahun ?? ''
        }&tw=${tw ?? ''}&provinsi=${provinsi ?? ''}&kabupaten=${
          kabupaten ?? ''
        }`,
      ),
    enabled: Boolean(tahun && tw),
  })

export const useKelompokBidangUsahaPerSatminkal = ({
  tahun,
  tw,
  provinsi,
  kabupaten,
}: Params) =>
  useQuery({
    queryKey: [
      'kelompok-bidang-usaha-per-satminkal',
      tahun,
      tw,
      provinsi,
      kabupaten,
    ],
    queryFn: () =>
      fetcher<KelompokBidangUsahaPerSatminkal[]>(
        `${baseUrl}/api/kelompok-dibentuk/bidang-usaha-per-satminkal?tahun=${
          tahun ?? ''
        }&tw=${tw ?? ''}&provinsi=${provinsi ?? ''}&kabupaten=${
          kabupaten ?? ''
        }`,
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
        `${baseUrl}/api/kelompok-dibentuk/locations?tahun=${tahun ?? ''}&tw=${
          tw ?? ''
        }&provinsi=${provinsi ?? ''}&kabupaten=${kabupaten ?? ''}`,
      ),
    enabled: Boolean(tahun && tw),
  })

export const useKelompokDibentukDetail = (no?: string) =>
  useQuery({
    queryKey: ['kelompok-dibentuk', no],
    queryFn: () =>
      fetcher<KelompokDibentukDetailResponse>(
        `${baseUrl}/api/kelompok-dibentuk/detail?no=${no}`,
      ),
    enabled: Boolean(no),
  })
