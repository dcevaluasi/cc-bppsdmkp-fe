// components/KROAnggaranTable.tsx
'use client';

import CardComponent from '@/components/CardComponent';
import { KROAnggaranItem } from '@/types/managerial/anggaran';
import React, { Fragment, useState } from 'react';
import { DotLoader } from 'react-spinners';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface KROAnggaranTableProps {
    loading: boolean;
    tahun: string | number;
    data: KROAnggaranItem[];
}

const KROAnggaranTable: React.FC<KROAnggaranTableProps> = ({ loading, tahun, data }) => {
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

    const toggleRow = (index: number) => {
        const newExpandedRows = new Set(expandedRows);
        if (newExpandedRows.has(index)) {
            newExpandedRows.delete(index);
        } else {
            newExpandedRows.add(index);
        }
        setExpandedRows(newExpandedRows);
    };

    const handleExportExcel = () => {
        const exportRows = data.flatMap((item) => {
            const parentRow = {
                kegiatan: item.kegiatan,
                kegiatan_name: item.kegiatan_name,
                pagu: item.pagu,
                realisasi: item.realisasi,
                percentage: item.percentage,
                outstanding: item.outstanding,
                oc_real_percentage: ((item.outstanding + item.realisasi) / item.pagu * 100).toFixed(2),
                blokir: item.blokir,
                oc_real_blokir_percentage: ((item.outstanding + item.realisasi + item.blokir) / item.pagu * 100).toFixed(2),
            };

            const detailRows = item.items.map(output => ({
                kegiatan: '', // Empty to distinguish child row
                kegiatan_name: '',
                output: output.output,
                output_name: output.output_name,
                pagu: output.pagu,
                realisasi: output.realisasi,
                percentage: output.percentage,
                outstanding: item.outstanding,
                oc_real_percentage: ((item.outstanding + item.realisasi) / item.pagu * 100).toFixed(2),
                blokir: item.blokir,
                oc_real_blokir_percentage: ((item.outstanding + item.realisasi + item.blokir) / item.pagu * 100).toFixed(2),
            }));

            return [parentRow, ...detailRows];
        });

        const worksheet = XLSX.utils.json_to_sheet(exportRows, {
            header: [
                'kegiatan',
                'kegiatan_name',
                'output',
                'output_name',
                'pagu',
                'realisasi',
                'percentage',
                'outstanding',
                'oc_real_percentage',
                'blokir',
                'oc_real_blokir_percentage'
            ]
        });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `Realisasi TA ${tahun}`);
        XLSX.writeFile(workbook, `Realisasi_Kegiatan_TA_${tahun}.xlsx`);
    };

    const [sortConfig, setSortConfig] = React.useState<{
        key: 'percentage' | 'oc_real_percentage' | 'oc_real_blokir_percentage' | null;
        direction: 'asc' | 'desc';
    }>({ key: null, direction: 'asc' });

    const handleSort = (key: 'percentage' | 'oc_real_percentage' | 'oc_real_blokir_percentage') => {
        if (sortConfig.key === key) {
            setSortConfig({
                key,
                direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
            });
        } else {
            setSortConfig({ key, direction: 'asc' });
        }
    };

    const renderSortIcon = (column: 'percentage' | 'oc_real_percentage' | 'oc_real_blokir_percentage' | null) => {
        const isActive = sortConfig.key === column;
        const icon = sortConfig.direction === 'asc' ? '▲' : '▼';

        return (
            <span className={`ml-1 ${isActive ? 'text-black' : 'text-gray-400'}`}>
                {icon}
            </span>
        );
    };


    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig.key) return 0;

        const getValue = (item: KROAnggaranItem) => {
            switch (sortConfig.key) {
                case 'percentage': return item.percentage;
                case 'oc_real_percentage': return ((item.outstanding + item.realisasi) / item.pagu) * 100;
                case 'oc_real_blokir_percentage': return ((item.outstanding + item.realisasi + item.blokir) / item.pagu) * 100;
            }
        };

        const aValue = getValue(a)!;
        const bValue = getValue(b)!;

        if (sortConfig.direction === 'asc') {
            return aValue - bValue;
        } else {
            return bValue - aValue;
        }
    });


    if (loading) {
        return (
            <div className="flex w-full h-[25vh] py-10 items-center justify-center">
                <DotLoader color="#2152ff" size={50} />
            </div>
        );
    }





    return (
        <CardComponent title={`Realisasi Anggaran Per Kegiatan Per Output TA ${tahun}`}>
            <div className="overflow-x-auto rounded-lg mt-5 flex flex-col gap-6">
                <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <button
                        onClick={handleExportExcel}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm hover:bg-emerald-700 transition"
                    >
                        📥 Export to Excel
                    </button>



                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full !text-gray-200 border border-gray-700 !bg-navy-700">
                        <thead className="bg-navy-800 text-gray-100 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-2 border ">Kegiatan</th>
                                <th className="px-4 py-2 border ">Nama Kegiatan</th>
                                <th className="px-4 py-2 border text-center">Pagu</th>
                                <th className="px-4 py-2 border text-center">Realisasi</th>
                                <th
                                    className="px-1 py-1 text-right border cursor-pointer select-none"
                                    onClick={() => handleSort('percentage')}
                                >
                                    % {renderSortIcon('percentage')}
                                </th>
                                <th className="px-4 py-2 border text-center">OC</th>
                                <th
                                    className="px-1 py-1 text-right border cursor-pointer select-none"
                                    onClick={() => handleSort('oc_real_percentage')}
                                >
                                    OC+REAL (%) {renderSortIcon('oc_real_percentage')}
                                </th>
                                <th className="px-4 py-2 border text-center">Blokir</th>
                                <th
                                    className="px-1 py-1 text-right border cursor-pointer select-none"
                                    onClick={() => handleSort('oc_real_blokir_percentage')}
                                >
                                    OC+REAL+BLOKIR (%){renderSortIcon('oc_real_blokir_percentage')}
                                </th>

                                <th className="px-4 py-2 border text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedData.map((kroAnggaran, index) => (
                                <Fragment key={index}>
                                    <tr className="bg-navy-700">
                                        <td className="px-4 py-2 border">{kroAnggaran.kegiatan}</td>
                                        <td className="px-4 py-2 border">{kroAnggaran.kegiatan_name}</td>
                                        <td className="px-4 py-2 border text-right">{kroAnggaran.pagu.toLocaleString()}</td>
                                        <td className="px-4 py-2 border text-right">{kroAnggaran.realisasi.toLocaleString()}</td>
                                        <td className="px-4 py-2 border text-right">{kroAnggaran.percentage}</td>
                                        <td className="px-4 py-2 border text-right">{kroAnggaran.outstanding.toLocaleString()}</td>
                                        <td className="px-4 py-2 border text-right">
                                            {(((kroAnggaran.outstanding + kroAnggaran.realisasi) / kroAnggaran.pagu) * 100).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-2 border text-right">{kroAnggaran.blokir.toLocaleString()}</td>
                                        <td className="px-4 py-2 border text-right">
                                            {(((kroAnggaran.outstanding + kroAnggaran.realisasi + kroAnggaran.blokir) / kroAnggaran.pagu) * 100).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-2 border text-center">
                                            <button
                                                onClick={() => toggleRow(index)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-xs rounded"
                                            >
                                                {expandedRows.has(index) ? 'Hide' : 'Detail'}
                                            </button>
                                        </td>
                                    </tr>

                                    {expandedRows.has(index) && (
                                        <tr className="bg-navy-900">
                                            <td colSpan={10} className="p-4">
                                                <div className="text-sm text-gray-300 font-semibold mb-2">Detail Output:</div>
                                                <table className="min-w-full text-xs !bg-navy-800 border border-gray-700">
                                                    <thead className="text-gray-100 uppercase">
                                                        <tr>
                                                            <th className="px-3 py-1 border">Output</th>
                                                            <th className="px-3 py-1 border">Nama Output</th>
                                                            <th className="px-3 py-1 border">Pagu</th>
                                                            <th className="px-3 py-1 border">Realisasi</th>
                                                            <th className="px-3 py-1 border">%</th>
                                                            <th className="px-3 py-1 border">OC</th>
                                                            <th className="px-3 py-1 border">OC+REAL (%)</th>
                                                            <th className="px-3 py-1 border">Blokir</th>
                                                            <th className="px-3 py-1 border">OC+REAL+BLOKIR (%)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {kroAnggaran.items.map((output, idx) => (
                                                            <tr key={idx} className={`${idx % 2 === 0 ? 'bg-navy-900' : 'bg-navy-800'}`}>
                                                                <td className="px-3 py-1 border">{output.output}</td>
                                                                <td className="px-3 py-1 border">{output.output_name}</td>
                                                                <td className="px-3 py-1 border text-right">{output.pagu.toLocaleString()}</td>
                                                                <td className="px-3 py-1 border text-right">{output.realisasi.toLocaleString()}</td>
                                                                <td className="px-3 py-1 border text-right">{output.percentage}</td>
                                                                <td className="px-3 py-1 border text-right">{kroAnggaran.outstanding.toLocaleString()}</td>
                                                                <td className="px-3 py-1 border text-right">
                                                                    {(((kroAnggaran.outstanding + kroAnggaran.realisasi) / kroAnggaran.pagu) * 100).toFixed(2)}
                                                                </td>
                                                                <td className="px-3 py-1 border text-right">{kroAnggaran.blokir.toLocaleString()}</td>
                                                                <td className="px-3 py-1 border text-right">
                                                                    {(((kroAnggaran.outstanding + kroAnggaran.realisasi + kroAnggaran.blokir) / kroAnggaran.pagu) * 100).toFixed(2)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    )}

                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </CardComponent>
    );
};

export default KROAnggaranTable;
