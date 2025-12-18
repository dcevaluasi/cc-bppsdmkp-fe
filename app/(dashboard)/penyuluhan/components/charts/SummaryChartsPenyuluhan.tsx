"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResultSummary, useResultSummary } from "@/hooks/penyuluhan/useGeneralSummaryPenyuluhData";

// Softer palette: blue, teal, indigo, tosca variations
const COLORS = [
    "#2563eb", // blue-600
    "#0d9488", // teal-600
    "#4338ca", // indigo-700
    "#14b8a6", // teal-500 (tosca vibe)
    "#1e3a8a", // blue-900
    "#38bdf8", // sky-400
    "#4f46e5", // indigo-600
    "#0f766e", // teal-700
];

// Custom tooltip styled for dark mode
const DarkTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-navy-800 px-3 py-2 rounded-md text-sm text-gray-200 shadow-md">
                <p className="font-medium text-gray-300">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} style={{ color: entry.color }}>
                        {entry.name}: {entry.value.toLocaleString("id-ID")}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};


// Custom Legend Component
const CustomLegend = ({ payload }: any) => {
    return (
        <div className="flex flex-wrap justify-center gap-3 mt-4">
            {payload.map((entry: any, index: number) => (
                <div key={`legend-${index}`} className="flex items-center gap-2">
                    {/* Color dot */}
                    <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                    />
                    {/* Label */}
                    <span className="text-gray-200 text-sm">{entry.value}</span>
                </div>
            ))}
        </div>
    );
};


interface SummaryChartsPenyuluhanProps {
    data?: ResultSummary | null
}

export default function SummaryChartsPenyuluhan({ data }: SummaryChartsPenyuluhanProps) {

    return (
        <div className="flex flex-col gap-5">
            <div className="grid grid-cols-3 gap-6 w-full text-gray-300">

                {/* Status Chart */}
                <Card className="rounded-2xl !bg-slate-900 shadow-lg w-full">
                    <CardHeader>
                        <CardTitle className="text-gray-200">Status Penyuluh</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={data?.status}>
                                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                                <XAxis dataKey="status" stroke="#94a3b8" />
                                <YAxis tickFormatter={(value) => value.toLocaleString("id-ID")}
                                    stroke="#94a3b8" />
                                <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                                <Bar dataKey="total" fill={COLORS[0]} radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Usia Chart */}
                <Card className="rounded-2xl !bg-slate-900 shadow-lg w-full">
                    <CardHeader>
                        <CardTitle className="text-gray-200">Kelompok Usia</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={data?.usia}>
                                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                                <XAxis dataKey="kelompok_usia" stroke="#94a3b8" />
                                <YAxis tickFormatter={(value) => value.toLocaleString("id-ID")}
                                    stroke="#94a3b8" />
                                <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                                <Bar dataKey="total" fill={COLORS[2]} radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Jenis Kelamin → BAR */}
                <Card className="rounded-2xl !bg-slate-900 shadow-lg w-full">
                    <CardHeader>
                        <CardTitle className="text-gray-200">Jenis Kelamin</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={data?.kelamin}>
                                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                                <XAxis dataKey="kelamin" stroke="#94a3b8" />
                                <YAxis tickFormatter={(value) => value.toLocaleString("id-ID")}
                                    stroke="#94a3b8" />
                                <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                                <Bar dataKey="total" fill={COLORS[3]} radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

            </div>
            <div className="grid grid-cols-2 gap-6 w-full text-gray-300">
                {/* Jabatan Chart */}
                <Card className="rounded-2xl !bg-slate-900 shadow-lg w-full">
                    <CardHeader>
                        <CardTitle className="text-gray-200">Jabatan Penyuluh</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={360}>
                            <BarChart data={data?.jabatan}>
                                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                                <XAxis dataKey="jabatan" stroke="#94a3b8" />
                                <YAxis
                                    tickFormatter={(value) => value.toLocaleString("id-ID")}
                                    stroke="#94a3b8"
                                />
                                <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                                <Legend
                                    verticalAlign="top"
                                    align="center"
                                    content={({ payload }) => (
                                        <div className="flex flex-wrap justify-center gap-3 mt-2">
                                            {payload?.map((entry, index) => (
                                                <div
                                                    key={`legend-${index}`}
                                                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-gray-300 text-sm shadow-md"
                                                >
                                                    <span
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: entry.color }}
                                                    />
                                                    {entry.value}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                />
                                <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                                    {data?.jabatan.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Pendidikan Chart */}
                <Card className="rounded-2xl !bg-slate-900 shadow-lg w-full">
                    <CardHeader>
                        <CardTitle className="text-gray-200">Pendidikan Penyuluh</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={360}>
                            <BarChart data={data?.pendidikan}>
                                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                                <XAxis dataKey="pendidikan" stroke="#94a3b8" />
                                <YAxis
                                    tickFormatter={(value) => value.toLocaleString("id-ID")}
                                    stroke="#94a3b8"
                                />
                                <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                                <Legend
                                    verticalAlign="top"
                                    align="center"
                                    content={({ payload }) => (
                                        <div className="flex flex-wrap justify-center gap-3 mt-2">
                                            {payload?.map((entry, index) => (
                                                <div
                                                    key={`legend-${index}`}
                                                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-gray-300 text-sm shadow-md"
                                                >
                                                    <span
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: entry.color }}
                                                    />
                                                    {entry.value}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                />
                                <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                                    {data?.pendidikan.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
            <Card className="rounded-2xl !bg-slate-900 shadow-lg w-full col-span-2">
                <CardHeader>
                    <CardTitle className="text-gray-200">Satminkal Penyuluh</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={360}>
                        <BarChart data={data?.satminkal}>
                            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                            <XAxis
                                dataKey="satminkal"
                                stroke="#94a3b8"
                            />
                            <YAxis tickFormatter={(value) => value.toLocaleString("id-ID")}
                                stroke="#94a3b8" />
                            <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />

                            <Legend
                                verticalAlign="top"
                                align="center"
                                content={({ payload }) => (
                                    <div className="flex flex-wrap justify-center gap-3 mt-2">
                                        {payload?.map((entry, index) => (
                                            <div
                                                key={`legend-${index}`}
                                                className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-gray-300 text-sm shadow-md"
                                            >
                                                <span
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: entry.color }}
                                                />
                                                {entry.value} {/* or if you have totals here: {entry.payload.total.toLocaleString("id-ID")} */}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            />


                            <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                                {data?.satminkal.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>


        </div>

    );
}
