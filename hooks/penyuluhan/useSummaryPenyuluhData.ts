import { useQuery } from '@tanstack/react-query'
import { fetcher } from '@/utils/api'
import { baseUrl } from '@/urls/urls'
import {
  PenyuluhanTotalResponse,
  PenyuluhByJabatanResponse,
  PenyuluhByJenisKelaminResponse,
  PenyuluhByKelompokUsiaResponse,
  PenyuluhByPendidikanResponse,
  PenyuluhByStatusResponse,
  PenyuluhDetailResponse,
  PenyuluhLocationResponse,
} from '@/types/penyuluhan/summary'

type Params = {
  tahun?: number | string
  tw?: 'TW I' | 'TW II' | 'TW III' | 'TW IV' | string
  provinsi?: string
  kabupaten?: string
  name?: string
}

export const useGroupByStatus = ({ tahun, tw, provinsi, kabupaten }: Params) =>
  useQuery({
    queryKey: ['penyuluh-status', tahun, tw, provinsi, kabupaten],
    queryFn: () =>
      fetcher<PenyuluhByStatusResponse>(
        `${baseUrl}/api/penyuluh/group-by-status?tahun=${tahun ?? ''}&tw=${
          tw ?? ''
        }&provinsi=${provinsi ?? ''}&kabupaten=${kabupaten ?? ''}`,
      ),
    enabled: Boolean(tahun && tw),
  })

export const useGroupByJabatan = ({ tahun, tw, provinsi, kabupaten }: Params) =>
  useQuery({
    queryKey: ['penyuluh-jabatan', tahun, tw, provinsi, kabupaten],
    queryFn: () =>
      fetcher<PenyuluhByJabatanResponse>(
        `${baseUrl}/api/penyuluh/group-by-jabatan?tahun=${tahun ?? ''}&tw=${
          tw ?? ''
        }&provinsi=${provinsi ?? ''}&kabupaten=${kabupaten ?? ''}`,
      ),
    enabled: Boolean(tahun && tw),
  })

export const useGroupByPendidikan = ({
  tahun,
  tw,
  provinsi,
  kabupaten,
}: Params) =>
  useQuery({
    queryKey: ['penyuluh-pendidikan', tahun, tw, provinsi, kabupaten],
    queryFn: () =>
      fetcher<PenyuluhByPendidikanResponse>(
        `${baseUrl}/api/penyuluh/group-by-pendidikan?tahun=${tahun ?? ''}&tw=${
          tw ?? ''
        }&provinsi=${provinsi ?? ''}&kabupaten=${kabupaten ?? ''}`,
      ),
    enabled: Boolean(tahun && tw),
  })

export const useGroupByKelompokUsia = ({
  tahun,
  tw,
  provinsi,
  kabupaten,
}: Params) =>
  useQuery({
    queryKey: ['penyuluh-kelompok-usia', tahun, tw, provinsi, kabupaten],
    queryFn: () =>
      fetcher<PenyuluhByKelompokUsiaResponse>(
        `${baseUrl}/api/penyuluh/group-by-kelompok-usia?tahun=${
          tahun ?? ''
        }&tw=${tw ?? ''}&provinsi=${provinsi ?? ''}&kabupaten=${
          kabupaten ?? ''
        }`,
      ),
    enabled: Boolean(tahun && tw),
  })

export const useGroupByKelamin = ({ tahun, tw, provinsi, kabupaten }: Params) =>
  useQuery({
    queryKey: ['penyuluh-kelamin', tahun, tw, provinsi, kabupaten],
    queryFn: () =>
      fetcher<PenyuluhByJenisKelaminResponse>(
        `${baseUrl}/api/penyuluh/group-by-kelamin?tahun=${tahun ?? ''}&tw=${
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
  name,
}: Params) =>
  useQuery({
    queryKey: ['locations', tahun, tw, provinsi, kabupaten, name],
    queryFn: () =>
      fetcher<PenyuluhLocationResponse[]>(
        `${baseUrl}/api/penyuluh/locations?tahun=${tahun ?? ''}&tw=${
          tw ?? ''
        }&provinsi=${provinsi ?? ''}&kabupaten=${kabupaten ?? ''}&name=${
          name ?? ''
        }`,
      ),
    enabled: Boolean(tahun && tw), // Hanya wajib tahun & tw
  })

export const usePenyuluhDetail = (no?: number) =>
  useQuery({
    queryKey: ['penyuluh', no],
    queryFn: () =>
      fetcher<PenyuluhDetailResponse>(`${baseUrl}/api/penyuluh/detail/${no}`),
    enabled: Boolean(no),
  })

export const usePenyuluhTotal = ({ tahun, tw, provinsi, kabupaten }: Params) =>
  useQuery({
    queryKey: ['total', tahun, tw, provinsi, kabupaten],
    queryFn: () =>
      fetcher<PenyuluhanTotalResponse>(
        `${baseUrl}/api/penyuluh/summary/penyuluhan?tahun=${tahun ?? ''}&tw=${
          tw ?? ''
        }&provinsi=${provinsi ?? ''}&kabupaten=${kabupaten ?? ''}`,
      ),
    enabled: Boolean(tahun && tw),
  })
