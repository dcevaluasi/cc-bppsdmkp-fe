'use client'
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from 'react';
import { DotLoader } from 'react-spinners';
import Card from "@/components/card";
import CountUp from "react-countup";
import { LucideIcon } from "lucide-react";

interface RealisasiBoxTextProp {
    loading: boolean;
    title: string;
    data: { name: string; value: number; fill: string }[];
    text: string;
    triwulan?: string;
    icon?: LucideIcon;
    color?: string; // gradient color
}

const RealisasiBoxText: React.FC<RealisasiBoxTextProp> = ({
    loading,
    title,
    data,
    text,
    triwulan = "tw1",
    icon: Icon,
    color = "from-blue-500 to-blue-700"
}) => {

    if (loading) {
        return (
            <div className="flex w-full h-[25vh] py-10 items-center justify-center">
                <DotLoader color="#2152ff" size={50} />
            </div>
        );
    }

    // Hitung total
    const total = data.reduce((sum, item) => sum + (item.value || 0), 0);

    return (
        <Card className="flex flex-col w-full py-9">
            <CardHeader className="items-center pb-0 relative w-full flex justify-center text-center gap-2">
                {Icon && (
                    <div className={`bg-gradient-to-br ${color} p-4 rounded-full shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                    </div>
                )}

                <CardTitle className="text-gray-300 text-center max-w-sm">
                    {title}
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col items-center justify-center mt-3 text-center">
                <h1 className='text-6xl font-black'>
                    <CountUp delay={0.5} end={total} />
                </h1>
            </CardContent>
        </Card>
    );
};

export default RealisasiBoxText;
