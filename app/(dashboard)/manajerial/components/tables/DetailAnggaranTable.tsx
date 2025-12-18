// components/DetailAnggaranTable.tsx
'use client';

import CardComponent from '@/components/CardComponent';
import { KROAnggaranItem, RekapRincianRealisasiAnggaranItem } from '@/types/managerial/anggaran';
import { Fragment, useState } from 'react';
import { DotLoader } from 'react-spinners';

interface DetailAnggaranTableProps {
    loading: boolean;
    tahun: string | number;
    data: RekapRincianRealisasiAnggaranItem | null;
}

const DetailAnggaranTable: React.FC<DetailAnggaranTableProps> = ({ loading, tahun, data }) => {
    if (loading) {
        return (
            <div className="flex w-full h-[25vh] py-10 items-center justify-center">
                <DotLoader color="#2152ff" size={50} />
            </div>
        );
    }

    return (
        <CardComponent title={`Rincian Realisasi Anggaran TA 2025`}>
            <div className=" overflow-hidden shadow">
                <table className="min-w-full text-sm">
                    <thead className="bg-navy-700 text-gray-600 font-semibold">
                        <tr>
                            <th className="px-4 py-2">Uraian</th>
                            <th className="px-4 py-2 text-right">Pagu</th>
                            <th className="px-4 py-2 text-right">Realisasi</th>
                            <th className="px-4 py-2 text-right">%</th>
                            <th className="px-4 py-2 text-right">Sisa</th>
                            <th className="px-4 py-2 text-right">%</th>
                        </tr>
                    </thead>
                    <tbody className="font-medium">
                        {/* Belanja Pegawai */}
                        {
                            data!.akun.map((akun, index) => (
                                <tr key={index} className={`${akun.name == 'Belanja Pegawai' ? 'text-[#60A5FA]' : akun.name == 'Belanja Modal' ? 'text-[#F9E400]' : 'text-[#4ADE80]'}`}>
                                    <td className="px-4 py-2  font-semibold">{akun.name}</td>
                                    <td className="px-4 py-2 text-right">{(akun.pagu).toLocaleString()}</td>
                                    <td className="px-4 py-2 text-right ">{(akun.realisasi).toLocaleString()}</td>
                                    <td className="px-4 py-2 text-right ">{(akun.persentase).toLocaleString()}</td>
                                    <td className="px-4 py-2  text-right ">{(akun.sisa).toLocaleString()}</td>
                                    <td className="px-4 py-2  text-right ">{akun.persentase_sisa}</td>
                                </tr>
                            ))
                        }
                        {/* Total */}
                        <tr className="bg-navy-700 font-bold text-gray-700">
                            <td className="px-4 py-2">Total</td>
                            <td className="px-4 py-2 text-right">{(data?.pagu)?.toLocaleString()}</td>
                            <td className="px-4 py-2  text-right ">{(data?.realisasi)?.toLocaleString()}</td>
                            <td className="px-4 py-2 text-right  ">{(data?.persentase)?.toLocaleString()}</td>
                            <td className="px-4 py-2  text-right ">{(data?.sisa)?.toLocaleString()}</td>
                            <td className="px-4 py-2  text-right ">{data?.persentase_sisa}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </CardComponent>
    );
};

export default DetailAnggaranTable;
