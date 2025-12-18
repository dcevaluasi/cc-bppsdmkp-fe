import React from "react";

import { DynamicKelompokTable } from "./tables/DynamicKelompokTable";
import { useKelompokBidangUsahaPerProvinsi, useKelompokBidangUsahaPerSatminkal, useKelompokJumlahPerProvinsi, useKelompokJumlahPerSatminkal, useKelompokKelasPerProvinsi, useGroupByLocations } from "@/hooks/penyuluhan/useSummaryKelompokDitingkatkanData";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { years } from "@/utils/time";
import { KelompokDitingkatkanMap } from "@/components/map/KelompokDitingkatkanMap";
import { usePenyuluhTotal } from "@/hooks/penyuluhan/useSummaryPenyuluhData";
import { StatsKelompok } from "./charts/StatsKelompok";
import SummaryChartsKelompokDitingkatkan from "./charts/SummaryChartsKelompokDitingkatkan";
import { useFetchProvince } from "@/hooks/master/useFetchProvince";
import { useFetchRegions } from "@/hooks/master/useFetchRegions";
import { FaX } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { DotLoader } from "react-spinners";

function KelompokDitingkatkan() {
  const [tahun, setTahun] = React.useState<number>(new Date().getFullYear());
  const [triwulan, setTriwulan] = React.useState<string>('TW I');

  const [selectedProvinsi, setSelectedProvinsi] = React.useState<string>('')
  const [selectedKabupaten, setSelectedKabupaten] = React.useState<string>('')
  const [selectedProvinsiCoords, setSelectedProvinsiCoords] = React.useState<{ lat: number, lng: number } | null>(null)


  const { provinsis, loading: loadingProvinsi } = useFetchProvince()
  const { kabupatens, loading: loadingKabupaten } = useFetchRegions(selectedProvinsi)

  const { data: totalData } = usePenyuluhTotal({ tahun: tahun, tw: triwulan, provinsi: selectedProvinsi, kabupaten: selectedKabupaten });

  const { data: jumlahPerSatminkalData } = useKelompokJumlahPerSatminkal({ tahun: tahun, tw: triwulan, provinsi: selectedProvinsi, kabupaten: selectedKabupaten });
  const { data: jumlahPerProvinsiData } = useKelompokJumlahPerProvinsi({ tahun: tahun, tw: triwulan, provinsi: selectedProvinsi, kabupaten: selectedKabupaten });
  const { data: bidangUsahaPerProvinsiData } = useKelompokBidangUsahaPerProvinsi({ tahun: tahun, tw: triwulan, provinsi: selectedProvinsi, kabupaten: selectedKabupaten });
  const { data: kelasPerProvinsiData } = useKelompokKelasPerProvinsi({ tahun: tahun, tw: triwulan, provinsi: selectedProvinsi, kabupaten: selectedKabupaten });
  const { data: bidangUsahaPerSatminkalData } = useKelompokBidangUsahaPerSatminkal({ tahun: tahun, tw: triwulan, provinsi: selectedProvinsi, kabupaten: selectedKabupaten });
  const { data: locationsData, isLoading } = useGroupByLocations({ tahun: tahun, tw: triwulan, provinsi: selectedProvinsi, kabupaten: selectedKabupaten });


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
                    (selectedProvinsi != "" || selectedKabupaten != "") && <Button
                      onClick={() => {
                        setSelectedProvinsi('')
                        setSelectedKabupaten('')
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
            </div> : <KelompokDitingkatkanMap kelompokDitingkatkans={locationsData!} focusCoords={selectedProvinsiCoords} />
          }

          <StatsKelompok total={totalData?.total_kelompok_ditingkatkan ?? 0} title={'Total Kelompok Ditingkatkan'} />
          <SummaryChartsKelompokDitingkatkan tahun={tahun.toString()} triwulan={triwulan.toString()} provinsi={selectedProvinsi} kabupaten={selectedKabupaten} />
          <DynamicKelompokTable
            title="Jumlah Kelompok per Satminkal"
            data={Array.isArray(jumlahPerSatminkalData) ? jumlahPerSatminkalData : []}
            groupKey="satminkal"
            excludeKeys={['total']}
          />

          <DynamicKelompokTable
            title="Jumlah Kelompok per Provinsi"
            data={Array.isArray(jumlahPerProvinsiData) ? jumlahPerProvinsiData : []}
            groupKey="provinsi"
            excludeKeys={['total']}
          />

          <DynamicKelompokTable
            title="Bidang Usaha per Provinsi"
            data={Array.isArray(bidangUsahaPerProvinsiData) ? bidangUsahaPerProvinsiData : []}
            groupKey="provinsi"
            excludeKeys={['total']}
          />

          <DynamicKelompokTable
            title="Kelas Kelompok per Provinsi"
            data={Array.isArray(kelasPerProvinsiData) ? kelasPerProvinsiData : []}
            groupKey="provinsi"
            excludeKeys={['total']}
          />

          <DynamicKelompokTable
            title="Bidang Usaha per Satminkal"
            data={Array.isArray(bidangUsahaPerSatminkalData) ? bidangUsahaPerSatminkalData : []}
            groupKey="satminkal"
            excludeKeys={['total']}
          />

        </div>
      </div>
    </>
  );
}

export default KelompokDitingkatkan;
