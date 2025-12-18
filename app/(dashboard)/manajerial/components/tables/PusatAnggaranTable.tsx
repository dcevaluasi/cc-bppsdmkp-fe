'use client'

import React, { useMemo, useState } from 'react'
import CardComponent from '@/components/CardComponent'
import { DotLoader } from 'react-spinners'
import { RekapPerPusatGroupedItem } from '@/types/managerial/anggaran'

interface Props {
    loading: boolean
    data: RekapPerPusatGroupedItem[]
    tahun: string
}

type SortColumn = 'pagu' | 'realisasi' | 'persen_realisasi' | null

const PusatAnggaranTable: React.FC<Props> = ({ loading, data, tahun }) => {
    const [sortColumn, setSortColumn] = useState<SortColumn>(null)
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

    const handleSort = (column: SortColumn) => {
        setSortOrder(prev => (sortColumn === column && prev === 'asc' ? 'desc' : 'asc'))
        setSortColumn(column)
    }

    const renderSortIcon = (column: SortColumn) => {
        if (sortColumn !== column) return <span className="ml-1 text-gray-400">▲▼</span>
        return <span className="ml-1 text-white">{sortOrder === 'asc' ? '▲' : '▼'}</span>
    }

    const groupedData = useMemo(() => {
        const groups: Record<string, RekapPerPusatGroupedItem[]> = {}

        data.forEach(item => {
            if (!groups[item.group]) groups[item.group] = []
            groups[item.group].push(item)
        })

        if (sortColumn) {
            Object.keys(groups).forEach(group => {
                groups[group].sort((a, b) => {
                    const aVal = a[sortColumn] ?? 0
                    const bVal = b[sortColumn] ?? 0
                    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
                })
            })
        }

        return groups
    }, [data, sortColumn, sortOrder])

    const totalPagu = useMemo(() => data.reduce((acc, cur) => acc + cur.pagu, 0), [data])
    const totalRealisasi = useMemo(() => data.reduce((acc, cur) => acc + cur.realisasi, 0), [data])
    const totalPersen = totalPagu ? (totalRealisasi / totalPagu) * 100 : 0

    if (loading) {
        return (
            <div className="flex h-[25vh] py-10 items-center justify-center">
                <DotLoader color="#2152ff" size={50} />
            </div>
        )
    }

    return (
        <CardComponent title={`Realisasi Anggaran (Kantor Pusat & Daerah) ${tahun}`}>
            <div className="overflow-x-auto rounded-lg w-full">
                <table className="w-full text-sm text-gray-200 border border-gray-700 !bg-navy-700">
                    <thead className="bg-navy-800 text-gray-100 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-2 border">Satker</th>
                            <th
                                className="px-4 py-2 border cursor-pointer text-right"
                                onClick={() => handleSort('pagu')}
                            >
                                Pagu {renderSortIcon('pagu')}
                            </th>
                            <th
                                className="px-4 py-2 border cursor-pointer text-right"
                                onClick={() => handleSort('realisasi')}
                            >
                                Realisasi {renderSortIcon('realisasi')}
                            </th>
                            <th
                                className="px-4 py-2 border cursor-pointer text-right"
                                onClick={() => handleSort('persen_realisasi')}
                            >
                                % Realisasi {renderSortIcon('persen_realisasi')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(groupedData).map(([groupName, groupItems]) => (
                            <React.Fragment key={groupName}>
                                <tr className="bg-navy-800 text-white font-semibold">
                                    <td colSpan={4} className="px-4 py-2 border uppercase">
                                        {groupName}
                                    </td>
                                </tr>

                                {groupItems.map(item => (
                                    <tr
                                        key={`${groupName}-${item.nama_satker}`}
                                        className="border-t border-gray-700 hover:bg-navy-600"
                                    >
                                        <td className="px-4 py-2 border">{item.nama_satker}</td>
                                        <td className="px-4 py-2 border text-right">
                                            {item.pagu.toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-4 py-2 border text-right">
                                            {item.realisasi.toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-4 py-2 border text-right">
                                            {item.persen_realisasi.toFixed(2).replace('.', ',')}
                                        </td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}

                        {/* Total Row */}
                        <tr className="bg-navy-900 text-white font-semibold border-t border-gray-600">
                            <td className="px-4 py-2 border text-right">TOTAL</td>
                            <td className="px-4 py-2 border text-right">{totalPagu.toLocaleString('id-ID')}</td>
                            <td className="px-4 py-2 border text-right">{totalRealisasi.toLocaleString('id-ID')}</td>
                            <td className="px-4 py-2 border text-right">
                                {totalPersen.toFixed(2).replace('.', ',')}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </CardComponent>
    )
}

export default PusatAnggaranTable
