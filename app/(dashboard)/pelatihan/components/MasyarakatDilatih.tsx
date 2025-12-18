"use client";

import React from "react";
import { HashLoader } from "react-spinners";
import Image from "next/image";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FiFilter } from "react-icons/fi";
import Cookies from "js-cookie";
import useFetchDataDukung from "@/hooks/pelatihan/useFetchDataPelatihan";
import { tahunList } from "@/utils/time";
import { DynamicTablePelatihanMasyarakat } from "@/components/dashboard/pelatihan/DynamicTablePelatihanMasyarakat";
import dayjs from "dayjs";
import { parseIndonesianDate, getQuarterForFiltering } from "@/utils/time"
import { UserPelatihan } from "@/types/pelatihan/pelatihan"

const PENYELENGGARA_CATEGORIES = [
    { value: "all", label: "Semua Penyelenggara" },
    { value: "upt", label: "UPT KKP" },
    { value: "pusat", label: "Pusat" },
    { value: "p2mkp", label: "P2MKP" }
]

const MasyarakatDilatih: React.FC = () => {
    const [includePusat, setIncludePusat] = React.useState(true);
    const { data: dataDukung, isFetching: isFetchingDataDukung, refetch } = useFetchDataDukung(includePusat)

    const [tahun, setTahun] = React.useState(() => dayjs().year());
    const [triwulan, setTriwulan] = React.useState(() => {
        const month = dayjs().month() + 1;
        if (month <= 3) return "TW I";
        if (month <= 6) return "TW II";
        if (month <= 9) return "TW III";
        return "TW IV";
    });

    // Filter states
    const [filterCategory, setFilterCategory] = React.useState<string>("all");
    const [filterSpecific, setFilterSpecific] = React.useState<string>("all");

    // Get categorized penyelenggara
    const categorizedPenyelenggara = React.useMemo(() => {
        const categories: {
            pusat: string[]
            upt: string[]
            p2mkp: string[]
        } = {
            pusat: [],
            upt: [],
            p2mkp: []
        }

        const penyelenggaras = new Set<string>()

        dataDukung.forEach((item: UserPelatihan) => {
            const penyelenggara = String(item.PenyelenggaraPelatihan || "")
            if (!penyelenggara || penyelenggara === "-" || penyelenggara === "Tidak Diketahui") return
            penyelenggaras.add(penyelenggara)
        })

        penyelenggaras.forEach(p => {
            const pLower = p.toLowerCase()

            if (pLower === "pusat pelatihan kelautan dan perikanan") {
                categories.pusat.push(p)
            } else if (pLower.includes("balai pelatihan") || pLower.includes("bppp")) {
                categories.upt.push(p)
            } else if (pLower.includes("mandiri") || pLower.includes("p2mkp")) {
                categories.p2mkp.push(p)
            }
        })

        categories.pusat.sort()
        categories.upt.sort()
        categories.p2mkp.sort()

        return categories
    }, [dataDukung])

    // Get specific options based on selected category
    const specificOptions = React.useMemo(() => {
        if (filterCategory === "pusat") return categorizedPenyelenggara.pusat
        if (filterCategory === "upt") return categorizedPenyelenggara.upt
        if (filterCategory === "p2mkp") return categorizedPenyelenggara.p2mkp
        return []
    }, [filterCategory, categorizedPenyelenggara])

    // Reset specific filter when category changes
    React.useEffect(() => {
        setFilterSpecific("all")
    }, [filterCategory])

    // Filter data based on penyelenggara category and specific selection
    const filteredDataByPenyelenggara = React.useMemo(() => {
        return dataDukung.filter((item: UserPelatihan) => {
            const penyelenggara = String(item.PenyelenggaraPelatihan || "").toLowerCase()

            // Filter by Category
            if (filterCategory === "pusat") {
                if (penyelenggara !== "pusat pelatihan kelautan dan perikanan") {
                    return false
                }
            } else if (filterCategory === "upt") {
                if (!penyelenggara.includes("balai pelatihan") && !penyelenggara.includes("bppp")) {
                    return false
                }
            } else if (filterCategory === "p2mkp") {
                if (!penyelenggara.includes("mandiri") && !penyelenggara.includes("p2mkp")) {
                    return false
                }
            }

            // Filter by Specific Penyelenggara
            if (filterSpecific !== "all") {
                const exactPenyelenggara = String(item.PenyelenggaraPelatihan || "")
                if (exactPenyelenggara !== filterSpecific) {
                    return false
                }
            }

            return true
        })
    }, [dataDukung, filterCategory, filterSpecific])

    // Calculate total filtered data
    const totalFiltered = React.useMemo(() => {
        return filteredDataByPenyelenggara.filter((item: UserPelatihan) => {
            if (!item.TanggalMulai) return false

            let d = new Date(item.TanggalMulai)
            if (isNaN(d.getTime())) {
                d = parseIndonesianDate(item.TanggalMulai) as Date
            }
            if (!d || isNaN(d.getTime())) return false

            const itemTahun = String(d.getFullYear())
            const itemTriwulan = getQuarterForFiltering(item.TanggalMulai!)

            if (tahun && itemTahun !== String(tahun)) return false
            if (triwulan) {
                const order = ["TW I", "TW II", "TW III", "TW IV"]
                const selectedIdx = order.indexOf(triwulan)
                const itemIdx = order.indexOf(itemTriwulan)
                if (itemIdx > selectedIdx) return false
            }

            return true
        }).length
    }, [filteredDataByPenyelenggara, tahun, triwulan])

    return (
        <div className="w-full mt-5">
            {isFetchingDataDukung ? (
                <div className="w-full h-[60vh] flex items-center justify-center">
                    <HashLoader color="#338CF5" size={60} />
                </div>
            ) : dataDukung.length != 0 ? (
                <>
                    <div className="flex flex-col gap-4 text-gray-100 bg-navy-800 rounded-lg shadow-lg p-6 mb-6">
                        <div className="flex items-center gap-2 text-base font-semibold">
                            <FiFilter className="text-blue-500" />
                            Filter Data
                        </div>

                        {/* Penyelenggara Filters */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Category Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">
                                    Kategori Penyelenggara
                                </label>
                                <Select value={filterCategory} onValueChange={setFilterCategory}>
                                    <SelectTrigger className="bg-navy-700 border-gray-600 text-gray-100 hover:bg-navy-600">
                                        <SelectValue placeholder="Pilih Kategori" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-navy-700 border-gray-600">
                                        {PENYELENGGARA_CATEGORIES.map(cat => (
                                            <SelectItem key={cat.value} value={cat.value} className="text-gray-100 focus:bg-navy-600">
                                                {cat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {filterCategory !== "all" && (
                                    <p className="text-xs text-gray-400 italic">
                                        {categorizedPenyelenggara[filterCategory as keyof typeof categorizedPenyelenggara]?.length || 0} penyelenggara
                                    </p>
                                )}
                            </div>

                            {/* Specific Penyelenggara Filter */}
                            {specificOptions.length > 0 && filterCategory !== "all" && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">
                                        Penyelenggara Spesifik
                                    </label>
                                    <Select value={filterSpecific} onValueChange={setFilterSpecific}>
                                        <SelectTrigger className="bg-navy-700 border-gray-600 text-gray-100 hover:bg-navy-600">
                                            <SelectValue placeholder="Pilih Penyelenggara" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-navy-700 border-gray-600 max-h-[300px]">
                                            <SelectItem value="all" className="text-gray-100 focus:bg-navy-600 font-semibold">
                                                Semua {PENYELENGGARA_CATEGORIES.find(c => c.value === filterCategory)?.label}
                                            </SelectItem>
                                            {specificOptions.map(p => (
                                                <SelectItem key={p} value={p} className="text-gray-100 focus:bg-navy-600">
                                                    {p}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>

                        {/* Tahun & Triwulan Filters */}
                        <div className="border-t border-gray-700 pt-4">
                            <label className="text-sm font-medium text-gray-300 block mb-2">
                                Periode
                            </label>
                            <div className="flex flex-wrap gap-2">
                                <Select value={String(tahun)} onValueChange={(val) => setTahun(Number(val))}>
                                    <SelectTrigger className="w-[140px] bg-navy-700 border-gray-600 text-gray-100 hover:bg-navy-600">
                                        <SelectValue placeholder="Pilih Tahun" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-navy-700 border-gray-600">
                                        {tahunList.map((y) => (
                                            <SelectItem key={y} value={String(y)} className="text-gray-100 focus:bg-navy-600">
                                                {y}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={triwulan} onValueChange={setTriwulan}>
                                    <SelectTrigger className="w-[140px] bg-navy-700 border-gray-600 text-gray-100 hover:bg-navy-600">
                                        <SelectValue placeholder="Pilih Triwulan" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-navy-700 border-gray-600">
                                        <SelectItem value="TW I" className="text-gray-100 focus:bg-navy-600">TW I</SelectItem>
                                        <SelectItem value="TW II" className="text-gray-100 focus:bg-navy-600">TW II</SelectItem>
                                        <SelectItem value="TW III" className="text-gray-100 focus:bg-navy-600">TW III</SelectItem>
                                        <SelectItem value="TW IV" className="text-gray-100 focus:bg-navy-600">TW IV</SelectItem>
                                    </SelectContent>
                                </Select>

                                {Cookies.get('Access')?.includes('superAdmin') && (
                                    <Select
                                        value={includePusat ? "true" : "false"}
                                        onValueChange={(value) => setIncludePusat(value === "true")}
                                    >
                                        <SelectTrigger className="w-[180px] bg-navy-700 border-gray-600 text-gray-100 hover:bg-navy-600">
                                            <SelectValue placeholder="Include Pusat" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-navy-700 border-gray-600">
                                            <SelectItem value="false" className="text-gray-100 focus:bg-navy-600">Tanpa Pusat</SelectItem>
                                            <SelectItem value="true" className="text-gray-100 focus:bg-navy-600">Dengan Pusat</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="border-t border-gray-700 pt-4">
                            <p className="text-sm text-gray-400">
                                Total data terfilter: <span className="font-bold text-blue-400">{totalFiltered.toLocaleString('id-ID')}</span> dari <span className="font-bold text-gray-300">{dataDukung.length.toLocaleString('id-ID')}</span> data
                            </p>
                        </div>
                    </div>

                    <DynamicTablePelatihanMasyarakat
                        tahun={tahun.toString()}
                        triwulan={triwulan}
                        dataUser={filteredDataByPenyelenggara}
                        rowKey="PenyelenggaraPelatihan"
                        colKey="Triwulan"
                        title="Masyarakat Dilatih berdasarkan Penyelenggara & Triwulan"
                    />

                    <DynamicTablePelatihanMasyarakat
                        tahun={tahun.toString()}
                        triwulan={triwulan}
                        dataUser={filteredDataByPenyelenggara}
                        rowKey="PenyelenggaraPelatihan"
                        colKey="JenisKelamin"
                        title="Masyarakat Dilatih berdasarkan Penyelenggara & Jenis Kelamin"
                    />

                    <DynamicTablePelatihanMasyarakat
                        tahun={tahun.toString()}
                        triwulan={triwulan}
                        dataUser={filteredDataByPenyelenggara}
                        rowKey="PenyelenggaraPelatihan"
                        colKey="PendidikanTerakhir"
                        title="Masyarakat Dilatih berdasarkan Penyelenggara & Pendidikan Terakhir"
                    />

                    <DynamicTablePelatihanMasyarakat
                        tahun={tahun.toString()}
                        triwulan={triwulan}
                        dataUser={filteredDataByPenyelenggara}
                        rowKey="Provinsi"
                        colKey="BidangPelatihan"
                        title="Masyarakat Dilatih berdasarkan Provinsi & Bidang/Klaster Pelatihan"
                    />

                    <DynamicTablePelatihanMasyarakat
                        tahun={tahun.toString()}
                        triwulan={triwulan}
                        dataUser={filteredDataByPenyelenggara}
                        rowKey="Provinsi"
                        colKey="PenyelenggaraPelatihan"
                        title="Masyarakat Dilatih berdasarkan Provinsi & Penyelenggara Pelatihan"
                    />

                    <DynamicTablePelatihanMasyarakat
                        tahun={tahun.toString()}
                        triwulan={triwulan}
                        dataUser={filteredDataByPenyelenggara}
                        rowKey="PenyelenggaraPelatihan"
                        colKey="JenisProgram"
                        title="Masyarakat Dilatih berdasarkan Sektor Pelatihan & Penyelenggara Pelatihan"
                    />

                    <DynamicTablePelatihanMasyarakat
                        tahun={tahun.toString()}
                        triwulan={triwulan}
                        dataUser={filteredDataByPenyelenggara}
                        rowKey="BidangPelatihan"
                        colKey="PenyelenggaraPelatihan"
                        title="Masyarakat Dilatih berdasarkan Klaster Pelatihan & Penyelenggara Pelatihan"
                    />

                    <DynamicTablePelatihanMasyarakat
                        tahun={tahun.toString()}
                        triwulan={triwulan}
                        dataUser={filteredDataByPenyelenggara}
                        rowKey="Program"
                        colKey="PenyelenggaraPelatihan"
                        title="Masyarakat Dilatih berdasarkan Program Pelatihan & Penyelenggara Pelatihan"
                    />

                    <DynamicTablePelatihanMasyarakat
                        tahun={tahun.toString()}
                        triwulan={triwulan}
                        dataUser={filteredDataByPenyelenggara}
                        rowKey="DukunganProgramPrioritas"
                        colKey="PenyelenggaraPelatihan"
                        title="Masyarakat Dilatih berdasarkan Dukungan Program Prioritas & Penyelenggara Pelatihan"
                    />
                </>
            ) : (
                <div className="relative max-w-7xl w-full mx-auto mt-20">
                    <div className="pt-7 md:pt-0 flex flex-col items-center">
                        <Image
                            src={"/illustrations/not-found.png"}
                            alt="Not Found"
                            width={0}
                            height={0}
                            className="w-[350px] md:w-[400px]"
                        />
                        <div className="max-w-3xl mx-auto text-center pb-5 md:pb-8 -mt-2">
                            <h1 className="text-2xl md:text-3xl font-calsans leading-[110%] text-gray-100">
                                Belum Ada Pelatihan
                            </h1>
                            <div className="text-gray-300 text-center leading-[125%] max-w-md">
                                Capaian ataupun summary dari pelaksanaan pelatihan belum dapat
                                dilihat, karena Balai Pelatihan belum memiliki peneyelenggaraan
                                pelatihan!
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MasyarakatDilatih;