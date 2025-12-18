'use client'

import { DotLoader } from 'react-spinners';
import CardComponent from '@/components/CardComponent';
import { PbjItem } from '@/types/managerial/pbj';
import React from 'react';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface Props {
    loading: boolean;
    tahun: string;
    filteredData: PbjItem[];
    search: string;
    setSearchData: React.Dispatch<React.SetStateAction<string>>;
}

const PBJKontrakTable: React.FC<Props> = ({ loading, tahun, filteredData, search, setSearchData }) => {
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = React.useState<number>(10);

    const [searchDataAgain, setSearchDataAgain] = React.useState<string>('');

    const filteredDataAgain = filteredData?.filter((item) =>
        item.nama_satker.toLowerCase().includes(searchDataAgain.toLowerCase())
    );

    const totalPages = Math.ceil(filteredDataAgain.length / itemsPerPage);

    const paginatedData = filteredDataAgain.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleExportExcel = () => {
        // Prepare data for export
        const exportData = filteredData.map((item, index) => ({
            No: (currentPage - 1) * itemsPerPage + index + 1,
            Satker: item.nama_satker,
            'Uraian Kontrak': item.uraian_kontrak,
            'No Kontrak': item.nomor_kontrak,
            Supplier: item.supplier,
            'Tgl Mulai': item.tgl_mulai,
            'Tgl Akhir': item.tgl_akhir,
            Kontrak: item.nilai_kontrak,
            Realisasi: item.nilai_realisasi,
            '%': ((item.nilai_realisasi / item.nilai_kontrak) * 100).toFixed(2),
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Kontrak");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, `PBJ_Rincian_Kontrak_TA_${tahun}.xlsx`);
    };


    if (loading) {
        return (
            <div className="flex w-full h-[25vh] py-10 items-center justify-center">
                <DotLoader color="#2152ff" size={50} />
            </div>
        );
    }



    return (
        <CardComponent title={`Rincian Outstanding Kontrak Berdasarkan Judul Kegiatan TA ${tahun}`}>
            <div className="overflow-x-auto rounded-lg flex flex-col gap-6">
                <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <button
                        onClick={handleExportExcel}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm hover:bg-emerald-700 transition"
                    >
                        📥 Export to Excel
                    </button>
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


                </div>

                <table className="min-w-full text-sm text-gray-200 border border-gray-700 !bg-navy-700">
                    <thead className="bg-navy-800 text-gray-100 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-2 text-center border">No</th>
                            <th className="px-4 py-2 text-center border">Satker</th>
                            <th className="px-4 py-2 text-center border">Uraian Kontrak</th>
                            <th className="px-1 py-2 text-center border">No Kontrak</th>
                            <th className="px-1 py-1 text-center border">Supplier</th>
                            <th className="px-4 py-2 text-center border">Tgl Mulai</th>
                            <th className="px-4 py-2 text-center border">Tgl Akhir</th>
                            <th className="px-4 py-2 text-right border">Kontrak</th>
                            <th className="px-4 py-2 text-center border">Realisasi</th>
                            <th className="px-4 py-2 text-right border">%</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData?.map((item, index) => (
                            <tr key={item.kdsatker} className="border-t border-gray-700 hover:bg-navy-600">
                                <td className="px-4 py-2 border">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                <td className="px-4 py-2 border">{item.nama_satker}</td>
                                <td className="px-4 py-2 text-left border">{item.uraian_kontrak}</td>
                                <td className="px-1 py-2 text-center border">{item.nomor_kontrak}</td>
                                <td className="px-1 py-1 text-center border">{item.supplier}</td>
                                <td className="px-4 py-2 text-left border">{item.tgl_mulai}</td>
                                <td className="px-4 py-2 text-left border">{item.tgl_akhir}</td>
                                <td className="px-4 py-2 text-right border">{item.nilai_kontrak.toLocaleString()}</td>
                                <td className="px-4 py-2 text-right border">{item.nilai_realisasi.toLocaleString()}</td>

                                <td className="px-4 py-2 text-right border">{((item.nilai_realisasi / item.nilai_kontrak) * 100).toLocaleString()}</td>

                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-between items-center mt-4">
                    <div className="text-gray-400 text-sm">
                        Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="px-3 py-1 bg-navy-800 text-gray-300 rounded disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className="px-3 py-1 bg-navy-800 text-gray-300 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>

            </div>
        </CardComponent>
    );
};

export default PBJKontrakTable;
