'use client'

import {
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import Card from "./card";

type PropsCardComponent = {
    title: string;
    children: any
};

export default function CardComponent({
    title,
    children
}: PropsCardComponent) {


    return (
        <Card className="flex flex-col w-full">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>
                        {title}
                    </CardTitle>
                </div>
            </CardHeader>

            <CardContent className="flex-1 pb-0 h-full  w-full flex items-center justify-center !px-0">
                {children}
            </CardContent>

            <CardFooter className="flex-col gap-2 text-sm">

            </CardFooter>
        </Card>
    );
}