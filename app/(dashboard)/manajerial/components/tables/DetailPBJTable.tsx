'use client';

import CardComponent from '@/components/CardComponent';
import { GroupedPbjByAkunResponse } from '@/types/managerial/pbj';
import { DotLoader } from 'react-spinners';

interface DetailPBJTableProps {
    loading: boolean;
    tahun: string | number;
    data: GroupedPbjByAkunResponse;
}

const DetailPBJTable: React.FC<DetailPBJTableProps> = ({ loading, tahun, data }) => {
    if (loading) {
        return (
            <div className="flex w-full h-[25vh] py-10 items-center justify-center">
                <DotLoader color="#2152ff" size={50} />
            </div>
        );
    }

    return (
        <CardComponent title={`Rekapitulasi Outstanding Kontrak TA ${tahun}`}>
            <div className=" overflow-hidden shadow">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-navy-700 text-gray-600 font-semibold">
                        <tr>
                            <th className="px-4 py-2">Uraian</th>
                            <th className="px-4 py-2">Kontrak</th>
                            <th className="px-4 py-2">Realisasi</th>
                            <th className="px-4 py-2">%</th>
                            <th className="px-4 py-2">Outstanding</th>
                            <th className="px-4 py-2">%</th>
                        </tr>
                    </thead>
                    <tbody className="font-medium">
                        {
                            data!.map((akun, index) => (
                                <tr key={index} className={`${akun.uraian == 'Belanja Pegawai' ? 'text-[#00CAFF]' : akun.uraian == 'Belanja Modal' ? 'text-[#00CAFF]' : 'text-[#4ADE80]'}`}>
                                    <td className="px-4 py-2  font-semibold">{akun.uraian}</td>

                                    <td className="px-4 py-2 ">{(akun.nilai_kontrak).toLocaleString()}</td>
                                    <td className="px-4 py-2 ">{(akun.nilai_realisasi).toLocaleString()}</td>
                                    <td className="px-4 py-2 ">{akun.persentasi}</td>
                                    <td className="px-4 py-2 ">{(akun.nilai_outstanding).toLocaleString()}</td>
                                    <td className="px-4 py-2 ">{akun.persentasi_outstanding}</td>
                                </tr>
                            ))
                        }
                        {(() => {
                            const total = data?.reduce(
                                (acc, curr) => {
                                    acc.nilai_kontrak += curr.nilai_kontrak;
                                    acc.nilai_realisasi += curr.nilai_realisasi;
                                    acc.nilai_outstanding += curr.nilai_outstanding;
                                    return acc;
                                },
                                {
                                    nilai_kontrak: 0,
                                    nilai_realisasi: 0,
                                    nilai_outstanding: 0,
                                }
                            );

                            const persentasi = total && total.nilai_kontrak > 0
                                ? (total.nilai_realisasi / total.nilai_kontrak) * 100
                                : 0;

                            const persentasi_outstanding = total && total.nilai_kontrak > 0
                                ? (total.nilai_outstanding / total.nilai_kontrak) * 100
                                : 0;

                            return (
                                <tr className="font-bold  text-gray-600">
                                    <td className="px-4 py-2">Total</td>
                                    <td className="px-4 py-2">{total?.nilai_kontrak.toLocaleString()}</td>
                                    <td className="px-4 py-2">{total?.nilai_realisasi.toLocaleString()}</td>
                                    <td className="px-4 py-2">{persentasi.toFixed(2)}</td>
                                    <td className="px-4 py-2">{total?.nilai_outstanding.toLocaleString()}</td>
                                    <td className="px-4 py-2">{persentasi_outstanding.toFixed(2)}</td>
                                </tr>
                            );
                        })()}

                    </tbody>
                </table>
            </div>
        </CardComponent>
    );
};

export default DetailPBJTable;
