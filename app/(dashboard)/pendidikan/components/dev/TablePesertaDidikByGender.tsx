'use client'
import React, { useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, TrendingUp, School, User } from "lucide-react"

interface PesertaDidikGender {
    no: number
    jenis: 'Tinggi' | 'Menengah'
    satdik: string
    laki_laki: number
    perempuan: number
}

interface TotalData {
    laki_laki: number
    perempuan: number
    jumlah: number
}

interface ChartDataItem {
    name: string
    'Laki-laki': number
    Perempuan: number
}

interface DataByTriwulan {
    tw1: PesertaDidikGender[]
    tw2: PesertaDidikGender[]
    tw3: PesertaDidikGender[]
}

const DATA: DataByTriwulan = {
    tw1: [
        { no: 1, jenis: 'Tinggi', satdik: 'Politeknik AUP', laki_laki: 1824, perempuan: 1030 },
        { no: 2, jenis: 'Tinggi', satdik: 'Politeknik KP Bitung', laki_laki: 322, perempuan: 171 },
        { no: 3, jenis: 'Tinggi', satdik: 'Politeknik KP Bone', laki_laki: 390, perempuan: 269 },
        { no: 4, jenis: 'Tinggi', satdik: 'Politeknik KP Dumai', laki_laki: 192, perempuan: 85 },
        { no: 5, jenis: 'Tinggi', satdik: 'Politeknik KP Jembrana', laki_laki: 203, perempuan: 160 },
        { no: 6, jenis: 'Tinggi', satdik: 'Politeknik KP Karawang', laki_laki: 162, perempuan: 117 },
        { no: 7, jenis: 'Tinggi', satdik: 'Politeknik KP Kupang', laki_laki: 337, perempuan: 187 },
        { no: 8, jenis: 'Tinggi', satdik: 'Politeknik KP Pangandaran', laki_laki: 143, perempuan: 125 },
        { no: 9, jenis: 'Tinggi', satdik: 'Politeknik KP Sidoarjo', laki_laki: 327, perempuan: 253 },
        { no: 10, jenis: 'Tinggi', satdik: 'Politeknik KP Sorong', laki_laki: 261, perempuan: 114 },
        { no: 11, jenis: 'Tinggi', satdik: 'Akademi Komunitas Wakatobi', laki_laki: 22, perempuan: 20 },
        { no: 12, jenis: 'Menengah', satdik: 'SUPM Kotaagung', laki_laki: 69, perempuan: 25 },
        { no: 13, jenis: 'Menengah', satdik: 'SUPM Ladong', laki_laki: 76, perempuan: 31 },
        { no: 14, jenis: 'Menengah', satdik: 'SUPM Pariaman', laki_laki: 129, perempuan: 51 },
        { no: 15, jenis: 'Menengah', satdik: 'SUPM Tegal', laki_laki: 169, perempuan: 48 },
        { no: 16, jenis: 'Menengah', satdik: 'SUPM Waeheru', laki_laki: 109, perempuan: 70 }
    ],
    tw2: [
        { no: 1, jenis: 'Tinggi', satdik: 'Politeknik AUP', laki_laki: 1820, perempuan: 1024 },
        { no: 2, jenis: 'Tinggi', satdik: 'Politeknik KP Bitung', laki_laki: 312, perempuan: 170 },
        { no: 3, jenis: 'Tinggi', satdik: 'Politeknik KP Bone', laki_laki: 390, perempuan: 269 },
        { no: 4, jenis: 'Tinggi', satdik: 'Politeknik KP Dumai', laki_laki: 191, perempuan: 85 },
        { no: 5, jenis: 'Tinggi', satdik: 'Politeknik KP Jembrana', laki_laki: 207, perempuan: 156 },
        { no: 6, jenis: 'Tinggi', satdik: 'Politeknik KP Karawang', laki_laki: 162, perempuan: 117 },
        { no: 7, jenis: 'Tinggi', satdik: 'Politeknik KP Kupang', laki_laki: 337, perempuan: 187 },
        { no: 8, jenis: 'Tinggi', satdik: 'Politeknik KP Pangandaran', laki_laki: 143, perempuan: 125 },
        { no: 9, jenis: 'Tinggi', satdik: 'Politeknik KP Sidoarjo', laki_laki: 326, perempuan: 254 },
        { no: 10, jenis: 'Tinggi', satdik: 'Politeknik KP Sorong', laki_laki: 263, perempuan: 111 },
        { no: 11, jenis: 'Tinggi', satdik: 'Akademi Komunitas Wakatobi', laki_laki: 22, perempuan: 20 },
        { no: 12, jenis: 'Menengah', satdik: 'SUPM Kotaagung', laki_laki: 20, perempuan: 0 },
        { no: 13, jenis: 'Menengah', satdik: 'SUPM Ladong', laki_laki: 28, perempuan: 6 },
        { no: 14, jenis: 'Menengah', satdik: 'SUPM Pariaman', laki_laki: 44, perempuan: 15 },
        { no: 15, jenis: 'Menengah', satdik: 'SUPM Tegal', laki_laki: 64, perempuan: 9 },
        { no: 16, jenis: 'Menengah', satdik: 'SUPM Waeheru', laki_laki: 48, perempuan: 26 }
    ],
    tw3: [
        { no: 1, jenis: 'Tinggi', satdik: 'Politeknik AUP', laki_laki: 1699, perempuan: 913 },
        { no: 2, jenis: 'Tinggi', satdik: 'Politeknik KP Bitung', laki_laki: 263, perempuan: 130 },
        { no: 3, jenis: 'Tinggi', satdik: 'Politeknik KP Bone', laki_laki: 269, perempuan: 158 },
        { no: 4, jenis: 'Tinggi', satdik: 'Politeknik KP Dumai', laki_laki: 186, perempuan: 67 },
        { no: 5, jenis: 'Tinggi', satdik: 'Politeknik KP Jembrana', laki_laki: 154, perempuan: 120 },
        { no: 6, jenis: 'Tinggi', satdik: 'Politeknik KP Karawang', laki_laki: 177, perempuan: 116 },
        { no: 7, jenis: 'Tinggi', satdik: 'Politeknik KP Kupang', laki_laki: 246, perempuan: 119 },
        { no: 8, jenis: 'Tinggi', satdik: 'Politeknik KP Pangandaran', laki_laki: 135, perempuan: 110 },
        { no: 9, jenis: 'Tinggi', satdik: 'Politeknik KP Sidoarjo', laki_laki: 392, perempuan: 256 },
        { no: 10, jenis: 'Tinggi', satdik: 'Politeknik KP Sorong', laki_laki: 219, perempuan: 84 },
        { no: 11, jenis: 'Tinggi', satdik: 'Akademi Komunitas Wakatobi', laki_laki: 22, perempuan: 10 },
        { no: 12, jenis: 'Menengah', satdik: 'SUPM Kotaagung', laki_laki: 57, perempuan: 20 },
        { no: 13, jenis: 'Menengah', satdik: 'SUPM Ladong', laki_laki: 63, perempuan: 31 },
        { no: 14, jenis: 'Menengah', satdik: 'SUPM Pariaman', laki_laki: 83, perempuan: 16 },
        { no: 15, jenis: 'Menengah', satdik: 'SUPM Tegal', laki_laki: 101, perempuan: 32 },
        { no: 16, jenis: 'Menengah', satdik: 'SUPM Waeheru', laki_laki: 90, perempuan: 62 }
    ]
}

export default function TablePesertaDidikByGender({
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
        const tinggiData = currentData.filter(d => d.jenis === 'Tinggi')
        const menengahData = currentData.filter(d => d.jenis === 'Menengah')

        const tinggiTotal: TotalData = tinggiData.reduce((acc, item) => ({
            laki_laki: acc.laki_laki + item.laki_laki,
            perempuan: acc.perempuan + item.perempuan,
            jumlah: acc.jumlah + item.laki_laki + item.perempuan
        }), { laki_laki: 0, perempuan: 0, jumlah: 0 })

        const menengahTotal: TotalData = menengahData.reduce((acc, item) => ({
            laki_laki: acc.laki_laki + item.laki_laki,
            perempuan: acc.perempuan + item.perempuan,
            jumlah: acc.jumlah + item.laki_laki + item.perempuan
        }), { laki_laki: 0, perempuan: 0, jumlah: 0 })

        const chartData: ChartDataItem[] = [
            { name: 'Pendidikan Tinggi', 'Laki-laki': tinggiTotal.laki_laki, Perempuan: tinggiTotal.perempuan },
            { name: 'Pendidikan Menengah', 'Laki-laki': menengahTotal.laki_laki, Perempuan: menengahTotal.perempuan }
        ]

        return {
            tinggi: { data: tinggiData, total: tinggiTotal },
            menengah: { data: menengahData, total: menengahTotal },
            chartData
        }
    }, [triwulan])

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const total = payload.reduce((sum: number, item: any) => sum + item.value, 0)
            const lakiPersen = ((payload[0].value / total) * 100).toFixed(1)
            const perempuanPersen = ((payload[1].value / total) * 100).toFixed(1)

            return (
                <div className="p-3 bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-blue-500/50 rounded-lg shadow-xl backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <strong className="text-sm text-white font-semibold">{payload[0].payload.name}</strong>
                    </div>
                    <div className="space-y-1 text-xs">
                        <div className="flex justify-between gap-4 text-gray-300">
                            <span className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                Laki-laki:
                            </span>
                            <span className="font-bold text-blue-400">{payload[0].value.toLocaleString('id-ID')} ({lakiPersen}%)</span>
                        </div>
                        <div className="flex justify-between gap-4 text-gray-300">
                            <span className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                                Perempuan:
                            </span>
                            <span className="font-bold text-pink-400">{payload[1].value.toLocaleString('id-ID')} ({perempuanPersen}%)</span>
                        </div>
                        <div className="flex justify-between gap-4 pt-2 mt-2 border-t border-gray-700">
                            <span className="font-semibold text-gray-200">Total:</span>
                            <span className="font-bold text-gray-200">{total.toLocaleString('id-ID')}</span>
                        </div>
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

    const renderTable = (data: PesertaDidikGender[], total: TotalData) => {
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
                            <th className="px-4 py-4 text-right font-semibold text-gray-200 min-w-[120px] border-l border-navy-600/30"
                                style={{ background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))' }}>
                                <div className="flex items-center justify-end gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    Laki-laki
                                </div>
                            </th>
                            <th className="px-4 py-4 text-right font-semibold text-gray-200 min-w-[120px] border-l border-navy-600/30"
                                style={{ background: 'linear-gradient(to bottom, rgba(236, 72, 153, 0.15), rgba(236, 72, 153, 0.05))' }}>
                                <div className="flex items-center justify-end gap-2">
                                    <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                                    Perempuan
                                </div>
                            </th>
                            <th className="px-4 py-4 text-right font-bold text-gray-200 bg-navy-900 border-l-2 border-teal-500/50 min-w-[120px]">
                                <div className="flex items-center justify-end gap-2">
                                    <TrendingUp className="w-3 h-3 text-teal-400" />
                                    Total
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-600/50">
                        {data.map((item, rowIndex) => {
                            const jumlah = item.laki_laki + item.perempuan
                            const lakiPersen = ((item.laki_laki / jumlah) * 100).toFixed(0)
                            const perempuanPersen = ((item.perempuan / jumlah) * 100).toFixed(0)

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
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="inline-block px-3 py-1 rounded bg-blue-500/10 text-blue-300 font-medium">
                                                {item.laki_laki.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-300 border-l border-navy-600/20">
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="inline-block px-3 py-1 rounded bg-red-500/10 text-red-500 font-medium">
                                                {item.perempuan.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right font-bold text-teal-400 bg-navy-800/50 border-l-2 border-teal-500/30">
                                        <span className="inline-block px-3 py-1 rounded-lg bg-teal-500/20 text-teal-300 font-bold">
                                            {jumlah.toLocaleString('id-ID')}
                                        </span>
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
                            <td className="px-4 py-4 text-right text-blue-300 border-l border-navy-600/30">
                                <span className="inline-block px-3 py-1 rounded bg-blue-500/20 font-bold">
                                    {total.laki_laki.toLocaleString('id-ID')}
                                </span>
                            </td>
                            <td className="px-4 py-4 text-right text-red-300 border-l border-navy-600/30">
                                <span className="inline-block px-3 py-1 rounded bg-red-500/20 font-bold">
                                    {total.perempuan.toLocaleString('id-ID')}
                                </span>
                            </td>
                            <td className="px-4 py-4 text-right text-teal-300 bg-navy-900 border-l-2 border-teal-500/50">
                                <span className="inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500/30 to-blue-500/30 text-white font-bold text-sm shadow-lg">
                                    {total.jumlah.toLocaleString('id-ID')}
                                </span>
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

    return (
        <div className="space-y-6">
            <Card className="flex flex-col w-full bg-gradient-to-br from-navy-800 to-navy-900 border-navy-600">
                <CardHeader className="items-center pb-0 border-b border-navy-600/50">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-400" />
                        <CardTitle className="text-white text-center">
                            Peserta Didik Berdasarkan Gender {tahun} ({twLabel[triwulan]})
                        </CardTitle>
                    </div>
                    <p className="text-sm text-gray-400 text-center pb-5">
                        Perbandingan distribusi gender antara Pendidikan Tinggi dan Menengah
                    </p>
                </CardHeader>
                <CardContent className="flex-1 pb-0 pt-2">
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartData} margin={{ top: 20, right: 30, bottom: 5, left: 20 }}>
                            <defs>
                                <linearGradient id="gradient-laki" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.7} />
                                </linearGradient>
                                <linearGradient id="gradient-perempuan" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#ec4899" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#ec4899" stopOpacity={0.7} />
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
                            <Bar dataKey="Laki-laki" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                                <LabelList
                                    dataKey="Laki-laki"
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
                            <Bar dataKey="Perempuan" fill="#ec4899" radius={[8, 8, 0, 0]}>
                                <LabelList
                                    dataKey="Perempuan"
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
                            <User className="w-5 h-5 text-blue-400" />
                            Detail Distribusi Gender
                        </CardTitle>
                        <p className="text-sm text-gray-400 mt-1">
                            Sebaran peserta didik berdasarkan jenis kelamin per satuan pendidikan
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