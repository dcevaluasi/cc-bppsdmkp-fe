'use client';

import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useSummaryKS } from '@/hooks/managerials/ks/useSummaryKS';
import RealisasiKSChart from './charts/RealisasiKSChart';
import KSTable from './tables/KSTable';
import { useRincianKS } from '@/hooks/managerials/ks/useRincianKS';

const currentYear = new Date().getFullYear();
const range = 8;

const years = Array.from({ length: range * 2 + 1 }, (_, i) => currentYear - range + i);

export const KerjaSama = () => {
    const [tahunMulai, setTahunMulai] = useState<string>('');
    const [tahunSelesai, setTahunSelesai] = useState<string>('');

    const { data: dataKS, loading: loadingKS } = useSummaryKS(tahunMulai, tahunSelesai);
    const { data: dataRincianKS, loading: loadingRincianKS, refetch } = useRincianKS(tahunMulai, tahunSelesai);

    function convertSummaryToChartData(summary: Record<string, number> = {}, colors: string[] = []) {
        return Object.entries(summary).map(([key, value], index) => ({
            name: key,
            value,
            fill: colors[index] || `hsl(${index * 50}, 60%, 60%)`,
        }));
    }

    const chartDataSubstansi = convertSummaryToChartData(dataKS?.substansi);
    const chartDataLingkup = convertSummaryToChartData(dataKS?.lingkup);
    const chartDataPemrakarsa = convertSummaryToChartData(dataKS?.pemrakarsa);
    const chartDataJenisDokumen = convertSummaryToChartData(dataKS?.jenis_dokumen);
    const chartDataTingkatan = convertSummaryToChartData(dataKS?.tingkatan);


    const [search, setSearch] = React.useState<string>('');

    const filteredData = dataRincianKS?.filter((item) =>
        item.Judul_Kerja_Sama.toLowerCase().includes(search.toLowerCase())
    );


    return (
        <div className="p-4 space-y-6">
            <div className="flex flex-row items-start gap-4">
                <div className="flex flex-row gap-4">
                    <div className="w-40">
                        <label className="block mb-1 text-sm text-gray-300">Tahun Mulai</label>
                        <Select value={tahunMulai.toString()} onValueChange={(val) => setTahunMulai(val)}>
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
                </div>
                <div className="flex flex-row gap-4">
                    <div className="w-40">
                        <label className="block mb-1 text-sm text-gray-300">Tahun Selesai</label>
                        <Select value={tahunSelesai.toString()} onValueChange={(val) => setTahunSelesai(val)}>
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
                </div>
            </div>
            <div className="flex flex-col gap-5">
                <div className="w-full flex flex-col gap-5">
                    <div className="w-full flex gap-5">
                        <RealisasiKSChart
                            loading={loadingKS}
                            title={`Substansi`}
                            data={chartDataSubstansi}
                            config={{}} // Optional chart config
                        />

                        <RealisasiKSChart
                            loading={loadingKS}
                            title={`Scope`}
                            data={chartDataLingkup}
                            config={{}} // Optional chart config
                        />

                        <RealisasiKSChart
                            loading={loadingKS}
                            title={`Pemrakarsa`}
                            data={chartDataPemrakarsa}
                            config={{}} // Optional chart config
                        />
                    </div>

                    <div className="w-full flex gap-5">
                        <RealisasiKSChart
                            loading={loadingKS}
                            title={`Tingkatan`}
                            data={chartDataTingkatan}
                            config={{}} // Optional chart config
                        />

                        <RealisasiKSChart
                            loading={loadingKS}
                            title={`Jenis Dokumen`}
                            data={chartDataJenisDokumen}
                            config={{}} // Optional chart config
                        />
                    </div>

                </div>

                <KSTable refetch={refetch} tahun={tahunMulai.toString()} tahunSelesai={tahunSelesai.toString()} dataRincianKS={dataRincianKS} loading={loadingRincianKS} search={search} setSearchData={setSearch} />

            </div>
        </div>
    );
};
