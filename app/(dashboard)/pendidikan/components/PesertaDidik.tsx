import React, { useMemo, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import axios from "axios";
import { baseUrl } from "@/urls/urls";
import { DotLoader } from "react-spinners";
import { PesertaDidikMap, PesertaDidikMapRef } from "@/components/map/PesertaDidikMap";
import { useFetchDataPesertaDidikLocation } from "@/hooks/pendidikan/peserta-didik/useFetchDataPesertaDidikLocation";
import { useFetchProvince } from "@/hooks/master/useFetchProvince";
import { useFetchRegions } from "@/hooks/master/useFetchRegions";
import { Button } from "@/components/ui/button";
import { FaX } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import DevData from "./DevData";
import DevRealisasiPendidikanText from "./charts/DevRealisasiPendidikanText";
import { BadgeCheck, User } from "lucide-react";

function PesertaDidik() {
  const [isFetching, setIsFetching] = React.useState<boolean>(false);
  const [tingkatPendidikan, setTingkatPendidikan] = React.useState<string>('All');
  const [summary, setSummary] =
    React.useState<any | null>(null);

  const handleFetchingSummaryStudents = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(`${baseUrl}/api/peserta-didiks/summary`, {
        params: {
          tingkatPendidikan,
          provinsi: selectedProvinsi,
          kabupaten: selectedKabupaten
        },
      });
      console.log({ response });

      setSummary(response.data);
      setIsFetching(false);
    } catch (error) {
      setIsFetching(false);
    }
  };

  const elaboratedDataSummary = (
    data: { [key: string]: any; count: number }[] | undefined,
    keyName: string
  ): Record<string, number> => {
    if (!Array.isArray(data)) return {}; // <--- this is the fix

    return data.reduce((acc, item) => {
      const key = item[keyName] || "Tidak diketahui";
      acc[key] = item.count;
      return acc;
    }, {} as Record<string, number>);
  };

  function convertSummaryToChartData(
    summary: Record<string, number> = {},
    variant: 'pekerjaan_orang_tua' | 'program_studi_singkatan' | 'provinsi' | 'agama' | 'gender' | 'asal' | 'nama_satdik' | 'jenjang_pendidikan' | 'tingkat' | 'level' = 'pekerjaan_orang_tua'
  ) {
    // Assign hue ranges that do NOT overlap
    const hueStartMap: Record<string, number> = {
      pekerjaan_orang_tua: 210,          // Blue range
      program_studi_singkatan: 120,     // Green range
      provinsi: 30,            // Orange/Brown range
      agama: 270, // Purple range
      gender: 59, // Purple range
      origin: 78,
      jenjang_pendidikan: 177,
      tingkat: 100,
      leve: 156,
      nama_satdik: 234
    };

    const baseHue = hueStartMap[variant] || 0;

    return Object.entries(summary).map(([key, value], index) => {
      const hue = (baseHue + index * 25) % 360; // Jump 25° for each item
      return {
        name: key,
        value,
        fill: `hsl(${hue}, 70%, 50%)`, // Solid vivid colors, same saturation/lightness
      };
    });
  }

  const [selectedProvinsi, setSelectedProvinsi] = React.useState<string>('')
  const [selectedProvinsiCoords, setSelectedProvinsiCoords] = React.useState<{ lat: number, lng: number } | null>(null)
  const [selectedKabupaten, setSelectedKabupaten] = React.useState<string>('')

  const [searchName, setSearchName] = React.useState('')
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = () => {
    setSearchQuery(searchName);
  };

  const { provinsis, loading: loadingProvinsi } = useFetchProvince()
  const { kabupatens, loading: loadingKabupaten } = useFetchRegions(selectedProvinsi)

  const summaryParentJob = elaboratedDataSummary(summary?.parent_job_count ?? [], "pekerjaan_orang_tua");
  const chartDataParentJob = convertSummaryToChartData(summaryParentJob, 'pekerjaan_orang_tua');

  const summaryLevel = elaboratedDataSummary(summary?.level_count ?? [], "level");
  const chartDataLevel = convertSummaryToChartData(summaryLevel, 'level');

  const summaryJenjang = elaboratedDataSummary(summary?.jenjang_counts ?? [], "jenjang_pendidikan");
  const chartDataJenjang = convertSummaryToChartData(summaryJenjang, 'jenjang_pendidikan');

  const summaryTingkat = elaboratedDataSummary(summary?.tingkat_counts ?? [], "tingkat");
  const chartDataTingkat = convertSummaryToChartData(summaryTingkat, 'tingkat');

  const summaryProdi = elaboratedDataSummary(summary?.prodis_count ?? [], "program_studi_singkatan");
  const chartDataProdi = convertSummaryToChartData(summaryProdi, 'program_studi_singkatan');

  const summaryProvince = elaboratedDataSummary(summary?.province_counts ?? [], "provinsi");
  const chartDataProvince = convertSummaryToChartData(summaryProvince, 'provinsi');

  const summaryReligion = elaboratedDataSummary(summary?.religion_counts ?? [], "agama");
  const chartDataReligion = convertSummaryToChartData(summaryReligion, 'agama');

  const summaryGender = elaboratedDataSummary(summary?.gender_counts ?? [], "gender");
  const chartDataGender = convertSummaryToChartData(summaryGender, 'gender');

  const summaryOrigin = elaboratedDataSummary(summary?.origin_count ?? [], "asal");
  const chartDataOrigin = convertSummaryToChartData(summaryOrigin, 'asal');


  const summarySatdik = elaboratedDataSummary(summary?.nama_satdik_count ?? [], "nama_satdik");
  const chartDataSatdik = convertSummaryToChartData(summarySatdik, 'nama_satdik');

  const { pesertaDidiks, isFetching: isFetchingPesertaDidik, error, refetch } =
    useFetchDataPesertaDidikLocation(tingkatPendidikan, selectedProvinsi, selectedKabupaten, searchQuery)

  const mapRef = useRef<PesertaDidikMapRef>(null);
  const [triwulan, setTriwulan] = React.useState<'tw1' | 'tw2' | 'tw3' | 'tw4'>('tw3');


  React.useEffect(() => {
    handleFetchingSummaryStudents();
  }, [tingkatPendidikan, selectedProvinsi, selectedKabupaten]);

  return (
    <div className="flex flex-col gap-5">
      {isFetching || isFetchingPesertaDidik ? (
        <div className="flex w-full h-fit py-10 items-center justify-center">
          <DotLoader color="#2152ff" size={50} />
        </div>
      ) : (
        <>
          <div className="w-full flex flex-col gap-5">
            <div className="flex flex-col items-start gap-4">
              <div className="w-full rounded-xl bg-navy-800/40 border border-navy-700/60 p-4 shadow-xl backdrop-blur-md">
                <div className="flex gap-4">
                  {/* Triwulan */}
                  <div className="flex flex-col w-fit">
                    <label className="mb-1 text-sm font-medium text-gray-200">Triwulan</label>
                    <Select
                      value={triwulan}
                      onValueChange={(val) => setTriwulan(val as 'tw1' | 'tw2' | 'tw3')}
                    >
                      <SelectTrigger className="w-fit text-gray-200 bg-navy-700/60 border-navy-600 shadow-inner">
                        <SelectValue placeholder="Pilih Triwulan" />
                      </SelectTrigger>
                      <SelectContent className='text-gray-200'>
                        <SelectItem value="tw1">TW I</SelectItem>
                        <SelectItem value="tw2">TW II</SelectItem>
                        <SelectItem value="tw3">TW III</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Provinsi */}
                  <div className="flex flex-col w-fit">
                    <label className="mb-1 text-sm font-medium text-gray-200">Provinsi</label>
                    <Select
                      value={selectedProvinsi}
                      onValueChange={(val) => {
                        setSelectedProvinsi(val)
                        setSelectedKabupaten('')
                        const provData = provinsis.find((p) => p.id.toString() === val)
                        provData && provData.lat && provData.lon
                          ? setSelectedProvinsiCoords({
                            lat: parseFloat(provData.lat),
                            lng: parseFloat(provData.lon)
                          })
                          : setSelectedProvinsiCoords(null)
                      }}
                    >
                      <SelectTrigger className="w-fit text-gray-200 bg-navy-700/60 border-navy-600 shadow-inner">
                        <SelectValue placeholder="Pilih Provinsi" />
                      </SelectTrigger>
                      <SelectContent className='text-gray-200'>
                        <SelectItem value="All">All</SelectItem>
                        {loadingProvinsi ? (
                          <SelectItem value="loading" disabled>
                            Loading...
                          </SelectItem>
                        ) : (
                          provinsis.map((prov) => (
                            <SelectItem key={prov.id} value={prov.id.toString()}>
                              {prov.provinsi}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Kabupaten */}
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-200">Kabupaten/Kota</label>
                    <Select
                      value={selectedKabupaten}
                      onValueChange={(val) => setSelectedKabupaten(val)}
                      disabled={!selectedProvinsi || selectedProvinsi === "All"}
                    >
                      <SelectTrigger className="w-full text-gray-200 bg-navy-700/60 border-navy-600 shadow-inner disabled:opacity-40">
                        <SelectValue placeholder="Pilih Kabupaten/Kota" />
                      </SelectTrigger>
                      <SelectContent className='text-gray-200'>
                        <SelectItem value="All">All</SelectItem>
                        {loadingKabupaten ? (
                          <SelectItem value="loading" disabled>
                            Loading...
                          </SelectItem>
                        ) : (
                          kabupatens.map((kab) => (
                            <SelectItem key={kab.id} value={kab.kabupaten}>
                              {kab.kabupaten}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Search */}
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-200">Cari Peserta Didik</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        placeholder="Nama peserta..."
                        className="flex h-10 w-full rounded-md border border-navy-600 bg-navy-700/60 
                     px-3 text-sm text-gray-200 placeholder-gray-400
                     focus:outline-none focus:ring-1 focus:ring-teal-400 shadow-inner"
                      />
                      <Button
                        onClick={handleSearch}
                        className="px-4 bg-teal-500 hover:bg-teal-600 text-white shadow-md rounded-lg flex items-center gap-2"
                      >
                        <FaSearch />
                        Cari
                      </Button>

                      {/* Clear Filter */}
                      {(tingkatPendidikan !== "All" ||
                        selectedProvinsi !== "All" ||
                        selectedKabupaten !== "All" ||
                        searchName !== "") && (
                          <div className="">
                            <Button
                              onClick={async () => {
                                setTingkatPendidikan("")
                                setSelectedProvinsi("")
                                setSelectedKabupaten("")
                                setSearchName("")
                                await refetch()
                                mapRef.current?.resetView();
                              }}
                              className="px-4 bg-gray-600 hover:bg-gray-700 text-white shadow-md rounded-lg flex items-center gap-2"
                            >
                              <FaX />
                              Clear Filter
                            </Button>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <PesertaDidikMap
              ref={mapRef}
              pesertaDidiks={pesertaDidiks}
              focusCoords={selectedProvinsiCoords}
            />


            {
              searchName == "" && <>
                <DevRealisasiPendidikanText
                  loading={false}
                  title="Total Peserta Didik"
                  data={[]}
                  text="Peserta Didik"
                  triwulan={triwulan}
                  icon={User}
                  color="from-blue-500 to-blue-700"
                />

                <DevData triwulan={triwulan} />
              </>
            }
          </div>
        </>
      )}
    </div>
  );
}

export default PesertaDidik;
