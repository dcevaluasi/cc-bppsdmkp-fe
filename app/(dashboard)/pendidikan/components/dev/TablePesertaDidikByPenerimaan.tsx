'use client'
import React, { useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, TrendingUp, School, ClipboardList, Users } from "lucide-react"

interface PenerimaanData {
    no: number
    jenis: 'Tinggi' | 'Menengah'
    satdik: string
    pendaftar_animo: number | string
    kuota: number
    penerimaan: number
}

interface TotalData {
    pendaftar_animo: number
    kuota: number
    penerimaan: number
}

interface ChartDataItem {
    name: string
    'Pendaftar': number
    'Kuota': number
    'Penerimaan': number
}

interface DataByTriwulan {
    tw1: PenerimaanData[]
    tw2: PenerimaanData[]
    tw3: PenerimaanData[]
}

const DATA: DataByTriwulan = {
    tw1: [
        { no: 1, jenis: 'Tinggi', satdik: 'Politeknik AUP', pendaftar_animo: 1951, kuota: 834, penerimaan: 838 },
        { no: 2, jenis: 'Tinggi', satdik: 'Politeknik KP Sidoarjo', pendaftar_animo: 1449, kuota: 220, penerimaan: 215 },
        { no: 3, jenis: 'Tinggi', satdik: 'Politeknik KP Bitung', pendaftar_animo: 250, kuota: 155, penerimaan: 155 },
        { no: 4, jenis: 'Tinggi', satdik: 'Politeknik KP Sorong', pendaftar_animo: 223, kuota: 122, penerimaan: 121 },
        { no: 5, jenis: 'Tinggi', satdik: 'Politeknik KP Karawang', pendaftar_animo: 166, kuota: 90, penerimaan: 90 },
        { no: 6, jenis: 'Tinggi', satdik: 'Politeknik KP Bone', pendaftar_animo: 356, kuota: 157, penerimaan: 157 },
        { no: 7, jenis: 'Tinggi', satdik: 'Politeknik KP Kupang', pendaftar_animo: 565, kuota: 140, penerimaan: 140 },
        { no: 8, jenis: 'Tinggi', satdik: 'Politeknik KP Dumai', pendaftar_animo: 168, kuota: 90, penerimaan: 90 },
        { no: 9, jenis: 'Tinggi', satdik: 'Politeknik KP Pangandaran', pendaftar_animo: 120, kuota: 90, penerimaan: 90 },
        { no: 10, jenis: 'Tinggi', satdik: 'Politeknik KP Jembrana', pendaftar_animo: 272, kuota: 90, penerimaan: 99 },
        { no: 11, jenis: 'Tinggi', satdik: 'Akademi Komunitas Wakatobi', pendaftar_animo: 66, kuota: 52, penerimaan: 43 },
        { no: 12, jenis: 'Menengah', satdik: 'SUPM Ladong', pendaftar_animo: '', kuota: 60, penerimaan: 37 },
        { no: 13, jenis: 'Menengah', satdik: 'SUPM Pariaman', pendaftar_animo: '', kuota: 60, penerimaan: 60 },
        { no: 14, jenis: 'Menengah', satdik: 'SUPM Kotaagung', pendaftar_animo: '', kuota: 50, penerimaan: 24 },
        { no: 15, jenis: 'Menengah', satdik: 'SUPM Tegal', pendaftar_animo: '', kuota: 72, penerimaan: 75 },
        { no: 16, jenis: 'Menengah', satdik: 'SUPM Waiheru', pendaftar_animo: '', kuota: 80, penerimaan: 77 }
    ],
    tw2: [],
    tw3: [
        { no: 1, jenis: 'Tinggi', satdik: 'Politeknik AUP', pendaftar_animo: 1573, kuota: 288, penerimaan: 295 },
        { no: 2, jenis: 'Tinggi', satdik: 'Politeknik KP Sidoarjo', pendaftar_animo: 258, kuota: 80, penerimaan: 80 },
        { no: 3, jenis: 'Tinggi', satdik: 'Politeknik KP Bitung', pendaftar_animo: 778, kuota: 250, penerimaan: 266 },
        { no: 4, jenis: 'Tinggi', satdik: 'Politeknik KP Sorong', pendaftar_animo: 173, kuota: 70, penerimaan: 70 },
        { no: 5, jenis: 'Tinggi', satdik: 'Politeknik KP Karawang', pendaftar_animo: 215, kuota: 107, penerimaan: 107 },
        { no: 6, jenis: 'Tinggi', satdik: 'Politeknik KP Bone', pendaftar_animo: 229, kuota: 77, penerimaan: 76 },
        { no: 7, jenis: 'Tinggi', satdik: 'Politeknik KP Kupang', pendaftar_animo: 312, kuota: 71, penerimaan: 69 },
        { no: 8, jenis: 'Tinggi', satdik: 'Politeknik KP Dumai', pendaftar_animo: 147, kuota: 80, penerimaan: 80 },
        { no: 9, jenis: 'Tinggi', satdik: 'Politeknik KP Pangandaran', pendaftar_animo: 116, kuota: 66, penerimaan: 67 },
        { no: 10, jenis: 'Tinggi', satdik: 'Politeknik KP Jembrana', pendaftar_animo: 199, kuota: 76, penerimaan: 76 },
        { no: 11, jenis: 'Tinggi', satdik: 'Akademi Komunitas Wakatobi', pendaftar_animo: 59, kuota: 35, penerimaan: 31 },
        { no: 12, jenis: 'Menengah', satdik: 'SUPM Ladong', pendaftar_animo: 189, kuota: 60, penerimaan: 60 },
        { no: 13, jenis: 'Menengah', satdik: 'SUPM Pariaman', pendaftar_animo: 231, kuota: 40, penerimaan: 40 },
        { no: 14, jenis: 'Menengah', satdik: 'SUPM Kotaagung', pendaftar_animo: 114, kuota: 60, penerimaan: 59 },
        { no: 15, jenis: 'Menengah', satdik: 'SUPM Tegal', pendaftar_animo: 275, kuota: 60, penerimaan: 60 },
        { no: 16, jenis: 'Menengah', satdik: 'SUPM Waiheru', pendaftar_animo: 236, kuota: 80, penerimaan: 80 }
    ]
}

export default function TablePesertaDidikByPenerimaan({
    loading = false,
    tahun = '2024',
    triwulan = 'tw1'
}: {
    loading?: boolean
    tahun?: string
    triwulan?: 'tw1' | 'tw2' | 'tw3'
}) {
    const [selectedJenis, setSelectedJenis] = useState<'Tinggi' | 'Menengah'>('Tinggi')

    const twLabel: Record<'tw1' | 'tw2' | 'tw3', string> = {
        tw1: 'TW I',
        tw2: 'TW II',
        tw3: 'TW III'
    }

    const { tinggi, menengah, chartData } = useMemo(() => {
        const currentData = DATA[triwulan]

        if (!currentData || currentData.length === 0) {
            return {
                tinggi: { data: [], total: { pendaftar_animo: 0, kuota: 0, penerimaan: 0 } },
                menengah: { data: [], total: { pendaftar_animo: 0, kuota: 0, penerimaan: 0 } },
                chartData: []
            }
        }

        const tinggiData = currentData.filter(d => d.jenis === 'Tinggi')
        const menengahData = currentData.filter(d => d.jenis === 'Menengah')

        const tinggiTotal: TotalData = tinggiData.reduce((acc, item) => ({
            pendaftar_animo: acc.pendaftar_animo + (typeof item.pendaftar_animo === 'number' ? item.pendaftar_animo : 0),
            kuota: acc.kuota + item.kuota,
            penerimaan: acc.penerimaan + item.penerimaan
        }), { pendaftar_animo: 0, kuota: 0, penerimaan: 0 })

        const menengahTotal: TotalData = menengahData.reduce((acc, item) => ({
            pendaftar_animo: acc.pendaftar_animo + (typeof item.pendaftar_animo === 'number' ? item.pendaftar_animo : 0),
            kuota: acc.kuota + item.kuota,
            penerimaan: acc.penerimaan + item.penerimaan
        }), { pendaftar_animo: 0, kuota: 0, penerimaan: 0 })

        const chartData: ChartDataItem[] = [
            { name: 'Pendidikan Tinggi', Pendaftar: tinggiTotal.pendaftar_animo, Kuota: tinggiTotal.kuota, Penerimaan: tinggiTotal.penerimaan },
            { name: 'Pendidikan Menengah', Pendaftar: menengahTotal.pendaftar_animo, Kuota: menengahTotal.kuota, Penerimaan: menengahTotal.penerimaan }
        ]

        return {
            tinggi: { data: tinggiData, total: tinggiTotal },
            menengah: { data: menengahData, total: menengahTotal },
            chartData
        }
    }, [triwulan])

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="p-3 bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-blue-500/50 rounded-lg shadow-xl backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <UserPlus className="w-4 h-4 text-blue-400" />
                        <strong className="text-sm text-white font-semibold">{payload[0].payload.name}</strong>
                    </div>
                    <div className="space-y-1 text-xs">
                        {payload.map((item: any, index: number) => (
                            item.value > 0 && (
                                <div key={index} className="flex justify-between gap-4 text-gray-300">
                                    <span className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        {item.name}:
                                    </span>
                                    <span className="font-bold text-blue-400">{item.value.toLocaleString('id-ID')}</span>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            )
        }
        return null
    }

    const CustomBarCursor = (props: any) => {
        const { x, y, width, height } = props
        return (
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                rx={4}
                ry={4}
                fill="rgba(59, 130, 246, 0.1)"
                stroke="rgba(59, 130, 246, 0.3)"
                strokeWidth={1}
            />
        )
    }

    const renderTable = (data: PenerimaanData[], total: TotalData) => {
        return (
            <div className="overflow-x-auto rounded-lg border-2 border-navy-600/50 shadow-xl">
                <table className="min-w-full divide-y divide-navy-600 bg-navy-700/50 text-sm text-gray-200">
                    <thead className="bg-gradient-to-r from-navy-800 to-navy-900">
                        <tr>
                            <th className="px-4 py-4 text-center font-semibold text-gray-200 border-r border-navy-600">
                                #
                            </th>
                            <th className="px-4 py-4 text-left font-semibold text-gray-200 min-w-[250px] border-r border-navy-600">
                                <div className="flex items-center gap-2">
                                    <School className="w-3 h-3 text-blue-400" />
                                    Satuan Pendidikan
                                </div>
                            </th>
                            <th className="px-4 py-4 text-right font-semibold text-gray-200 min-w-[130px] border-l border-navy-600/30"
                                style={{ background: 'linear-gradient(to bottom, rgba(139, 92, 246, 0.15), rgba(139, 92, 246, 0.05))' }}>
                                <div className="flex items-center justify-end gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                    Pendaftar/Animo
                                </div>
                            </th>
                            <th className="px-4 py-4 text-right font-semibold text-gray-200 min-w-[100px] border-l border-navy-600/30"
                                style={{ background: 'linear-gradient(to bottom, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.05))' }}>
                                <div className="flex items-center justify-end gap-2">
                                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                    Kuota
                                </div>
                            </th>
                            <th className="px-4 py-4 text-right font-semibold text-gray-200 min-w-[110px] border-l border-navy-600/30"
                                style={{ background: 'linear-gradient(to bottom, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))' }}>
                                <div className="flex items-center justify-end gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    Penerimaan
                                </div>
                            </th>
                            <th className="px-4 py-4 text-right font-bold text-gray-200 bg-navy-900 border-l-2 border-teal-500/50 min-w-[120px]">
                                <div className="flex items-center justify-end gap-2">
                                    <TrendingUp className="w-3 h-3 text-teal-400" />
                                    % Penerimaan
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-600/50">
                        {data.map((item, rowIndex) => {
                            const pendaftar = typeof item.pendaftar_animo === 'number' ? item.pendaftar_animo : 0
                            const persentase = pendaftar > 0 ? ((item.penerimaan / pendaftar) * 100).toFixed(1) : '-'
                            const persentaseNum = persentase !== '-' ? parseFloat(persentase) : 0

                            // Color coding untuk persentase
                            let persenColor = 'text-gray-400'
                            if (persentaseNum >= 90) persenColor = 'text-green-400'
                            else if (persentaseNum >= 70) persenColor = 'text-blue-400'
                            else if (persentaseNum >= 50) persenColor = 'text-orange-400'
                            else if (persentaseNum > 0) persenColor = 'text-red-400'

                            return (
                                <tr
                                    key={item.no}
                                    className="hover:bg-navy-600/50 transition-all duration-200 group"
                                    style={{
                                        background: rowIndex % 2 === 0 ? 'rgba(30, 41, 59, 0.3)' : 'rgba(15, 23, 42, 0.3)'
                                    }}
                                >
                                    <td className="px-4 py-3 text-center text-gray-300 border-r border-navy-600">
                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">
                                            {item.no}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-200 font-medium border-r border-navy-600">
                                        {item.satdik}
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-300 border-l border-navy-600/20">
                                        {pendaftar > 0 ? (
                                            <span className="inline-block px-3 py-1 rounded bg-purple-500/10 text-purple-300 font-medium">
                                                {pendaftar.toLocaleString('id-ID')}
                                            </span>
                                        ) : (
                                            <span className="text-gray-600">-</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-300 border-l border-navy-600/20">
                                        <span className="inline-block px-3 py-1 rounded bg-orange-500/10 text-orange-300 font-medium">
                                            {item.kuota.toLocaleString('id-ID')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-300 border-l border-navy-600/20">
                                        <span className="inline-block px-3 py-1 rounded bg-green-500/10 text-green-300 font-medium">
                                            {item.penerimaan.toLocaleString('id-ID')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right font-bold bg-navy-800/50 border-l-2 border-teal-500/30">
                                        {persentase !== '-' ? (
                                            <span className={`inline-block px-3 py-1 rounded-lg ${persenColor} font-bold`}>
                                                {persentase}%
                                            </span>
                                        ) : (
                                            <span className="text-gray-600">-</span>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                        <tr className="bg-gradient-to-r from-navy-900 to-navy-800 font-bold border-t-2 border-blue-500/50">
                            <td colSpan={2} className="px-4 py-4 text-right text-gray-200 uppercase tracking-wider border-r border-navy-600">
                                <div className="flex items-center justify-end gap-2">
                                    <TrendingUp className="w-4 h-4 text-teal-400" />
                                    TOTAL
                                </div>
                            </td>
                            <td className="px-4 py-4 text-right text-purple-300 border-l border-navy-600/30">
                                {total.pendaftar_animo > 0 ? (
                                    <span className="inline-block px-3 py-1 rounded bg-purple-500/20 font-bold">
                                        {total.pendaftar_animo.toLocaleString('id-ID')}
                                    </span>
                                ) : (
                                    <span className="text-gray-600">-</span>
                                )}
                            </td>
                            <td className="px-4 py-4 text-right text-orange-300 border-l border-navy-600/30">
                                <span className="inline-block px-3 py-1 rounded bg-orange-500/20 font-bold">
                                    {total.kuota.toLocaleString('id-ID')}
                                </span>
                            </td>
                            <td className="px-4 py-4 text-right text-green-300 border-l border-navy-600/30">
                                <span className="inline-block px-3 py-1 rounded bg-green-500/20 font-bold">
                                    {total.penerimaan.toLocaleString('id-ID')}
                                </span>
                            </td>
                            <td className="px-4 py-4 text-right text-teal-300 bg-navy-900 border-l-2 border-teal-500/50">
                                {total.pendaftar_animo > 0 ? (
                                    <span className="inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500/30 to-blue-500/30 text-white font-bold text-sm shadow-lg">
                                        {((total.penerimaan / total.pendaftar_animo) * 100).toFixed(1)}%
                                    </span>
                                ) : (
                                    <span className="text-gray-600">-</span>
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex h-[25vh] py-10 items-center justify-center">
                <div className="text-gray-300">Loading...</div>
            </div>
        )
    }

    if (DATA[triwulan].length === 0) {
        return (
            <div className="flex h-[25vh] py-10 items-center justify-center">
                <div className="text-gray-300">Data tidak tersedia untuk {twLabel[triwulan]}</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <Card className="flex flex-col w-full bg-gradient-to-br from-navy-800 to-navy-900 border-navy-600">
                <CardHeader className="items-center pb-0 border-b border-navy-600/50">
                    <div className="flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-blue-400" />
                        <CardTitle className="text-white text-center">
                            Penerimaan Peserta Didik {tahun} ({twLabel[triwulan]})
                        </CardTitle>
                    </div>
                    <p className="text-sm text-gray-400 text-center pb-5">
                        Perbandingan pendaftar, kuota, dan penerimaan peserta didik
                    </p>
                </CardHeader>
                <CardContent className="flex-1 pb-0 pt-2">
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartData} margin={{ top: 20, right: 30, bottom: 5, left: 20 }}>
                            <defs>
                                <linearGradient id="gradient-pendaftar" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.7} />
                                </linearGradient>
                                <linearGradient id="gradient-kuota" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.7} />
                                </linearGradient>
                                <linearGradient id="gradient-penerimaan" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.7} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis
                                dataKey="name"
                                stroke="#9CA3AF"
                                tick={{ fill: '#E5E7EB', fontSize: 12, fontWeight: 500 }}
                            />
                            <YAxis
                                stroke="#9CA3AF"
                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={<CustomBarCursor />} />
                            <Legend verticalAlign="top" height={36} iconType="rect" />
                            <Bar dataKey="Pendaftar" fill="#8b5cf6" radius={[8, 8, 0, 0]}>
                                <LabelList
                                    dataKey="Pendaftar"
                                    position="top"
                                    offset={8}
                                    formatter={(value: number) => value > 0 ? value.toLocaleString('id-ID') : ''}
                                    style={{
                                        fill: '#E5E7EB',
                                        fontSize: 11,
                                        fontWeight: 'bold',
                                        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                                    }}
                                />
                            </Bar>
                            <Bar dataKey="Kuota" fill="#f59e0b" radius={[8, 8, 0, 0]}>
                                <LabelList
                                    dataKey="Kuota"
                                    position="top"
                                    offset={8}
                                    formatter={(value: number) => value.toLocaleString('id-ID')}
                                    style={{
                                        fill: '#E5E7EB',
                                        fontSize: 11,
                                        fontWeight: 'bold',
                                        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                                    }}
                                />
                            </Bar>
                            <Bar dataKey="Penerimaan" fill="#10b981" radius={[8, 8, 0, 0]}>
                                <LabelList
                                    dataKey="Penerimaan"
                                    position="top"
                                    offset={8}
                                    formatter={(value: number) => value.toLocaleString('id-ID')}
                                    style={{
                                        fill: '#E5E7EB',
                                        fontSize: 11,
                                        fontWeight: 'bold',
                                        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                                    }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="flex flex-col w-full bg-gradient-to-br from-navy-800 to-navy-900 border-navy-600">
                <CardHeader className="pb-4 flex items-center justify-between flex-row w-full border-b border-navy-600/50">
                    <div>
                        <CardTitle className="text-white flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 text-blue-400" />
                            Detail Penerimaan Per Satuan Pendidikan
                        </CardTitle>
                        <p className="text-sm text-gray-400 mt-1">
                            Data pendaftar, daya tampung, dan pendaftar ulang
                        </p>
                    </div>
                    <div className="w-56">
                        <Select value={selectedJenis} onValueChange={(val) => setSelectedJenis(val as 'Tinggi' | 'Menengah')}>
                            <SelectTrigger className="w-full text-gray-300 bg-navy-700 border-navy-600">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Tinggi" className="text-gray-300">🎓 Pendidikan Tinggi</SelectItem>
                                <SelectItem value="Menengah" className="text-gray-300">🏫 Pendidikan Menengah</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    {selectedJenis === 'Tinggi'
                        ? renderTable(tinggi.data, tinggi.total)
                        : renderTable(menengah.data, menengah.total)
                    }
                </CardContent>
            </Card>
        </div>
    )
}