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
    Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGapokkanPerProvinsi, useGapokkanPerSatminkal } from "@/hooks/penyuluhan/useSummaryGapokkanData";

const COLORS = [
    "#2563eb", // blue-600
    "#0d9488", // teal-600
    "#4338ca", // indigo-700
    "#14b8a6", // teal-500
    "#1e3a8a", // blue-900
    "#38bdf8", // sky-400
    "#4f46e5", // indigo-600
    "#0f766e", // teal-700
];

const DarkTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-navy-700 px-3 py-2 rounded-md text-sm text-gray-200 border border-gray-500 shadow-md">
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

interface SummaryChartsGapokkanProps {
    tahun: string | undefined;
    triwulan: string | undefined;
    provinsi?: string;
    kabupaten?: string;
}

export default function SummaryChartsGapokkan({ tahun, triwulan, provinsi, kabupaten }: SummaryChartsGapokkanProps) {
    const { data: gapokkanPerProvinsi } = useGapokkanPerProvinsi({
        tahun, tw: triwulan, provinsi: provinsi,
        kabupaten: kabupaten
    });
    const { data: gapokkanPerSatminkal } = useGapokkanPerSatminkal({
        tahun, tw: triwulan, provinsi: provinsi,
        kabupaten: kabupaten
    });

    return (
        <div className="flex flex-col gap-6">
            {/* Gapokkan per Provinsi */}
            <Card className="rounded-2xl !bg-slate-900 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-gray-200">Gapokkan per Provinsi</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={360}>
                        <BarChart data={gapokkanPerProvinsi}>
                            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                            <XAxis dataKey="provinsi" stroke="#94a3b8" />
                            <YAxis
                                tickFormatter={(value) => Number(value).toLocaleString("id-ID")}
                                stroke="#94a3b8"
                            />
                            <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                            <Legend wrapperStyle={{ color: "#cbd5e1" }} />

                            <Bar dataKey="gapokkan" name="Gapokkan" fill={COLORS[0]} radius={[6, 6, 0, 0]} />
                            <Bar dataKey="koperasi" name="Koperasi" fill={COLORS[1]} radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Gapokkan per Satminkal */}
            <Card className="rounded-2xl !bg-slate-900 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-gray-200">Gapokkan per Satminkal</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={360}>
                        <BarChart data={gapokkanPerSatminkal}>
                            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                            <XAxis dataKey="satminkal" stroke="#94a3b8" />
                            <YAxis
                                tickFormatter={(value) => Number(value).toLocaleString("id-ID")}
                                stroke="#94a3b8"
                            />
                            <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                            <Legend wrapperStyle={{ color: "#cbd5e1" }} />

                            <Bar dataKey="gapokkan" name="Gapokkan" fill={COLORS[2]} radius={[6, 6, 0, 0]} />
                            <Bar dataKey="koperasi" name="Koperasi" fill={COLORS[3]} radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
