'use client'

import {
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import Card from "./card";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    LabelList,
    Cell,
} from "recharts";
import { ChartContainer } from "./ui/chart";
import { formatToShortRupiah } from "@/utils/text";

type Props = {
    title: string;
    data: { name: string; value: number; fill: string }[];
    config: any;
};

export default function CardBarChart({
    title,
    data,
    config,
}: Props) {
    const total = data.reduce((acc: number, item: any) => acc + item.value, 0);

    return (
        <Card className="flex flex-col w-full">
            <CardHeader className="items-center pb-0 relative">
                <CardTitle className="text-white text-center">{title}</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 pb-0">
                <ChartContainer className="mx-auto max-h-[250px]" config={config}>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart
                            layout="horizontal"
                            data={data}
                            margin={{ top: 10, bottom: 10, left: 40, right: 40 }}
                        >
                            <YAxis type="number" hide />
                            <XAxis
                                type="category"
                                dataKey="name"
                                tick={{ fill: "#fff", fontSize: 12 }}
                            />
                            <Bar
                                dataKey="value"
                                radius={[8, 8, 8, 8]}
                                isAnimationActive={false}
                            >
                                <LabelList
                                    dataKey="value"
                                    content={({ x, y, width, value }) => {
                                        const labelX = Number(x) + Number(width) / 2;
                                        const labelY = Number(y) - 10; // 10px above the bar

                                        return (
                                            <text
                                                x={labelX}
                                                y={labelY}
                                                fill="#ffffff"
                                                fontSize={12}
                                                textAnchor="middle"
                                                dominantBaseline="central"
                                            >
                                                {formatToShortRupiah(Number(value))}
                                            </text>
                                        );
                                    }}
                                />




                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.fill || `hsl(${index * 60}, 70%, 50%)`}
                                    />
                                ))}
                            </Bar>

                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>

            <CardFooter className="flex-col gap-2 text-sm">
                <div className="mt-4 flex gap-2 flex-wrap items-center justify-center">
                    {data.map((entry) => (
                        <div key={entry.name} className="flex items-center gap-2">
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
