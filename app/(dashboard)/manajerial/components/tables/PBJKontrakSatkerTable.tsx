'use client'

import { DotLoader } from 'react-spinners';
import CardComponent from '@/components/CardComponent';
import { GroupedPbjBySatkerItem, GroupPbjBySatkerDataResponse, PbjItem } from '@/types/managerial/pbj';
import React from 'react';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface Props {
    loading: boolean;
    tahun: string;
    filteredData: GroupPbjBySatkerDataResponse;
    search: string;
    setSearchData: React.Dispatch<React.SetStateAction<string>>;
}

type SortColumn = 'persentasi_realisasi_pbj' | 'persentasi_outstanding_pbj' | null;


const PBJKontrakSatkerTable: React.FC<Props> = ({ loading, tahun, filteredData, search, setSearchData }) => {
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = React.useState<number>(10);

    const [searchDataAgain, setSearchDataAgain] = React.useState<string>('');

    const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');
    const [sortColumn, setSortColumn] = React.useState<SortColumn>(null);

    let filteredDataAgain = filteredData?.filter((item) =>
        item.nama_satker.toLowerCase().includes(searchDataAgain.toLowerCase())
    );

    // Calculate the dynamic values for sorting columns
    const sortedData = React.useMemo(() => {
        if (!sortColumn) return filteredDataAgain || [];

        return [...(filteredDataAgain || [])].sort((a, b) => {
            let valA: number;
            let valB: number;

            switch (sortColumn) {
                case 'persentasi_realisasi_pbj':
                    valA = a.persentasi_realisasi_pbj;
                    valB = b.persentasi_realisasi_pbj;
                    break;
                case 'persentasi_outstanding_pbj':
                    valA = a.persentasi_outstanding_pbj;
                    valB = b.persentasi_outstanding_pbj;
                    break;
                default:
                    valA = 0;
                    valB = 0;
            }

            if (sortOrder === 'asc') return valA - valB;
            return valB - valA;
        });
    }, [filteredDataAgain, sortOrder, sortColumn]);

    // Handle clicking column header to sort
    const handleSort = (column: SortColumn) => {
        if (sortColumn === column) {
            // toggle order
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            // new column sort, default desc
            setSortColumn(column);
            setSortOrder('desc');
        }
    };

    // Reset sorting to default (no sorting)
    const resetSorting = () => {
        setSortColumn(null);
        setSortOrder('desc');
    };



    const handleExportExcel = () => {
        const wsData = [
            ['No', 'Satker', 'Nilai Kontrak', 'Realisasi', '%'],
            ...filteredData.map((item, index) => [
                index + 1,
                item.nama_satker,
                item.nilai_kontrak,
                item.nilai_realisasi,
                item.persentasi,
            ]),
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(wsData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'PBJ_Satker');

        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
        });

        const data = new Blob([excelBuffer], {
            type: 'application/octet-stream',
        });

        saveAs(data, `PBJ_Kontrak_Satker_TA_${tahun}.xlsx`);
    };

    if (loading) {
        return (
            <div className="flex w-full h-[25vh] py-10 items-center justify-center">
                <DotLoader color="#2152ff" size={50} />
            </div>
        );
    }

    const renderSortIcon = (column: SortColumn) => {
        const isActive = sortColumn === column;
        const icon = sortOrder === 'asc' ? '▲' : '▼';

        return (
            <span className={`ml-1 ${isActive ? 'text-white' : 'text-gray-500'}`}>
                {icon}
            </span>
        );
    };


    return (
        <CardComponent title={`Rincian Outstanding Kontrak Per Satker TA ${tahun}`}>
            <div className="overflow-x-auto rounded-lg flex flex-col gap-6 w-full">
                <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <button
                        onClick={handleExportExcel}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm hover:bg-emerald-700 transition"
                    >
                        📥 Export to Excel
                    </button>
                    <div className="w-fit flex items-end justify-center gap-2">
                        <div className="w-full md:w-auto">
                            <label className="block mb-1 text-sm text-gray-300">Search </label>
                            <input
                                type="text"
                                value={searchDataAgain}
                                onChange={(e) => setSearchDataAgain(e.target.value)}
                                placeholder="Cari berdasarkan nama kegiatan..."
                                className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 bg-navy-700 text-gray-300"
                            />
                        </div>
                        <button
                            onClick={sortColumn ? resetSorting : undefined}
                            disabled={!sortColumn}
                            className={`px-4 py-2 rounded-md text-white text-sm transition
    ${sortColumn
                                    ? 'bg-navy-700 border border-input hover:bg-gray-700 cursor-pointer'
                                    : 'bg-navy-700 border border-input opacity-50 cursor-not-allowed'
                                }
  `}
                            title={sortColumn ? 'Reset Sorting' : 'Pilih Salah Satu % Untuk Sorting'}
                        >
                            {sortColumn ? 'Reset Sorting' : 'Pilih Salah Satu % Untuk Sorting'}
                        </button>
                    </div>



                </div>

                <table className="w-full text-sm text-gray-200 border border-gray-700 !bg-navy-700">
                    <thead className="bg-navy-800 text-gray-100 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-2 text-center border">No</th>
                            <th className="px-4 py-2 text-center border">Satker</th>
                            <th className="px-4 py-2 text-right border">Nilai Kontrak</th>
                            <th className="px-1 py-2 text-right border">Realisasi</th>
                            <th
                                className="px-1 py-1 text-right border cursor-pointer select-none"
                                onClick={() => handleSort('persentasi_realisasi_pbj')}
                            >
                                % {renderSortIcon('persentasi_realisasi_pbj')}
                            </th>
                            <th className="px-1 py-2 text-right border">Outstanding Kontrak</th>
                            <th
                                className="px-1 py-1 text-right border cursor-pointer select-none"
                                onClick={() => handleSort('persentasi_outstanding_pbj')}
                            >
                                % {renderSortIcon('persentasi_outstanding_pbj')}
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        {sortedData?.map((item, index) => (
                            <tr key={index} className="border-t border-gray-700 hover:bg-navy-600">
                                <td className="px-4 py-2 border">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                <td className="px-4 py-2 border">{item.nama_satker}</td>
                                <td className="px-4 py-2 text-right border">{item.nilai_kontrak.toLocaleString()}</td>
                                <td className="px-1 py-2 text-right border">{item.nilai_realisasi.toLocaleString()}</td>
                                <td className="px-1 py-1 text-right border">{item.persentasi_realisasi_pbj}</td>
                                <td className="px-1 py-2 text-right border">{item.nilai_outstanding_pbj.toLocaleString()}</td>
                                <td className="px-1 py-1 text-right border">{item.persentasi_outstanding_pbj}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>



            </div>
        </CardComponent>
    );
};

export default PBJKontrakSatkerTable;
