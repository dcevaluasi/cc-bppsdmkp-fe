'use client'

import {
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import React from 'react';

import {
    Label,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    XAxis,
    YAxis,
    Bar,
    Cell,
    LabelList,
    CartesianGrid,
} from "recharts";

import { DotLoader } from 'react-spinners';
import Card from "@/components/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart3, TrendingUp } from 'lucide-react';

interface AlumniChartsProp {
    loading: boolean;
    title: string;
    data: any[];
    config?: object;
    isFull?: boolean
}

const AlumniCharts: React.FC<AlumniChartsProp> = ({ loading, title, data, config, isFull }) => {
    return loading ? (
        <div className="flex w-full h-[25vh] py-10 items-center justify-center">
            <DotLoader color="#3b82f6" size={50} />
        </div>
    ) : (
        <div className="space-y-6">
            <CardBarChart
                title={title}
                data={data}
                config={config}
                isFull={isFull}
            />
            <DataTable data={data} title={title} />
        </div>
    );
};

export default AlumniCharts;

type Props = {
    title: string;
    data: { name: string; value: number; fill: string }[];
    config: any
    isFull?: boolean
};

function CardBarChart({
    title,
    data,
    config,
    isFull,
}: Props) {
    // Normalize name function
    const normalizeName = (name: string) => {
        return name
            .replace(/Sekolah Usaha Perikanan Menengah \(SUPM\)/gi, 'SUPM')
            .replace(/Politeknik/gi, 'Poltek')
    }

    const total = data.reduce(
        (acc: number, item: any) => acc + item.value,
        0
    );

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const { name, value } = payload[0].payload;
            const displayName = normalizeName(name);

            return (
                <div className="p-3 bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-blue-500/50 rounded-lg shadow-xl backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-4 h-4 text-blue-400" />
                        <strong className="text-sm text-white font-semibold">{displayName}</strong>
                    </div>
                    <div className="space-y-1 text-xs">
                        <div className="flex justify-between gap-4 text-gray-300">
                            <span>Jumlah:</span>
                            <span className="font-bold text-blue-400">{value.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between gap-4 text-gray-300">
                            <span>Persentase:</span>
                            <span className="font-bold text-teal-400">{((value / total) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between gap-4 pt-2 mt-2 border-t border-gray-700">
                            <span className="font-semibold text-gray-200">Total Keseluruhan:</span>
                            <span className="font-bold text-gray-200">{total.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    const CustomBarCursor = (props: any) => {
        const { x, y, width, height } = props;
        return (
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                rx={4}
                ry={4}
                fill="rgba(59, 130, 246, 0.1)"
                stroke="rgba(59, 130, 246, 0.3)"
                strokeWidth={1}
            />
        );
    };

    return (
        <Card className="flex flex-col w-full bg-gradient-to-br from-navy-800 to-navy-900 border-navy-600">
            <CardHeader className="items-center pb-4 border-b border-navy-600/50">
                <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    <CardTitle className="text-white text-center">{title}</CardTitle>
                </div>
            </CardHeader>

            <CardContent className="flex-1 pb-0 pt-2">
                <ChartContainer config={config} className="mx-auto max-h-[800px]">
                    <ResponsiveContainer width="100%" height={500}>
                        <BarChart
                            data={data}
                            layout="horizontal"
                            margin={{ top: 20, right: 10, bottom: 0, left: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <Tooltip content={<CustomTooltip />} cursor={<CustomBarCursor />} />
                            <YAxis
                                type="number"
                                stroke="#9CA3AF"
                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            />
                            <XAxis
                                type="category"
                                dataKey="name"
                                stroke="#9CA3AF"
                                tickLine={false}
                                angle={isFull ? -45 : 0}
                                textAnchor={isFull ? "end" : "middle"}
                                interval={0}
                                tick={(props) => {
                                    const { x, y, payload } = props;
                                    const displayName = normalizeName(payload.value);
                                    return (
                                        <text
                                            x={x}
                                            y={y}
                                            dy={16}
                                            textAnchor={isFull ? "end" : "middle"}
                                            transform={isFull ? `rotate(-45, ${x}, ${y})` : undefined}
                                            fill="#E5E7EB"
                                            fontSize={12}
                                            fontWeight={500}
                                        >
                                            {displayName.toUpperCase()}
                                        </text>
                                    );
                                }}
                                height={isFull ? 100 : 60}
                            >
                                <Label
                                    value=""
                                    offset={10}
                                    position="insideBottom"
                                    style={{ fill: "#9CA3AF", fontSize: 14 }}
                                />
                            </XAxis>

                            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                <LabelList
                                    dataKey="value"
                                    position="top"
                                    offset={8}
                                    formatter={(value: number) => value.toLocaleString('id-ID')}
                                    style={{
                                        fill: '#E5E7EB',
                                        fontSize: 11,
                                        fontWeight: 'bold',
                                        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                                    }}
                                />
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.fill || `hsl(${index * 50}, 60%, 60%)`}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

function DataTable({ data, title }: { title: string, data: { name: string; value: number; fill: string }[] }) {
    const normalizeName = (name: string) => {
        return name
            .replace(/Sekolah Usaha Perikanan Menengah \(SUPM\)/gi, 'SUPM')
            .replace(/Politeknik/gi, 'Poltek')
    }

    const total = data.reduce((acc, item) => acc + item.value, 0);

    return (
        <Card className="flex flex-col w-full bg-gradient-to-br from-navy-800 to-navy-900 border-navy-600">
            <CardHeader className="pb-4 border-b border-navy-600/50">
                <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    Detail Data
                </CardTitle>
                <p className="text-sm text-gray-400 mt-1">
                    {title}                </p>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="overflow-x-auto rounded-lg border-2 border-navy-600/50 shadow-xl">
                    <table className="min-w-full divide-y divide-navy-600 bg-navy-700/50 text-sm text-gray-200">
                        <thead className="bg-gradient-to-r from-navy-800 to-navy-900">
                            <tr>
                                <th className="px-4 py-4 text-center font-semibold text-gray-200 border-r border-navy-600">
                                    #
                                </th>
                                <th className="px-4 py-4 text-left font-semibold text-gray-200 w-fit border-r border-navy-600">
                                    <div className="flex items-center gap-2">
                                        <BarChart3 className="w-3 h-3 text-blue-400" />
                                        Data
                                    </div>
                                </th>
                                <th className="px-4 py-4 text-right font-semibold text-gray-200 min-w-[120px] border-l border-navy-600/30"
                                    style={{ background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))' }}>
                                    <div className="flex items-center justify-end gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        Jumlah
                                    </div>
                                </th>
                                <th className="px-4 py-4 text-right font-bold text-gray-200 bg-navy-900 border-l-2 border-teal-500/50 min-w-[120px]">
                                    <div className="flex items-center justify-end gap-2">
                                        <TrendingUp className="w-3 h-3 text-teal-400" />
                                        Persentase
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-navy-600/50">
                            {data.map((item, rowIndex) => {
                                const percentage = ((item.value / total) * 100).toFixed(1);

                                return (
                                    <tr
                                        key={rowIndex}
                                        className="hover:bg-navy-600/50 transition-all duration-200 group"
                                        style={{
                                            background: rowIndex % 2 === 0 ? 'rgba(30, 41, 59, 0.3)' : 'rgba(15, 23, 42, 0.3)'
                                        }}
                                    >
                                        <td className="px-4 py-3 text-center text-gray-300 border-r border-navy-600">
                                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">
                                                {rowIndex + 1}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-200 font-medium border-r border-navy-600">
                                            {normalizeName(item.name)}
                                        </td>
                                        <td className="px-4 py-3 text-right text-gray-300 border-l border-navy-600/20">
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="inline-block px-3 py-1 rounded bg-blue-500/10 text-blue-300 font-medium">
                                                    {item.value.toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right font-bold text-teal-400 bg-navy-800/50 border-l-2 border-teal-500/30">
                                            <span className="inline-block px-3 py-1 rounded-lg bg-teal-500/20 text-teal-300 font-bold">
                                                {percentage}%
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            <tr className="bg-gradient-to-r from-navy-900 to-navy-800 font-bold border-t-2 border-blue-500/50">
                                <td colSpan={2} className="px-4 py-4 text-right text-gray-200 uppercase tracking-wider border-r border-navy-600">
                                    <div className="flex items-center justify-end gap-2">
                                        <TrendingUp className="w-4 h-4 text-teal-400" />
                                        TOTAL
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-right text-blue-300 border-l border-navy-600/30">
                                    <span className="inline-block px-3 py-1 rounded bg-blue-500/20 font-bold">
                                        {total.toLocaleString('id-ID')}
                                    </span>
                                </td>
                                <td className="px-4 py-4 text-right text-teal-300 bg-navy-900 border-l-2 border-teal-500/50">
                                    <span className="inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500/30 to-blue-500/30 text-white font-bold text-sm shadow-lg">
                                        100%
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}