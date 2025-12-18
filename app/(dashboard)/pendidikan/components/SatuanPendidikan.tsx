import React from "react";
import { Satdik } from "@/types/satdik";
import axios from "axios";
import { baseUrl } from "@/urls/urls";
import { SatdikMap } from "@/components/map/SatdikMap";
import { useRekapSatker } from "@/hooks/managerials/useRekapPerSatker";
import { DotLoader } from "react-spinners";
import { AlumniSummary } from "@/types/alumnis";
import RealisasiPendidikanChart from "./charts/RealisasiPendidikanChart";
import { usePendidikanContext } from "@/components/contexts/PendidikanContext";
import { useRekapPendapatanPerDay } from "@/hooks/managerials/useRekapPendapatanPerDay";
import { useRekapRealisasiSisa } from "@/hooks/managerials/useRekapRealisasiSisa";
import { useRekapRealisasiSisa as useRekapRealisasiSisaPendapatan } from "@/hooks/managerials/incomes/useRekapRealisasiSisa";
import { useGetTanggalOmspan } from "@/hooks/managerials/useGetTanggalOmpsan";
import RealisasiManajerialPendidikan from "./charts/RealisasiManajerialPendidikan";
import { useRekapPBJPerSatker } from "@/hooks/managerials/pbj/useRekapPBJPerSatker";
import { PESERTA_DIDIK_BY_SATDIK } from "./dev/TablePesertaDidikBySatdik";
import { SatdikCharts, SatdikFinances, SatdikStats, SatdikTables } from "./satdik";


function SatuanPendidikan() {
  const [tanggal, setTanggal] = React.useState<string>('');
  const { idSatdikSelected } = usePendidikanContext();
  const [isFetching, setIsFetching] = React.useState<boolean>(false);
  const [satuanPendidikans, setSatuanPendidikans] = React.useState<Satdik[]>([]);
  const [summaryPesertaDidik, setSummaryPesertaDidik] = React.useState<any | null>(null);
  const [summaryAlumni, setSummaryAlumni] = React.useState<AlumniSummary | null>(null);
  const [summaryTenagaPendidik, setSummaryTenagaPendidik] = React.useState<any | null>(null);
  const [summaryTenagaKependidikan, setSummaryTenagaKependidikan] = React.useState<any | null>(null);
  const [tahun, setTahun] = React.useState<number>(new Date().getFullYear());

  const handleFetchingSatuanPendidikan = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(`${baseUrl}/api/satuan-pendidikan`);
      setSatuanPendidikans(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleFetchingSummaryPesertaDidik = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(`${baseUrl}/api/peserta-didiks/summary${idSatdikSelected ? `?satdik_id=${idSatdikSelected}` : ''}`);
      setSummaryPesertaDidik(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleFetchingSummaryAlumni = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(`${baseUrl}/api/alumnis/summary${idSatdikSelected ? `?satdik_id=${idSatdikSelected}` : ''}`);
      setSummaryAlumni(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleFetchingSummaryTenagaPendidik = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(`${baseUrl}/api/pendidiks/summary${idSatdikSelected ? `?satdik_id=${idSatdikSelected}` : ''}`);
      setSummaryTenagaPendidik(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleFetchingSummaryTenagaKependidikan = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(`${baseUrl}/api/tenaga-kependidikans/summary${idSatdikSelected ? `?satdik_id=${idSatdikSelected}` : ''}`);
      setSummaryTenagaKependidikan(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  const getSelectedSatdikKodeSatker = (): string | undefined => {
    const selected = satuanPendidikans.find((satdik) => satdik.RowID === parseInt(idSatdikSelected!));
    return selected?.Kode_Satker;
  };

  const kodeSatker = getSelectedSatdikKodeSatker();

  const { data: dataAnggaran, loading: loadingAnggaran } = useRekapSatker(tahun, '', 'Pendidikan');
  const { data: dataPbj, loading: loadingPbj } = useRekapPBJPerSatker(tahun, tanggal, kodeSatker);
  const { data: pendapatanDataGrafik, loading: isLoadingPendapatanGrafik } = useRekapPendapatanPerDay(tahun, "latest", "pendidikan");
  const { data: dataRekapRealisasiSisa, loading: loadingRekapRealisasiSisa } = useRekapRealisasiSisa(tahun, tanggal, kodeSatker);
  const { data: dataRekapRealisasiSisaPendapatan, loading: loadingRekapRealisasiSisaPendapatan } = useRekapRealisasiSisaPendapatan(tahun, tanggal, kodeSatker);
  const { data: dataTanggalOmspan, loading: loadingTanggalOmspan } = useGetTanggalOmspan();

  const elaboratedDataSummary = (data: { [key: string]: any; count: number }[] | undefined, keyName: string): Record<string, number> => {
    if (!Array.isArray(data)) return {};
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
    const hueStartMap: Record<string, number> = {
      pekerjaan_orang_tua: 210,
      program_studi_singkatan: 200,
      provinsi: 30,
      agama: 270,
      gender: 59,
      origin: 78,
      jenjang_pendidikan: 177,
      tingkat: 240,
      level: 16,
      nama_satdik: 234
    };

    const baseHue = hueStartMap[variant] || 0;

    return Object.entries(summary).map(([key, value], index) => {
      const hue = (baseHue + index * 25) % 360;
      return {
        name: key,
        value,
        fill: `hsl(${hue}, 70%, 50%)`,
      };
    });
  }

  // Chart Data
  const summaryAlumniSatdik = elaboratedDataSummary(summaryAlumni?.nama_satdik_count ?? [], "nama_satdik");
  const chartDataAlumniSatdik = convertSummaryToChartData(summaryAlumniSatdik, 'nama_satdik');

  const summaryPendidikSatdik = elaboratedDataSummary(summaryTenagaPendidik?.nama_satdik_count, "nama_satdik");
  const chartDataSatdik = convertSummaryToChartData(summaryPendidikSatdik, 'nama_satdik');

  const summaryTenagaKependidikanSatdik = elaboratedDataSummary(summaryTenagaKependidikan?.nama_satdik_count, "nama_satdik");
  const chartDataSatdikTK = convertSummaryToChartData(summaryTenagaKependidikanSatdik, 'nama_satdik');

  const chartDataSatdikPesertaDidik = PESERTA_DIDIK_BY_SATDIK
    .filter(item => !idSatdikSelected || item.no.toString() === idSatdikSelected)
    .map(item => ({
      name: item.satdik,
      value: item.tw3_aktif + item.tw3_tunda,
      fill: item.jenis === 'Tinggi' ? '#3B82F6' : '#10B981'
    }));

  const summaryParentJob = elaboratedDataSummary(summaryPesertaDidik?.parent_job_count ?? [], "pekerjaan_orang_tua");
  const chartDataParentJob = convertSummaryToChartData(summaryParentJob, 'pekerjaan_orang_tua');

  const summaryJenjang = elaboratedDataSummary(summaryPesertaDidik?.jenjang_counts ?? [], "jenjang_pendidikan");
  const chartDataJenjang = convertSummaryToChartData(summaryJenjang, 'jenjang_pendidikan');

  const summaryTingkat = elaboratedDataSummary(summaryPesertaDidik?.tingkat_counts ?? [], "tingkat");
  const chartDataTingkat = convertSummaryToChartData(summaryTingkat, 'tingkat');

  const summaryProdi = elaboratedDataSummary(summaryPesertaDidik?.prodis_count ?? [], "program_studi_singkatan");
  const chartDataProdi = convertSummaryToChartData(summaryProdi, 'program_studi_singkatan');

  const summaryReligion = elaboratedDataSummary(summaryPesertaDidik?.religion_counts ?? [], "agama");
  const chartDataReligion = convertSummaryToChartData(summaryReligion, 'agama');

  const summaryGender = elaboratedDataSummary(summaryPesertaDidik?.gender_counts ?? [], "gender");
  const chartDataGender = convertSummaryToChartData(summaryGender, 'gender');

  const summaryLevel = elaboratedDataSummary(summaryPesertaDidik?.level_count ?? [], "level");
  const chartDataLevel = convertSummaryToChartData(summaryLevel, 'level');

  const summaryOrigin = elaboratedDataSummary(summaryPesertaDidik?.origin_count ?? [], "asal");
  const chartDataOrigin = convertSummaryToChartData(summaryOrigin, 'asal');

  const anggaranData = dataAnggaran?.map((item) => ({
    label: item.nama_satker,
    desktop: item.realisasi_sampai_tanggal,
  })) || [];

  const pendapatanData = pendapatanDataGrafik?.map((item) => ({
    label: item.nama_satker,
    desktop: item.realisasi_amount,
    mobile: item.pagu
  })) ?? [];

  const chartDataRekapRealisasiSisa = dataRekapRealisasiSisa
    ? [
      { name: "Realisasi", value: dataRekapRealisasiSisa.realisasi || 0, fill: "#5CB338", pagu: dataRekapRealisasiSisa.pagu || 0 },
      { name: "Sisa", value: dataRekapRealisasiSisa.sisa || 0, fill: "#FB4141", pagu: dataRekapRealisasiSisa.pagu || 0 },
    ]
    : [];

  const chartDataRekapRealisasiPBJ = dataPbj?.[0]
    ? [
      { name: "Realisasi", value: dataPbj[0].nilai_realisasi || 0, fill: "#5CB338", pagu: dataPbj[0].nilai_realisasi || 0 },
      { name: "Nilai Kontrak", value: dataPbj[0].nilai_kontrak || 0, fill: "#FB4141", pagu: dataPbj[0].nilai_kontrak || 0 },
    ]
    : [];

  const chartDataRekapRealisasiSisaPendapatan = dataRekapRealisasiSisaPendapatan
    ? [
      { name: "Capaian", value: dataRekapRealisasiSisaPendapatan.realisasi || 0, fill: "#5CB338", pagu: dataRekapRealisasiSisaPendapatan.pagu || 0 },
      { name: "Target", value: dataRekapRealisasiSisaPendapatan.pagu || 0, fill: "#FB4141", pagu: dataRekapRealisasiSisaPendapatan.pagu || 0 },
    ]
    : [];

  const mergedData = React.useMemo(() => {
    const allSatdikNames = Array.from(
      new Set([
        ...chartDataSatdikPesertaDidik.map(d => d.name),
        ...chartDataAlumniSatdik.map(d => d.name),
        ...chartDataSatdik.map(d => d.name),
        ...chartDataSatdikTK.map(d => d.name),
      ])
    );

    return allSatdikNames.map(name => ({
      name,
      pesertaDidik: chartDataSatdikPesertaDidik.find(d => d.name === name)?.value || 0,
      alumni: chartDataAlumniSatdik.find(d => d.name === name)?.value || 0,
      pendidik: chartDataSatdik.find(d => d.name === name)?.value || 0,
      tenagaPendidik: chartDataSatdikTK.find(d => d.name === name)?.value || 0,
    }));
  }, [chartDataSatdikPesertaDidik, chartDataAlumniSatdik, chartDataSatdik, chartDataSatdikTK]);

  React.useEffect(() => {
    const list = dataTanggalOmspan?.tanggal_omspan ?? [];
    if (list.length > 0 && tanggal === '') {
      setTanggal(list[0]);
    }
  }, [dataTanggalOmspan, tanggal]);

  React.useEffect(() => {
    handleFetchingSatuanPendidikan();
    handleFetchingSummaryAlumni();
    handleFetchingSummaryTenagaPendidik();
    handleFetchingSummaryTenagaKependidikan();
    handleFetchingSummaryPesertaDidik();
  }, [idSatdikSelected]);

  return (
    <section>
      <div className="flex flex-col gap-2 h-[100vh]">
        <SatdikMap satdiks={satuanPendidikans} />
        <SatdikStats data={mergedData} />
        {idSatdikSelected !== null ? (
          <div className="flex flex-col gap-4">
            <div className="w-full grid grid-cols-2 gap-5">
              <RealisasiPendidikanChart loading={isFetching} title="Peserta Didik Berdasarkan Tingkat" data={chartDataLevel} config={{}} isFull={true} />
              <RealisasiPendidikanChart loading={isFetching} title="Peserta Didik Berdasarkan Prodi" data={chartDataProdi} config={{}} isFull={true} />
              <RealisasiPendidikanChart loading={isFetching} title="Peserta Didik Berdasarkan Jalur Pendaftaran" data={chartDataOrigin} config={{}} isFull={true} />
            </div>
            <div className="w-full grid grid-cols-2 gap-5">
              <RealisasiPendidikanChart loading={isFetching} title="Peserta Didik Berdasarkan Gender" data={chartDataGender} config={{}} isFull={true} />
              {loadingRekapRealisasiSisa ? (
                <div className="flex w-full h-[25vh] py-10 items-center justify-center">
                  <DotLoader color="#2152ff" size={50} />
                </div>
              ) : (
                <RealisasiManajerialPendidikan loading={loadingRekapRealisasiSisa} title={`Realisasi Anggaran Tahun ${tahun}`} data={chartDataRekapRealisasiSisa} config={{}} />
              )}
              {loadingRekapRealisasiSisaPendapatan ? (
                <div className="flex w-full h-[25vh] py-10 items-center justify-center">
                  <DotLoader color="#2152ff" size={50} />
                </div>
              ) : (
                <RealisasiManajerialPendidikan loading={loadingRekapRealisasiSisaPendapatan} title={`Capaian PNBP TA ${tahun}`} data={chartDataRekapRealisasiSisaPendapatan} config={{}} />
              )}
              {loadingPbj ? (
                <div className="flex w-full h-[25vh] py-10 items-center justify-center">
                  <DotLoader color="#2152ff" size={50} />
                </div>
              ) : (
                <RealisasiManajerialPendidikan loading={loadingPbj} title={`Realisasi PBJ TA ${tahun}`} data={chartDataRekapRealisasiPBJ} config={{}} />
              )}
            </div>
          </div>
        ) : (
          <div>
            <SatdikCharts data={mergedData} />
            <SatdikFinances isLoadingPendapatanGrafik={isLoadingPendapatanGrafik} loadingAnggaran={loadingAnggaran} anggaranData={anggaranData} pendapatanData={pendapatanData} />
            <SatdikTables
              data={mergedData}
              anggaranData={anggaranData}
              pendapatanData={pendapatanData}
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default SatuanPendidikan;