"use client";

import React from "react";
import { HashLoader } from "react-spinners";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FiBook, FiCalendar, FiCheckCircle, FiLayers } from "react-icons/fi";
import CountUp from "react-countup";
import { useFetchDataMateriPelatihanMasyarakat } from "@/hooks/pelatihan/useFetchDataModul";
import { DynamicTableModulPelatihan } from "@/components/dashboard/pelatihan/DynamicTableModulPelatihan";

const ModulPelatihan: React.FC = () => {
    const { data, loading, error, stats } = useFetchDataMateriPelatihanMasyarakat();

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
                <p className="text-gray-300 mt-2">Terjadi kesalahan saat memuat data materi pelatihan.</p>
            </div>
        );
    }

    if (data.length === 0) {
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
                            Belum Ada Data Modul Pelatihan
                        </h1>
                        <div className="text-gray-300 text-center leading-[125%] max-w-md">
                            Data modul pelatihan belum tersedia saat ini.
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full mt-5 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-navy-800 border-0">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                            <FiBook className="text-blue-500" />
                            Total Modul
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-400">
                            <CountUp end={data.length} separator="." />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-navy-800 border-0">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                            <FiLayers className="text-green-500" />
                            Bidang Pelatihan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-400">
                            <CountUp end={Object.keys(stats.bidang).length} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-navy-800 border-0">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                            <FiCalendar className="text-purple-500" />
                            Tahun
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-purple-400">
                            <CountUp end={Object.keys(stats.tahun).length} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-navy-800 border-0">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                            <FiCheckCircle className="text-yellow-500" />
                            Telah Disahkan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-yellow-400">
                            <CountUp end={stats.verified['true'] || 0} separator="." />
                        </div>
                    </CardContent>
                </Card>
            </div>


            <DynamicTableModulPelatihan
                dataMateri={data}
                rowKey="Tahun"
                colKey="BidangMateriPelatihan"
                title="Materi Pelatihan berdasarkan Tahun & Bidang"
            />

        </div>
    );
};

export default ModulPelatihan;