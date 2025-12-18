'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type SatdikTablesProps = {
    data: {
        name: string
        pesertaDidik: number
        alumni: number
        pendidik: number
        tenagaPendidik: number
    }[]
    anggaranData?: { label: string; desktop: number }[]
    pendapatanData?: { label: string; desktop: number; mobile?: number }[]
}

const ITEMS_PER_PAGE = 10

export function SatdikTables({ data, anggaranData = [], pendapatanData = [] }: SatdikTablesProps) {
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [filterJenjang, setFilterJenjang] = useState<'Semua' | 'Tinggi' | 'Menengah'>('Semua')
    const [activeTab, setActiveTab] = useState<'sdm' | 'anggaran' | 'pnbp'>('sdm')

    const normalizeName = (name: string) => {
        return name
            .replace(/Sekolah Usaha Perikanan Menengah \(SUPM\)/gi, 'SUPM')
            .replace(/Politeknik/gi, 'Poltek')
    }

    const getJenjang = (name: string): 'Tinggi' | 'Menengah' => {
        if (name.match(/Politeknik|Akademi/gi)) return 'Tinggi'
        if (name.match(/Sekolah|SUPM/gi)) return 'Menengah'
        return 'Tinggi'
    }

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            const matchSearch = normalizeName(item.name).toLowerCase().includes(search.toLowerCase())
            const matchJenjang = filterJenjang === 'Semua' || getJenjang(item.name) === filterJenjang
            return matchSearch && matchJenjang
        })
    }, [data, search, filterJenjang])

    const filteredAnggaranData = useMemo(() => {
        return anggaranData.filter((item) => {
            const matchSearch = normalizeName(item.label).toLowerCase().includes(search.toLowerCase())
            const matchJenjang = filterJenjang === 'Semua' || getJenjang(item.label) === filterJenjang
            return matchSearch && matchJenjang
        })
    }, [anggaranData, search, filterJenjang])

    const filteredPendapatanData = useMemo(() => {
        return pendapatanData.filter((item) => {
            const matchSearch = normalizeName(item.label).toLowerCase().includes(search.toLowerCase())
            const matchJenjang = filterJenjang === 'Semua' || getJenjang(item.label) === filterJenjang
            return matchSearch && matchJenjang
        })
    }, [pendapatanData, search, filterJenjang])

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE
        if (activeTab === 'sdm') {
            return filteredData.slice(start, start + ITEMS_PER_PAGE)
        } else if (activeTab === 'anggaran') {
            return filteredAnggaranData.slice(start, start + ITEMS_PER_PAGE)
        } else {
            return filteredPendapatanData.slice(start, start + ITEMS_PER_PAGE)
        }
    }, [filteredData, filteredAnggaranData, filteredPendapatanData, currentPage, activeTab])

    const totalPages = useMemo(() => {
        if (activeTab === 'sdm') {
            return Math.ceil(filteredData.length / ITEMS_PER_PAGE)
        } else if (activeTab === 'anggaran') {
            return Math.ceil(filteredAnggaranData.length / ITEMS_PER_PAGE)
        } else {
            return Math.ceil(filteredPendapatanData.length / ITEMS_PER_PAGE)
        }
    }, [filteredData, filteredAnggaranData, filteredPendapatanData, activeTab])

    const totals = useMemo(() => {
        return filteredData.reduce(
            (acc, item) => ({
                pesertaDidik: acc.pesertaDidik + item.pesertaDidik,
                alumni: acc.alumni + item.alumni,
                pendidik: acc.pendidik + item.pendidik,
                tenagaPendidik: acc.tenagaPendidik + item.tenagaPendidik,
            }),
            { pesertaDidik: 0, alumni: 0, pendidik: 0, tenagaPendidik: 0 }
        )
    }, [filteredData])

    const totalAnggaran = useMemo(() => {
        return filteredAnggaranData.reduce((acc, item) => acc + item.desktop, 0)
    }, [filteredAnggaranData])

    const totalPendapatan = useMemo(() => {
        return filteredPendapatanData.reduce((acc, item) => ({
            realisasi: acc.realisasi + item.desktop,
            target: acc.target + (item.mobile || 0)
        }), { realisasi: 0, target: 0 })
    }, [filteredPendapatanData])

    const FilterSelect = ({ value, onChange }: { value: string, onChange: (val: 'Semua' | 'Tinggi' | 'Menengah') => void }) => (
        <div className="w-40">
            <label className="block mb-1 text-sm text-gray-300">Jenjang</label>
            <Select value={value} onValueChange={(val) => onChange(val as 'Semua' | 'Tinggi' | 'Menengah')}>
                <SelectTrigger className="w-full text-gray-300">
                    <SelectValue placeholder="Pilih Jenjang" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Semua" className="text-gray-300">Semua</SelectItem>
                    <SelectItem value="Tinggi" className="text-gray-300">Tinggi</SelectItem>
                    <SelectItem value="Menengah" className="text-gray-300">Menengah</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )

    return (
        <Card className="flex flex-col w-full mt-5">
            <CardHeader className="pb-4 flex items-center justify-between flex-row w-full">
                <CardTitle className="text-white text-center">Data Satuan Pendidikan</CardTitle>
                <FilterSelect value={filterJenjang} onChange={(val) => {
                    setFilterJenjang(val)
                    setCurrentPage(1)
                }} />
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Tabs */}
                <div className="flex gap-2 border-b border-navy-700">
                    <button
                        className={`px-4 py-2 text-sm font-medium transition ${activeTab === 'sdm'
                            ? 'text-teal-400 border-b-2 border-teal-400'
                            : 'text-gray-400 hover:text-gray-300'
                            }`}
                        onClick={() => {
                            setActiveTab('sdm')
                            setCurrentPage(1)
                        }}
                    >
                        SDM
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium transition ${activeTab === 'anggaran'
                            ? 'text-teal-400 border-b-2 border-teal-400'
                            : 'text-gray-400 hover:text-gray-300'
                            }`}
                        onClick={() => {
                            setActiveTab('anggaran')
                            setCurrentPage(1)
                        }}
                    >
                        Realisasi Belanja
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium transition ${activeTab === 'pnbp'
                            ? 'text-teal-400 border-b-2 border-teal-400'
                            : 'text-gray-400 hover:text-gray-300'
                            }`}
                        onClick={() => {
                            setActiveTab('pnbp')
                            setCurrentPage(1)
                        }}
                    >
                        Capaian PNBP
                    </button>
                </div>

                {/* Search */}
                <input
                    type="text"
                    placeholder="🔍 Cari satuan pendidikan..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value)
                        setCurrentPage(1)
                    }}
                    className="w-full px-4 py-2 rounded-md bg-navy-800 border border-navy-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500"
                />

                <div className="overflow-x-auto rounded-md border border-navy-700">
                    {activeTab === 'sdm' && (
                        <table className="min-w-full divide-y divide-navy-700 bg-navy-700 text-sm text-gray-200">
                            <thead className="bg-navy-800">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-gray-200">No</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-200">Satuan Pendidikan</th>
                                    <th className="px-4 py-3 text-center font-medium text-gray-200">Jenjang</th>
                                    <th className="px-4 py-3 text-center font-medium text-gray-200">Peserta Didik</th>
                                    <th className="px-4 py-3 text-center font-medium text-gray-200">Alumni</th>
                                    <th className="px-4 py-3 text-center font-medium text-gray-200">Pendidik</th>
                                    <th className="px-4 py-3 text-center font-medium text-gray-200">Tenaga Kependidikan</th>
                                    <th className="px-4 py-3 text-center font-medium text-gray-200">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-navy-600">
                                {paginatedData.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-4 text-gray-400">
                                            Tidak ada data ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    <>
                                        {paginatedData.map((item: any, index) => {
                                            const total = item.pesertaDidik + item.alumni + item.pendidik + item.tenagaPendidik
                                            const jenjang = getJenjang(item.name)

                                            return (
                                                <tr key={index} className="hover:bg-navy-600 transition">
                                                    <td className="px-4 py-3 text-center text-gray-200">
                                                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-200">
                                                        {normalizeName(item.name).toUpperCase()}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${jenjang === 'Tinggi'
                                                            ? 'bg-blue-500/20 text-blue-400'
                                                            : 'bg-green-500/20 text-green-400'
                                                            }`}>
                                                            {jenjang}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-gray-200">
                                                        {item.pesertaDidik.toLocaleString()}
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-gray-200">
                                                        {item.alumni.toLocaleString()}
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-gray-200">
                                                        {item.pendidik.toLocaleString()}
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-gray-200">
                                                        {item.tenagaPendidik.toLocaleString()}
                                                    </td>
                                                    <td className="px-4 py-3 text-center font-bold text-teal-400">
                                                        {total.toLocaleString()}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        <tr className="bg-navy-800 font-bold">
                                            <td colSpan={3} className="px-4 py-3 text-right text-gray-200">
                                                TOTAL
                                            </td>
                                            <td className="px-4 py-3 text-center text-teal-400">
                                                {totals.pesertaDidik.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-center text-teal-400">
                                                {totals.alumni.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-center text-teal-400">
                                                {totals.pendidik.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-center text-teal-400">
                                                {totals.tenagaPendidik.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-center text-teal-400">
                                                {(totals.pesertaDidik + totals.alumni + totals.pendidik + totals.tenagaPendidik).toLocaleString()}
                                            </td>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </table>
                    )}

                    {activeTab === 'anggaran' && (
                        <table className="min-w-full divide-y divide-navy-700 bg-navy-700 text-sm text-gray-200">
                            <thead className="bg-navy-800">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-gray-200">No</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-200">Satuan Pendidikan</th>
                                    <th className="px-4 py-3 text-center font-medium text-gray-200">Jenjang</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-200">Realisasi Belanja</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-navy-600">
                                {paginatedData.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-4 text-gray-400">
                                            Tidak ada data ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    <>
                                        {paginatedData.map((item: any, index) => {
                                            const jenjang = getJenjang(item.label)
                                            return (
                                                <tr key={index} className="hover:bg-navy-600 transition">
                                                    <td className="px-4 py-3 text-center text-gray-200">
                                                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-200">
                                                        {normalizeName(item.label).toUpperCase()}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${jenjang === 'Tinggi'
                                                            ? 'bg-blue-500/20 text-blue-400'
                                                            : 'bg-green-500/20 text-green-400'
                                                            }`}>
                                                            {jenjang}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-bold text-teal-400">
                                                        Rp {item.desktop.toLocaleString()}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        <tr className="bg-navy-800 font-bold">
                                            <td colSpan={3} className="px-4 py-3 text-right text-gray-200">
                                                TOTAL
                                            </td>
                                            <td className="px-4 py-3 text-right text-teal-400">
                                                Rp {totalAnggaran.toLocaleString()}
                                            </td>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </table>
                    )}

                    {activeTab === 'pnbp' && (
                        <table className="min-w-full divide-y divide-navy-700 bg-navy-700 text-sm text-gray-200">
                            <thead className="bg-navy-800">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-gray-200">No</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-200">Satuan Pendidikan</th>
                                    <th className="px-4 py-3 text-center font-medium text-gray-200">Jenjang</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-200">Realisasi</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-200">Target</th>
                                    <th className="px-4 py-3 text-center font-medium text-gray-200">Persentase</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-navy-600">
                                {paginatedData.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-4 text-gray-400">
                                            Tidak ada data ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    <>
                                        {paginatedData.map((item: any, index) => {
                                            const jenjang = getJenjang(item.label)
                                            const percentage = item.mobile ? ((item.desktop / item.mobile) * 100).toFixed(2) : 0
                                            return (
                                                <tr key={index} className="hover:bg-navy-600 transition">
                                                    <td className="px-4 py-3 text-center text-gray-200">
                                                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-200">
                                                        {normalizeName(item.label).toUpperCase()}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${jenjang === 'Tinggi'
                                                            ? 'bg-blue-500/20 text-blue-400'
                                                            : 'bg-green-500/20 text-green-400'
                                                            }`}>
                                                            {jenjang}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-gray-200">
                                                        Rp {item.desktop.toLocaleString()}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-gray-200">
                                                        Rp {(item.mobile || 0).toLocaleString()}
                                                    </td>
                                                    <td className="px-4 py-3 text-center font-bold text-teal-400">
                                                        {percentage}%
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        <tr className="bg-navy-800 font-bold">
                                            <td colSpan={3} className="px-4 py-3 text-right text-gray-200">
                                                TOTAL
                                            </td>
                                            <td className="px-4 py-3 text-right text-teal-400">
                                                Rp {totalPendapatan.realisasi.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-right text-teal-400">
                                                Rp {totalPendapatan.target.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-center text-teal-400">
                                                {totalPendapatan.target ? ((totalPendapatan.realisasi / totalPendapatan.target) * 100).toFixed(2) : 0}%
                                            </td>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-400">
                        Halaman <strong>{currentPage}</strong> dari <strong>{totalPages || 1}</strong>
                        <span className="ml-2">
                            ({activeTab === 'sdm' ? filteredData.length : activeTab === 'anggaran' ? filteredAnggaranData.length : filteredPendapatanData.length} data)
                        </span>
                    </p>
                    <div className="flex gap-2">
                        <button
                            className={`px-3 py-1 rounded border text-sm ${currentPage === 1
                                ? 'bg-navy-800 text-gray-500 cursor-not-allowed border-navy-700'
                                : 'bg-navy-700 text-gray-200 hover:bg-navy-600 border-navy-700'
                                }`}
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            ⬅ Sebelumnya
                        </button>
                        <button
                            className={`px-3 py-1 rounded border text-sm ${currentPage === totalPages || totalPages === 0
                                ? 'bg-navy-800 text-gray-500 cursor-not-allowed border-navy-700'
                                : 'bg-navy-700 text-gray-200 hover:bg-navy-600 border-navy-700'
                                }`}
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages || totalPages === 0}
                        >
                            Selanjutnya ➡
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}