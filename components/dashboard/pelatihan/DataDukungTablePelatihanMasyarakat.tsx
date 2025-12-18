"use client";

import React, { useMemo } from "react";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import { FiBarChart2, FiDownload } from "react-icons/fi"
import { Button } from "@/components/ui/button";
import { splitCityAndDate } from "@/utils/text";
import { generateTanggalPelatihan } from "@/utils/time";
import { UserPelatihan } from "@/types/pelatihan/pelatihan";

const DataDukungTablePelatihanMasyarakat = ({ data, tahun, triwulan }: { data: UserPelatihan[], tahun: number, triwulan: string }) => {

    const triwulanToMonth = (tw: string) => {
        if (tw === "TW I") return 3;
        if (tw === "TW II") return 6;
        if (tw === "TW III") return 9;
        return 12;
    };

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            const berakhir = dayjs(item.TanggalMulai, "YYYY-MM-DD");
            const matchTahun = berakhir.year() === tahun;
            const batasBulan = triwulanToMonth(triwulan);
            const matchTriwulan = matchTahun && berakhir.month() + 1 <= batasBulan;
            return matchTriwulan;
        });
    }, [data, tahun, triwulan]);

    const totalData = filteredData.length;

    const handleExportExcel = () => {
        const sortedData = [...filteredData].sort((a, b) => {
            const aPeny = a.PenyelenggaraPelatihan || "";
            const bPeny = b.PenyelenggaraPelatihan || "";

            const aIsPusat = aPeny.toLowerCase().includes("pusat");
            const bIsPusat = bPeny.toLowerCase().includes("pusat");

            if (aIsPusat && !bIsPusat) return -1;
            if (!aIsPusat && bIsPusat) return 1;

            return aPeny.localeCompare(bPeny);
        });

        const exportData = sortedData.map((item, index) => ({
            "NO": index + 1,
            "PENYELENGGARA PELATIHAN": item.PenyelenggaraPelatihan.toUpperCase(),
            "NAMA": item.Nama.toUpperCase(),
            NIK: item.Nik || "-",
            "NO TELPON": item.NoTelpon || "-",
            "TEMPAT LAHIR": splitCityAndDate(item.TempatTanggalLahir).city,
            "TANGGAL LAHIR": splitCityAndDate(item.TempatTanggalLahir).date,
            "KOTA/KABUPATEN": item.Kota?.toString()?.toUpperCase(),
            PROVINSI: item.Provinsi?.toString()?.toUpperCase(),
            "JENIS KELAMIN": item.JenisKelamin,
            ALAMAT: item.Alamat || "-",
            "PENDIDIKAN TERKAHIR": item.PendidikanTerakhir,
            "NAMA PELATIHAN": item.NamaPelatihan.toUpperCase(),
            "SEKTOR PELATIHAN": item.JenisProgram.toUpperCase(),
            "BIDANG/KLASTER PELATIHAN": item.BidangPelatihan.toUpperCase(),
            "PROGRAM PELATIHAN": item.Program.toUpperCase(),
            "DUKUNGAN PROGRAM PRIORITAS": item.DukunganProgramPrioritas.toUpperCase(),
            "TANGGAL PELATIHAN": `${generateTanggalPelatihan(item.TanggalMulai)} - ${generateTanggalPelatihan(item.TanggalBerakhir)}`.toUpperCase(),
            "NO SERTIFIKAT": item.NoRegistrasi,
            "FILE SERTIFIKAT": item.FileSertifikat
                ? `https://elaut-bppsdm.kkp.go.id/api-elaut/public/static/sertifikat-ttde/${item.FileSertifikat}`
                : "-",
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        worksheet["!cols"] = Object.keys(exportData[0]).map(() => ({ wch: 25 }));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data Pelatihan");
        XLSX.writeFile(
            workbook,
            `DATA DUKUNG MASYARAKAT DILATIH ${tahun} - ${triwulan}.xlsx`
        );
    };

    return (
        <div className="space-y-6">
            <div className="bg-navy-800 rounded-lg shadow-lg border border-gray-700">
                <div className="px-6 py-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
                        <FiBarChart2 className="text-blue-500" />
                        Data Dukung <span className="italic">By Name By Address</span> Masyarakat Dilatih
                    </h3>
                </div>

                <div className="p-6">
                    <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-navy-700 rounded-lg p-4 border border-gray-600">
                        <div>
                            <p className="flex items-center gap-2 font-semibold text-gray-100">
                                <FiBarChart2 className="text-blue-500 flex-shrink-0" />
                                Rekapitulasi {tahun} - {triwulan}
                            </p>
                            <p className="text-gray-300 mt-1">
                                Total Data: <span className="font-bold text-blue-400">{totalData.toLocaleString('id-ID')}</span>
                            </p>
                        </div>
                        <Button
                            onClick={handleExportExcel}
                            className="flex items-center gap-2 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <FiDownload className="w-4 h-4" />
                            Download Data Dukung
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataDukungTablePelatihanMasyarakat;