"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    useKelompokBidangUsahaPerProvinsi,
    useKelompokBidangUsahaPerSatminkal,
    useKelompokJumlahPerProvinsi,
    useKelompokJumlahPerSatminkal,
    useKelompokKelasPerProvinsi,
} from "@/hooks/penyuluhan/useSummaryKelompokDisuluhData";

const COLORS = ["#2563eb", "#0d9488", "#4338ca", "#14b8a6", "#f59e0b"];

const DarkTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-navy-700 border border-gray-500 px-3 py-2 rounded-md text-sm text-gray-200 shadow-md">
                <p className="font-semibold text-gray-300">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} style={{ color: entry.color }}>
                        {entry.name}: {Number(entry.value).toLocaleString("id-ID")}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

interface SummaryChartsKelompokDisuluhProps {
    tahun?: string;
    triwulan?: string;
    provinsi?: string;
    kabupaten?: string;
}

export default function SummaryChartsKelompokDisuluh({
    tahun,
    triwulan,
    provinsi,
    kabupaten
}: SummaryChartsKelompokDisuluhProps) {
    const { data: jumlahPerSatminkalData = [] } = useKelompokJumlahPerSatminkal({
        tahun,
        tw: triwulan,
        provinsi,
        kabupaten
    });
    const { data: jumlahPerProvinsiData = [] } = useKelompokJumlahPerProvinsi({
        tahun,
        tw: triwulan,
        provinsi,
        kabupaten
    });
    const { data: bidangUsahaPerProvinsiData = [] } = useKelompokBidangUsahaPerProvinsi({
        tahun,
        tw: triwulan,
        provinsi,
        kabupaten
    });
    const { data: kelasPerProvinsiData = [] } = useKelompokKelasPerProvinsi({
        tahun,
        tw: triwulan,
        provinsi,
        kabupaten
    });
    const { data: bidangUsahaPerSatminkalData = [] } = useKelompokBidangUsahaPerSatminkal({
        tahun,
        tw: triwulan,
        provinsi,
        kabupaten
    });

    return (
        <div className="flex flex-col gap-6">
            <div className={provinsi !== "" ? "w-full flex gap-5" : "space-y-5"}>
                {/* 1. Jumlah per Satminkal */}
                <Card className="rounded-2xl !bg-slate-900 shadow-lg w-full">
                    <CardHeader>
                        <CardTitle className="text-gray-200">
                            Jumlah Kelompok per Satminkal
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={jumlahPerSatminkalData}
                                layout="horizontal"
                                margin={{ left: 40 }}
                            >
                                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                                <YAxis type="number" stroke="#94a3b8" />
                                <XAxis type="category" dataKey="satminkal" stroke="#94a3b8" width={120} />
                                <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                                <Bar dataKey="jml_kelompok" name="Jumlah Kelompok" fill={COLORS[0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 2. Jumlah per Provinsi */}
                <Card className="rounded-2xl !bg-slate-900 shadow-lg w-full">
                    <CardHeader>
                        <CardTitle className="text-gray-200">
                            Jumlah Kelompok per Provinsi
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={jumlahPerProvinsiData}
                                layout="horizontal"
                                margin={{ left: 40 }}
                            >
                                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                                <YAxis type="number" stroke="#94a3b8" />
                                <XAxis type="category" dataKey="provinsi" stroke="#94a3b8" width={120} />
                                <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                                <Bar dataKey="jml_kelompok" name="Jumlah Kelompok" fill={COLORS[1]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 4. Kelas per Provinsi */}
                <Card className="rounded-2xl !bg-slate-900 shadow-lg w-full">
                    <CardHeader>
                        <CardTitle className="text-gray-200">Kelas Kelompok per Provinsi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={kelasPerProvinsiData}
                                layout="horizontal"
                                margin={{ left: 40 }}
                            >
                                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                                <YAxis type="number" stroke="#94a3b8" />
                                <XAxis type="category" dataKey="provinsi" stroke="#94a3b8" width={120} />
                                <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                                <Legend wrapperStyle={{ color: "#cbd5e1" }} />
                                <Bar dataKey="PEMULA" name="Pemula" fill={COLORS[0]} stackId="a" />
                                <Bar dataKey="MADYA" name="Madya" fill={COLORS[1]} stackId="a" />
                                <Bar dataKey="LANJUT" name="Lanjut" fill={COLORS[2]} stackId="a" />
                                <Bar dataKey="UTAMA" name="Utama" fill={COLORS[3]} stackId="a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="w-full flex gap-5">
                {/* 3. Bidang Usaha per Provinsi */}
                <Card className="rounded-2xl !bg-slate-900 shadow-lg w-full">
                    <CardHeader>
                        <CardTitle className="text-gray-200">Bidang Usaha per Provinsi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer
                            width="100%"
                            height={provinsi === "" ? 800 : 600}
                        >
                            <BarChart
                                data={bidangUsahaPerProvinsiData}
                                layout={provinsi === "" ? "vertical" : "horizontal"}
                                margin={provinsi === "" ? { left: 40 } : { top: 20, right: 30, left: 20, bottom: 80 }}
                            >
                                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />

                                {provinsi === "" ? (
                                    <>
                                        <XAxis
                                            type="number"
                                            stroke="#94a3b8"
                                            tickFormatter={(v) => Number(v).toLocaleString("id-ID")}
                                        />
                                        <YAxis type="category" dataKey="provinsi" stroke="#94a3b8" width={120} />
                                    </>
                                ) : (
                                    <>
                                        <XAxis
                                            type="category"
                                            dataKey="provinsi"
                                            stroke="#94a3b8"
                                            textAnchor="end"
                                            height={100}
                                        />
                                        <YAxis
                                            type="number"
                                            stroke="#94a3b8"
                                            tickFormatter={(v) => Number(v).toLocaleString("id-ID")}
                                        />
                                    </>
                                )}

                                <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                                <Legend wrapperStyle={{ color: "#cbd5e1" }} />
                                <Bar dataKey="BUDIDAYA" name="Budidaya" fill={COLORS[0]} stackId="a" />
                                <Bar dataKey="PENANGKAPAN" name="Penangkapan" fill={COLORS[1]} stackId="a" />
                                <Bar dataKey="PENGOLAHAN/PEMASARAN" name="Pengolahan/Pemasaran" fill={COLORS[2]} stackId="a" />
                                <Bar dataKey="GARAM" name="Garam" fill={COLORS[3]} stackId="a" />
                                <Bar dataKey="PENGAWASAN" name="Pengawasan" fill={COLORS[4]} stackId="a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 5. Bidang Usaha per Satminkal */}
                <Card className="rounded-2xl !bg-slate-900 shadow-lg w-full w-full">
                    <CardHeader>
                        <CardTitle className="text-gray-200">Bidang Usaha per Satminkal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer
                            width="100%"
                            height={provinsi === "" ? 600 : 500}
                        >
                            <BarChart
                                data={bidangUsahaPerSatminkalData}
                                layout={provinsi === "" ? "vertical" : "horizontal"}
                                margin={provinsi === "" ? { left: 40 } : { top: 20, right: 30, left: 20, bottom: 80 }}
                            >
                                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />

                                {provinsi === "" ? (
                                    <>
                                        <XAxis
                                            type="number"
                                            stroke="#94a3b8"
                                            tickFormatter={(v) => Number(v).toLocaleString("id-ID")}
                                        />
                                        <YAxis type="category" dataKey="satminkal" stroke="#94a3b8" width={120} />
                                    </>
                                ) : (
                                    <>
                                        <XAxis
                                            type="category"
                                            dataKey="satminkal"
                                            stroke="#94a3b8"
                                            textAnchor="end"
                                            height={100}
                                        />
                                        <YAxis
                                            type="number"
                                            stroke="#94a3b8"
                                            tickFormatter={(v) => Number(v).toLocaleString("id-ID")}
                                        />
                                    </>
                                )}

                                <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                                <Legend wrapperStyle={{ color: "#cbd5e1" }} />
                                <Bar dataKey="BUDIDAYA" name="Budidaya" fill={COLORS[0]} stackId="a" />
                                <Bar dataKey="PENANGKAPAN" name="Penangkapan" fill={COLORS[1]} stackId="a" />
                                <Bar dataKey="PENGOLAHAN/PEMASARAN" name="Pengolahan/Pemasaran" fill={COLORS[2]} stackId="a" />
                                <Bar dataKey="GARAM" name="Garam" fill={COLORS[3]} stackId="a" />
                                <Bar dataKey="PENGAWASAN" name="Pengawasan" fill={COLORS[4]} stackId="a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>


        </div>
    );
}
