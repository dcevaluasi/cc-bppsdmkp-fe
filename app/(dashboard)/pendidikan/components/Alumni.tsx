import React from "react";
import { DotLoader } from "react-spinners";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlumniMap } from "@/components/map/AlumniMap";
import { useFetchDataAlumniLocation } from "@/hooks/pendidikan/alumni/useFetchDataAlumniLocation";
import { useFetchDataAlumniSummary } from "@/hooks/pendidikan/alumni/useFetchDataAlumniSummary";
import { BadgeCheck } from "lucide-react";
import AlumniCharts from "./alumni/AlumniCharts";
import RealisasiBoxText from "@/components/dashboard/RealisasiBoxText";

function Alumni() {
  const [selectedYear, setSelectedYear] = React.useState('All');
  const [tingkatPendidikan, setTingkatPendidikan] = React.useState<string>('All');

  const { data: summary, loading: loadingSummary } = useFetchDataAlumniSummary({
    tingkatPendidikan,
    selectedYear
  });

  const { data: dataAlumniLocation, loading: loadingAlumniLocation } = useFetchDataAlumniLocation({
    selectedYear: selectedYear === 'All' ? '' : selectedYear,
    tingkatPendidikan,
  });


  const isFetching = loadingSummary;

  const elaboratedDataSummaryAlumni = (
    data: { [key: string]: any; count: number }[] | undefined,
    keyName: string
  ): Record<string, number> => {
    if (!Array.isArray(data)) return {};
    return data.reduce((acc, item) => {
      const key = item[keyName] || "Tidak diketahui";
      acc[key] = item.count;
      return acc;
    }, {} as Record<string, number>);
  };

  function convertSummaryToChartData(
    summary: Record<string, number> = {},
    variant: 'absorption' | 'penghasilan' | 'negara' | 'status_pekerjaan' | 'program_studi' | 'bidang_pekerjaan' | 'jenis_kelamin' | 'nama_satdik' = 'absorption'
  ) {
    const hueStartMap: Record<string, number> = {
      absorption: 210,
      penghasilan: 120,
      negara: 30,
      status_pekerjaan: 270,
      program_studi: 59,
      bidang_pekerjaan: 78,
      jenis_kelamin: 176,
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

  const summaryAbsorption = elaboratedDataSummaryAlumni(summary?.absorption_count ?? [], "absorption");
  const chartDataAbsorption = convertSummaryToChartData(summaryAbsorption, 'absorption');

  const summaryIncomeRange = elaboratedDataSummaryAlumni(summary?.income_range_count ?? [], "penghasilan");
  const chartDataIncomeRange = convertSummaryToChartData(summaryIncomeRange, 'penghasilan');

  const summaryCompanyCountry = elaboratedDataSummaryAlumni(summary?.company_country_count ?? [], "negara");
  const chartDataCompanyCountry = convertSummaryToChartData(summaryCompanyCountry, 'negara');

  const summaryWorkStatus = elaboratedDataSummaryAlumni(summary?.work_status_count ?? [], "status_pekerjaan");
  const chartDataWorkStatus = convertSummaryToChartData(summaryWorkStatus, "status_pekerjaan");

  const summaryStudyProgram = elaboratedDataSummaryAlumni(summary?.study_program_count_has_work ?? [], "program_studi");
  const chartDataStudyProgram = convertSummaryToChartData(summaryStudyProgram, 'program_studi');

  const summaryJobField = elaboratedDataSummaryAlumni(summary?.top_job_fields ?? [], "bidang_pekerjaan");
  const chartDataJobField = convertSummaryToChartData(summaryJobField, 'bidang_pekerjaan');

  const summaryGender = elaboratedDataSummaryAlumni(summary?.gender_count ?? [], "jenis_kelamin");
  const chartDataGender = convertSummaryToChartData(summaryGender, 'jenis_kelamin');

  const summarySatdik = elaboratedDataSummaryAlumni(summary?.nama_satdik_count ?? [], "nama_satdik");
  const chartDataSatdik = convertSummaryToChartData(summarySatdik, 'nama_satdik');



  return (
    <div className="flex flex-col relative">
      {isFetching ? (
        <div className="flex w-full h-fit py-10 items-center justify-center">
          <DotLoader color="#2152ff" size={50} />
        </div>
      ) : (
        <div className="w-full flex flex-col gap-5">
          <div className="flex flex-row gap-4">
            <div className="w-40">
              <label className="block mb-1 text-sm text-gray-300">Tingkat Pendidikan</label>
              <Select value={tingkatPendidikan} onValueChange={setTingkatPendidikan}>
                <SelectTrigger className="w-full text-gray-300">
                  <SelectValue placeholder="Pilih Tingkat Pendidikan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All" className="text-gray-300">All</SelectItem>
                  <SelectItem value="Tinggi" className="text-gray-300">Tinggi</SelectItem>
                  <SelectItem value="Menengah" className="text-gray-300">Menengah</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-40">
              <label className="block mb-1 text-sm text-gray-300">Tahun Lulus</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-full text-gray-300">
                  <SelectValue placeholder="Pilih Tahun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All" className="text-gray-300">All</SelectItem>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <SelectItem key={year} value={String(year)} className="text-gray-300">
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loadingAlumniLocation ? (
            <div className="flex w-full h-fit py-10 items-center justify-center">
              <DotLoader color="#2152ff" size={50} />
            </div>
          ) : (
            <AlumniMap alumnis={dataAlumniLocation} />
          )}

          <RealisasiBoxText icon={BadgeCheck}
            color="from-indigo-500 to-indigo-700" loading={isFetching} title="Total Lulusan" data={chartDataWorkStatus} text="Lulusan" />

          <AlumniCharts loading={isFetching} title="Lulusan Berdasarkan Satuan Pendidikan" data={chartDataSatdik} config={{}} isFull={true} />

          <div className="w-full grid grid-cols-2 gap-5">
            <AlumniCharts loading={isFetching} title="Lulusan Berdasarkan Status Bekerja" data={chartDataWorkStatus} config={{}} isFull={true} />
            <AlumniCharts loading={isFetching} title="Lulusan Berdasarkan Gender" data={chartDataGender} config={{}} isFull={true} />
          </div>

          <div className="w-full flex flex-col gap-5">
            <AlumniCharts loading={isFetching} title="Lulusan Berdasarkan Jenis Pekerjaan" data={chartDataAbsorption} config={{}} isFull={true} />
            <AlumniCharts loading={isFetching} title="Lulusan Berdasarkan Rentang Penghasilan" data={chartDataIncomeRange} config={{}} isFull={true} />
            <AlumniCharts loading={isFetching} title="Lulusan Berdasarkan Negara Tempat Bekerja" data={chartDataCompanyCountry} config={{}} isFull={true} />
            <AlumniCharts loading={isFetching} title="Top Bidang Pekerjaan" data={chartDataJobField} config={{}} isFull={true} />
            <AlumniCharts loading={isFetching} title="Lulusan Berdasarkan Program Studi" data={chartDataStudyProgram} config={{}} isFull={true} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Alumni;