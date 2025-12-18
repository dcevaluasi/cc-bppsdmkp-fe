'use client';

import { DotLoader } from 'react-spinners';
import { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import CardComponent from '@/components/CardComponent';
import { RekapPerSatkerItem } from '@/types/managerial/anggaran';

interface Props {
    loading: boolean;
    tahun: string;
    filteredData: RekapPerSatkerItem[];
    search: string;
    setSearchData: React.Dispatch<React.SetStateAction<string>>;
}

type SortColumn = 'persen_realisasi' | 'oc_real' | 'oc_real_blokir' | null;

const SatkerAnggaranTable: React.FC<Props> = ({ loading, tahun, filteredData, search, setSearchData }) => {
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [sortColumn, setSortColumn] = useState<SortColumn>(null);

    // Filter data by search input
    const filteredDataAgain = filteredData?.filter((item) =>
        item.nama_satker.toLowerCase().includes(search.toLowerCase())
    );

    // Calculate the dynamic values for sorting columns
    const sortedData = useMemo(() => {
        if (!sortColumn) return filteredDataAgain || [];

        return [...(filteredDataAgain || [])].sort((a, b) => {
            let valA: number;
            let valB: number;

            switch (sortColumn) {
                case 'persen_realisasi':
                    valA = a.persen_realisasi;
                    valB = b.persen_realisasi;
                    break;
                case 'oc_real':
                    valA = ((a.realisasi + a.outstanding) / a.pagu) * 100;
                    valB = ((b.realisasi + b.outstanding) / b.pagu) * 100;
                    break;
                case 'oc_real_blokir':
                    valA = ((a.realisasi + a.outstanding) / (a.pagu - a.blokir)) * 100;
                    valB = ((b.realisasi + b.outstanding) / (b.pagu - b.blokir)) * 100;
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
        const worksheet = XLSX.utils.json_to_sheet(
            sortedData.map((item, index) => ({
                No: index + 1,
                Satker: item.nama_satker,
                Pagu: item.pagu,
                Realisasi: item.realisasi,
                '% Realisasi': item.persen_realisasi.toFixed(2),
                OC: item.outstanding,
                'OC + REAL (%)': (((item.realisasi + item.outstanding) / item.pagu) * 100).toFixed(2),
                Blokir: item.blokir,
                'OC + REAL + BLOKIR (%)': (((item.realisasi + item.outstanding + item.blokir) / item.pagu) * 100).toFixed(2),
            }))
        );

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'AnggaranPerSatker');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(file, `Realisasi_Anggaran_Satker_${tahun}.xlsx`);
    };

    if (loading) {
        return (
            <div className="flex w-full h-[25vh] py-10 items-center justify-center">
                <DotLoader color="#2152ff" size={50} />
            </div>
        );
    }

    // Helper to render sort icon if active column
    const renderSortIcon = (column: SortColumn) => {
        if (sortColumn !== column) {
            return <span className="ml-1 text-gray-400">▲▼</span>; // default icon
        }

        return (
            <span className="ml-1 text-white font-bold">
                {sortOrder === 'asc' ? '▲' : '▼'}
            </span>
        );
    };

    return (
        <CardComponent title={`Realisasi Anggaran Per Satker ${tahun}`}>
            <div className="overflow-x-auto rounded-lg flex flex-col gap-6">
                <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <button
                        onClick={handleExportExcel}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm hover:bg-emerald-700 transition"
                    >
                        📥 Export to Excel
                    </button>
                    <div className="flex gap-2 w-full md:w-auto items-end justify-center">
                        <div className="w-full md:w-auto">
                            <label className="block mb-1 text-sm text-gray-300">Search </label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearchData(e.target.value)}
                                placeholder="Cari berdasarkan nama satker..."
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

                <table className="min-w-full text-sm text-gray-200 border border-gray-700 !bg-navy-700">
                    <thead className="bg-navy-800 text-gray-100 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-2 text-center border">No</th>
                            <th className="px-4 py-2 text-center border">Satker</th>
                            <th className="px-4 py-2 text-right border">Pagu</th>
                            <th className="px-4 py-2 text-right border">Realisasi</th>
                            <th
                                className="px-4 py-2 text-right border cursor-pointer select-none"
                                onClick={() => handleSort('persen_realisasi')}
                            >
                                % Realisasi {renderSortIcon('persen_realisasi')}
                            </th>
                            <th className="px-4 py-2 text-right border">OC</th>
                            <th
                                className="px-4 py-2 text-right border cursor-pointer select-none"
                                onClick={() => handleSort('oc_real')}
                            >
                                OC+REAL (%) {renderSortIcon('oc_real')}
                            </th>
                            <th className="px-4 py-2 text-right border">Blokir</th>
                            <th
                                className="px-4 py-2 text-right border cursor-pointer select-none"
                                onClick={() => handleSort('oc_real_blokir')}
                            >
                                OC+REAL-BLOKIR (%) {renderSortIcon('oc_real_blokir')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData?.map((item, index) => (
                            <tr key={item.kdsatker} className="border-t border-gray-700 hover:bg-navy-600">
                                <td className="px-4 py-2 border">{index + 1}</td>
                                <td className="px-4 py-2 border">{item.nama_satker}</td>
                                <td className="px-4 py-2 border text-right">{item.pagu.toLocaleString()}</td>
                                <td className="px-4 py-2 border text-right">{item.realisasi.toLocaleString()}</td>
                                <td className="px-4 py-2 border text-right">{item.persen_realisasi.toFixed(2)}</td>
                                <td className="px-4 py-2 border text-right">{item.outstanding.toLocaleString()}</td>
                                <td className="px-4 py-2 border text-right">
                                    {(((item.realisasi + item.outstanding) / item.pagu) * 100).toLocaleString()}
                                </td>
                                <td className="px-4 py-2 border text-right">{item.blokir.toLocaleString()}</td>
                                <td className="px-4 py-2 border text-right">
                                    {(((item.realisasi + item.outstanding) / (item.pagu - item.blokir)) * 100).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </CardComponent>
    );
};

export default SatkerAnggaranTable;
