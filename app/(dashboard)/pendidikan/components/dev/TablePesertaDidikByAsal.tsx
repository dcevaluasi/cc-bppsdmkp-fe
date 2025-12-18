'use client'
import React, { useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, Cell } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, GraduationCap, TrendingUp, School } from "lucide-react"

interface JalurMasukData {
    no: number
    jenis: 'Tinggi' | 'Menengah'
    satdik: string
    pelaku_utama: number | string
    mitra: number | string
    umum: number | string
    mandiri: number | string
    tugas_belajar: number | string
}

interface TotalData {
    pelaku_utama: number
    mitra: number
    umum: number
    mandiri: number
    tugas_belajar: number
    jumlah: number
}

interface ChartDataItem {
    name: string
    'Pelaku Utama': number
    'Mitra': number
    'Umum': number
    'Mandiri': number
    'Tugas Belajar': number
}

interface DataByTriwulan {
    tw1: JalurMasukData[]
    tw2: JalurMasukData[]
    tw3: JalurMasukData[]
}

const DATA: DataByTriwulan = {
    tw1: [
        { no: 1, jenis: 'Tinggi', satdik: 'Akademi Komunitas Kelautan dan Perikanan Wakatobi', pelaku_utama: 42, mitra: '', umum: '', mandiri: '', tugas_belajar: '' },
        { no: 2, jenis: 'Tinggi', satdik: 'Politeknik AUP', pelaku_utama: 2297, mitra: '', umum: 546, mandiri: '', tugas_belajar: 11 },
        { no: 3, jenis: 'Tinggi', satdik: 'Politeknik KP Bitung', pelaku_utama: 422, mitra: '', umum: 71, mandiri: '', tugas_belajar: '' },
        { no: 4, jenis: 'Tinggi', satdik: 'Politeknik KP Bone', pelaku_utama: 523, mitra: '', umum: 136, mandiri: '', tugas_belajar: '' },
        { no: 5, jenis: 'Tinggi', satdik: 'Politeknik KP Dumai', pelaku_utama: 232, mitra: '', umum: 45, mandiri: '', tugas_belajar: '' },
        { no: 6, jenis: 'Tinggi', satdik: 'Politeknik KP Jembrana', pelaku_utama: 284, mitra: '', umum: 79, mandiri: '', tugas_belajar: '' },
        { no: 7, jenis: 'Tinggi', satdik: 'Politeknik KP Karawang', pelaku_utama: 236, mitra: '', umum: 43, mandiri: '', tugas_belajar: '' },
        { no: 8, jenis: 'Tinggi', satdik: 'Politeknik KP Kupang', pelaku_utama: 448, mitra: '', umum: 76, mandiri: '', tugas_belajar: '' },
        { no: 9, jenis: 'Tinggi', satdik: 'Politeknik KP Pangandaran', pelaku_utama: 229, mitra: '', umum: 39, mandiri: '', tugas_belajar: '' },
        { no: 10, jenis: 'Tinggi', satdik: 'Politeknik KP Sidoarjo', pelaku_utama: 203, mitra: '', umum: 368, mandiri: 9, tugas_belajar: '' },
        { no: 11, jenis: 'Tinggi', satdik: 'Politeknik KP Sorong', pelaku_utama: 308, mitra: '', umum: 67, mandiri: '', tugas_belajar: '' },
        { no: 12, jenis: 'Menengah', satdik: 'SUPM Kota Agung', pelaku_utama: 59, mitra: '', umum: 35, mandiri: '', tugas_belajar: '' },
        { no: 13, jenis: 'Menengah', satdik: 'SUPM Ladong', pelaku_utama: 84, mitra: '', umum: 23, mandiri: '', tugas_belajar: '' },
        { no: 14, jenis: 'Menengah', satdik: 'SUPM Pariaman', pelaku_utama: 129, mitra: '', umum: 51, mandiri: '', tugas_belajar: '' },
        { no: 15, jenis: 'Menengah', satdik: 'SUPM Tegal', pelaku_utama: 161, mitra: '', umum: 56, mandiri: '', tugas_belajar: '' },
        { no: 16, jenis: 'Menengah', satdik: 'SUPM Waiheru', pelaku_utama: 131, mitra: '', umum: 48, mandiri: '', tugas_belajar: '' }
    ],
    tw2: [
        { no: 1, jenis: 'Tinggi', satdik: 'Akademi Komunitas Kelautan dan Perikanan Wakatobi', pelaku_utama: 42, mitra: '', umum: '', mandiri: '', tugas_belajar: '' },
        { no: 2, jenis: 'Tinggi', satdik: 'Politeknik AUP', pelaku_utama: 2289, mitra: '', umum: 544, mandiri: '', tugas_belajar: 11 },
        { no: 3, jenis: 'Tinggi', satdik: 'Politeknik KP Bitung', pelaku_utama: 415, mitra: '', umum: 67, mandiri: '', tugas_belajar: '' },
        { no: 4, jenis: 'Tinggi', satdik: 'Politeknik KP Bone', pelaku_utama: 523, mitra: '', umum: 136, mandiri: '', tugas_belajar: '' },
        { no: 5, jenis: 'Tinggi', satdik: 'Politeknik KP Dumai', pelaku_utama: 231, mitra: '', umum: 45, mandiri: '', tugas_belajar: '' },
        { no: 6, jenis: 'Tinggi', satdik: 'Politeknik KP Jembrana', pelaku_utama: 284, mitra: '', umum: 79, mandiri: '', tugas_belajar: '' },
        { no: 7, jenis: 'Tinggi', satdik: 'Politeknik KP Karawang', pelaku_utama: 236, mitra: '', umum: 43, mandiri: '', tugas_belajar: '' },
        { no: 8, jenis: 'Tinggi', satdik: 'Politeknik KP Kupang', pelaku_utama: 229, mitra: '', umum: 39, mandiri: '', tugas_belajar: '' },
        { no: 9, jenis: 'Tinggi', satdik: 'Politeknik KP Pangandaran', pelaku_utama: 203, mitra: '', umum: 368, mandiri: '', tugas_belajar: '' },
        { no: 10, jenis: 'Tinggi', satdik: 'Politeknik KP Sidoarjo', pelaku_utama: 448, mitra: '', umum: 76, mandiri: 9, tugas_belajar: '' },
        { no: 11, jenis: 'Tinggi', satdik: 'Politeknik KP Sorong', pelaku_utama: 307, mitra: '', umum: 67, mandiri: '', tugas_belajar: '' },
        { no: 12, jenis: 'Menengah', satdik: 'SUPM Kota Agung', pelaku_utama: 20, mitra: '', umum: '', mandiri: '', tugas_belajar: '' },
        { no: 13, jenis: 'Menengah', satdik: 'SUPM Ladong', pelaku_utama: 34, mitra: '', umum: '', mandiri: '', tugas_belajar: '' },
        { no: 14, jenis: 'Menengah', satdik: 'SUPM Pariaman', pelaku_utama: 59, mitra: '', umum: '', mandiri: '', tugas_belajar: '' },
        { no: 15, jenis: 'Menengah', satdik: 'SUPM Tegal', pelaku_utama: 73, mitra: '', umum: '', mandiri: '', tugas_belajar: '' },
        { no: 16, jenis: 'Menengah', satdik: 'SUPM Waiheru', pelaku_utama: 71, mitra: '', umum: 3, mandiri: '', tugas_belajar: '' }
    ],
    tw3: [
        { no: 1, jenis: 'Tinggi', satdik: 'Akademi Komunitas Kelautan dan Perikanan Wakatobi', pelaku_utama: 32, mitra: '', umum: '', mandiri: '', tugas_belajar: '' },
        { no: 2, jenis: 'Tinggi', satdik: 'Politeknik AUP', pelaku_utama: 2254, mitra: '', umum: 339, mandiri: '', tugas_belajar: 19 },
        { no: 3, jenis: 'Tinggi', satdik: 'Politeknik KP Bitung', pelaku_utama: 391, mitra: '', umum: 2, mandiri: '', tugas_belajar: '' },
        { no: 4, jenis: 'Tinggi', satdik: 'Politeknik KP Bone', pelaku_utama: 426, mitra: '', umum: 1, mandiri: '', tugas_belajar: '' },
        { no: 5, jenis: 'Tinggi', satdik: 'Politeknik KP Dumai', pelaku_utama: 251, mitra: '', umum: 2, mandiri: '', tugas_belajar: '' },
        { no: 6, jenis: 'Tinggi', satdik: 'Politeknik KP Jembrana', pelaku_utama: 270, mitra: '', umum: 4, mandiri: '', tugas_belajar: '' },
        { no: 7, jenis: 'Tinggi', satdik: 'Politeknik KP Karawang', pelaku_utama: 290, mitra: '', umum: 3, mandiri: '', tugas_belajar: '' },
        { no: 8, jenis: 'Tinggi', satdik: 'Politeknik KP Kupang', pelaku_utama: 364, mitra: '', umum: 1, mandiri: '', tugas_belajar: '' },
        { no: 9, jenis: 'Tinggi', satdik: 'Politeknik KP Pangandaran', pelaku_utama: 245, mitra: '', umum: '', mandiri: '', tugas_belajar: '' },
        { no: 10, jenis: 'Tinggi', satdik: 'Politeknik KP Sidoarjo', pelaku_utama: 149, mitra: '', umum: 499, mandiri: '', tugas_belajar: '' },
        { no: 11, jenis: 'Tinggi', satdik: 'Politeknik KP Sorong', pelaku_utama: 298, mitra: '', umum: 5, mandiri: '', tugas_belajar: '' },
        { no: 12, jenis: 'Menengah', satdik: 'SUPM Kota Agung', pelaku_utama: 77, mitra: '', umum: '', mandiri: '', tugas_belajar: '' },
        { no: 13, jenis: 'Menengah', satdik: 'SUPM Ladong', pelaku_utama: 94, mitra: '', umum: '', mandiri: '', tugas_belajar: '' },
        { no: 14, jenis: 'Menengah', satdik: 'SUPM Pariaman', pelaku_utama: 99, mitra: '', umum: '', mandiri: '', tugas_belajar: '' },
        { no: 15, jenis: 'Menengah', satdik: 'SUPM Tegal', pelaku_utama: 133, mitra: '', umum: '', mandiri: '', tugas_belajar: '' },
        { no: 16, jenis: 'Menengah', satdik: 'SUPM Waiheru', pelaku_utama: 149, mitra: '', umum: 3, mandiri: '', tugas_belajar: '' }
    ]
}

const toNumber = (val: number | string): number => {
    return typeof val === 'number' ? val : 0
}

const COLORS = {
    'Pelaku Utama': '#3b82f6',
    'Mitra': '#8b5cf6',
    'Umum': '#10b981',
    'Mandiri': '#f59e0b',
    'Tugas Belajar': '#ef4444'
}

export default function TablePesertaDidikByAsal({
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

        const tinggiTotal: TotalData = tinggiData.reduce((acc, item) => {
            const pelaku = toNumber(item.pelaku_utama)
            const mitra = toNumber(item.mitra)
            const umum = toNumber(item.umum)
            const mandiri = toNumber(item.mandiri)
            const tugas = toNumber(item.tugas_belajar)
            return {
                pelaku_utama: acc.pelaku_utama + pelaku,
                mitra: acc.mitra + mitra,
                umum: acc.umum + umum,
                mandiri: acc.mandiri + mandiri,
                tugas_belajar: acc.tugas_belajar + tugas,
                jumlah: acc.jumlah + pelaku + mitra + umum + mandiri + tugas
            }
        }, { pelaku_utama: 0, mitra: 0, umum: 0, mandiri: 0, tugas_belajar: 0, jumlah: 0 })

        const menengahTotal: TotalData = menengahData.reduce((acc, item) => {
            const pelaku = toNumber(item.pelaku_utama)
            const mitra = toNumber(item.mitra)
            const umum = toNumber(item.umum)
            const mandiri = toNumber(item.mandiri)
            const tugas = toNumber(item.tugas_belajar)
            return {
                pelaku_utama: acc.pelaku_utama + pelaku,
                mitra: acc.mitra + mitra,
                umum: acc.umum + umum,
                mandiri: acc.mandiri + mandiri,
                tugas_belajar: acc.tugas_belajar + tugas,
                jumlah: acc.jumlah + pelaku + mitra + umum + mandiri + tugas
            }
        }, { pelaku_utama: 0, mitra: 0, umum: 0, mandiri: 0, tugas_belajar: 0, jumlah: 0 })

        const chartData: ChartDataItem[] = [
            {
                name: 'Pendidikan Tinggi',
                'Pelaku Utama': tinggiTotal.pelaku_utama,
                'Mitra': tinggiTotal.mitra,
                'Umum': tinggiTotal.umum,
                'Mandiri': tinggiTotal.mandiri,
                'Tugas Belajar': tinggiTotal.tugas_belajar
            },
            {
                name: 'Pendidikan Menengah',
                'Pelaku Utama': menengahTotal.pelaku_utama,
                'Mitra': menengahTotal.mitra,
                'Umum': menengahTotal.umum,
                'Mandiri': menengahTotal.mandiri,
                'Tugas Belajar': menengahTotal.tugas_belajar
            }
        ]

        return {
            tinggi: { data: tinggiData, total: tinggiTotal },
            menengah: { data: menengahData, total: menengahTotal },
            chartData
        }
    }, [triwulan])

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const total = payload.reduce((sum: number, item: any) => sum + item.value, 0)

            return (
                <div className="p-3 bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-blue-500/50 rounded-lg shadow-xl backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <GraduationCap className="w-4 h-4 text-blue-400" />
                        <strong className="text-sm text-white font-semibold">{label}</strong>
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
                        <div className="flex justify-between gap-4 pt-2 mt-2 border-t border-gray-700">
                            <span className="font-semibold text-gray-200">Total:</span>
                            <span className="font-bold text-gray-400">{total.toLocaleString('id-ID')}</span>
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

    const renderTable = (data: JalurMasukData[], total: TotalData, jenis: string) => {
        return (
            <div className="overflow-x-auto rounded-lg border-2 border-navy-600/50 shadow-xl">
                <table className="min-w-full divide-y divide-navy-600 bg-navy-700/50 text-xs text-gray-200">
                    <thead className="bg-gradient-to-r from-navy-800 to-navy-900">
                        <tr>
                            <th className="px-3 py-4 text-center font-semibold text-gray-200 border-r border-navy-600">
                                #
                            </th>
                            <th className="px-4 py-4 text-left font-semibold text-gray-200 min-w-[250px] border-r border-navy-600">
                                <div className="flex items-center gap-2">
                                    <School className="w-3 h-3 text-blue-400" />
                                    Satuan Pendidikan
                                </div>
                            </th>
                            <th className="px-4 py-4 text-right font-semibold text-gray-200 min-w-[110px] border-l border-navy-600/30"
                                style={{ background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))' }}>
                                <div className="flex items-center justify-end gap-1">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    Pelaku Utama
                                </div>
                            </th>
                            <th className="px-4 py-4 text-right font-semibold text-gray-200 min-w-[100px] border-l border-navy-600/30"
                                style={{ background: 'linear-gradient(to bottom, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05))' }}>
                                <div className="flex items-center justify-end gap-1">
                                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                    Mitra
                                </div>
                            </th>
                            <th className="px-4 py-4 text-right font-semibold text-gray-200 min-w-[100px] border-l border-navy-600/30"
                                style={{ background: 'linear-gradient(to bottom, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))' }}>
                                <div className="flex items-center justify-end gap-1">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    Umum
                                </div>
                            </th>
                            <th className="px-4 py-4 text-right font-semibold text-gray-200 min-w-[100px] border-l border-navy-600/30"
                                style={{ background: 'linear-gradient(to bottom, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))' }}>
                                <div className="flex items-center justify-end gap-1">
                                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                    Mandiri
                                </div>
                            </th>
                            <th className="px-4 py-4 text-right font-semibold text-gray-200 min-w-[110px] border-l border-navy-600/30"
                                style={{ background: 'linear-gradient(to bottom, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))' }}>
                                <div className="flex items-center justify-end gap-1">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    Tugas Belajar
                                </div>
                            </th>
                            <th className="px-4 py-4 text-right font-bold text-gray-200 bg-navy-900 border-l-2 border-teal-500/50">
                                <div className="flex items-center justify-end gap-1">
                                    <TrendingUp className="w-3 h-3 text-teal-400" />
                                    Total
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-600/50">
                        {data.map((item, rowIndex) => {
                            const pelaku = toNumber(item.pelaku_utama)
                            const mitra = toNumber(item.mitra)
                            const umum = toNumber(item.umum)
                            const mandiri = toNumber(item.mandiri)
                            const tugas = toNumber(item.tugas_belajar)
                            const jumlah = pelaku + mitra + umum + mandiri + tugas

                            return (
                                <tr
                                    key={item.no}
                                    className="hover:bg-navy-600/50 transition-all duration-200 group"
                                    style={{
                                        background: rowIndex % 2 === 0 ? 'rgba(30, 41, 59, 0.3)' : 'rgba(15, 23, 42, 0.3)'
                                    }}
                                >
                                    <td className="px-3 py-3 text-center text-gray-300 border-r border-navy-600">
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">
                                            {item.no}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-200 font-medium border-r border-navy-600">
                                        {item.satdik}
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-300 border-l border-navy-600/20">
                                        {pelaku > 0 ? (
                                            <span className="inline-block px-2 py-1 rounded bg-blue-500/10 text-blue-300 font-medium">
                                                {pelaku.toLocaleString('id-ID')}
                                            </span>
                                        ) : (
                                            <span className="text-gray-600">-</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-300 border-l border-navy-600/20">
                                        {mitra > 0 ? (
                                            <span className="inline-block px-2 py-1 rounded bg-purple-500/10 text-purple-300 font-medium">
                                                {mitra.toLocaleString('id-ID')}
                                            </span>
                                        ) : (
                                            <span className="text-gray-600">-</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-300 border-l border-navy-600/20">
                                        {umum > 0 ? (
                                            <span className="inline-block px-2 py-1 rounded bg-green-500/10 text-green-300 font-medium">
                                                {umum.toLocaleString('id-ID')}
                                            </span>
                                        ) : (
                                            <span className="text-gray-600">-</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-300 border-l border-navy-600/20">
                                        {mandiri > 0 ? (
                                            <span className="inline-block px-2 py-1 rounded bg-orange-500/10 text-orange-300 font-medium">
                                                {mandiri.toLocaleString('id-ID')}
                                            </span>
                                        ) : (
                                            <span className="text-gray-600">-</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-300 border-l border-navy-600/20">
                                        {tugas > 0 ? (
                                            <span className="inline-block px-2 py-1 rounded bg-red-500/10 text-red-300 font-medium">
                                                {tugas.toLocaleString('id-ID')}
                                            </span>
                                        ) : (
                                            <span className="text-gray-600">-</span>
                                        )}
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
                                    TOTAL {jenis}
                                </div>
                            </td>
                            <td className="px-4 py-4 text-right text-blue-300 border-l border-navy-600/30">
                                {total.pelaku_utama > 0 ? (
                                    <span className="inline-block px-2 py-1 rounded bg-blue-500/20 font-bold">
                                        {total.pelaku_utama.toLocaleString('id-ID')}
                                    </span>
                                ) : '-'}
                            </td>
                            <td className="px-4 py-4 text-right text-purple-300 border-l border-navy-600/30">
                                {total.mitra > 0 ? (
                                    <span className="inline-block px-2 py-1 rounded bg-purple-500/20 font-bold">
                                        {total.mitra.toLocaleString('id-ID')}
                                    </span>
                                ) : '-'}
                            </td>
                            <td className="px-4 py-4 text-right text-green-300 border-l border-navy-600/30">
                                {total.umum > 0 ? (
                                    <span className="inline-block px-2 py-1 rounded bg-green-500/20 font-bold">
                                        {total.umum.toLocaleString('id-ID')}
                                    </span>
                                ) : '-'}
                            </td>
                            <td className="px-4 py-4 text-right text-orange-300 border-l border-navy-600/30">
                                {total.mandiri > 0 ? (
                                    <span className="inline-block px-2 py-1 rounded bg-orange-500/20 font-bold">
                                        {total.mandiri.toLocaleString('id-ID')}
                                    </span>
                                ) : '-'}
                            </td>
                            <td className="px-4 py-4 text-right text-red-300 border-l border-navy-600/30">
                                {total.tugas_belajar > 0 ? (
                                    <span className="inline-block px-2 py-1 rounded bg-red-500/20 font-bold">
                                        {total.tugas_belajar.toLocaleString('id-ID')}
                                    </span>
                                ) : '-'}
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
                <CardHeader className="items-center border-b border-navy-600/50">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-400" />
                        <CardTitle className="text-white text-center">
                            Peserta Didik Berdasarkan Jalur Masuk {tahun} ({twLabel[triwulan]})
                        </CardTitle>
                    </div>
                    <p className="text-sm text-gray-400 text-center mb-2">
                        Perbandingan jalur masuk antara Pendidikan Tinggi dan Menengah
                    </p>
                </CardHeader>
                <CardContent className="flex-1 pb-0 pt-2">
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <defs>
                                {Object.entries(COLORS).map(([key, color]) => (
                                    <linearGradient key={key} id={`gradient-${key.replace(/\s/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={color} stopOpacity={1} />
                                        <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                                    </linearGradient>
                                ))}
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
                            <Bar dataKey="Pelaku Utama" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                                <LabelList
                                    dataKey="Pelaku Utama"
                                    position="top"
                                    offset={5}
                                    formatter={(value: number) => value > 0 ? value.toLocaleString('id-ID') : ''}
                                    style={{ fill: '#E5E7EB', fontSize: 10, fontWeight: 'bold', color: '#fff', textShadow: '#fff' }}
                                />
                            </Bar>
                            <Bar dataKey="Mitra" fill="#8b5cf6" radius={[8, 8, 0, 0]}>
                                <LabelList
                                    dataKey="Mitra"
                                    position="top"
                                    offset={5}
                                    formatter={(value: number) => value > 0 ? value.toLocaleString('id-ID') : ''}
                                    style={{ fill: '#E5E7EB', fontSize: 10, fontWeight: 'bold', color: '#fff', textShadow: '#fff' }}
                                />
                            </Bar>
                            <Bar dataKey="Umum" fill="#10b981" radius={[8, 8, 0, 0]}>
                                <LabelList
                                    dataKey="Umum"
                                    position="top"
                                    offset={5}
                                    formatter={(value: number) => value > 0 ? value.toLocaleString('id-ID') : ''}
                                    style={{ fill: '#E5E7EB', fontSize: 10, fontWeight: 'bold', color: '#fff', textShadow: '#fff' }}
                                />
                            </Bar>
                            <Bar dataKey="Mandiri" fill="#f59e0b" radius={[8, 8, 0, 0]}>
                                <LabelList
                                    dataKey="Mandiri"
                                    position="top"
                                    offset={5}
                                    formatter={(value: number) => value > 0 ? value.toLocaleString('id-ID') : ''}
                                    style={{ fill: '#E5E7EB', fontSize: 10, fontWeight: 'bold', color: '#fff', textShadow: '#fff' }}
                                />
                            </Bar>
                            <Bar dataKey="Tugas Belajar" fill="#ef4444" radius={[8, 8, 0, 0]}>
                                <LabelList
                                    dataKey="Tugas Belajar"
                                    position="top"
                                    offset={5}
                                    formatter={(value: number) => value > 0 ? value.toLocaleString('id-ID') : ''}
                                    style={{ fill: '#E5E7EB', fontSize: 10, fontWeight: 'bold', color: '#fff', textShadow: '#fff' }}
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
                            <GraduationCap className="w-5 h-5 text-blue-400" />
                            Detail Jalur Masuk Per Satuan Pendidikan
                        </CardTitle>
                        <p className="text-sm text-gray-400 mt-1">
                            Distribusi peserta didik berdasarkan jalur masuk atau asal/usul
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
                        ? renderTable(tinggi.data, tinggi.total, 'Pendidikan Tinggi')
                        : renderTable(menengah.data, menengah.total, 'Pendidikan Menengah')
                    }
                </CardContent>
            </Card>
        </div>
    )
}