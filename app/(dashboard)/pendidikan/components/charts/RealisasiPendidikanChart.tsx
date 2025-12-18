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
import { BarChart3 } from 'lucide-react';

// Define the types for the props
interface RealisasiPendidikanChartProp {
    loading: boolean;
    title: string;
    data: any[];
    config?: object;
    isFull?: boolean
}

const RealisasiPendidikanChart: React.FC<RealisasiPendidikanChartProp> = ({ loading, title, data, config, isFull }) => {
    return loading ? (
        <div className="flex w-full h-[25vh] py-10 items-center justify-center">
            <DotLoader color="#3b82f6" size={50} />
        </div>
    ) : (
        <CardBarChart
            title={title}
            data={data}
            config={config}
            isFull={isFull}
        />
    );
};

export default RealisasiPendidikanChart;

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
                            margin={{ top: 20, right: 30, bottom: 0, left: 20 }}
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