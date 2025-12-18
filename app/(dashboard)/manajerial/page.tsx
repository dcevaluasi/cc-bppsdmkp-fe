"use client";


import Widget from "@/components/widget/Widget";

import { FaHandshake, FaRupiahSign } from "react-icons/fa6";

import { HiMiniChartPie, HiMiniUserGroup } from "react-icons/hi2";
import { GiGraduateCap, GiReceiveMoney, GiTakeMyMoney } from "react-icons/gi";
import React from "react";
import Cookies from "js-cookie";
import { Anggaran } from "./components/Anggaran";
import { Pendapatan } from "./components/Pendapatan";
import { PBJ } from "./components/PBJ";
import { KerjaSama } from "./components/KerjaSama";
import { Kinerja } from "./components/Kinerja";

const NFTMarketPlacePage = () => {

    const [selectedTab, setSelectedTab] =
        React.useState<string>("Anggaran");
    const tabs = [
        {
            id: 1,
            name:
                'Anggaran',
            icon: <GiTakeMyMoney className="h-7 w-7" />,
        },
        {
            id: 2,
            name:
                'Kinerja',
            icon: <HiMiniChartPie className="h-7 w-7" />,
        },
        {
            id: 3,
            name: "PNBP",
            icon: <GiReceiveMoney className="h-6 w-6" />,
        },
        {
            id: 4,
            name: "PBJ",
            icon: <HiMiniUserGroup className="h-6 w-6" />,
        },
        {
            id: 5,
            name: "Kerja Sama",
            icon: <FaHandshake className="h-7 w-7" />,
        },

    ];

    console.log("SELECTED TAB: ", selectedTab);

    return (
        <div className="mt-3 flex flex-col h-full grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-3">
            <div
                className={`mt-2 mb-3 grid grid-cols-1 gap-5 md:grid-cols-5 lg:grid-cols-5 
            2xl:grid-cols-5
          `}
            >
                {tabs.map((tab, index) => (
                    <Widget
                        key={index}
                        icon={tab.icon}
                        title={tab.name!}
                        selected={selectedTab}
                        onClick={() => {
                            Cookies.set("SelectedTab", tab.name!);
                            setSelectedTab(tab.name!);
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                            });
                        }}
                    />
                ))}
            </div>
            <div className="col-span-1 h-fit w-full xl:col-span-1 2xl:col-span-2">
                {
                    selectedTab == 'Anggaran' && <Anggaran />
                }
                {
                    selectedTab == 'Kinerja' && <Kinerja />
                }
                {
                    selectedTab == 'PNBP' && <Pendapatan />
                }
                {
                    selectedTab == 'Kerja Sama' && <KerjaSama />
                }
                {
                    selectedTab == 'PBJ' && <PBJ />
                }
            </div>

        </div>
    );
};

export default NFTMarketPlacePage;
