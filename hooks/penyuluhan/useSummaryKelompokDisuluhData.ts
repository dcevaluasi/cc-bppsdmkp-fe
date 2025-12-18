import { useQuery } from '@tanstack/react-query'
import { fetcher } from '@/utils/api'
import { baseUrl } from '@/urls/urls'
import {
  KelompokJumlahPerSatminkal,
  KelompokJumlahPerProvinsi,
  KelompokBidangUsahaPerProvinsi,
  KelompokKelasPerProvinsi,
  KelompokBidangUsahaPerSatminkal,
} from '@/types/penyuluhan/kelompok'
import {
  KelompokDisuluhDetailResponse,
  KelompokLocationResponse,
} from '@/types/penyuluhan/summary'

type Params = {
  tahun?: number | string
  tw?: 'TW I' | 'TW II' | 'TW III' | 'TW IV' | string
  provinsi?: string
  kabupaten?: string
}

// 1. /jumlah-per-satminkal
export const useKelompokJumlahPerSatminkal = ({
  tahun,
  tw,
  provinsi,
  kabupaten,
}: Params) =>
  useQuery({
    queryKey: ['kelompok-jumlah-per-satminkal', tahun, tw, provinsi, kabupaten],
    queryFn: () =>
      fetcher<KelompokJumlahPerSatminkal[]>(
        `${baseUrl}/api/kelompok-disuluh/jumlah-per-satminkal?tahun=${
          tahun ?? ''
        }&tw=${tw ?? ''}&provinsi=${provinsi ?? ''}&kabupaten=${
          kabupaten ?? ''
        }`,
      ),
    enabled: Boolean(tahun && tw),
  })

// 2. /jumlah-per-provinsi
export const useKelompokJumlahPerProvinsi = ({
  tahun,
  tw,
  provinsi,
  kabupaten,
}: Params) =>
  useQuery({
    queryKey: ['kelompok-jumlah-per-provinsi', tahun, tw, provinsi, kabupaten],
    queryFn: () =>
      fetcher<KelompokJumlahPerProvinsi[]>(
        `${baseUrl}/api/kelompok-disuluh/jumlah-per-provinsi?tahun=${
          tahun ?? ''
        }&tw=${tw ?? ''}&provinsi=${provinsi ?? ''}&kabupaten=${
          kabupaten ?? ''
        }`,
      ),
    enabled: Boolean(tahun && tw),
  })

// 3. /bidang-usaha-per-provinsi
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
        `${baseUrl}/api/kelompok-disuluh/bidang-usaha-per-provinsi?tahun=${
          tahun ?? ''
        }&tw=${tw ?? ''}&provinsi=${provinsi ?? ''}&kabupaten=${
          kabupaten ?? ''
        }`,
      ),
    enabled: Boolean(tahun && tw),
  })

// 4. /kelas-per-provinsi
export const useKelompokKelasPerProvinsi = ({
  tahun,
  tw,
  provinsi,
  kabupaten,
}: Params) =>
  useQuery({
    queryKey: ['kelompok-kelas-per-provinsi', tahun, tw, provinsi, kabupaten],
    queryFn: () =>
      fetcher<KelompokKelasPerProvinsi[]>(
        `${baseUrl}/api/kelompok-disuluh/kelas-per-provinsi?tahun=${
          tahun ?? ''
        }&tw=${tw ?? ''}&provinsi=${provinsi ?? ''}&kabupaten=${
          kabupaten ?? ''
        }`,
      ),
    enabled: Boolean(tahun && tw),
  })

// 5. /bidang-usaha-per-satminkal
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
        `${baseUrl}/api/kelompok-disuluh/bidang-usaha-per-satminkal?tahun=${
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
        `${baseUrl}/api/kelompok-disuluh/locations?tahun=${tahun ?? ''}&tw=${
          tw ?? ''
        }&provinsi=${provinsi ?? ''}&kabupaten=${kabupaten ?? ''}`,
      ),
    enabled: Boolean(tahun && tw),
  })

export const useKelompokDisuluhDetail = (no?: string) =>
  useQuery({
    queryKey: ['kelompok-disuluh', no],
    queryFn: () =>
      fetcher<KelompokDisuluhDetailResponse>(
        `${baseUrl}/api/kelompok-disuluh/detail?no=${no}`,
      ),
    enabled: Boolean(no),
  })
