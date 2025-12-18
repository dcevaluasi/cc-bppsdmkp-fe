import CardComponent from '@/components/CardComponent';
import { exportRealisasiPerSatkerToExcel } from '@/utils/export/exportRealisasiPerSatker';
import { useState, useMemo } from 'react';

interface SatkerItem {
    kdsatker: string;
    nama_satker: string;
    pagu: number;
    realisasi: number;
    persen_realisasi: number;
}

interface Props {
    tahun: string;
    dataSatker: SatkerItem[];
}

const SatkerPendapatanTable: React.FC<Props> = ({
    tahun,
    dataSatker,
}) => {
    const [search, setSearch] = useState(''); // Add search state here
    const [sortOrderSatker, setSortOrderSatker] = useState<'asc' | 'desc' | null>(null);

    const resetSorting = () => setSortOrderSatker(null);

    const filteredData = useMemo(() => {
        return dataSatker.filter((item) =>
            item.nama_satker.toLowerCase().includes(search.toLowerCase())
        );
    }, [dataSatker, search]);

    const sortedDataSatker = useMemo(() => {
        if (!sortOrderSatker) return filteredData;

        return [...filteredData].sort((a, b) =>
            sortOrderSatker === 'asc'
                ? a.persen_realisasi - b.persen_realisasi
                : b.persen_realisasi - a.persen_realisasi
        );
    }, [filteredData, sortOrderSatker]);

    return (
        <CardComponent title={`Capaian PNBP Per Satker ${tahun}`}>
            <div className="overflow-x-auto rounded-lg w-full flex flex-col gap-6">
                <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <button
                        onClick={() => exportRealisasiPerSatkerToExcel(sortedDataSatker, parseInt(tahun))}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm hover:bg-emerald-700 transition"
                    >
                        📥 Export to Excel
                    </button>

                    <div className="flex gap-2 items-end w-full md:w-auto">
                        <div className="w-full md:w-auto">
                            <label className="block mb-1 text-sm text-gray-300">Search </label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari berdasarkan nama satker..."
                                className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 bg-navy-700 text-gray-300"
                            />
                        </div>

                        <button
                            onClick={sortOrderSatker ? resetSorting : undefined}
                            disabled={!sortOrderSatker}
                            className={`px-4 py-2 rounded-md text-white text-sm transition ${sortOrderSatker
                                ? 'bg-navy-700 border border-input hover:bg-gray-700 cursor-pointer'
                                : 'bg-navy-700 border border-input opacity-50 cursor-not-allowed'
                                }`}
                            title={sortOrderSatker ? 'Reset Sorting' : 'Pilih Salah Satu % Untuk Sorting'}
                        >
                            {sortOrderSatker ? 'Reset Sorting' : 'Pilih % Untuk Sorting'}
                        </button>
                    </div>
                </div>

                <table className="min-w-full text-sm text-gray-200 border border-gray-700 !bg-navy-700">
                    <thead className="bg-navy-800 text-gray-100 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-2 text-left">No</th>
                            <th className="px-4 py-2 text-left">KDSatker</th>
                            <th className="px-4 py-2 text-left">Nama Satker</th>
                            <th className="px-4 py-2 text-right">Target</th>
                            <th className="px-4 py-2 text-right">Capaian</th>
                            <th
                                className="px-4 py-2 text-right cursor-pointer select-none"
                                onClick={() =>
                                    setSortOrderSatker((prev) =>
                                        prev === 'asc' ? 'desc' : 'asc'
                                    )
                                }
                                title="Klik untuk sort"
                            >
                                %{' '}
                                <span className="ml-1">
                                    {sortOrderSatker === 'asc' ? (
                                        <span className="text-white font-bold">▲</span>
                                    ) : sortOrderSatker === 'desc' ? (
                                        <span className="text-white font-bold">▼</span>
                                    ) : (
                                        <span className="text-gray-400">▲▼</span>
                                    )}
                                </span>

                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {sortedDataSatker.map((item, index) => (
                            <tr
                                key={item.kdsatker}
                                className="border-t border-gray-700 hover:bg-navy-600"
                            >
                                <td className="px-4 py-2 border">{index + 1}</td>
                                <td className="px-4 py-2 text-center border">{item.kdsatker}</td>
                                <td className="px-4 py-2 border">{item.nama_satker.toUpperCase()}</td>
                                <td className="px-4 py-2 text-right border">{item.pagu.toLocaleString()}</td>
                                <td className="px-4 py-2 text-right border">{item.realisasi.toLocaleString()}</td>
                                <td className="px-4 py-2 text-right border">{item.persen_realisasi.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </CardComponent>
    );
};

export default SatkerPendapatanTable;
