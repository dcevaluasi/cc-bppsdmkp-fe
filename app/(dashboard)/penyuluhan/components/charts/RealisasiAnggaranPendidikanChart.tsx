'use client'

import {
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Card from "@/components/card";
import { ChartContainer } from "@/components/ui/chart";
import { DotLoader } from 'react-spinners';
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
} from "recharts";
import React from "react";
import { simplifySatkerName } from "@/utils/text";

interface RealisasiAnggaranPendidikanChartProps {
    loading: boolean;
    title: string;
    data: {
        label: string;
        alumni: number;
        desktop: number;
    }[];
    config?: object;
}

const RealisasiAnggaranPendidikanChart: React.FC<RealisasiAnggaranPendidikanChartProps> = ({
    loading,
    title,
    data,
    config,
}) => {
    return loading ? (
        <div className="flex w-full h-[25vh] py-10 items-center justify-center">
            <DotLoader color="#2152ff" size={50} />
        </div>
    ) : (
        <CardBarChart title={title} data={data} config={config} />
    );
};

export default RealisasiAnggaranPendidikanChart;

type BarChartProps = {
    title: string;
    data: {
        label: string;
        alumni: number;
        desktop: number;
    }[];
    config?: any;
};

const CardBarChart = ({ title, data, config }: BarChartProps) => {
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;
            return (
                <div className="p-2 bg-white border rounded shadow-md text-xs z-[99999]">
                    <strong className="text-sm text-gray-900">{item.label}</strong>
                    <div className="text-gray-700">Realisasi: {item.alumni.toLocaleString()}</div>
                    <div className="text-gray-700">Pagu: {item.desktop.toLocaleString()}</div>
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
                rx={8}
                ry={8}
                fill="rgba(0, 0, 0, 0.1)"
            />
        );
    };

    return (
        <Card className="flex flex-col w-full mt-5">
            <CardHeader className="items-center pb-0 w-full flex justify-center text-center">
                <CardTitle className="text-white text-center max-w-sm">{title}</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 pb-0 overflow-x-auto">
                <div className="min-w-[1500px]">
                    <ChartContainer config={config} className="aspect-auto max-h-[600px]">
                        <ResponsiveContainer width="100%" height={600}>
                            <BarChart
                                data={data.map(d => ({
                                    ...d,
                                    alumni: d.alumni / 1_000_000,
                                    desktop: d.desktop / 1_000_000,
                                }))}
                                layout="horizontal"
                                margin={{ top: 20, right: 20, bottom: 100, left: 40 }}
                            >
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload?.length) {
                                            const item = payload[0].payload;
                                            return (
                                                <div className="p-2 bg-white border rounded shadow-md text-xs z-[99999]">
                                                    <strong className="text-sm text-gray-900">{item.label}</strong>
                                                    <div className="text-gray-700">Realisasi: {(item.alumni * 1_000_000).toLocaleString()}</div>
                                                    <div className="text-gray-700">Pagu: {(item.desktop * 1_000_000).toLocaleString()}</div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                    cursor={<CustomBarCursor />}
                                />
                                <YAxis type="number" hide />
                                <XAxis
                                    type="category"
                                    dataKey="label"
                                    tickLine={false}
                                    interval={0}
                                    tick={({ x, y, payload }) => (
                                        <text
                                            x={x}
                                            y={y}
                                            dy={16}
                                            textAnchor="end"
                                            transform={`rotate(-45, ${x}, ${y})`}
                                            fill="#888"
                                            fontSize={12}
                                        >
                                            {simplifySatkerName(payload.value).toUpperCase()}
                                        </text>
                                    )}
                                />
                                <Bar radius={[8, 8, 8, 8]} dataKey="desktop" fill="#a855f7" stackId="a" />
                                <Bar radius={[8, 8, 8, 8]} dataKey="alumni" fill="#17c1e8" stackId="a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
            </CardContent>


            <CardFooter className="flex flex-col gap-2 items-center justify-center text-sm">
                <div className="mt-4 flex gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: "#a855f7" }} />
                        <span>Pagu</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: "#17c1e8" }} />
                        <span>Realisasi</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};
