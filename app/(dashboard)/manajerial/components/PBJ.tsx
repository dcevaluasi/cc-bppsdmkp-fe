'use client';

import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRekapPBJ } from '@/hooks/managerials/pbj/useRekapPBJ';
import PBJKontrakTable from './tables/PBJKontrakTable';
import { useRekapPBJPerSatker } from '@/hooks/managerials/pbj/useRekapPBJPerSatker';
import PBJKontrakSatkerTable from './tables/PBJKontrakSatkerTable';
import DetailPBJTable from './tables/DetailPBJTable';
import { useRekapPBJPerAkun } from '@/hooks/managerials/pbj/useRekapPBJPerAkun';
import RealisasiPBJChart from './charts/RealisasiPBJChart';
import { useGetTanggalOmpsanPBJ } from '@/hooks/managerials/useGetTanggalOmpsanPBJ';

const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);
const monthNames = [
    "Januari", "Februari", "Maret", "April",
    "Mei", "Juni", "Juli", "Agustus",
    "September", "Oktober", "November", "Desember"
];

const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return {
        label: monthNames[date.getMonth()],
        value: (date.getMonth() + 1).toString()
    };
});

export const PBJ = () => {
    const [tahun, setTahun] = useState<number>(new Date().getFullYear());
    const [tanggal, setTanggal] = useState<string>('');
    const { data: dataTanggalOmspan, loading: loadingTanggalOmspan } = useGetTanggalOmpsanPBJ();

    const { data, loading } = useRekapPBJ(tahun, tanggal ?? '');
    const { data: dataPerSatker, loading: loadingPerSatker } = useRekapPBJPerSatker(tahun, tanggal ?? '');
    const { data: dataPerAkun, loading: loadingPerAkun } = useRekapPBJPerAkun(tahun, tanggal ?? '');
    const chartDataRekapRealisasiSisa = dataPerAkun.length != 0
        ? [
            {
                name: "Belanja Barang",
                value: (dataPerAkun[0].nilai_realisasi) || 0,
                fill: "#4ADE80",
                persentasi: dataPerAkun[0].persentasi || 0
            },
            {
                name: "Belanja Modal",
                value: (dataPerAkun[1].nilai_realisasi) || 0,
                fill: "#00CAFF",
                persentasi: dataPerAkun[1].persentasi || 0
            },

        ]
        : [];

    const [search, setSearch] = React.useState<string>('');
    const filteredData = (data ?? [])?.filter((item) =>
        item.nama_satker.toLowerCase().includes(search.toLowerCase())
    );

    React.useEffect(() => {
        const list = dataTanggalOmspan?.tanggal_omspan ?? [];
        if (list.length > 0 && tanggal === '') {
            setTanggal(list[0]);
        }
    }, [dataTanggalOmspan, tanggal]);

    return (
        <div className="p-4 space-y-6">
            {
                dataTanggalOmspan != null && <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
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

                    <div className="w-60">
                        <label className="block mb-1 text-sm text-gray-300">Tanggal Omspan</label>
                        <Select value={tanggal.toString()} onValueChange={(val) => setTanggal(val)}>
                            <SelectTrigger className="w-full text-gray-300">
                                <SelectValue placeholder="Pilih Tanggal Omspan" />
                            </SelectTrigger>
                            <SelectContent>
                                {dataTanggalOmspan?.tanggal_omspan.map((tanggal) => (
                                    <SelectItem key={tanggal} value={tanggal.toString()} className='text-gray-300'>
                                        {tanggal}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            }

            {
                tanggal == '' ? <></> : <>
                    <div className="flex flex-col items-start gap-4">
                        <label className="block mb-1 text-sm text-gray-300 max-w-3xl">Data di bawah ini merupakan data Outstanding Kontrak (kontrak yang sedang berjalan dan belum selesai pembayarannya) secara keseluruhan (termasuk paket kontrak di bawah Rp200.000.000). Silakan lakukan filtering sesuai kebutuhan Anda. Terima kasih.</label>
                    </div>
                    <div className="flex flex-col gap-5">
                        <div className="w-full flex flex-col gap-5">
                            <div className="w-full flex gap-5">
                                <RealisasiPBJChart
                                    loading={loadingPerAkun}
                                    title={`Postur Outstanding Kontrak TA  ${tahun}`}
                                    data={chartDataRekapRealisasiSisa}
                                    config={{}} // Optional chart config
                                />
                                <DetailPBJTable loading={loadingPerAkun} tahun={tahun} data={dataPerAkun} />
                            </div>
                        </div>
                        <PBJKontrakSatkerTable tahun={tahun.toString()} loading={loading} filteredData={dataPerSatker!} search={search} setSearchData={setSearch} />
                        <PBJKontrakTable tahun={tahun.toString()} loading={loading} filteredData={filteredData!} search={search} setSearchData={setSearch} />

                    </div>
                </>
            }

        </div>
    );
};
