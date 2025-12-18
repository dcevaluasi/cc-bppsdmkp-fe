"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import * as XLSX from "xlsx"
import { parseIndonesianDate, getQuarterForFiltering } from "@/utils/time"
import { HiUserGroup } from "react-icons/hi2"
import { PROVINCES } from "@/data/provinces"
import { UserPelatihan } from "@/types/pelatihan/pelatihan"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { FiBarChart2, FiDownload, FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { TrendingUp, BarChart3 } from "lucide-react"
import Card from "@/components/card"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type Props = {
    dataUser: UserPelatihan[]
    rowKey: string
    colKey: string
    title: string
    tahun: string
    triwulan: string
}

const COLORS = [
    '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b',
    '#10b981', '#06b6d4', '#f97316', '#6366f1',
    '#14b8a6', '#a855f7', '#ef4444', '#84cc16'
]

const ITEMS_PER_PAGE = 10

export function DynamicTablePelatihanMasyarakat({
    dataUser,
    rowKey,
    colKey,
    title,
    tahun,
    triwulan
}: Props) {
    const [currentPage, setCurrentPage] = React.useState(1)
    const [filterPenyelenggara, setFilterPenyelenggara] = React.useState<string>("all")

    // Get all unique penyelenggara with categorization
    const penyelenggaraOptions = React.useMemo(() => {
        const grouped: {
            pusat: string[]
            balai: string[]
            p2mkp: string[]
        } = {
            pusat: [],
            balai: [],
            p2mkp: []
        }

        const penyelenggaras = new Set<string>()

        dataUser.forEach(item => {
            const penyelenggara = String(item.Penyelenggara || "")
            if (!penyelenggara || penyelenggara === "-") return

            penyelenggaras.add(penyelenggara)
        })

        // Categorize penyelenggara
        penyelenggaras.forEach(p => {
            const pLower = p.toLowerCase()

            if (pLower.includes("pusat") && pLower.includes("pelatihan") &&
                pLower.includes("kelautan") && pLower.includes("perikanan")) {
                grouped.pusat.push(p)
            } else if (pLower.includes("balai") && pLower.includes("pelatihan") &&
                !pLower.includes("p2mkp")) {
                grouped.balai.push(p)
            } else if (pLower.includes("p2mkp")) {
                grouped.p2mkp.push(p)
            }
        })

        // Sort each group
        grouped.pusat.sort()
        grouped.balai.sort()
        grouped.p2mkp.sort()

        return grouped
    }, [dataUser])

    const filteredData = React.useMemo(() => {
        return dataUser.filter((item: UserPelatihan) => {
            if (!item.TanggalMulai) return false

            let d = new Date(item.TanggalMulai)
            if (isNaN(d.getTime())) {
                d = parseIndonesianDate(item.TanggalMulai) as Date
            }
            if (!d || isNaN(d.getTime())) return false

            const itemTahun = String(d.getFullYear())
            const itemTriwulan = getQuarterForFiltering(item.TanggalMulai!)

            if (tahun && itemTahun !== tahun) return false
            if (triwulan) {
                const order = ["TW I", "TW II", "TW III", "TW IV"]
                const selectedIdx = order.indexOf(triwulan)
                const itemIdx = order.indexOf(itemTriwulan)
                if (itemIdx > selectedIdx) return false
            }

            // Filter by Penyelenggara
            if (filterPenyelenggara !== "all") {
                const penyelenggara = String(item.Penyelenggara || "")
                if (penyelenggara !== filterPenyelenggara) {
                    return false
                }
            }

            return true
        })
    }, [dataUser, tahun, triwulan, filterPenyelenggara])

    const columns = React.useMemo(() => {
        if (colKey === "Triwulan") {
            const all = ["TW I", "TW II", "TW III", "TW IV"]
            if (!triwulan) return all
            const idx = all.indexOf(triwulan)
            return all.slice(0, idx + 1)
        }
        return Array.from(
            new Set(filteredData.map((item) => item[colKey] || "Tidak Diketahui"))
        )
    }, [filteredData, colKey, triwulan])

    const rows = React.useMemo(() => {
        if (rowKey === "Provinsi") {
            return PROVINCES
        }
        return Array.from(
            new Set(
                filteredData.map(
                    (item) => String(item[rowKey as keyof UserPelatihan] ?? "Tidak Diketahui")
                )
            )
        )
    }, [filteredData, rowKey])

    const groupedData = React.useMemo(() => {
        const map = new Map<string, any>()

        rows.forEach((row) => {
            map.set(row, { row, total: 0 })
            columns.forEach((col) => (map.get(row)[col] = 0))
        })

        filteredData.forEach((item: UserPelatihan) => {
            let rowVal = String(item[rowKey as keyof UserPelatihan] ?? "Tidak Diketahui")

            if (rowKey === "Provinsi") {
                if (!rowVal || rowVal === "-" || rowVal === "") {
                    rowVal = "Tidak Diketahui"
                } else {
                    const strVal = String(rowVal).toLowerCase()
                    const normalized = PROVINCES.find((p) => p.toLowerCase() === strVal)
                    rowVal = normalized ?? "Tidak Diketahui"
                }
            }

            let colVal: string
            if (colKey === "Triwulan") {
                colVal = getQuarterForFiltering(item.TanggalMulai!) || "Tidak Diketahui"
            } else {
                colVal = String(item[colKey as keyof UserPelatihan] ?? "Tidak Diketahui")
            }

            if (!map.has(rowVal)) {
                map.set(rowVal, { row: rowVal, total: 0 })
                columns.forEach((col) => (map.get(rowVal)[col] = 0))
            }

            const row = map.get(rowVal)
            row[colVal] = (row[colVal] || 0) + 1
            row.total++
        })

        if (colKey === "Triwulan") {
            const order = ["TW I", "TW II", "TW III", "TW IV"]
            map.forEach((row) => {
                let running = 0
                order.forEach((tw) => {
                    running += row[tw] || 0
                    row[tw] = running
                })
            })
        }

        return Array.from(map.values())
    }, [filteredData, rowKey, colKey, columns, rows])

    const totals = React.useMemo(() => {
        const base: any = { row: "TOTAL", total: 0 }
        columns.forEach((col) => (base[col] = 0))
        groupedData.forEach((row) => {
            columns.forEach((col) => {
                base[col] += row[col]
            })
            base.total += row.total
        })
        return base
    }, [groupedData, columns])

    const chartData = React.useMemo(() => {
        const topN = rowKey === "Program" ? 10 : 15
        return groupedData
            .filter(row => row.total > 0)
            .sort((a, b) => b.total - a.total)
            .slice(0, topN)
            .map(row => ({
                name: row.row,
                ...columns.reduce((acc, col) => {
                    acc[col] = row[col]
                    return acc
                }, {} as any)
            }))
    }, [groupedData, columns, rowKey])

    // Pagination
    const totalPages = Math.ceil(groupedData.length / ITEMS_PER_PAGE)
    const paginatedData = React.useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
        const endIndex = startIndex + ITEMS_PER_PAGE
        return groupedData.slice(startIndex, endIndex)
    }, [groupedData, currentPage])

    React.useEffect(() => {
        setCurrentPage(1)
    }, [filterPenyelenggara])

    const exportToExcel = () => {
        const wsData = [
            [rowKey, ...columns, "Total"],
            ...groupedData.map((row) => [row.row, ...columns.map((c) => row[c]), row.total]),
            ["TOTAL", ...columns.map((c) => totals[c]), totals.total],
        ]
        const ws = XLSX.utils.aoa_to_sheet(wsData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Capaian")
        XLSX.writeFile(wb, `${title} - ${triwulan} ${tahun}.xlsx`)
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="p-3 bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-blue-500/50 rounded-lg shadow-xl backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-4 h-4 text-blue-400" />
                        <strong className="text-sm text-white font-semibold">{label}</strong>
                    </div>
                    <div className="space-y-1 text-xs">
                        {payload.map((entry: any, index: number) => (
                            <div key={index} className="flex justify-between gap-4 text-gray-300">
                                <span>{entry.name}:</span>
                                <span className="font-bold" style={{ color: entry.color }}>
                                    {entry.value.toLocaleString('id-ID')}
                                </span>
                            </div>
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

    const CustomLegend = (props: any) => {
        const { payload } = props
        return (
            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {payload.map((entry: any, index: number) => (
                    <div
                        key={`legend-${index}`}
                        className="flex items-center gap-2 px-3 py-1.5 bg-navy-700/50 rounded-lg border border-navy-600/50 hover:bg-navy-600/50 transition-colors"
                    >
                        <div
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-xs text-gray-300 font-medium">{entry.value}</span>
                    </div>
                ))}
            </div>
        )
    }

    const totalPenyelenggara = penyelenggaraOptions.pusat.length +
        penyelenggaraOptions.balai.length +
        penyelenggaraOptions.p2mkp.length

    return (
        <div className="space-y-6">
            {/* Filters */}
            {totalPenyelenggara > 0 && (
                <Card className="bg-gradient-to-br from-navy-800 to-navy-900 border-navy-600">
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">
                                Filter Penyelenggara
                            </label>
                            <Select value={filterPenyelenggara} onValueChange={setFilterPenyelenggara}>
                                <SelectTrigger className="bg-navy-700 border-navy-600 text-gray-200">
                                    <SelectValue placeholder="Pilih Penyelenggara" />
                                </SelectTrigger>
                                <SelectContent className="bg-navy-700 border-navy-600 max-h-[400px]">
                                    <SelectItem value="all" className="text-gray-200 font-semibold">
                                        Semua Penyelenggara
                                    </SelectItem>

                                    {penyelenggaraOptions.pusat.length > 0 && (
                                        <>
                                            <SelectItem
                                                value="__separator_pusat"
                                                disabled
                                                className="text-blue-400 font-bold text-xs py-2"
                                            >
                                                ── PUSAT PELATIHAN ──
                                            </SelectItem>
                                            {penyelenggaraOptions.pusat.map(p => (
                                                <SelectItem key={p} value={p} className="text-gray-200 pl-6">
                                                    {p}
                                                </SelectItem>
                                            ))}
                                        </>
                                    )}

                                    {penyelenggaraOptions.balai.length > 0 && (
                                        <>
                                            <SelectItem
                                                value="__separator_balai"
                                                disabled
                                                className="text-teal-400 font-bold text-xs py-2"
                                            >
                                                ── BALAI PELATIHAN ──
                                            </SelectItem>
                                            {penyelenggaraOptions.balai.map(p => (
                                                <SelectItem key={p} value={p} className="text-gray-200 pl-6">
                                                    {p}
                                                </SelectItem>
                                            ))}
                                        </>
                                    )}

                                    {penyelenggaraOptions.p2mkp.length > 0 && (
                                        <>
                                            <SelectItem
                                                value="__separator_p2mkp"
                                                disabled
                                                className="text-purple-400 font-bold text-xs py-2"
                                            >
                                                ── P2MKP ──
                                            </SelectItem>
                                            {penyelenggaraOptions.p2mkp.map(p => (
                                                <SelectItem key={p} value={p} className="text-gray-200 pl-6">
                                                    {p}
                                                </SelectItem>
                                            ))}
                                        </>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Chart Section */}
            <Card className="flex flex-col w-full bg-gradient-to-br from-navy-800 to-navy-900 border-navy-600">
                <CardHeader className="pb-4 border-b border-navy-600/50">
                    <div className="flex items-center justify-center gap-2">
                        <FiBarChart2 className="w-5 h-5 text-blue-400" />
                        <CardTitle className="text-white text-center">{title}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <ResponsiveContainer width="100%" height={rowKey === "Program" ? 400 : 500}>
                        <BarChart data={chartData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis type="number" stroke="#9ca3af" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                            <YAxis
                                type="category"
                                dataKey="name"
                                width={250}
                                stroke="#9ca3af"
                                tick={{ fill: '#E5E7EB', fontSize: 11, fontWeight: 500 }}
                                interval={0}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={<CustomBarCursor />} />
                            <Legend content={<CustomLegend />} />
                            {columns.map((col, idx) => (
                                <Bar
                                    key={col}
                                    dataKey={col}
                                    stackId="a"
                                    fill={COLORS[idx % COLORS.length]}
                                    name={col}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                    <p className="text-gray-400 text-xs mt-4 italic text-center">
                        * Menampilkan top {rowKey === "Program" ? "10" : "15"} {rowKey} dengan jumlah terbanyak
                    </p>
                </CardContent>
            </Card>

            {/* Table Section */}
            <Card className="flex flex-col w-full bg-gradient-to-br from-navy-800 to-navy-900 border-navy-600">
                <CardHeader className="pb-4 border-b border-navy-600/50 flex flex-row items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                        <HiUserGroup className="w-5 h-5 text-blue-400" />
                        {title}
                    </CardTitle>
                    <Button
                        size="sm"
                        onClick={exportToExcel}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    >
                        <FiDownload className="w-4 h-4" />
                        Export Excel
                    </Button>
                </CardHeader>

                <CardContent className="pt-6">
                    <div className="overflow-x-auto rounded-lg border-2 border-navy-600/50 shadow-xl">
                        <table className="min-w-full divide-y divide-navy-600 bg-navy-700/50 text-sm text-gray-200">
                            <thead className="bg-gradient-to-r from-navy-800 to-navy-900">
                                <tr>
                                    <th className="px-4 py-4 text-center font-semibold text-gray-200 border-r border-navy-600 sticky left-0 bg-navy-800 z-10">
                                        #
                                    </th>
                                    <th className="px-4 py-4 text-left font-semibold text-gray-200 border-r border-navy-600 sticky left-[64px] bg-navy-800 z-10 min-w-[150px]">
                                        <div className="flex items-center gap-2">
                                            <BarChart3 className="w-3 h-3 text-blue-400" />
                                            {rowKey}
                                        </div>
                                    </th>
                                    {columns.map((col) => (
                                        <th key={col} className="px-4 py-4 text-center font-semibold text-gray-200 min-w-[100px] border-r border-navy-600/30">
                                            {col}
                                        </th>
                                    ))}
                                    <th className="px-4 py-4 text-center font-bold text-gray-200 bg-navy-900 border-l-2 border-teal-500/50 min-w-[120px]">
                                        <div className="flex items-center justify-center gap-2">
                                            <TrendingUp className="w-3 h-3 text-teal-400" />
                                            Total
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-navy-600/50">
                                {paginatedData.map((row, index) => {
                                    const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index
                                    return (
                                        <tr
                                            key={row.row}
                                            className="hover:bg-navy-600/50 transition-all duration-200"
                                            style={{
                                                background: index % 2 === 0 ? 'rgba(30, 41, 59, 0.3)' : 'rgba(15, 23, 42, 0.3)'
                                            }}
                                        >
                                            <td className="px-4 py-3 text-center text-gray-300 border-r border-navy-600 sticky left-0 bg-navy-700/90">
                                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">
                                                    {globalIndex + 1}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-200 font-medium border-r border-navy-600 sticky left-[64px] bg-navy-700/90">
                                                {row.row}
                                            </td>
                                            {columns.map((col) => {
                                                const val = row[col]
                                                return (
                                                    <td key={col} className="px-4 py-3 text-center text-gray-300 border-r border-navy-600/20">
                                                        {val > 0 ? (
                                                            <span className="inline-block px-2 py-1 rounded bg-blue-500/10 text-blue-300">
                                                                {val.toLocaleString('id-ID')}
                                                            </span>
                                                        ) : '-'}
                                                    </td>
                                                )
                                            })}
                                            <td className="px-4 py-3 text-center font-bold text-teal-400 bg-navy-800/50 border-l-2 border-teal-500/30">
                                                <span className="inline-block px-3 py-1 rounded-lg bg-teal-500/20 text-teal-300 font-bold">
                                                    {row.total.toLocaleString('id-ID')}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6">
                            <p className="text-sm text-gray-400">
                                Menampilkan {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, groupedData.length)} dari {groupedData.length} data
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="bg-navy-700 border-navy-600 text-gray-200 hover:bg-navy-600 disabled:opacity-50"
                                >
                                    <FiChevronLeft className="w-4 h-4" />
                                </Button>
                                <span className="text-sm text-gray-300 px-3">
                                    Halaman {currentPage} dari {totalPages}
                                </span>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="bg-navy-700 border-navy-600 text-gray-200 hover:bg-navy-600 disabled:opacity-50"
                                >
                                    <FiChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Total Summary - Scrollable */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-navy-900 to-navy-800 rounded-lg border-2 border-blue-500/50">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-teal-400" />
                                <span className="text-gray-200 font-bold uppercase tracking-wider">Total Keseluruhan</span>
                            </div>

                            <div className="overflow-x-auto">
                                <div className="flex items-center gap-6 min-w-max">
                                    {columns.map((col) => (
                                        <div key={col} className="text-center min-w-[100px]">
                                            <div className="text-xs text-gray-400 mb-1">{col}</div>
                                            <div className="text-blue-300 font-bold text-lg">
                                                {totals[col] > 0 ? totals[col].toLocaleString('id-ID') : '-'}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="text-center pl-6 border-l-2 border-teal-500/50 min-w-[120px]">
                                        <div className="text-xs text-gray-400 mb-1">Total</div>
                                        <div className="text-teal-300 font-bold text-xl">
                                            {totals.total.toLocaleString('id-ID')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}