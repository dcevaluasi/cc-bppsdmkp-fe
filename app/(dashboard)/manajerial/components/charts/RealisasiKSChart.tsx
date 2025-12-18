
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
    LabelList,
} from "recharts";

import { DotLoader } from 'react-spinners';
import Card from "@/components/card";
import { ChartContainer } from "@/components/ui/chart";

interface RealisasiKSChartProp {
    loading: boolean;
    title: string;
    data: any[];
    config?: object;
}

const RealisasiKSChart: React.FC<RealisasiKSChartProp> = ({ loading, title, data, config }) => {
    return loading ? (
        <div className="flex w-full h-[25vh] py-10 items-center justify-center">
            <DotLoader color="#2152ff" size={50} />
        </div>
    ) : (
        <CardPieChart
            title={title}
            data={data}
            config={config}
        />
    );
};

export default RealisasiKSChart;

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

    const CustomBarCursor = (props: any) => {
        const { x, y, width, height } = props
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
        )
    }

    return (
        <Card className="flex flex-col w-full">
            <CardHeader className="items-center pb-0 relative">
                <CardTitle className="text-white text-center">{title}</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 pb-0">
                <ChartContainer config={config} className="mx-auto max-h-[600px]">
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={data} layout="horizontal" margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
                            <Tooltip content={<CustomTooltip />} cursor={<CustomBarCursor />} />
                            <YAxis type="number" hide />
                            <XAxis type="category" dataKey="name" tick={{ fill: "#888", fontSize: 12 }} />
                            <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                                <LabelList
                                    dataKey="value"
                                    position="top"
                                    offset={10}
                                    style={{ fill: '#fff', fontSize: 12 }}
                                />
                                {data.map((entry, index) => {
                                    const hue = (200 + index * 25) % 360
                                    const fill = `hsl(${hue}, 70%, 50%)`
                                    return <Cell key={`cell-${index}`} fill={fill} />
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>

            <CardFooter className="flex-col gap-2 items-center justify-start text-sm">

                <div className="mt-4 flex gap-2 flex-wrap items-start justify-start">
                    {data.map((entry, index) => {
                        const hue = (200 + index * 25) % 360;
                        const fill = `hsl(${hue}, 70%, 50%)`;
                        return (<div key={entry.name} className="flex items-start gap-2">
                            <div
                                className="w-4 h-4 rounded-sm"
                                style={{ backgroundColor: fill }}
                            ></div>
                            <span className="text-sm">{entry.name}</span>
                        </div>);
                    })}
                </div>
            </CardFooter>
        </Card>
    );
}
