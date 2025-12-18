import React from "react";

import { useGroupByJabatan, useGroupByKelamin, useGroupByKelompokUsia, useGroupByLocations, useGroupByPendidikan, useGroupByStatus, usePenyuluhTotal } from "@/hooks/penyuluhan/useSummaryPenyuluhData";
import { PenyuluhGroupedTable } from "./tables/PenyuluhGroupedTable";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { years } from "@/utils/time";
import { PenyuluhMap } from "@/components/map/PenyuluhMap";
import SummaryChartsPenyuluhan from "./charts/SummaryChartsPenyuluhan";
import { useSummaryValuePenyuluh } from "@/hooks/penyuluhan/useSummaryValuePenyuluh";
import { StatsPenyuluh } from "./charts/StatsPenyuluh";
import { useResultSummary } from "@/hooks/penyuluhan/useGeneralSummaryPenyuluhData";
import { DotLoader } from "react-spinners";
import { useFetchProvince } from "@/hooks/master/useFetchProvince";
import { useFetchRegions } from "@/hooks/master/useFetchRegions";
import { FaX } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { FaSearch } from "react-icons/fa";

function Penyuluh() {
  const [tahun, setTahun] = React.useState<number>(new Date().getFullYear());
  const [triwulan, setTriwulan] = React.useState<string>('TW I');

  const [selectedProvinsi, setSelectedProvinsi] = React.useState<string>('')
  const [selectedProvinsiCoords, setSelectedProvinsiCoords] = React.useState<{ lat: number, lng: number } | null>(null)
  const [selectedKabupaten, setSelectedKabupaten] = React.useState<string>('')

  const { provinsis, loading: loadingProvinsi } = useFetchProvince()
  const { kabupatens, loading: loadingKabupaten } = useFetchRegions(selectedProvinsi)

  const [searchName, setSearchName] = React.useState('')
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = () => {
    setSearchQuery(searchName);
  };

  const { data: totalData } = usePenyuluhTotal({ tahun: tahun, tw: triwulan, provinsi: selectedProvinsi, kabupaten: selectedKabupaten });

  const { data: statusData } = useGroupByStatus({ tahun: tahun, tw: triwulan, provinsi: selectedProvinsi, kabupaten: selectedKabupaten });
  const { data: jabatanData } = useGroupByJabatan({ tahun: tahun, tw: triwulan, provinsi: selectedProvinsi, kabupaten: selectedKabupaten });
  const { data: pendidikanData } = useGroupByPendidikan({ tahun: tahun, tw: triwulan, provinsi: selectedProvinsi, kabupaten: selectedKabupaten });
  const { data: usiaData } = useGroupByKelompokUsia({ tahun: tahun, tw: triwulan, provinsi: selectedProvinsi, kabupaten: selectedKabupaten });
  const { data: kelaminData } = useGroupByKelamin({ tahun: tahun, tw: triwulan, provinsi: selectedProvinsi, kabupaten: selectedKabupaten });
  const { data: locationsData, isLoading, isError } = useGroupByLocations({ tahun: tahun, tw: triwulan, provinsi: selectedProvinsi, kabupaten: selectedKabupaten, name: searchQuery });
  const { data: summaryData } = useSummaryValuePenyuluh(tahun, triwulan, selectedProvinsi, selectedKabupaten);
  const { data: graphicData, loading, error } = useResultSummary({ tahun: tahun, tw: triwulan, provinsi: selectedProvinsi, kabupaten: selectedKabupaten });

  return (
    <>
      <div className={`flex flex-col gap-2 h-[90vh]`}>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-3">
          <div className="flex flex-row gap-4">
            <div className="w-full flex gap-4">
              <div className="w-40">
                <label className="block mb-1 text-sm text-gray-300">Tahun</label>
                <Select value={tahun.toString()} onValueChange={(val) => setTahun(parseInt(val))}>
                  <SelectTrigger className="w-full text-gray-300">
                    <SelectValue placeholder="Pilih Tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()} className='text-gray-300'>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-40">
                <label className="block mb-1 text-sm text-gray-300">Triwulan</label>
                <Select value={triwulan} onValueChange={(val) => setTriwulan(val)}>
                  <SelectTrigger className="w-full text-gray-300">
                    <SelectValue placeholder="Pilih Triwulan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TW I" className="text-gray-300">TW I</SelectItem>
                    <SelectItem value="TW II" className="text-gray-300">TW II</SelectItem>
                    <SelectItem value="TW III" className="text-gray-300">TW III</SelectItem>
                    <SelectItem value="TW IV" className="text-gray-300">TW IV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="w-full flex gap-4">
              <div className="w-40">
                <label className="block mb-1 text-sm text-gray-300">Provinsi</label>
                <Select
                  value={selectedProvinsi}
                  onValueChange={(val) => {
                    setSelectedProvinsi(val)
                    setSelectedKabupaten('')
                    const provinsiData = provinsis.find(p => p.id.toString() === val)
                    if (provinsiData && provinsiData.lat && provinsiData.lon) {
                      setSelectedProvinsiCoords({
                        lat: parseFloat(provinsiData.lat),
                        lng: parseFloat(provinsiData.lon)
                      })
                    } else {
                      setSelectedProvinsiCoords(null)
                    }
                  }}
                >
                  <SelectTrigger className="w-full text-gray-300">
                    <SelectValue placeholder="Pilih Provinsi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={'All'} className='text-gray-300'>
                      All
                    </SelectItem>
                    {loadingProvinsi ? (
                      <SelectItem value="loading" disabled className='text-gray-300'>
                        Loading...
                      </SelectItem>
                    ) : (
                      provinsis.map((prov) => (
                        <SelectItem
                          key={prov.id}
                          value={prov.id.toString()}
                          className='text-gray-300'
                        >
                          {prov.provinsi}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-40">
                <label className="block mb-1 text-sm text-gray-300">Kabupaten/Kota</label>
                <div className="flex gap-4">
                  <Select
                    value={selectedKabupaten}
                    onValueChange={(val) => setSelectedKabupaten(val)}
                    disabled={!selectedProvinsi || selectedProvinsi === 'All'}
                  >
                    <SelectTrigger className="w-40 text-gray-300">
                      <SelectValue placeholder="Pilih Kabupaten/Kota" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={'All'} className='text-gray-300'>
                        All
                      </SelectItem>
                      {loadingKabupaten ? (
                        <SelectItem value="loading" disabled className='text-gray-300'>
                          Loading...
                        </SelectItem>
                      ) : (
                        kabupatens.map((kab) => (
                          <SelectItem
                            key={kab.id}
                            value={kab.kabupaten}
                            className='text-gray-300'
                          >
                            {kab.kabupaten}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>


                  {
                    (selectedProvinsi != "" || selectedKabupaten != "" || searchName != "") && <Button
                      onClick={() => {
                        setSelectedProvinsi('')
                        setSelectedKabupaten('')
                        setSearchName('')
                        setSelectedProvinsiCoords(null)
                      }}
                      className="px-4 bg-navy-500 hover:to-neutral-700 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                    >
                      <FaX />
                      Clear Filter
                    </Button>
                  }

                </div>

              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          {
            isLoading ? <div className="flex w-full h-[25vh] py-10 items-center justify-center">
              <DotLoader color="#2152ff" size={50} />
            </div> : <PenyuluhMap penyuluhs={locationsData!} focusCoords={selectedProvinsiCoords} />
          }

          {
            searchName == '' &&
            <>
              <StatsPenyuluh data={summaryData} />
              <SummaryChartsPenyuluhan data={graphicData} />
              <PenyuluhGroupedTable
                title="Penyuluh by Status"
                data={Array.isArray(statusData) ? statusData : []}
                groupKey="provinsi"
                columns={[
                  { key: 'status', label: 'Status' },
                  { key: 'total', label: 'Total' },
                ]}
                valueKey="status"
                labelKey="status"
              />

              <PenyuluhGroupedTable
                title="Penyuluh by Jabatan"
                data={Array.isArray(jabatanData) ? jabatanData : []}
                groupKey="provinsi"
                columns={[
                  { key: 'jabatan', label: 'Jabatan' },
                  { key: 'total', label: 'Total' },
                ]}
                valueKey="jabatan"
                labelKey="jabatan"
              />

              <PenyuluhGroupedTable
                title="Penyuluh by Pendidikan"
                data={Array.isArray(pendidikanData) ? pendidikanData : []}
                groupKey="provinsi"
                columns={[
                  { key: 'pendidikan', label: 'Pendidikan' },
                  { key: 'total', label: 'Total' },
                ]}
                valueKey="pendidikan"
                labelKey="pendidikan"
              />

              <PenyuluhGroupedTable
                title="Penyuluh by Kelompok Usia"
                data={Array.isArray(usiaData) ? usiaData : []}
                groupKey="provinsi"
                columns={[
                  { key: 'kelompok_usia', label: 'Kelompok Usia' },
                  { key: 'total', label: 'Total' },
                ]}
                valueKey="kelompok_usia"
                labelKey="kelompok_usia"
              />

              <PenyuluhGroupedTable
                title="Data Penyuluh Berdasarkan Jenis Kelamin"
                data={Array.isArray(kelaminData) ? kelaminData : []}
                groupKey="provinsi"
                columns={[
                  { key: "kelamin", label: "Jenis Kelamin" },
                  { key: "total", label: "Total" },
                ]}
                valueKey="kelamin"
                labelKey="kelamin"
              />
            </>
          }

        </div>
      </div>
    </>
  );
}

export default Penyuluh