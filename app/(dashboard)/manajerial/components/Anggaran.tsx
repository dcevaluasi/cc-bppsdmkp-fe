'use client';

import React, { useMemo, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRekapSatker } from '@/hooks/managerials/useRekapPerSatker';
import { DotLoader } from 'react-spinners';

import {
    Pie,
    PieChart,
    Label,
    BarChart,
    CartesianGrid,
    XAxis,
    Bar,
    LabelList,
    Cell,
    Tooltip,
    ResponsiveContainer,
    YAxis,
    AreaChart,
    Area,
    LineChart,
    Line,
} from "recharts";
import {
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import Card from "@/components/card";

import { useRekapRealisasiSisa } from '@/hooks/managerials/useRekapRealisasiSisa';
import { useRekapRincianRealisasiAnggaran } from '@/hooks/managerials/useRekapRincianRealisasiAnggaran';
import { useKROAnggaran } from '@/hooks/managerials/useKROAnggaran';
import { useRekapAnggaranPerDay } from '@/hooks/managerials/useRekapAnggaranPerDay';
import KROAnggaranTable from './tables/KROAnggaranTable';
import SatkerAnggaranTable from './tables/SatkerAnggaranTable';
import RealisasiAnggaranChart from './charts/RealisasiAnggaranChart';
import DetailAnggaranTable from './tables/DetailAnggaranTable';
import { useGetTanggalOmspan } from '@/hooks/managerials/useGetTanggalOmpsan';
import { formatToShortRupiah } from '@/utils/text';
import PusatAnggaranTable from './tables/PusatAnggaranTable';
import { transformRekapPerSatker } from '@/types/managerial/anggaran';
import { useRincianDipaPerPusat } from '@/hooks/managerials/useRincianDipaPerPusat';
import SqlUploadOmspan from './SqlUploadOmpsan';


const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);



export const Anggaran = () => {
    const [tahun, setTahun] = useState<number>(new Date().getFullYear());
    const [tanggal, setTanggal] = useState<string>('');
    const { data: dataTanggalOmspan, loading: loadingTanggalOmspan } = useGetTanggalOmspan();
    const { data, loading } = useRekapSatker(tahun, tanggal ?? '');


    const [selectedYearChart, setSelectedYearChart] = useState<number>(2025);


    const monthNames = [
        "Januari", "Februari", "Maret", "April",
        "Mei", "Juni", "Juli", "Agustus",
        "September", "Oktober", "November", "Desember"
    ];

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-indexed (0 = January)
    const currentYear = currentDate.getFullYear();

    const months = Array.from({ length: 12 }, (_, i) => {
        // Get the total month index counting backwards
        const monthIndex = currentMonth - i;

        // Handle wrapping around previous years
        const date = new Date(currentYear, monthIndex, 1);
        const month = date.getMonth();
        const year = date.getFullYear();

        return {
            label: `${monthNames[month]} ${year}`,
            value: (month + 1).toString()
        };
    });


    // Initialize from months[0].value (string) to number:
    const [selectedMonthChart, setSelectedMonthChart] = useState<number>(parseInt(months[0].value));


    const { data: anggaranDataGrafik, loading: isLoadingGrafik } = useRekapAnggaranPerDay(selectedYearChart, selectedMonthChart)

    const anggaranData = anggaranDataGrafik?.map((item) => ({
        label: new Date(item.date).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }),
        desktop: item['Belanja Barang dan Jasa'],
        mobile: item['Belanja Pegawai'],
        browser: item['Belanja Modal'],

    })) ?? []

    const arialChartConfig = {
        visitors: {
            label: "Jumlah",
        },
        desktop: {
            label: "Belanja Barang dan Jasa",
            color: "#4ADE80", // bright green (accessible and readable)
        },
        mobile: {
            label: "Belanja Pegawai",
            color: "#60A5FA", // bright sky blue (cool and clean)
        },
        browser: {
            label: "Belanja Modal",
            color: "#F9E400", // bright red (stands out sharply)
        },
    } satisfies ChartConfig;


    const { data: dataRekapRealisasiSisa, loading: loadingRekapRealisasiSisa } = useRekapRealisasiSisa(tahun, tanggal);

    const { data: dataRekapRincianRealisasiAnggaran, loading: loadingRekapRincianRealisasiAnggaran } = useRekapRincianRealisasiAnggaran(tahun, tanggal)

    const chartDataRekapRealisasiSisa = dataRekapRealisasiSisa
        ? [
            {
                name: "Realisasi",
                value: dataRekapRealisasiSisa.realisasi || 0,
                fill: "#5CB338",
                pagu: dataRekapRealisasiSisa.pagu || 0
            },
            {
                name: "Sisa",
                value: dataRekapRealisasiSisa.sisa || 0,
                fill: "#FB4141",
                pagu: dataRekapRealisasiSisa.pagu || 0
            },
        ]
        : [];


    const [search, setSearch] = React.useState<string>('');

    const filteredData = data?.filter((item) =>
        search === '' || (item.nama_satker || '').toLowerCase().includes(search.toLowerCase())
    );

    console.log({ filteredData })

    const { data: dataKROAnggaran, loading: loadingKROAnggaran } = useKROAnggaran(tahun, tanggal)

    React.useEffect(() => {
        const list = dataTanggalOmspan?.tanggal_omspan ?? [];
        if (list.length > 0 && tanggal === '') {
            setTanggal(list[0]);
        }
    }, [dataTanggalOmspan, tanggal]);

    const { data: dataRincianDipaPerPusat, loading: loadingRincianDipaPerPusat } = useRincianDipaPerPusat(tahun, tanggal)
    const transformed = useMemo(() => transformRekapPerSatker(dataRincianDipaPerPusat), [dataRincianDipaPerPusat]);
    return (
        <div className="p-4 space-y-6">
            {
                loadingTanggalOmspan != null ? (
                    <div className="w-full flex items-center justify-between">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
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
                        <SqlUploadOmspan />
                    </div>
                ) : <></>
            }



            {
                tanggal == '' ? <></> : <>
                    <div className="flex flex-col gap-5">
                        <div className="w-full flex flex-col gap-5">
                            <div className="w-full flex gap-5">
                                <RealisasiAnggaranChart
                                    loading={loadingRekapRealisasiSisa}
                                    title={`Realisasi Anggaran Tahun ${tahun}`}
                                    data={chartDataRekapRealisasiSisa}
                                    config={{}} // Optional chart config
                                />

                                <DetailAnggaranTable loading={loadingRekapRincianRealisasiAnggaran} tahun={tahun} data={dataRekapRincianRealisasiAnggaran} />
                            </div>

                        </div>

                        {isLoadingGrafik ? (
                            <div className="flex w-full h-[25vh] py-10 items-center justify-center">
                                <DotLoader color="#2152ff" size={50} />
                            </div>
                        ) : (
                            <Card className="mt-5">
                                <CardHeader className="flex items-center justify-between gap-2 space-y-0 border-b py-5 sm:flex-row">
                                    <div className="grid flex-1 gap-1 text-center sm:text-left">
                                        <CardTitle>Grafik Realisasi Anggaran</CardTitle>

                                    </div>

                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                        <div className="w-40">
                                            <label className="block mb-1 text-sm text-gray-300">Tahun</label>
                                            <Select value={selectedYearChart.toString()} onValueChange={(val) => setSelectedYearChart(parseInt(val))}>
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

                                        <div className="w-48">
                                            <label className="block mb-1 text-sm text-gray-300">Bulan</label>
                                            <Select value={selectedMonthChart.toString()} onValueChange={(val) => setSelectedMonthChart(parseInt(val))}>
                                                <SelectTrigger className="w-full text-gray-300">
                                                    <SelectValue placeholder="Pilih Bulan" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {months.map((month, idx) => (
                                                        <SelectItem key={idx} value={month.value} className="text-gray-300">
                                                            {month.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>


                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-2 pt-4 sm:pt-6 relative">
                                    <div className="overflow-x-auto pt-0 scrollbar-hide">
                                        <div className="w-[2500px]">
                                            <ChartContainer
                                                config={arialChartConfig}
                                                className="aspect-auto h-[450px] w-full pb-5"
                                            >
                                                <AreaChart data={anggaranData} stackOffset="none">
                                                    <defs>
                                                        <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
                                                            <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
                                                        </linearGradient>
                                                        <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
                                                            <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
                                                        </linearGradient>
                                                        <linearGradient id="fillBrowser" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="var(--color-browser)" stopOpacity={0.8} />
                                                            <stop offset="95%" stopColor="var(--color-browser)" stopOpacity={0.1} />
                                                        </linearGradient>
                                                    </defs>

                                                    <CartesianGrid vertical={false} horizontal={false} />
                                                    <XAxis
                                                        dataKey="label"
                                                        tickLine={false}
                                                        axisLine={false}
                                                        tickMargin={8}
                                                        minTickGap={32}
                                                        interval={0}
                                                        angle={-45}
                                                        textAnchor="end"
                                                        height={100}
                                                        tick={{ fill: "#cbd5e0" }}
                                                    />
                                                    <YAxis
                                                        domain={[0, 'auto']}
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tick={false}
                                                    />
                                                    <ChartTooltip
                                                        cursor={false}
                                                        content={<ChartTooltipContent indicator="dot" />}
                                                    />
                                                    <Area
                                                        dataKey="mobile"
                                                        type="monotone"
                                                        fill="url(#fillMobile)"
                                                        stroke="var(--color-mobile)"
                                                        stackId="a"
                                                    />

                                                    <Area
                                                        dataKey="desktop"
                                                        type="monotone"
                                                        fill="url(#fillDesktop)"
                                                        stroke="var(--color-desktop)"
                                                        stackId="b"
                                                    />


                                                    <Area
                                                        dataKey="browser"
                                                        type="monotone"
                                                        fill="url(#fillBrowser)"
                                                        stroke="var(--color-browser)"
                                                        stackId="c"


                                                    />



                                                    <ChartLegend content={<ChartLegendContent />} />
                                                </AreaChart>
                                            </ChartContainer>
                                        </div>
                                    </div>
                                </CardContent>

                            </Card>


                        )}


                        <PusatAnggaranTable loading={loadingRincianDipaPerPusat} data={transformed} tahun={tahun.toString()} />


                        <SatkerAnggaranTable tahun={tahun.toString()} loading={loading} filteredData={filteredData! ?? []} search={search} setSearchData={setSearch} />


                        {
                            dataKROAnggaran != null && <KROAnggaranTable
                                loading={loadingKROAnggaran}
                                tahun={tahun}
                                data={dataKROAnggaran!}
                            />
                        }



                    </div></>
            }


        </div>
    );
};
