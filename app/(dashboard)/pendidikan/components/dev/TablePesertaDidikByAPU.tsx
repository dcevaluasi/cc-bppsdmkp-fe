'use client'
import React, { useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface AnakPelakuUtamaData {
    no: number
    jenis: 'Tinggi' | 'Menengah'
    satdik: string
    anak_pelaku_utama: number
}

interface DataByTriwulan {
    tw1: AnakPelakuUtamaData[]
    tw2: AnakPelakuUtamaData[]
    tw3: AnakPelakuUtamaData[]
}

const DATA: DataByTriwulan = {
    tw1: [
        { no: 1, jenis: 'Tinggi', satdik: 'Politeknik AUP', anak_pelaku_utama: 815 },
        { no: 2, jenis: 'Tinggi', satdik: 'Politeknik KP Bitung', anak_pelaku_utama: 149 },
        { no: 3, jenis: 'Tinggi', satdik: 'Politeknik KP Bone', anak_pelaku_utama: 155 },
        { no: 4, jenis: 'Tinggi', satdik: 'Politeknik KP Dumai', anak_pelaku_utama: 90 },
        { no: 5, jenis: 'Tinggi', satdik: 'Politeknik KP Jembrana', anak_pelaku_utama: 98 },
        { no: 6, jenis: 'Tinggi', satdik: 'Politeknik KP Karawang', anak_pelaku_utama: 88 },
        { no: 7, jenis: 'Tinggi', satdik: 'Politeknik KP Kupang', anak_pelaku_utama: 136 },
        { no: 8, jenis: 'Tinggi', satdik: 'Politeknik KP Pangandaran', anak_pelaku_utama: 87 },
        { no: 9, jenis: 'Tinggi', satdik: 'Politeknik KP Sidoarjo', anak_pelaku_utama: 44 },
        { no: 10, jenis: 'Tinggi', satdik: 'Politeknik KP Sorong', anak_pelaku_utama: 119 },
        { no: 11, jenis: 'Tinggi', satdik: 'Akademi Komunitas Wakatobi', anak_pelaku_utama: 42 },
        { no: 12, jenis: 'Menengah', satdik: 'SUPM Kotaagung', anak_pelaku_utama: 21 },
        { no: 13, jenis: 'Menengah', satdik: 'SUPM Ladong', anak_pelaku_utama: 34 },
        { no: 14, jenis: 'Menengah', satdik: 'SUPM Pariaman', anak_pelaku_utama: 59 },
        { no: 15, jenis: 'Menengah', satdik: 'SUPM Tegal', anak_pelaku_utama: 73 },
        { no: 16, jenis: 'Menengah', satdik: 'SUPM Waeheru', anak_pelaku_utama: 72 }
    ],
    tw2: [],
    tw3: [
        { no: 1, jenis: 'Tinggi', satdik: 'Politeknik AUP', anak_pelaku_utama: 287 },
        { no: 2, jenis: 'Tinggi', satdik: 'Politeknik KP Bitung', anak_pelaku_utama: 80 },
        { no: 3, jenis: 'Tinggi', satdik: 'Politeknik KP Sidoarjo', anak_pelaku_utama: 49 },
        { no: 4, jenis: 'Tinggi', satdik: 'Politeknik KP Sorong', anak_pelaku_utama: 70 },
        { no: 5, jenis: 'Tinggi', satdik: 'Politeknik KP Karawang', anak_pelaku_utama: 107 },
        { no: 6, jenis: 'Tinggi', satdik: 'Politeknik KP Bone', anak_pelaku_utama: 76 },
        { no: 7, jenis: 'Tinggi', satdik: 'Politeknik KP Kupang', anak_pelaku_utama: 69 },
        { no: 8, jenis: 'Tinggi', satdik: 'Politeknik KP Jembrana', anak_pelaku_utama: 80 },
        { no: 9, jenis: 'Tinggi', satdik: 'Politeknik KP Pangandaran', anak_pelaku_utama: 67 },
        { no: 10, jenis: 'Tinggi', satdik: 'Politeknik KP Dumai', anak_pelaku_utama: 76 },
        { no: 11, jenis: 'Tinggi', satdik: 'Akademi Komunitas KP Wakatobi', anak_pelaku_utama: 31 },
        { no: 12, jenis: 'Menengah', satdik: 'SUPM Ladong', anak_pelaku_utama: 60 },
        { no: 13, jenis: 'Menengah', satdik: 'SUPM Pariaman', anak_pelaku_utama: 40 },
        { no: 14, jenis: 'Menengah', satdik: 'SUPM Kota Agung', anak_pelaku_utama: 59 },
        { no: 15, jenis: 'Menengah', satdik: 'SUPM Tegal', anak_pelaku_utama: 60 },
        { no: 16, jenis: 'Menengah', satdik: 'SUPM Waiheru', anak_pelaku_utama: 80 }
    ]
}

const CardComponent = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-navy-800 rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
        </div>
        {children}
    </div>
)

export default function TablePesertaDidikByAPU({
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

        if (currentData.length === 0) {
            return {
                tinggi: { data: [], total: 0 },
                menengah: { data: [], total: 0 },
                chartData: []
            }
        }

        const tinggiData = currentData.filter(d => d.jenis === 'Tinggi')
        const menengahData = currentData.filter(d => d.jenis === 'Menengah')

        const tinggiTotal = tinggiData.reduce((acc, item) => acc + item.anak_pelaku_utama, 0)
        const menengahTotal = menengahData.reduce((acc, item) => acc + item.anak_pelaku_utama, 0)

        const chartData = [
            { name: 'Pendidikan Tinggi', 'Anak Pelaku Utama': tinggiTotal },
            { name: 'Pendidikan Menengah', 'Anak Pelaku Utama': menengahTotal }
        ]

        return {
            tinggi: { data: tinggiData, total: tinggiTotal },
            menengah: { data: menengahData, total: menengahTotal },
            chartData
        }
    }, [triwulan])

    const renderTable = (data: AnakPelakuUtamaData[], total: number, jenis: string) => {
        if (data.length === 0) {
            return (
                <div className="p-6 text-center text-gray-400">
                    Data tidak tersedia untuk periode ini
                </div>
            )
        }

        return (
            <div className="overflow-x-auto rounded-lg p-5">
                <table className="w-full text-sm text-gray-200 border border-gray-700 bg-navy-700">
                    <thead className="bg-navy-800 text-gray-100 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-2 border text-center">No</th>
                            <th className="px-4 py-2 border">Satuan Pendidikan</th>
                            <th className="px-4 py-2 border text-right">Anak Pelaku Utama</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.no} className="border-t border-gray-700 hover:bg-navy-600">
                                <td className="px-4 py-2 border text-center">{item.no}</td>
                                <td className="px-4 py-2 border">{item.satdik}</td>
                                <td className="px-4 py-2 border text-right">
                                    {item.anak_pelaku_utama.toLocaleString('id-ID')}
                                </td>
                            </tr>
                        ))}
                        <tr className="bg-navy-800 font-bold">
                            <td colSpan={2} className="px-4 py-2 border text-right">Total {jenis}</td>
                            <td className="px-4 py-2 border text-right">
                                {total.toLocaleString('id-ID')}
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

    const hasData = DATA[triwulan].length > 0

    return (
        <div className="space-y-6 p-6 bg-navy-900 min-h-screen">
            <CardComponent title={`Data Peserta Didik Anak Pelaku Utama ${tahun} - ${twLabel[triwulan]}`}>
                {hasData ? (
                    <div className="p-5">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #374151', color: '#fff' }}
                                    formatter={(value: number) => value.toLocaleString('id-ID')}
                                />
                                <Legend />
                                <Bar dataKey="Anak Pelaku Utama" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="p-6 text-center text-gray-400">
                        Data tidak tersedia untuk periode ini
                    </div>
                )}
            </CardComponent>

            <div className="bg-navy-800 rounded-lg shadow-lg">
                <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-100">Berdasarkan Anak Pelaku Utama (APU)</h3>
                    <select
                        value={selectedJenis}
                        onChange={(e) => setSelectedJenis(e.target.value as 'Tinggi' | 'Menengah')}
                        className="px-4 py-2 bg-navy-700 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                        <option value="Tinggi">Pendidikan Tinggi</option>
                        <option value="Menengah">Pendidikan Menengah</option>
                    </select>
                </div>
                {selectedJenis === 'Tinggi'
                    ? renderTable(tinggi.data, tinggi.total, 'Pendidikan Tinggi')
                    : renderTable(menengah.data, menengah.total, 'Pendidikan Menengah')
                }
            </div>
        </div>
    )
}