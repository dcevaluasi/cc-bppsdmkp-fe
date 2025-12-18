'use client'

import React, { useMemo, useState } from 'react'
import { DotLoader } from 'react-spinners'
import CardComponent from '@/components/CardComponent'
import { IndikatorKinerja, KinerjaSummaryResponse, Output, Sasaran } from '@/types/managerial/kinerja'

interface Props {
    loading: boolean
    data: KinerjaSummaryResponse
    tahun: string
    selectedTw?: string // "TW I", "TW II", etc.
}

const KinerjaTable: React.FC<Props> = ({ loading, data, tahun, selectedTw }) => {
    const filteredData = useMemo(() => {
        if (!selectedTw) return data
        return data
            .map((sasaran: Sasaran) => ({
                ...sasaran,
                indikator_kinerja: sasaran.indikator_kinerja
                    .map((ik: IndikatorKinerja) => ({
                        ...ik,
                        output: ik.output.filter((out: Output) => out.tw === selectedTw)
                    }))
                    .filter(ik => ik.output.length > 0)
            }))
            .filter(s => s.indikator_kinerja.length > 0)
    }, [data, selectedTw])

    const [sortConfig, setSortConfig] = React.useState<{
        key: 'anggaran' | 'target' | null
        direction: 'asc' | 'desc'
    }>({ key: null, direction: 'asc' })

    if (loading) {
        return (
            <div className="flex h-[25vh] py-10 items-center justify-center">
                <DotLoader color="#2152ff" size={50} />
            </div>
        )
    }


    const toggleSort = (key: 'anggaran' | 'target') => {
        setSortConfig(prev => {
            if (prev.key === key) {
                return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
            }
            return { key, direction: 'asc' }
        })
    }



    return (
        <CardComponent title={`Realisasi Per Sasaran ${tahun} ${selectedTw || ''}`}>
            <div className="overflow-x-auto rounded-lg w-full p-0 m-0">
                <table className="w-full text-sm text-gray-200 border border-gray-700 !bg-navy-700">
                    <thead className="bg-navy-800 text-gray-100 uppercase text-xs">
                        <tr>

                            <th className="px-4 py-2 border">Sasaran</th>
                            <th className="px-4 py-2 border text-center">No</th>
                            <th className="px-4 py-2 border">IKU</th>
                            <th className="px-4 py-2 border">Unit Penanggung Jawab</th>
                            <th className="px-4 py-2 border">Output</th>
                            <th className="px-4 py-2 border">Satuan</th>
                            <th className="px-4 py-2 border text-center leading-none">Pagu<br />(Rp 000)</th>
                            <th className="px-4 py-2 border text-center leading-none">Realisasi<br />  (Rp 000)</th>
                            <th
                                className="px-4 py-2 border text-center cursor-pointer"
                                onClick={() => toggleSort('anggaran')}
                            >
                                % {sortConfig.key === 'anggaran' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▲▼'}
                            </th>
                            <th className="px-4 py-2 border text-right">Target</th>
                            <th className="px-4 py-2 border text-right">Realisasi</th>
                            <th
                                className="px-4 py-2 border text-center cursor-pointer"
                                onClick={() => toggleSort('target')}
                            >
                                % {sortConfig.key === 'target' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▲▼'}
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((sasaran, sasaranIdx) => {
                            const totalIKUs = sasaran.indikator_kinerja.reduce(
                                (acc, ik) => acc + ik.output.length,
                                0
                            )
                            let ikuCounter = 1
                            let outputRowIndex = 0

                            return sasaran.indikator_kinerja.map((ik, ikuIdx) => {
                                // Grouping logic for merging alokasi and realisasi cells
                                const groupedOutputs: {
                                    output: Output
                                    isFirst: boolean
                                    rowspan: number
                                }[] = []

                                let outputs = [...ik.output]

                                if (sortConfig.key === 'anggaran') {
                                    outputs.sort((a, b) => {
                                        const aVal = a.realisasi_anggaran / a.alokasi_anggaran || 0
                                        const bVal = b.realisasi_anggaran / b.alokasi_anggaran || 0
                                        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal
                                    })
                                }

                                if (sortConfig.key === 'target') {
                                    outputs.sort((a, b) => {
                                        const aVal = a.r_tw / a.t_tw || 0
                                        const bVal = b.r_tw / b.t_tw || 0
                                        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal
                                    })
                                }

                                const seenKeys: Record<string, number> = {}

                                outputs.forEach((out) => {
                                    const key = `${out.alokasi_anggaran}-${out.realisasi_anggaran}`
                                    seenKeys[key] = (seenKeys[key] || 0) + 1
                                })

                                const usedKeys: Record<string, number> = {}

                                outputs.forEach((out) => {
                                    const key = `${out.alokasi_anggaran}-${out.realisasi_anggaran}`
                                    const isFirst = !usedKeys[key]
                                    usedKeys[key] = (usedKeys[key] || 0) + 1

                                    groupedOutputs.push({
                                        output: out,
                                        isFirst,
                                        rowspan: isFirst ? seenKeys[key] : 0
                                    })
                                })



                                return groupedOutputs.map(({ output: out, isFirst, rowspan }, outIdx) => {
                                    const isFirstOutputOfIKU = outIdx === 0
                                    const isFirstIKUOfSasaran = outputRowIndex === 0

                                    const row = (
                                        <tr
                                            key={`${sasaranIdx}-${ikuIdx}-${outIdx}`}
                                            className="border-t border-gray-700 hover:bg-navy-600"
                                        >
                                            {/* Sasaran Column */}
                                            {isFirstIKUOfSasaran && (
                                                <td className="px-4 py-2 border align-center" rowSpan={totalIKUs}>
                                                    {sasaran.sasaran}
                                                </td>
                                            )}

                                            {/* No Column */}
                                            {isFirstOutputOfIKU && (
                                                <td
                                                    className="px-4 py-2 border text-center"
                                                    rowSpan={ik.output.length}
                                                >
                                                    {ikuCounter++}
                                                </td>
                                            )}

                                            {/* IKU */}
                                            {isFirstOutputOfIKU && (
                                                <td className="px-4 py-2 border" rowSpan={ik.output.length}>
                                                    {ik.nama}
                                                </td>
                                            )}

                                            {/* Unit Penanggung Jawab */}
                                            {isFirstOutputOfIKU && (
                                                <td className="px-4 py-2 border" rowSpan={ik.output.length}>
                                                    {ik.unit_pj}
                                                </td>
                                            )}

                                            {/* Output */}
                                            <td className="px-4 py-2 border">{out.nama}</td>

                                            {/* Satuan */}
                                            <td className="px-4 py-2 border">{out.satuan_target}</td>

                                            {/* Alokasi Anggaran */}
                                            {isFirst && (
                                                <td
                                                    className="px-4 py-2 border text-right"
                                                    rowSpan={rowspan}
                                                >
                                                    {out.alokasi_anggaran.toLocaleString('id-ID')}
                                                </td>
                                            )}

                                            {/* Realisasi Anggaran */}
                                            {isFirst && (
                                                <td
                                                    className="px-4 py-2 border text-right"
                                                    rowSpan={rowspan}
                                                >
                                                    {out.realisasi_anggaran.toLocaleString('id-ID')}
                                                </td>
                                            )}

                                            {isFirst && (
                                                <td
                                                    className="px-4 py-2 border text-right"
                                                    rowSpan={rowspan}
                                                >
                                                    {isNaN(out.realisasi_anggaran / out.alokasi_anggaran)
                                                        ? 0
                                                        : ((out.realisasi_anggaran / out.alokasi_anggaran) * 100).toLocaleString('id-ID')}

                                                </td>
                                            )}


                                            {/* Target */}
                                            <td className="px-4 py-2 border text-right">
                                                {out.t_tw.toLocaleString('id-ID')}
                                            </td>

                                            {/* Realisasi */}
                                            <td className="px-4 py-2 border text-right">
                                                {out.r_tw.toLocaleString('id-ID')}
                                            </td>

                                            <td className="px-4 py-2 border text-right">
                                                {isNaN(out.r_tw / out.t_tw)
                                                    ? 0
                                                    : ((out.r_tw / out.t_tw) * 100).toLocaleString('id-ID')}

                                            </td>


                                        </tr>
                                    )

                                    outputRowIndex++
                                    return row
                                })
                            })
                        })}
                    </tbody>

                </table>
            </div>
        </CardComponent>
    )
}

export default KinerjaTable
