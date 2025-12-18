'use client'

import React, { useState, useMemo } from 'react'

type DynamicKelompokTableProps = {
    title: string
    data: Record<string, any>[]
    groupKey: string
    excludeKeys?: string[] // e.g. ['total']
}

const ITEMS_PER_PAGE = 10

export const DynamicKelompokTable: React.FC<DynamicKelompokTableProps> = ({
    title,
    data,
    groupKey,
    excludeKeys = [],
}) => {
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    const filteredData = useMemo(() => {
        return data.filter((item) =>
            item[groupKey]?.toLowerCase().includes(search.toLowerCase())
        )
    }, [data, search, groupKey])

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE
        return filteredData.slice(start, start + ITEMS_PER_PAGE)
    }, [filteredData, currentPage])

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)

    // Determine dynamic numeric columns
    const dynamicKeys = useMemo(() => {
        if (data.length === 0) return []

        const firstItem = data[0]
        return Object.keys(firstItem).filter(
            (key) =>
                key !== groupKey &&
                !excludeKeys.includes(key) &&
                typeof firstItem[key] === 'number'
        )
    }, [data, groupKey, excludeKeys])

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-200">{title}</h2>

            <input
                type="text"
                placeholder="🔍 Cari..."
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value)
                    setCurrentPage(1)
                }}
                className="w-full max-w-md px-4 py-2 rounded-md bg-navy-800 border border-navy-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500"
            />

            <div className="overflow-x-auto rounded-md border border-navy-700">
                <table className="min-w-full divide-y divide-navy-700 bg-navy-700 text-sm text-gray-200">
                    <thead className="bg-navy-800">
                        <tr>
                            <th className="px-4 py-2 text-left font-medium text-gray-200">No</th>
                            <th className="px-4 py-2 text-left font-medium capitalize text-gray-200">
                                {groupKey}
                            </th>
                            {dynamicKeys.map((key) => (
                                <th key={key} className="px-4 py-2 text-center font-medium text-gray-200">
                                    {key}
                                </th>
                            ))}
                            <th className="px-4 py-2 text-center font-medium text-gray-200">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-600">
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={dynamicKeys.length + 3} className="text-center py-4 text-gray-400">
                                    Tidak ada data ditemukan.
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((item, index) => {
                                const total =
                                    typeof item.total === 'number'
                                        ? item.total
                                        : dynamicKeys.reduce(
                                            (sum, key) => sum + (item[key] ?? 0),
                                            0
                                        )

                                return (
                                    <tr key={index} className="hover:bg-navy-600 transition">
                                        <td className="px-4 py-2 text-center text-gray-200">
                                            {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                        </td>
                                        <td className="px-4 py-2 text-gray-200">{item[groupKey]}</td>
                                        {dynamicKeys.map((key) => (
                                            <td key={key} className="px-4 py-2 text-center text-gray-200">
                                                {item[key] ?? 0}
                                            </td>
                                        ))}
                                        <td className="px-4 py-2 text-center font-bold text-teal-500">{total}</td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-400">
                    Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong>
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
        </div>
    )
}
