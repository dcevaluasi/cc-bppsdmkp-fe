'use client'

import {
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import React from 'react';
import { DotLoader } from 'react-spinners';
import Card from "@/components/card";

// Define the types for the props
interface RealisasiPendidikanTableProp {
    loading: boolean;
    title: string;
    data: { name: string; value: number; fill: string }[];
    config?: object;
}

const RealisasiPendidikanTable: React.FC<RealisasiPendidikanTableProp> = ({ loading, title, data, config }) => {
    return loading ? (
        <div className="flex w-full h-[25vh] py-10 items-center justify-center">
            <DotLoader color="#2152ff" size={50} />
        </div>
    ) : (
        <CardTable
            title={title}
            data={data}
        />
    );
};

export default RealisasiPendidikanTable;

type Props = {
    title: string;
    data: { name: string; value: number; fill: string }[];
};

function CardTable({ title, data }: Props) {
    const total = data.reduce((acc, item) => acc + item.value, 0);

    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = React.useState<number>(10);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const paginatedData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );


    return (
        <Card className="flex flex-col w-full">
            <CardHeader className="items-center pb-0 relative w-full flex justify-center text-center">
                <CardTitle className="text-white text-center max-w-sm">{title}</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 overflow-x-auto mt-6">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-navy-800">
                        <tr>
                            <th className="px-4 py-2 text-left font-medium text-gray-700">Warna</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-700">Kategori</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-700">Jumlah</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-700">Persentase</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paginatedData.map((entry, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2">
                                    <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: entry.fill }} />
                                </td>
                                <td className="px-4 py-2">{entry.name}</td>
                                <td className="px-4 py-2">{entry.value}</td>
                                <td className="px-4 py-2">{((entry.value / total) * 100).toFixed(2)}%</td>
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
            </CardContent>

            <CardFooter className="flex-col gap-2 items-start justify-start text-sm">
                <div className="flex items-start gap-2 font-medium leading-none">
                    Updated last minute
                </div>

            </CardFooter>
        </Card>
    );
}
