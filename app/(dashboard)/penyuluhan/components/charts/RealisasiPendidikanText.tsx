
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
import CountUp from "react-countup";

// Define the types for the props
interface RealisasiPendidikanTextProp {
    loading: boolean;
    title: string;
    data: any[]; // Adjust this type based on your actual chart data structure
    config?: object; // Optional chart style config
    text: string
}

const RealisasiPendidikanText: React.FC<RealisasiPendidikanTextProp> = ({ loading, title, data, config, text }) => {
    return loading ? (
        <div className="flex w-full h-[25vh] py-10 items-center justify-center">
            <DotLoader color="#2152ff" size={50} />
        </div>
    ) : (
        <CardPieChart
            title={title}
            data={data}
            text={text}
        />
    );
};

export default RealisasiPendidikanText;

type Props = {
    title: string;
    data: { name: string; value: number; fill: string }[];
    text: string
};

function CardPieChart({
    title,
    data,
    text
}: Props) {
    const total = data.reduce(
        (acc: number, item: any) => acc + item.value,
        0
    );


    return (
        <Card className="flex flex-col w-full">
            <CardHeader className="items-center pb-0 relative w-full  flex justify-center text-center">
                <CardTitle className="text-white text-center max-w-sm">{title}</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 pb-0 flex items-center justify-center flex-col mt-9 mb-5">
                <h1 className='text-6xl font-black'>
                    <CountUp delay={2} end={total} />
                </h1>
                <p className="font-normal text-lg">{text}</p>
            </CardContent>

            <CardFooter className="flex-col gap-2 items-start justify-start text-sm">

            </CardFooter>
        </Card>
    );
}
