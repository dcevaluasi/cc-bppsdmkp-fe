"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import * as XLSX from "xlsx"
import { HiUserGroup } from "react-icons/hi2"
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts"
import { FiBarChart2, FiTrendingUp } from "react-icons/fi"
import { MateriPelatihan } from "@/types/pelatihan/modul"

type Props = {
    dataMateri: MateriPelatihan[]
    rowKey: keyof MateriPelatihan
    colKey: keyof MateriPelatihan
    title: string
}

const COLORS = [
    '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b',
    '#10b981', '#06b6d4', '#f97316', '#6366f1',
    '#14b8a6', '#a855f7', '#ef4444', '#84cc16'
]

export function DynamicTableModulPelatihan({
    dataMateri,
    rowKey,
    colKey,
    title,
}: Props) {
    const columns = React.useMemo(() => {
        return Array.from(
            new Set(
                dataMateri
                    .map((item) => String(item[colKey] ?? "Tidak Diketahui"))
                    .filter(val => val && val !== "" && val !== "-")
            )
        ).sort()
    }, [dataMateri, colKey])

    const rows = React.useMemo(() => {
        return Array.from(
            new Set(
                dataMateri
                    .map((item) => String(item[rowKey] ?? "Tidak Diketahui"))
                    .filter(val => val && val !== "" && val !== "-")
            )
        ).sort()
    }, [dataMateri, rowKey])

    const groupedData = React.useMemo(() => {
        const map = new Map<string, any>()

        rows.forEach((row) => {
            map.set(row, { row, total: 0 })
            columns.forEach((col) => (map.get(row)![col] = 0))
        })

        dataMateri.forEach((item) => {
            let rowVal = String(item[rowKey] ?? "Tidak Diketahui")
            let colVal = String(item[colKey] ?? "Tidak Diketahui")

            if (!rowVal || rowVal === "" || rowVal === "-") rowVal = "Tidak Diketahui"
            if (!colVal || colVal === "" || colVal === "-") colVal = "Tidak Diketahui"

            if (!map.has(rowVal)) {
                map.set(rowVal, { row: rowVal, total: 0 })
                columns.forEach((col) => (map.get(rowVal)![col] = 0))
            }

            const row = map.get(rowVal)!
            row[colVal] = (row[colVal] || 0) + 1
            row.total++
        })

        return Array.from(map.values())
    }, [dataMateri, rowKey, colKey, columns, rows])

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

    const barChartData = React.useMemo(() => {
        return groupedData
            .filter(row => row.total > 0)
            .sort((a, b) => b.total - a.total)
            .slice(0, 12)
            .map(row => ({
                name: row.row.length > 30 ? row.row.substring(0, 30) + '...' : row.row,
                fullName: row.row,
                total: row.total,
                ...columns.reduce((acc, col) => {
                    acc[col] = row[col]
                    return acc
                }, {} as any)
            }))
    }, [groupedData, columns])

    const lineChartData = React.useMemo(() => {
        return groupedData
            .filter(row => row.total > 0)
            .sort((a, b) => b.total - a.total)
            .slice(0, 10)
            .map(row => ({
                name: row.row.length > 20 ? row.row.substring(0, 20) + '...' : row.row,
                ...columns.reduce((acc, col) => {
                    acc[col] = row[col]
                    return acc
                }, {} as any)
            }))
    }, [groupedData, columns])

    const exportToExcel = () => {
        const wsData = [
            [rowKey, ...columns, "Total"],
            ...groupedData.map((row) => [row.row, ...columns.map((c) => row[c]), row.total]),
            ["TOTAL", ...columns.map((c) => totals[c]), totals.total],
        ]
        const ws = XLSX.utils.aoa_to_sheet(wsData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Data Materi Pelatihan")
        XLSX.writeFile(wb, `${title}.xlsx`)
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-navy-800 border border-gray-600 rounded-lg p-3 shadow-lg">
                    <p className="text-gray-100 font-semibold mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: <span className="font-bold">{entry.value.toLocaleString('id-ID')}</span>
                        </p>
                    ))}
                </div>
            )
        }
        return null
    }

    return (
        <div className="space-y-6">

            {/* Table Section */}
            <div className="bg-navy-800 rounded-lg shadow-lg ">
                <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
                        <HiUserGroup className="text-blue-500" />
                        Tabel Detail: {title}
                    </h3>
                    <Button
                        size="sm"
                        onClick={exportToExcel}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Export Excel
                    </Button>
                </div>

                <div className="overflow-x-auto p-5">
                    <table className="w-full text-xs text-gray-200  bg-navy-700">
                        <thead className="bg-navy-800 text-gray-100 uppercase">
                            <tr>
                                <th className="px-2 py-2 border text-center sticky left-0 bg-navy-800 z-10">No</th>
                                <th className="px-3 py-2 border sticky left-8 bg-navy-800 z-10 min-w-[150px]">
                                    {rowKey}
                                </th>
                                {columns.map((col) => (
                                    <th key={col} className="px-2 py-2 border text-center min-w-[100px]">
                                        {col}
                                    </th>
                                ))}
                                <th className="px-3 py-2 border text-center bg-navy-900 font-bold">
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedData.map((row, index) => (
                                <tr key={row.row} className="border-t border-gray-700 hover:bg-navy-600">
                                    <td className="px-2 py-2 border text-center sticky left-0 bg-navy-700">
                                        {index + 1}
                                    </td>
                                    <td className="px-3 py-2 border sticky left-8 bg-navy-700">
                                        {row.row}
                                    </td>
                                    {columns.map((col) => {
                                        const val = row[col]
                                        return (
                                            <td key={col} className="px-2 py-2 border text-center">
                                                {val > 0 ? val.toLocaleString('id-ID') : '-'}
                                            </td>
                                        )
                                    })}
                                    <td className="px-3 py-2 border text-center font-semibold bg-navy-700">
                                        {row.total.toLocaleString('id-ID')}
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-navy-800 font-bold">
                                <td colSpan={2} className="px-3 py-2 border text-right sticky left-0 bg-navy-800">
                                    TOTAL
                                </td>
                                {columns.map((col) => (
                                    <td key={col} className="px-2 py-2 border text-center">
                                        {totals[col] > 0 ? totals[col].toLocaleString('id-ID') : '-'}
                                    </td>
                                ))}
                                <td className="px-3 py-2 border text-center bg-navy-800">
                                    {totals.total.toLocaleString('id-ID')}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-3 bg-navy-900 text-sm text-gray-400 italic">
                    * Tabel dapat di-scroll horizontal untuk melihat semua kolom
                </div>
            </div>
        </div>
    )
}