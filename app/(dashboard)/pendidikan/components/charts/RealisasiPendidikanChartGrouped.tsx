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
} from "recharts";

import { DotLoader } from 'react-spinners';
import Card from "@/components/card";
import { ChartContainer, ChartLegendContent } from "@/components/ui/chart";
import { simplifySatkerName } from "@/utils/text";

// Define the types for the props
interface RealisasiPendidikanChartGroupedProp {
    loading: boolean;
    title: string;
    data: any[]; // Adjust this type based on your actual chart data structure
    config?: object; // Optional chart style config
    isFull?: boolean
}

const RealisasiPendidikanChartGrouped: React.FC<RealisasiPendidikanChartGroupedProp> = ({ loading, title, data, config, isFull }) => {
    console.log('DATA DI KOMPONENT', data)
    return loading ? (
        <div className="flex w-full h-[25vh] py-10 items-center justify-center">
            <DotLoader color="#2152ff" size={50} />
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

export default RealisasiPendidikanChartGrouped;

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
    const total = data.reduce(
        (acc: number, item: any) => acc + item.value,
        0
    );

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="p-2 bg-white border rounded shadow-md text-xs z-[99999] space-y-1">
                    <strong className="text-sm text-gray-900">{label}</strong>
                    {payload.map((entry: any, index: number) => {
                        const value = entry.value;
                        const dataKey = entry.dataKey as ChartKey;
                        const color = chartConfig[dataKey]?.color || '#ccc';
                        const labelText = chartConfig[dataKey]?.label || dataKey;

                        return (
                            <div key={index} className="flex items-center gap-1 text-gray-700">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                                <span className="capitalize">{labelText}:</span>
                                <span>{value}</span>
                                <span className="ml-auto">
                                    ({((value / total) * 100).toFixed(1)}%)
                                </span>
                            </div>
                        );
                    })}
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

    const chartKeys = ['alumni', 'pendidik', 'tenagaPendidik',] as const;

    type ChartKey = typeof chartKeys[number];

    const chartConfig: Record<ChartKey, { label: string; color: string }> = {
        alumni: { label: "Alumni", color: "#3B82F6" },
        pendidik: { label: "Pendidik", color: "#10B981" },
        tenagaPendidik: { label: "Tenaga Kependidikan", color: "#F59E0B" },
    };


    return (
        <Card className="flex flex-col w-full">
            <CardHeader className="items-center pb-0 relative w-full flex justify-center text-center">
                <CardTitle className="text-white text-center max-w-sm">{title}</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex gap-4 pb-0">
                <div className="flex flex-col gap-2 pt-6">
                    {chartKeys.map((key) => (
                        <div key={key} className="flex items-center gap-2 text-sm text-white">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: chartConfig[key].color }}
                            />
                            <span>{chartConfig[key].label}</span>
                        </div>
                    ))}
                </div>

                <ChartContainer config={config} className="flex-1 mx-auto max-h-[350px]">
                    <ResponsiveContainer width="100%" height={600}>
                        <BarChart
                            data={data}
                            layout="horizontal"
                            margin={{ top: 20, right: 20, bottom: 30, left: 40 }}
                        >
                            <XAxis
                                type="category"
                                dataKey="name"
                                tickLine={false}
                                angle={0}
                                textAnchor="end"
                                interval={0}
                                tick={(props) => {
                                    const { x, y, payload } = props;
                                    return (
                                        <text
                                            x={isFull ? x : 0}
                                            y={isFull ? y : 0}
                                            dy={16}
                                            textAnchor="end"
                                            transform={`rotate(${0}, ${isFull ? x : 0}, ${isFull ? y : 0})`}
                                            fill="#888"
                                            fontSize={12}
                                        >
                                            {title.includes("Satuan Pendidikan") || title === ""
                                                ? simplifySatkerName(payload.value).toUpperCase()
                                                : payload.value.toUpperCase()}
                                        </text>
                                    );
                                }}
                            >
                                <Label
                                    value=""
                                    offset={10}
                                    position="insideBottom"
                                    style={{ fill: "#666", fontSize: 14 }}
                                />
                            </XAxis>

                            <YAxis type="number" hide />

                            {chartKeys.map((key: ChartKey) => (
                                <Bar
                                    key={key}
                                    dataKey={key}
                                    name={chartConfig[key].label}
                                    fill={chartConfig[key].color}
                                    radius={[8, 8, 0, 0]}
                                >
                                    <LabelList
                                        dataKey={key}
                                        position="top"
                                        offset={10}
                                        style={{ fill: "#fff", fontSize: 12 }}
                                    />
                                </Bar>
                            ))}

                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );

}
