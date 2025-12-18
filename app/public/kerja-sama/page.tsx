"use client";


import Widget from "@/components/widget/Widget";

import { FaHandshake, FaRupiahSign } from "react-icons/fa6";

import React from "react";
import { KerjaSama } from "@/app/(dashboard)/manajerial/components/KerjaSama";
import Image from "next/image";

const Page = () => {
    const tabs = [
        {
            id: 1,
            name: "Kerja Sama",
            icon: <FaHandshake className="h-7 w-7" />,
        },

    ];

    return (
        <div className="p-10 flex bg-navy-900 flex-col h-full  gap-5 ">
            <div
                className={`mt-2 mb-3 grid grid-cols-1 gap-5
          `}
            >
                <div className={`mx-auto w-fit my-7 flex flex-col items-center`}>
                    <Image
                        src="/logo-kkp-white.png"
                        alt="Logo BPPSDM KP"
                        width={0}
                        height={0}
                        className={`w-[65px] h-[60px] mb-3`}
                    />
                    <div className={` font-poppins text-center leading-[110%] text-[16px] font-bold uppercase  text-gray-200 block mt-1 ml-1  h-2.5`}>
                        Integrated Human <br />
                        <span className="font-medium">Resources Intelligent Platform</span>
                    </div>
                </div>

                <Widget
                    icon={tabs[0].icon}
                    title={tabs[0].name!}

                />
            </div>
            <div className="h-fit max-w-full ">
                <KerjaSama />
            </div>
        </div>
    );
};

export default Page;
