
'use client'

import {
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import React from 'react';

import {
    Pie,
    PieChart,
    Label,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    XAxis,
    YAxis,
    Bar,
    Cell,
} from "recharts";

import { DotLoader } from 'react-spinners';
import Card from "@/components/card";
import { ChartContainer } from "@/components/ui/chart";

// Define the types for the props
interface RealisasiPendidikanChartPieProp {
    loading: boolean;
    title: string;
    data: any[]; // Adjust this type based on your actual chart data structure
    config?: object; // Optional chart style config
}

const RealisasiPendidikanChartPie: React.FC<RealisasiPendidikanChartPieProp> = ({ loading, title, data, config }) => {
    return loading ? (
        <div className="flex w-full h-[25vh] py-10 items-center justify-center">
            <DotLoader color="#2152ff" size={50} />
        </div>
    ) : (
        <CardPieChart
            title={title}
            data={data}
            config={config} // optional, or your chart style config
        />
    );
};

export default RealisasiPendidikanChartPie;

type Props = {
    title: string;
    data: { name: string; value: number; fill: string }[];
    config: any
};

function CardPieChart({
    title,
    data,
    config,
}: Props) {
    const total = data.reduce(
        (acc: number, item: any) => acc + item.value,
        0
    );

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const { name, value } = payload[0].payload;

            return (
                <div className="p-2 bg-white border rounded shadow-md text-xs z-[99999]">
                    <strong className="text-sm text-gray-900">{name}</strong>
                    <div className="text-gray-700">Jumlah: {value} </div>
                    <div className="text-gray-700">Persentase: {((value / total) * 100).toLocaleString()}%</div>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="flex flex-col w-full">
            <CardHeader className="items-center pb-0 relative">
                <CardTitle className="text-white text-center">{title}</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 pb-0">
                <ChartContainer className="mx-auto w-[600px] max-h-[350px] " config={config}>
                    <PieChart>
                        <Tooltip content={<CustomTooltip />} />
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            width={"350"}
                            className="w-[350px]"
                            strokeWidth={1}
                            label={({ name, percent, cx, cy, midAngle, outerRadius }) => {
                                const RADIAN = Math.PI / 180;
                                const radius = outerRadius + 20;
                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                const displayName = name.length > 30 ? name.slice(0, 30) + '…' : name; // Optional truncation

                                return (
                                    <text
                                        x={x}
                                        y={y}
                                        width={1000}
                                        textAnchor={x > cx ? "start" : "end"}
                                        dominantBaseline="central"
                                        fill="#fff"
                                        className="text-xs"
                                    >
                                        {displayName} ({(percent * 100).toFixed(1)}%)
                                    </text>
                                );
                            }}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-white text-3xl font-bold"
                                                >
                                                    {total}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-gray-400 text-sm"
                                                >
                                                    Total
                                                </tspan>
                                            </text>
                                        );
                                    }
                                    return null;
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>


            <CardFooter className="flex-col gap-2 items-start justify-start text-sm">
                <div className="flex items-start gap-2 font-medium leading-none">
                    Updated last minute
                </div>

                <div className="mt-4 flex gap-2 flex-wrap items-start justify-start">
                    {data.map((entry) => (
                        <div key={entry.name} className="flex items-start gap-2">
                            <div
                                className="w-4 h-4 rounded-sm"
                                style={{ backgroundColor: entry.fill }}
                            ></div>
                            <span className="text-sm">{entry.name}</span>
                        </div>
                    ))}
                </div>
            </CardFooter>
        </Card>
    );
}
