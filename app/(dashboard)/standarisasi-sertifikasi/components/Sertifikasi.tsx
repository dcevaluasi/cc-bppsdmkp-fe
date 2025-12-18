import React from 'react'
import TablePivotSertifikasiMonthly from '@/components/table/TablePivotSertifikasiMonthly';
import { useSummaryMonthly } from '@/hooks/sertifikasi/akp/useSummaryMonthly';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { years } from '@/utils/time';
import { DotLoader } from 'react-spinners';
import TablePivotSertifikasiByLembaga from '@/components/table/TablePivotSertifikasiByLembaga';
import { useSummaryByLembaga } from '@/hooks/sertifikasi/akp/useSummaryByLemdiklat';
import ChartSummaryAKPTotals from './charts/ChartSummaryAKPTotals';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from 'recharts';

const COLORS = [
    '#ef4444', '#eab308', '#84cc16', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
];

interface TooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
}

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-sm">
                <p className="text-slate-100 text-base font-bold mb-3">{payload[0].payload.lembaga}</p>
                {payload.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.fill }}
                        />
                        <div className="flex items-baseline gap-2">
                            <p className="text-lg font-bold text-white">{item.value}</p>
                            <p className="text-xs text-slate-400">{item.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};
function ChartSertifikasiMonthly({ tahun }: { tahun: any }) {
    const { data: dataSertifikasiMonthly, isLoading, error } = useSummaryMonthly(tahun, "Keahlian");

    if (isLoading) return <div className="text-slate-400">Loading...</div>;
    if (error) return <div className="text-red-400">Error loading data</div>;

    // Transform data - group by month and certificate type
    const groupedData: any = {};
    const certificateTypes = new Set<string>();

    dataSertifikasiMonthly?.data?.forEach((item: any) => {
        const bulan = item.bulan.substring(0, 3);
        if (!groupedData[bulan]) {
            groupedData[bulan] = { bulan };
        }
        groupedData[bulan][item.s_jenis_sertifikat] = parseInt(item.jumlah);
        certificateTypes.add(item.s_jenis_sertifikat);
    });

    const chartData = Object.values(groupedData);
    const certificateTypesArray = Array.from(certificateTypes);

    // Calculate width based on number of bars
    const chartWidth = Math.max(chartData.length * 100, 800);

    return (
        <Card className="bg-navy-800 border border-navy-700 text-white">
            <CardHeader>
                <CardTitle>Sertifikasi Keahlian Awak Kapal Perikanan (AKP) Berdasarkan Bulan</CardTitle>
            </CardHeader>
            <CardContent>
                <div className=" p-6 rounded-lg">
                    <div className="overflow-x-auto">
                        <div style={{ width: '100%', minWidth: `${chartWidth}px` }}>
                            <ResponsiveContainer width="100%" height={450}>
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis
                                        dataKey="bulan"
                                        stroke="#94a3b8"
                                        style={{ fontSize: '14px' }}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        style={{ fontSize: '14px' }}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                                    <Legend
                                        wrapperStyle={{ paddingTop: '20px' }}
                                        iconType="circle"
                                    />
                                    {certificateTypesArray.map((certType, index) => (
                                        <Bar
                                            key={certType}
                                            dataKey={certType}
                                            stackId="a"
                                            fill={COLORS[index % COLORS.length]}
                                            radius={index === certificateTypesArray.length - 1 ? [8, 8, 0, 0] : [0, 0, 0, 0]}
                                        >
                                            <LabelList
                                                dataKey={certType}
                                                position="inside"
                                                style={{ fill: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                                formatter={(value: number) => value > 0 ? value : ''}
                                            />
                                        </Bar>
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

    );
}

function ChartSertifikasiByLembaga({ tahun }: { tahun: any }) {
    const { data: dataSertifikasiByLembaga, isLoading: isLoadingSertifikasiByLembaga, error: errorLoadingSertifikasiByLembaga } = useSummaryByLembaga(tahun, "Keahlian");

    if (isLoadingSertifikasiByLembaga) return <div className="text-slate-400">Loading...</div>;
    if (errorLoadingSertifikasiByLembaga) return <div className="text-red-400">Error loading data</div>;

    // Transform data - group by lembaga and certificate type
    const groupedData: any = {};
    const certificateTypes = new Set<string>();

    dataSertifikasiByLembaga?.data?.forEach((item: any) => {
        const lembaga = item.uk_nama;
        if (!groupedData[lembaga]) {
            groupedData[lembaga] = { lembaga };
        }
        groupedData[lembaga][item.s_jenis_sertifikat] = parseInt(item.jumlah);
        certificateTypes.add(item.s_jenis_sertifikat);
    });

    const chartData = Object.values(groupedData);
    const certificateTypesArray = Array.from(certificateTypes);

    // Calculate width based on number of bars (stacked bars need less space)
    const chartWidth = Math.max(chartData.length * 100, 1000);

    return (
        <Card className="bg-navy-800 border border-navy-700 text-white">
            <CardHeader>
                <CardTitle>Sertifikasi Keahlian Awak Kapal Perikanan (AKP) Berdasarkan Lembaga Diklat</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-lg">
                    <div className="overflow-x-auto">
                        <div style={{ width: '100%', minWidth: `${chartWidth}px` }}>
                            <ResponsiveContainer width="100%" height={450}>
                                <BarChart
                                    data={chartData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis
                                        dataKey="lembaga"
                                        stroke="#94a3b8"
                                        angle={-45}
                                        textAnchor="end"
                                        height={100}
                                        interval={0}
                                        style={{ fontSize: '12px' }}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        style={{ fontSize: '14px' }}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                                    <Legend
                                        wrapperStyle={{ paddingTop: '20px' }}
                                        iconType="circle"
                                    />
                                    {certificateTypesArray.map((certType, index) => (
                                        <Bar
                                            key={certType}
                                            dataKey={certType}
                                            stackId="a"
                                            fill={COLORS[index % COLORS.length]}
                                            radius={index === certificateTypesArray.length - 1 ? [8, 8, 0, 0] : [0, 0, 0, 0]}
                                        >
                                            <LabelList
                                                dataKey={certType}
                                                position="inside"
                                                style={{ fill: '#fff', fontSize: '11px', fontWeight: '600' }}
                                                formatter={(value: number) => value > 0 ? value : ''}
                                            />
                                        </Bar>
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

    );
}
function Sertifikasi() {
    const [tahun, setTahun] = React.useState<number>(new Date().getFullYear());
    const [jenisSertifikasi, setJenisSertifikasi] = React.useState<string>("BPPSDM KP");

    const { data: dataSertifikasiMonthly, isLoading, error } = useSummaryMonthly(tahun, "Keahlian");
    const { data: dataSertifikasiByLembaga, isLoading: isLoadingSertifikasiByLembaga, error: errorLoadingSertifikasiByLembaga } = useSummaryByLembaga(tahun, "Keahlian");

    if (isLoading || isLoadingSertifikasiByLembaga) return <div className="flex w-full h-[25vh] py-10 items-center justify-center">
        <DotLoader color="#2152ff" size={50} />
    </div>;
    if (error || errorLoadingSertifikasiByLembaga) return <p>Terjadi kesalahan saat fetch data</p>;

    return (
        <section>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-3 md:justify-between">
                <div className="flex gap-4">
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
                        <label className="block mb-1 text-sm text-gray-300">Jenis Sertifikasi</label>
                        <Select value={jenisSertifikasi} onValueChange={(val) => setJenisSertifikasi(val)}>
                            <SelectTrigger className="w-full text-gray-300">
                                <SelectValue placeholder="Pilih Jenis" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BNSP" className="text-gray-300">BNSP</SelectItem>
                                <SelectItem value="BPPSDM KP" className="text-gray-300">BPPSDM KP</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {jenisSertifikasi == "BPPSDM KP" && <p className="text-gray-400 font-semibold tex">
                    Source : akapi.kkp.go.id
                </p>}

            </div>
            {
                jenisSertifikasi == "BPPSDM KP" ?
                    <div className="flex flex-col gap-5">
                        <ChartSummaryAKPTotals jenis='Keahlian' />

                        <div className="flex flex-col gap-2">
                            <ChartSertifikasiMonthly tahun={tahun} />
                            {dataSertifikasiMonthly && <TablePivotSertifikasiMonthly data={dataSertifikasiMonthly.data} />}
                        </div>

                        <div className="flex flex-col gap-2">
                            <ChartSertifikasiByLembaga tahun={tahun} />
                            {dataSertifikasiMonthly && <TablePivotSertifikasiByLembaga data={dataSertifikasiByLembaga?.data || []} />}
                        </div>
                    </div>
                    : <></>
            }
        </section>
    )
}

export default Sertifikasi
