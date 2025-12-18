"use client";

import React from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import axios from "axios";
import { baseUrl } from "@/urls/urls";
import { DotLoader } from "react-spinners";
import { UserCheck, UserCircle } from "lucide-react";
import PendidikCharts from "./pendidik/PendidikCharts";
import RealisasiBoxText from "@/components/dashboard/RealisasiBoxText";


function TenagaPendidik() {
  const [isFetching, setIsFetching] = React.useState<boolean>(false);
  const [summary, setSummary] = React.useState<any | null>(
    null
  );
  const [summaryTenagaKependidikan, setSummaryTenagaKependidikan] = React.useState<any | null>(
    null
  );
  const [tingkatPendidikan, setTingkatPendidikan] = React.useState<string>('All');
  const [jenisProfesi, setJenisProfesi] = React.useState<string>('Pendidik');

  const elaboratedDataSummaryPendidik = (
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

  const handleFetchingSummaryTenagaPendidik = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(`${baseUrl}/api/pendidiks/summary`, {
        params: {
          tingkatPendidikan,
        },
      });

      setSummary(response.data);
      setIsFetching(false);
    } catch (error) {
      setIsFetching(true);
    }
  };

  const handleFetchingSummaryTenagaKependidikan = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(`${baseUrl}/api/tenaga-kependidikans/summary`, {
        params: {
          tingkatPendidikan,
        },
      });

      setSummaryTenagaKependidikan(response.data);
      setIsFetching(false);
    } catch (error) {
      setIsFetching(true);
    }
  };

  const summaryGolongan = elaboratedDataSummaryPendidik(summary?.golongan_count ?? [], "golongan");

  const summaryProgramStudi = elaboratedDataSummaryPendidik(summary?.program_studi_count, "program_studi");
  const summaryJabatan = elaboratedDataSummaryPendidik(summary?.jabatan_count, "jabatan");
  const summaryStatusSertifikasi = elaboratedDataSummaryPendidik(summary?.status_sertifikasi_count, "status_sertifikasi");
  const summaryStatusAktif = elaboratedDataSummaryPendidik(summary?.status_aktif_count, "status_aktif");
  const summarySatdik = elaboratedDataSummaryPendidik(summary?.nama_satdik_count, "nama_satdik");

  const summaryGender = elaboratedDataSummaryPendidik(summary?.gender_count, "gender");

  const summaryTKGolongan = elaboratedDataSummaryPendidik(summaryTenagaKependidikan?.golongan_count ?? [], "golongan");

  const summaryTKProgramStudi = elaboratedDataSummaryPendidik(summaryTenagaKependidikan?.program_studi_count, "program_studi");
  const summaryTKJabatan = elaboratedDataSummaryPendidik(summaryTenagaKependidikan?.jabatan_count, "jabatan");
  const summaryTKStatusSertifikasi = elaboratedDataSummaryPendidik(summaryTenagaKependidikan?.status_sertifikasi_count, "status_sertifikasi");
  const summaryTKStatusAktif = elaboratedDataSummaryPendidik(summaryTenagaKependidikan?.status_aktif_count, "status_aktif");
  const summaryTKSatdik = elaboratedDataSummaryPendidik(summaryTenagaKependidikan?.nama_satdik_count, "nama_satdik");

  const summaryTKGender = elaboratedDataSummaryPendidik(summaryTenagaKependidikan?.gender_count, "gender");

  function convertSummaryToChartData(
    summary: Record<string, number> = {},
    variant: 'golongan' | 'program_studi' | 'jabatan' | 'status_sertifikasi' | 'status_aktif' | 'nama_satdik' | 'gender' = 'golongan'
  ) {
    // Assign hue ranges that do NOT overlap
    const hueStartMap: Record<string, number> = {
      golongan: 210,          // Blue range
      program_studi: 120,     // Green range
      jabatan: 30,            // Orange/Brown range
      status_sertifikasi: 270, // Purple range
      status_aktif: 59, // Purple range
      nama_satdik: 78,
      gender: 176
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


  // Usage
  const chartDataGolongan = convertSummaryToChartData(summaryGolongan, 'golongan');
  const chartDataProgramStudi = convertSummaryToChartData(summaryProgramStudi, 'program_studi');
  const chartDataJabatan = convertSummaryToChartData(summaryJabatan, 'jabatan');
  const chartDataStatusSertifikasi = convertSummaryToChartData(summaryStatusSertifikasi, 'status_sertifikasi');
  const chartDataSatdik = convertSummaryToChartData(summarySatdik, 'nama_satdik');
  const chartDataGender = convertSummaryToChartData(summaryGender, 'gender');

  const chartDataGolonganTK = convertSummaryToChartData(summaryTKGolongan, 'golongan');
  const chartDataStatusAktifTK = convertSummaryToChartData(summaryTKStatusAktif, 'status_aktif');
  const chartDataSatdikTK = convertSummaryToChartData(summaryTKSatdik, 'nama_satdik');
  const chartDataGenderTK = convertSummaryToChartData(summaryTKGender, 'gender');

  React.useEffect(() => {
    handleFetchingSummaryTenagaPendidik();
    handleFetchingSummaryTenagaKependidikan()
  }, [tingkatPendidikan]);

  return (
    <div className="flex flex-col gap-5">
      {isFetching ? (
        <div className="flex w-full h-fit py-10 items-center justify-center">
          <DotLoader color="#2152ff" size={50} />
        </div>
      ) : (
        <>
          <div className="flex flex-col items-start gap-4">
            <div className="flex flex-row gap-4">
              <div className="w-40">
                <label className="block mb-1 text-sm text-gray-300">Jenis Profesi</label>
                <Select value={jenisProfesi} onValueChange={(val) => setJenisProfesi(val)}>
                  <SelectTrigger className="w-full text-gray-300">
                    <SelectValue placeholder="Pilih Jenis Profesi" />
                  </SelectTrigger>
                  <SelectContent>

                    <SelectItem value={'Pendidik'} className='text-gray-300'>
                      Pendidik
                    </SelectItem>
                    <SelectItem value={'Tenaga Kependidikan'} className='text-gray-300'>
                      Tenaga Kependidikan
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40">
                <label className="block mb-1 text-sm text-gray-300">Tingkat Pendidikan</label>
                <Select value={tingkatPendidikan} onValueChange={(val) => setTingkatPendidikan(val)}>
                  <SelectTrigger className="w-full text-gray-300">
                    <SelectValue placeholder="Pilih Tingkat Pendidikan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={'All'} className='text-gray-300'>
                      All
                    </SelectItem>
                    <SelectItem value={'Tinggi'} className='text-gray-300'>
                      Tinggi
                    </SelectItem>
                    <SelectItem value={'Menengah'} className='text-gray-300'>
                      Menengah
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>
          </div>
          {
            jenisProfesi == 'Pendidik' ? <><RealisasiBoxText
              loading={isFetching}
              title={`Total Pendidik`}
              data={chartDataGender}
              icon={UserCheck}
              color="from-teal-500 to-teal-700"
              text={'Pendidik'}
            /><PendidikCharts
                loading={isFetching}
                title={`Pendidik Berdasarkan Satuan Pendidikan`}
                data={chartDataSatdik}
                config={{}}
                isFull={true}
              />
              <div className="w-full flex flex-col gap-5">
                <div className="w-full gap-5 grid grid-cols-2 ">
                  <PendidikCharts
                    loading={isFetching}
                    title={`Pendidik Berdasarkan Jabatan`}
                    data={chartDataJabatan}
                    config={{}}
                    isFull={true}
                  />
                  <PendidikCharts
                    loading={isFetching}
                    title={`Pendidik Berdasarkan Golongan`}
                    data={chartDataGolongan}
                    config={{}}
                    isFull={true}
                  />
                </div>
                <div className="w-full gap-5 grid grid-cols-2 ">
                  <PendidikCharts
                    loading={isFetching}
                    title={`Pendidik Berdasarkan Sertifikasi`}
                    data={chartDataStatusSertifikasi}
                    config={{}}
                    isFull={true}
                  />
                  <PendidikCharts
                    loading={isFetching}
                    title={`Pendidik Berdasarkan Jenis Kelamin`}
                    data={chartDataGender}
                    config={{}}
                    isFull={true}
                  />
                </div>
              </div>
              <PendidikCharts
                loading={isFetching}
                title={`Pendidik Berdasarkan Program Studi`}
                data={chartDataProgramStudi}
                config={{}}
                isFull={true}
              />

            </> : <> <RealisasiBoxText
              loading={isFetching}
              title={`Total Tenaga Kependidikan`}
              data={chartDataSatdikTK}
              icon={UserCircle}
              color={"from-purple-500 to-purple-700"}
              text={'Tenaga Kependidikan'}
            /> <PendidikCharts
                loading={isFetching}
                title={`Tenaga Kependidikan Berdasarkan Satuan Pendidikan`}
                data={chartDataSatdikTK}
                config={{}}
                isFull={true}
              />
              <div className="w-full flex flex-col gap-5">
                <div className="w-full gap-5 grid grid-cols-1 ">
                  <PendidikCharts
                    loading={isFetching}
                    title={`Tenaga Kependidikan Berdasarkan Golongan`}
                    data={chartDataGolonganTK}
                    config={{}}
                    isFull={true}
                  />
                </div>
                <div className="w-full gap-5 grid grid-cols-2 ">
                  <PendidikCharts
                    loading={isFetching}
                    title={`Tenaga Kependidikan Berdasarkan Status Aktif`}
                    data={chartDataStatusAktifTK}
                    config={{}}
                    isFull={true}
                  />
                  <PendidikCharts
                    loading={isFetching}
                    title={`Tenaga Kependidikan Berdasarkan Jenis Kelamin`}
                    data={chartDataGenderTK}
                    config={{}}
                    isFull={true}
                  />
                </div>
              </div>

            </>
          }



        </>
      )}
    </div>
  );
}

export default TenagaPendidik;
