'use client'
import React, { useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { School, TrendingUp, Users } from 'lucide-react'

interface PesertaDidikData {
    no: number
    jenis: 'Tinggi' | 'Menengah'
    satdik: string
    tw1_aktif: number
    tw1_tunda: number
    tw2_aktif: number
    tw2_tunda: number
    tw3_aktif: number
    tw3_tunda: number
}

interface TotalData {
    aktif: number
    tunda: number
    jumlah: number
}

interface ChartDataItem {
    name: string
    Aktif: number
    Tunda: number
}

interface TablePesertaDidikBySatdikProps {
    loading?: boolean
    tahun?: string
    triwulan?: 'tw1' | 'tw2' | 'tw3'
}

export const PESERTA_DIDIK_BY_SATDIK: PesertaDidikData[] = [
    { no: 1, jenis: 'Tinggi', satdik: 'Politeknik AUP', tw1_aktif: 2854, tw1_tunda: 0, tw2_aktif: 2832, tw2_tunda: 12, tw3_aktif: 2586, tw3_tunda: 26 },
    { no: 2, jenis: 'Tinggi', satdik: 'Politeknik KP Sidoarjo', tw1_aktif: 580, tw1_tunda: 0, tw2_aktif: 574, tw2_tunda: 6, tw3_aktif: 639, tw3_tunda: 9 },
    { no: 3, jenis: 'Tinggi', satdik: 'Politeknik KP Bitung', tw1_aktif: 493, tw1_tunda: 0, tw2_aktif: 477, tw2_tunda: 5, tw3_aktif: 383, tw3_tunda: 10 },
    { no: 4, jenis: 'Tinggi', satdik: 'Politeknik KP Sorong', tw1_aktif: 375, tw1_tunda: 0, tw2_aktif: 350, tw2_tunda: 24, tw3_aktif: 255, tw3_tunda: 48 },
    { no: 5, jenis: 'Tinggi', satdik: 'Politeknik KP Karawang', tw1_aktif: 279, tw1_tunda: 0, tw2_aktif: 274, tw2_tunda: 5, tw3_aktif: 291, tw3_tunda: 2 },
    { no: 6, jenis: 'Tinggi', satdik: 'Politeknik KP Bone', tw1_aktif: 659, tw1_tunda: 0, tw2_aktif: 657, tw2_tunda: 4, tw3_aktif: 425, tw3_tunda: 2 },
    { no: 7, jenis: 'Tinggi', satdik: 'Politeknik KP Kupang', tw1_aktif: 524, tw1_tunda: 0, tw2_aktif: 520, tw2_tunda: 2, tw3_aktif: 361, tw3_tunda: 4 },
    { no: 8, jenis: 'Tinggi', satdik: 'Politeknik KP Dumai', tw1_aktif: 277, tw1_tunda: 0, tw2_aktif: 274, tw2_tunda: 0, tw3_aktif: 253, tw3_tunda: 0 },
    { no: 9, jenis: 'Tinggi', satdik: 'Politeknik KP Pangandaran', tw1_aktif: 268, tw1_tunda: 0, tw2_aktif: 266, tw2_tunda: 2, tw3_aktif: 243, tw3_tunda: 2 },
    { no: 10, jenis: 'Tinggi', satdik: 'Politeknik KP Jembrana', tw1_aktif: 363, tw1_tunda: 0, tw2_aktif: 363, tw2_tunda: 2, tw3_aktif: 274, tw3_tunda: 0 },
    { no: 14, jenis: 'Tinggi', satdik: 'Akademi Komunitas Kelautan dan Perikanan Wakatobi', tw1_aktif: 42, tw1_tunda: 0, tw2_aktif: 41, tw2_tunda: 1, tw3_aktif: 31, tw3_tunda: 1 },
    { no: 19, jenis: 'Menengah', satdik: 'Sekolah Usaha Perikanan Menengah (SUPM) Ladong', tw1_aktif: 107, tw1_tunda: 0, tw2_aktif: 34, tw2_tunda: 0, tw3_aktif: 94, tw3_tunda: 0 },
    { no: 20, jenis: 'Menengah', satdik: 'Sekolah Usaha Perikanan Menengah (SUPM) Pariaman', tw1_aktif: 180, tw1_tunda: 0, tw2_aktif: 59, tw2_tunda: 0, tw3_aktif: 99, tw3_tunda: 0 },
    { no: 17, jenis: 'Menengah', satdik: 'Sekolah Usaha Perikanan Menengah (SUPM) Kota Agung', tw1_aktif: 94, tw1_tunda: 0, tw2_aktif: 20, tw2_tunda: 0, tw3_aktif: 77, tw3_tunda: 0 },
    { no: 23, jenis: 'Menengah', satdik: 'Sekolah Usaha Perikanan Menengah (SUPM) Tegal', tw1_aktif: 217, tw1_tunda: 0, tw2_aktif: 73, tw2_tunda: 0, tw3_aktif: 133, tw3_tunda: 0 },
    { no: 24, jenis: 'Menengah', satdik: 'Sekolah Usaha Perikanan Menengah (SUPM) Waiheru', tw1_aktif: 179, tw1_tunda: 0, tw2_aktif: 74, tw2_tunda: 0, tw3_aktif: 146, tw3_tunda: 6 },
]

export default function TablePesertaDidikBySatdik({
    loading = false,
    tahun = '2024',
    triwulan = 'tw1'
}: TablePesertaDidikBySatdikProps) {
    const [selectedJenis, setSelectedJenis] = useState<'Tinggi' | 'Menengah'>('Tinggi')

    const twLabel: Record<'tw1' | 'tw2' | 'tw3', string> = {
        tw1: 'TW I',
        tw2: 'TW II',
        tw3: 'TW III'
    }

    const { tinggi, menengah, chartData } = useMemo(() => {
        const tinggiData = PESERTA_DIDIK_BY_SATDIK.filter(d => d.jenis === 'Tinggi')
        const menengahData = PESERTA_DIDIK_BY_SATDIK.filter(d => d.jenis === 'Menengah')

        const tinggiTotal: TotalData = tinggiData.reduce((acc, item) => {
            const aktif = (item as any)[`${triwulan}_aktif`] || 0
            const tunda = (item as any)[`${triwulan}_tunda`] || 0
            return {
                aktif: acc.aktif + aktif,
                tunda: acc.tunda + tunda,
                jumlah: acc.jumlah + aktif + tunda
            }
        }, { aktif: 0, tunda: 0, jumlah: 0 })

        const menengahTotal: TotalData = menengahData.reduce((acc, item) => {
            const aktif = (item as any)[`${triwulan}_aktif`] || 0
            const tunda = (item as any)[`${triwulan}_tunda`] || 0
            return {
                aktif: acc.aktif + aktif,
                tunda: acc.tunda + tunda,
                jumlah: acc.jumlah + aktif + tunda
            }
        }, { aktif: 0, tunda: 0, jumlah: 0 })

        const chartData: ChartDataItem[] = [
            { name: 'Pendidikan Tinggi', Aktif: tinggiTotal.aktif, Tunda: tinggiTotal.tunda },
            { name: 'Pendidikan Menengah', Aktif: menengahTotal.aktif, Tunda: menengahTotal.tunda }
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
            const aktifPersen = ((payload[0].value / total) * 100).toFixed(1)
            const tundaPersen = ((payload[1].value / total) * 100).toFixed(1)

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
                                Aktif:
                            </span>
                            <span className="font-bold text-blue-400">{payload[0].value.toLocaleString('id-ID')} ({aktifPersen}%)</span>
                        </div>
                        <div className="flex justify-between gap-4 text-gray-300">
                            <span className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                                Tunda:
                            </span>
                            <span className="font-bold text-pink-400">{payload[1].value.toLocaleString('id-ID')} ({tundaPersen}%)</span>
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


    const renderTable = (data: PesertaDidikData[], total: TotalData) => {
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
                                    Aktif
                                </div>
                            </th>
                            <th className="px-4 py-4 text-right font-semibold text-gray-200 min-w-[120px] border-l border-navy-600/30"
                                style={{ background: 'linear-gradient(to bottom, rgba(236, 72, 153, 0.15), rgba(236, 72, 153, 0.05))' }}>
                                <div className="flex items-center justify-end gap-2">
                                    <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                                    Tunda
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
                            const jumlah = item[`${triwulan}_aktif`] + item[`${triwulan}_tunda`]

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
                                            {rowIndex + 1}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-200 font-medium border-r border-navy-600">
                                        {item.satdik}
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-300 border-l border-navy-600/20">
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="inline-block px-3 py-1 rounded bg-blue-500/10 text-blue-300 font-medium">
                                                {item[`${triwulan}_aktif`].toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-300 border-l border-navy-600/20">
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="inline-block px-3 py-1 rounded bg-red-500/10 text-red-500 font-medium">
                                                {item[`${triwulan}_tunda`].toLocaleString('id-ID')}
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
                                    {total.aktif.toLocaleString('id-ID')}
                                </span>
                            </td>
                            <td className="px-4 py-4 text-right text-red-300 border-l border-navy-600/30">
                                <span className="inline-block px-3 py-1 rounded bg-red-500/20 font-bold">
                                    {total.tunda.toLocaleString('id-ID')}
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
            <Card className="flex flex-col w-full">
                <CardHeader className="items-center pb-0 border-b border-navy-600/50">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-400" />
                        <CardTitle className="text-white text-center">
                            Peserta Didik Berdasarkan Satdik {tahun} - {twLabel[triwulan]}
                        </CardTitle>
                    </div>
                    <p className="text-sm text-gray-400 text-center pb-5">
                        Perbandingan distribusi status antara Pendidikan Tinggi dan Menengah
                    </p>
                </CardHeader>

                <CardContent className="flex-1 pb-0 pt-2">
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartData} margin={{ top: 20, right: 10, bottom: 70, left: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip content={<CustomTooltip />} cursor={<CustomBarCursor />} />
                            <Legend verticalAlign="top" height={36} iconType="rect" />
                            <YAxis type="number" />
                            <XAxis
                                type="category"
                                dataKey="name"
                                tickLine={false}
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                                tick={(props) => {
                                    const { x, y, payload } = props
                                    return (
                                        <text
                                            x={x}
                                            y={y}
                                            dy={16}
                                            textAnchor="end"
                                            transform={`rotate(-45, ${x}, ${y})`}
                                            fill="#888"
                                            fontSize={12}
                                        >
                                            {payload.value}
                                        </text>
                                    )
                                }}
                            />
                            <Bar dataKey="Aktif" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                                <LabelList
                                    dataKey="Aktif"
                                    position="top"
                                    offset={10}
                                    formatter={(value: number) => value.toLocaleString('id-ID')}
                                    style={{ fill: '#fff', fontSize: 12 }}
                                />
                            </Bar>
                            <Bar dataKey="Tunda" fill="#ef4444" radius={[8, 8, 0, 0]}>
                                <LabelList
                                    dataKey="Tunda"
                                    position="top"
                                    offset={10}
                                    formatter={(value: number) => value.toLocaleString('id-ID')}
                                    style={{ fill: '#fff', fontSize: 12 }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="flex flex-col w-full">
                <CardHeader className="pb-4 flex items-center justify-between flex-row w-full">
                    <CardTitle className="text-white">Berdasarkan Satuan Pendidikan</CardTitle>
                    <div className="w-40">
                        <Select value={selectedJenis} onValueChange={(val) => setSelectedJenis(val as 'Tinggi' | 'Menengah')}>
                            <SelectTrigger className="w-full text-gray-300">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Tinggi" className="text-gray-300">Pendidikan Tinggi</SelectItem>
                                <SelectItem value="Menengah" className="text-gray-300">Pendidikan Menengah</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    {selectedJenis === 'Tinggi'
                        ? renderTable(tinggi.data, tinggi.total)
                        : renderTable(menengah.data, menengah.total)
                    }
                </CardContent>
            </Card>
        </div>
    )
}