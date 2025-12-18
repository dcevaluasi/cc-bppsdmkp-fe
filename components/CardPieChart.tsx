'use client'

import {
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import Card from "./card";

type Props = {
    title: string;
    data: { name: string; value: number; fill: string }[];
    config: any
};

import {
    Pie,
    PieChart,
    Label,
    Tooltip,
} from "recharts";

import { ChartContainer } from "./ui/chart";

export default function CardPieChart({
    title,
    data,
    config,
}: Props) {
    const total = data.reduce(
        (acc: number, item: any) => acc + item.value,
        0
    );

    const formattedTotal = total.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    });

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const { name, value, pagu } = payload[0].payload;
            const formattedValue = value.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
            });

            return (
                <div className="p-2 bg-white border rounded shadow-md text-xs z-[99999]">
                    <strong className="text-sm text-gray-900">{name}</strong>
                    <div className="text-gray-700">{formattedValue}</div>
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
                <ChartContainer className="mx-auto aspect-square max-h-[250px]" config={config}>
                    <PieChart>
                        <Tooltip content={<CustomTooltip />} />
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cursor={"pointer"}
                            style={{ fontSize: 10 }}
                            cy="50%"
                            strokeWidth={2}
                            outerRadius={80}
                            innerRadius={60}
                            labelLine={true}
                            width={500}
                            label={({ name, value, pagu, persentasi }: any) =>
                                pagu
                                    ? `${name}: ${((value / pagu) * 100).toFixed(2)}%`
                                    : `${parseFloat(persentasi).toFixed(2)}%`
                            }
                        >
                            <></>
                        </Pie>
                    </PieChart>
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
