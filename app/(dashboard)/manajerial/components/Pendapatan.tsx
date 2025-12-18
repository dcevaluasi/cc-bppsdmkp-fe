'use client';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRekapSatker } from '@/hooks/managerials/incomes/useRekapPerSatker';
import { DotLoader } from 'react-spinners';

import { useRekapRealisasiSisa } from '@/hooks/managerials/incomes/useRekapRealisasiSisa';
import { useRekapPerAkun } from '@/hooks/managerials/incomes/useRekapPerAkun';
import { useRekapRealisasiPerSatkerPerAkun } from '@/hooks/managerials/incomes/useRekapRealisasiPerSatkerPerAkun';
import { useRekapPendapatanPerDay } from '@/hooks/managerials/useRekapPendapatanPerDay';
import CardComponent from '@/components/CardComponent';
import { useGetTanggalOmspanPendapatan } from '@/hooks/managerials/useGetTanggalOmpsanPendapatan';
import { RealisasiKeuanganChart } from '@/components/global/RealisasiKeuanganChart';
import { exportTotalRealisasiToExcel } from '@/utils/export/exportTotalRealisasi';
import { exportRealisasiPerSatkerToExcel } from '@/utils/export/exportRealisasiPerSatker';
import { exportRealisasiPerAkun } from '@/utils/export/exportRealisasiPerAkun';
import RealisasiAnggaranChart from './charts/RealisasiAnggaranChart';
import SatkerPendapatanTable from './tables/SatkerPendapatanTable';

const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);

export const Pendapatan = () => {
    const [tahun, setTahun] = useState<number>(new Date().getFullYear());
    const [tanggal, setTanggal] = useState<string>('');
    const { data: dataTanggalOmspan, loading: loadingTanggalOmspan } = useGetTanggalOmspanPendapatan();

    const { data, loading } = useRekapSatker(tahun, tanggal ?? '');

    const { data: pendapatanDataGrafik, loading: isLoadingGrafik } = useRekapPendapatanPerDay(tahun, tanggal ?? '')

    const isBLU = (nama: string) => {
        const satkerBLU = [
            "Politeknik Kelautan dan Perikanan Sidoarjo",
            "Balai Pelatihan dan Penyuluhan Perikanan Tegal",
        ]
        const lowerNama = nama.toLowerCase()
        return satkerBLU.some(satker =>
            lowerNama.includes(satker.toLowerCase())
        )
    }

    // ✅ Data excluding target satker
    const pendapatanDataExcluding = pendapatanDataGrafik?.filter(
        (item) => !isBLU(item.nama_satker)
    ).map((item) => ({
        label: item.nama_satker,
        desktop: item.realisasi_amount,
        mobile: item.pagu,
    })) ?? []

    // ✅ Data only for target satker
    const pendapatanDataOnly = pendapatanDataGrafik?.filter(
        (item) => isBLU(item.nama_satker)
    ).map((item) => ({
        label: item.nama_satker,
        desktop: item.realisasi_amount,
        mobile: item.pagu,
    })) ?? []

    const { data: dataRekapRealisasiAkun, loading: loadingRekapRealisasiAkun } = useRekapPerAkun(tahun, tanggal ?? '');

    const { data: dataRekapRealisasiSisa, loading: loadingRekapRealisasiSisa } = useRekapRealisasiSisa(tahun, tanggal ?? '');

    const { data: dataRekapRealisasiPerSatkerPerAkun, loading: loadingRekapRealisasiPerSatkerPerAkun } = useRekapRealisasiPerSatkerPerAkun(tahun, tanggal ?? '');

    const [search, setSearch] = useState<string>('');

    const filteredData = (data ?? []).filter((item) =>
        search === '' || (item.nama_satker || '').toLowerCase().includes(search.toLowerCase())
    );

    const filteredDataAkun = (dataRekapRealisasiAkun ?? [])?.filter((item) =>
        item.akun.toLowerCase().includes(search.toLowerCase())
    );

    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

    const toggleRow = (index: number) => {
        const newSet = new Set(expandedRows);
        if (newSet.has(index)) {
            newSet.delete(index);
        } else {
            newSet.add(index);
        }
        setExpandedRows(newSet);
    };

    const [sortOrderAkun, setSortOrderAkun] = useState<'asc' | 'desc'>('desc');
    const sortedDataAkun = React.useMemo(() => {
        return [...(filteredDataAkun || [])].sort((a, b) => {
            if (sortOrderAkun === 'asc') return a.realisasi - b.realisasi;
            return b.realisasi - a.realisasi;
        });
    }, [filteredDataAkun, sortOrderAkun]);

    const [sortOrderSatker, setSortOrderSatker] = useState<'asc' | 'desc'>('desc');
    const sortedDataSatker = React.useMemo(() => {
        return [...(filteredData || [])].sort((a, b) => {
            if (sortOrderSatker === 'asc') return a.realisasi - b.realisasi;
            return b.realisasi - a.realisasi;
        });
    }, [filteredData, sortOrderSatker]);

    React.useEffect(() => {
        const list = dataTanggalOmspan?.tanggal_omspan ?? [];
        if (list.length > 0 && tanggal === '') {
            setTanggal(list[0]);
        }
    }, [dataTanggalOmspan, tanggal]);

    const chartDataRekapRealisasiSisa = dataRekapRealisasiSisa
        ? [
            {
                name: "Capaian",
                value: dataRekapRealisasiSisa.realisasi || 0,
                fill: "#5CB338",
                pagu: dataRekapRealisasiSisa.pagu || 0
            },
            {
                name: "Target",
                value: dataRekapRealisasiSisa.pagu - dataRekapRealisasiSisa.realisasi || 0,
                fill: "#FB4141",
                pagu: dataRekapRealisasiSisa.pagu || 0
            },
        ]
        : [];

    const [sortOrderSatkerAkun, setSortOrderSatkerAkun] = useState<'asc' | 'desc'>('desc');
    const sortedDataRealisasiPerSatkerAkun = dataRekapRealisasiPerSatkerPerAkun
        ? [...dataRekapRealisasiPerSatkerPerAkun].sort((a, b) =>
            sortOrderSatkerAkun === 'asc'
                ? a.percentage - b.percentage
                : b.percentage - a.percentage
        )
        : [];



    const handleExportExcelRealisasiPerSatkerAkun = () => {
        const exportRows = (dataRekapRealisasiPerSatkerPerAkun! ?? []).flatMap((item, index) => {
            const parentRow = {
                satker: item.nama_satker.toUpperCase(),
                output_code: '',
                output_name: '',
                pagu: item.pagu,
                realisasi: item.realisasi,
                percentage: item.percentage,
                type: 'Satker Summary'
            };

            const detailRows = item.details.map((detail) => {
                const [output_code, output_name] = detail.output.split(' - ');
                return {
                    satker: '',
                    output_code,
                    output_name,
                    pagu: detail.pagu,
                    realisasi: detail.realisasi,
                    percentage: detail.percentage,
                    type: 'Detail Output'
                };
            });

            return [parentRow, ...detailRows];
        });

        const worksheet = XLSX.utils.json_to_sheet(exportRows, {
            header: ['satker', 'output_code', 'output_name', 'pagu', 'realisasi', 'percentage', 'type']
        });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `Realisasi Per Satker TA ${tahun}`);
        XLSX.writeFile(workbook, `Realisasi_Pendapatan_Per_Satker_Per_Akun_TA_${tahun}.xlsx`);
    };

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
                tanggal == '' ? <></> : <div className="flex flex-col gap-5">
                    {loading || loadingRekapRealisasiSisa ? (
                        <div className="flex w-full h-[25vh] py-10 items-center justify-center">
                            <DotLoader color="#2152ff" size={50} />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-5">
                            <div className="w-full flex flex-col gap-5">
                                <div className="w-full flex gap-5">
                                    <RealisasiAnggaranChart
                                        loading={loadingRekapRealisasiSisa}
                                        title={`Capaian PNBP TA ${tahun}`}
                                        data={chartDataRekapRealisasiSisa}
                                        config={{}} // Optional chart config
                                    />

                                    <CardComponent title={`Capaian PNBP TA  ${tahun}`}>
                                        <div className="overflow-x-auto rounded-lg mt-5 w-full flex flex-col gap-6">
                                            <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4">
                                                <button
                                                    onClick={() => exportTotalRealisasiToExcel(dataRekapRealisasiSisa!, tahun)}
                                                    className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm hover:bg-emerald-700 transition"
                                                >
                                                    📥 Export to Excel
                                                </button>
                                            </div>
                                            <table className="w-full text-sm text-gray-200 border border-gray-700 !bg-navy-700">
                                                <thead className="bg-navy-800 text-gray-100 uppercase text-xs">
                                                    <tr>
                                                        <th className="px-4 py-2 text-left">Uraian</th>
                                                        <th className="px-4 py-2 text-right">Target</th>
                                                        <th className="px-4 py-2 text-right">Capaian</th>
                                                        <th className="px-4 py-2 text-right">%</th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="border-t border-gray-700 hover:bg-navy-600">
                                                        <td className="px-4 py-2 border">Total</td>
                                                        <td className="px-4 py-2 border text-right">{dataRekapRealisasiSisa!.pagu.toLocaleString()}</td>
                                                        <td className="px-4 py-2 text-right border">{dataRekapRealisasiSisa!.realisasi.toLocaleString()}</td>
                                                        <td className="px-4 py-2 text-right border">{((dataRekapRealisasiSisa!.realisasi / dataRekapRealisasiSisa!.pagu) * 100).toFixed(2)}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardComponent>
                                </div>
                            </div>

                            {isLoadingGrafik ? (
                                <div className="flex w-full h-[25vh] py-10 items-center justify-center">
                                    <DotLoader color="#2152ff" size={50} />
                                </div>
                            ) : (
                                <div className="w-full overflow-scroll flex gap-5 scrollbar-hide">
                                    <RealisasiKeuanganChart data={pendapatanDataOnly}
                                        arialChartConfig={'w-[350px]'} title="Grafik Capaian PNBP - Satker BLU" />
                                    <RealisasiKeuanganChart data={pendapatanDataExcluding}
                                        arialChartConfig={{}} title="Grafik Capaian PNBP - Satker PNBP" />
                                </div>

                            )}

                            <SatkerPendapatanTable
                                tahun={tahun.toString()}
                                dataSatker={filteredData}
                            />
                        </div>
                    )}

                    {loadingRekapRealisasiAkun ? (
                        <div className="flex w-full h-[25vh] py-10 items-center justify-center">
                            <DotLoader color="#2152ff" size={50} />
                        </div>
                    ) : (
                        <CardComponent title={`Capaian PNBP Per Akun TA ${tahun}`}>
                            <div className="overflow-x-auto rounded-lg  flex flex-col gap-6 w-full">
                                <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4">
                                    <button
                                        onClick={() => exportRealisasiPerAkun(sortedDataAkun, tahun)}
                                        className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm hover:bg-emerald-700 transition"
                                    >
                                        📥 Export to Excel
                                    </button>
                                    <div className="w-full md:w-auto">
                                        <label className="block mb-1 text-sm text-gray-300">Search </label>
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Cari berdasarkan nama satker..."
                                            className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 bg-navy-700 text-gray-300"
                                        />
                                    </div>


                                </div>

                                <table className="w-full text-sm text-gray-200 border border-gray-700 !bg-navy-700">
                                    <thead className="bg-navy-800 text-gray-100 uppercase text-xs">
                                        <tr>
                                            <th className="px-4 py-2 text-left">No</th>
                                            <th className="px-4 py-2 text-left">Akun</th>
                                            <th className="px-4 py-2 text-right">Target</th>
                                            <th
                                                className="px-4 py-2 text-right "

                                            >
                                                Capaian

                                            </th>
                                            <th
                                                className="px-4 py-2 text-right cursor-pointer hover:underline"
                                                onClick={() => setSortOrderAkun(sortOrderAkun === 'asc' ? 'desc' : 'asc')}
                                                title="Klik untuk sort"
                                            >
                                                %{' '}
                                                <span className="ml-1">
                                                    {sortOrderAkun === 'asc' ? (
                                                        <span className="text-white font-bold">▲</span>
                                                    ) : sortOrderAkun === 'desc' ? (
                                                        <span className="text-white font-bold">▼</span>
                                                    ) : (
                                                        <span className="text-gray-400">▲▼</span>
                                                    )}
                                                </span>
                                            </th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedDataAkun?.map((item, index) => (
                                            <tr key={item.no} className="border-t border-gray-700 hover:bg-navy-600">
                                                <td className="px-4 py-2 border">{index + 1}</td>
                                                <td className="px-4 py-2 border">{item.akun}</td>
                                                <td className="px-4 py-2 text-right border">{item.pagu.toLocaleString()}</td>
                                                <td className="px-4 py-2 text-right border">{item.realisasi.toLocaleString()}</td>
                                                <td className="px-4 py-2 text-right border">{item.persentasi.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardComponent>

                    )}

                    {loadingRekapRealisasiPerSatkerPerAkun ? (
                        <div className="flex w-full h-[25vh] py-10 items-center justify-center">
                            <DotLoader color="#2152ff" size={50} />
                        </div>
                    ) : (
                        <CardComponent title={`Capaian PNBP Per Satker Per Akun TA ${tahun}`}>
                            <div className="overflow-x-auto rounded-lg  flex flex-col gap-6 w-full">
                                <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4">
                                    <button
                                        onClick={handleExportExcelRealisasiPerSatkerAkun}
                                        className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm hover:bg-emerald-700 transition"
                                    >
                                        📥 Export to Excel
                                    </button>
                                    <div className="w-full md:w-auto">
                                        <label className="block mb-1 text-sm text-gray-300">Search </label>
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Cari berdasarkan nama satker..."
                                            className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 bg-navy-700 text-gray-300"
                                        />
                                    </div>


                                </div>

                                <table className="w-full text-sm text-gray-200 border border-gray-700 !bg-navy-700">
                                    <thead className="bg-navy-800 text-gray-100 uppercase text-xs">
                                        <tr>
                                            <th className="px-4 py-2 text-left">No</th>
                                            <th className="px-4 py-2 text-left">Stker/Akun</th>
                                            <th className="px-4 py-2 text-right">Target</th>
                                            <th className="px-4 py-2 text-right">Capaian</th>
                                            <th
                                                className="px-4 py-2 text-right cursor-pointer hover:underline"
                                                onClick={() => setSortOrderSatkerAkun(sortOrderSatkerAkun === 'asc' ? 'desc' : 'asc')}
                                                title="Klik untuk sort"
                                            >
                                                %{' '}
                                                <span className="ml-1">
                                                    {sortOrderSatkerAkun === 'asc' ? (
                                                        <span className="text-white font-bold">▲</span>
                                                    ) : sortOrderSatkerAkun === 'desc' ? (
                                                        <span className="text-white font-bold">▼</span>
                                                    ) : (
                                                        <span className="text-gray-400">▲▼</span>
                                                    )}
                                                </span>
                                            </th>

                                            <th className="px-4 py-2 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            sortedDataRealisasiPerSatkerAkun?.map((realisasi, index) => (
                                                <>
                                                    <tr className="bg-navy-700">
                                                        <td className="px-4 py-2 border">{index + 1}</td>
                                                        <td className="px-4 py-2 border">{(realisasi!.nama_satker).toUpperCase()}</td>
                                                        <td className="px-4 py-2 border text-right">{realisasi!.pagu.toLocaleString()}</td>
                                                        <td className="px-4 py-2 border text-right">{realisasi!.realisasi.toLocaleString()}</td>
                                                        <td className="px-4 py-2 border text-right">{realisasi!.percentage}</td>
                                                        <td className="px-4 py-2 border text-center">
                                                            <button
                                                                onClick={() => toggleRow(index)}
                                                                className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-xs rounded"
                                                            >
                                                                {expandedRows.has(index) ? 'Hide' : 'Detail'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    {expandedRows.has(index) && (
                                                        <tr>
                                                            <td colSpan={6} className="px-4 py-2 border bg-navy-800">
                                                                <div className="overflow-x-auto">
                                                                    <table className="min-w-full mt-2  text-white">
                                                                        <thead className="bg-navy-700">
                                                                            <tr>
                                                                                <th className="px-3 py-2 border">Output</th>
                                                                                <th className="px-3 py-2 border">Nama Output</th>
                                                                                <th className="px-3 py-2 border">Target</th>
                                                                                <th className="px-3 py-2 border">Capaian</th>
                                                                                <th className="px-3 py-2 border">%</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {realisasi.details.map((output: any, i: any) => (
                                                                                <tr key={i} className={`${i % 2 === 0 ? 'bg-navy-800' : 'bg-transparent'}`}>
                                                                                    <td className="px-3 py-2 border">{output.output.split(' - ')[0]}</td>
                                                                                    <td className="px-3 py-2 border">{output.output.split(' - ')[1]}</td>
                                                                                    <td className="px-3 py-2 border text-right">{output.pagu.toLocaleString()}</td>
                                                                                    <td className="px-3 py-2 border text-right">{output.realisasi.toLocaleString()}</td>
                                                                                    <td className="px-3 py-2 border text-right">{output.percentage}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}</>
                                            ))
                                        }

                                    </tbody>
                                </table>
                            </div>
                        </CardComponent>

                    )}
                </div>
            }
        </div>
    );
};

