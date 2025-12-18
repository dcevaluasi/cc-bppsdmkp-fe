"use client";

import React from "react";
import { HashLoader } from "react-spinners";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FiUsers, FiAward, FiBookOpen, FiCheckCircle } from "react-icons/fi";
import CountUp from "react-countup";
import { useFetchDataInstruktur } from "@/hooks/pelatihan/useFetchDataInstruktur";
import { DynamicTableInstruktur } from "@/components/dashboard/pelatihan/DynamicTableInstruktur";

const InstrukturPelatih: React.FC = () => {
    const { instrukturs, loading, error, fetchInstrukturData, stats } = useFetchDataInstruktur();

    React.useEffect(() => {
        fetchInstrukturData();
    }, [fetchInstrukturData]);

    if (loading) {
        return (
            <div className="w-full h-[60vh] flex items-center justify-center">
                <HashLoader color="#60a5fa" size={60} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full mt-5 bg-navy-800 rounded-lg shadow-lg border border-red-500 p-6">
                <h3 className="text-lg font-semibold text-red-400">Error Loading Data</h3>
                <p className="text-gray-300 mt-2">Terjadi kesalahan saat memuat data instruktur.</p>
            </div>
        );
    }

    if (instrukturs.length === 0) {
        return (
            <div className="relative max-w-7xl w-full mx-auto mt-20">
                <div className="pt-7 md:pt-0 flex flex-col items-center">
                    <Image
                        src={"/illustrations/not-found.png"}
                        alt="Not Found"
                        width={350}
                        height={400}
                        className="w-[350px] md:w-[400px]"
                    />
                    <div className="max-w-3xl mx-auto text-center pb-5 md:pb-8 -mt-2">
                        <h1 className="text-2xl md:text-3xl font-calsans leading-[110%] text-gray-100">
                            Belum Ada Data Instruktur
                        </h1>
                        <div className="text-gray-300 text-center leading-[125%] max-w-md">
                            Data instruktur belum tersedia saat ini.
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full mt-5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Instruktur */}
                <Card className="bg-navy-800 border-0">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                            <FiUsers className="text-blue-500" />
                            Instruktur
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-400">
                            <CountUp end={stats.jenjangJabatanKelompok.Instruktur} />
                        </div>
                    </CardContent>
                </Card>

                {/* Widyaiswara */}
                <Card className="bg-navy-800 border-0">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                            <FiAward className="text-green-500" />
                            Widyaiswara
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-400">
                            <CountUp end={stats.jenjangJabatanKelompok.Widyaiswara} />
                        </div>
                    </CardContent>
                </Card>

                {/* Pelatih */}
                <Card className="bg-navy-800 border-0">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                            <FiBookOpen className="text-purple-500" />
                            Pelatih
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-purple-400">
                            <CountUp end={stats.jenjangJabatanKelompok.Pelatih} />
                        </div>
                    </CardContent>
                </Card>

                {/* Lainnya */}
                <Card className="bg-navy-800 border-0">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                            <FiCheckCircle className="text-yellow-500" />
                            Lainnya
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-yellow-400">
                            <CountUp end={stats.jenjangJabatanKelompok.Lainnya} />
                        </div>
                    </CardContent>
                </Card>

            </div>


            <DynamicTableInstruktur
                dataInstruktur={instrukturs}
                rowKey="bidang_keahlian"
                colKey="jenjang_jabatan_kelompok"
                title="Instruktur berdasarkan Jenjang Jabatan & Pendidikan Terakhir"
            />



            <DynamicTableInstruktur
                dataInstruktur={instrukturs}
                rowKey="jenjang_jabatan_kelompok"
                colKey="pendidikkan_terakhir"
                title="Instruktur berdasarkan Jenjang Jabatan & Pendidikan Terakhir"
            />


            <DynamicTableInstruktur
                dataInstruktur={instrukturs}
                rowKey="bidang_keahlian"
                colKey="pendidikkan_terakhir"
                title="Instruktur berdasarkan Bidang Keahlian & Pendidikan Terakhir"
            />



        </div>
    );
};

export default InstrukturPelatih;

type TotalInfoCardInstrukturProps = {
    title: string
    total: number
    subtitle?: string
}

function TotalInfoCardInstruktur({ title, total, subtitle = "Total Instruktur" }: TotalInfoCardInstrukturProps) {
    return (
        <Card className="bg-navy-800 border-0">
            <CardHeader className="items-center pb-0 relative w-full flex justify-center text-center">
                <CardTitle className="text-gray-100 text-center max-w-2xl">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0 flex items-center justify-center flex-col mt-9 mb-5">
                <h1 className="text-6xl font-black text-blue-400">
                    <CountUp delay={0.5} end={total} separator="." />
                </h1>
                <p className="font-normal text-lg text-gray-300 mt-2">{subtitle}</p>
            </CardContent>
            <CardFooter className="flex-col gap-2 items-center justify-center text-sm pb-6">
            </CardFooter>
        </Card>
    )
}