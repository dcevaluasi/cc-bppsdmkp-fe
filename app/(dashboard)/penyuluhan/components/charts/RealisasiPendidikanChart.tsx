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
import { ChartContainer } from "@/components/ui/chart";
import { simplifySatkerName } from "@/utils/text";

// Define the types for the props
interface RealisasiPendidikanChartProp {
    loading: boolean;
    title: string;
    data: any[]; // Adjust this type based on your actual chart data structure
    config?: object; // Optional chart style config
    isFull?: boolean
}

const RealisasiPendidikanChart: React.FC<RealisasiPendidikanChartProp> = ({ loading, title, data, config, isFull }) => {
    return loading ? (
        <div className="flex w-full h-[25vh] py-10 items-center justify-center">
            <DotLoader color="#2152ff" size={50} />
        </div>
    ) : (
        <CardBarChart
            title={title}
            data={data}
            config={config} // optional, or your chart style config
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
        <Card className="flex flex-col w-full">
            <CardHeader className="items-center pb-0 relative w-full  flex justify-center text-center">
                <CardTitle className="text-white text-center max-w-sm">{title}</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 pb-0">
                <ChartContainer config={config} className="mx-auto max-h-[800px] ">
                    <ResponsiveContainer width="100%" height={600}>
                        <BarChart
                            data={data}
                            layout="horizontal"
                            margin={{ top: 20, right: 20, bottom: 70, left: 40 }}
                        >
                            <Tooltip content={<CustomTooltip />} cursor={<CustomBarCursor />} />
                            <YAxis type="number" hide />
                            <XAxis
                                type="category"
                                dataKey="name"
                                tickLine={false}
                                angle={isFull ? -45 : 0}
                                textAnchor="end"
                                interval={0} // ensures all labels are shown
                                tick={(props) => {
                                    const { x, y, payload } = props;
                                    return (
                                        <text
                                            x={isFull ? x : 0}
                                            y={isFull ? y : 0}
                                            dy={16} // adjust vertical position
                                            textAnchor="end"
                                            transform={`rotate(${isFull ? -45 : 0}, ${isFull ? x : 0}, ${isFull ? y : 0})`}
                                            fill="#888"
                                            fontSize={12}
                                        >
                                            {title.includes('Satuan Pendidikan') || title == '' ? simplifySatkerName(payload.value).toUpperCase() : (payload.value).toUpperCase()}
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



                            <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                                <LabelList
                                    dataKey="value"
                                    position="top"
                                    offset={10}
                                    style={{ fill: "#fff", fontSize: 12 }}
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
