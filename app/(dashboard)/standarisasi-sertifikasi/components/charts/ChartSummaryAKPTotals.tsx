"use client";

import React from "react";
import { useSummaryTotals } from "@/hooks/sertifikasi/akp/useSummaryTotals";
import {
    ResponsiveContainer,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Bar,
} from "recharts";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";

interface Props {
    jenis: "Keahlian" | "Keterampilan";
}

export default function ChartSummaryAKPTotals({ jenis }: Props) {
    const { data, isLoading, error } = useSummaryTotals(jenis);

    if (isLoading) return <p className="text-gray-400">Loading...</p>;
    if (error) return <p className="text-red-400">Failed to load data</p>;
    if (!data) return null;

    // gabungin dua dataset (sertifikat & ujian) jadi satu per tahun
    const chartData = data.data.total_sertifikat.map((s) => {
        const ujian = data.data.total_ujian_selesai.find(
            (u) => u.tahun === s.tahun
        );
        return {
            tahun: s.tahun,
            totalSertifikat: Number(s.total_sertifikat),
            totalUjian: ujian ? Number(ujian.total_ujian_selesai) : 0,
        };
    });

    return (
        <Card className="bg-navy-800 border border-navy-700 text-white">
            <CardHeader>
                <CardTitle>Trend Sertifikasi {jenis} Awak Kapal Perikanan (AKP)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="tahun" stroke="#cbd5e1" />
                            <YAxis stroke="#cbd5e1" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(30, 41, 59, 0.85)",
                                    border: "1px solid #334155",
                                    color: "#f1f5f9",
                                }}
                                cursor={{ fill: "rgba(255,255,255,0.05)" }}
                            />

                            <Legend />
                            <Bar
                                dataKey="totalSertifikat"
                                fill="#3b82f6"
                                name="Total Sertifikat Keahlian"
                                activeBar={{
                                    fill: "rgba(59,130,246", // warna bar pas hover
                                }}
                            />
                            <Bar
                                dataKey="totalUjian"
                                fill="#f59e0b"
                                name="Total Pelaksanaan Ujian Berdasarkan Kelas"
                                activeBar={{
                                    fill: "rgba(245,158,11)",
                                }}
                            />

                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
