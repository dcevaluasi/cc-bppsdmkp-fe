"use client";

import Widget from "@/components/widget/Widget";

import { IoPieChart } from "react-icons/io5";
import {
  MdWork,
} from "react-icons/md";
import { RiSchoolFill } from "react-icons/ri";
import { HiMiniUserGroup } from "react-icons/hi2";
import { GiGraduateCap } from "react-icons/gi";
import { MapProvider } from "@/providers";
import React from "react";
import SatuanPendidikan from "./components/SatuanPendidikan";
import PesertaDidik from "./components/PesertaDidik";
import Alumni from "./components/Alumni";
import TenagaPendidik from "./components/TenagaPendidik";
import Pentaru from "./components/Pentaru";
import Cookies from "js-cookie";

const NFTMarketPlacePage = () => {
  const [selectedTab, setSelectedTab] =
    React.useState<string>("Satuan Pendidikan");
  const tabs = [
    {
      id: 1,
      name:
        "Satuan Pendidikan",
      icon: <RiSchoolFill className="h-7 w-7" />,
    },
    {
      id: 2,
      name: "Peserta Didik",
      icon: <HiMiniUserGroup className="h-6 w-6" />,
    },
    {
      id: 3,
      name: "Alumni",
      icon: <GiGraduateCap className="h-7 w-7" />,
    },
    {
      id: 4,
      name: "Pendidik dan Tenaga Kependidikan",
      icon: <MdWork className="h-6 w-6" />,
    },
    {
      id: 5,
      name: "Pentaru",
      icon: <IoPieChart className="h-7 w-7" />,
    },
  ];

  return (
    <MapProvider>
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
          {selectedTab == "Satuan Pendidikan" && <SatuanPendidikan />}
          {selectedTab == "Peserta Didik" && <PesertaDidik />}
          {selectedTab == "Alumni" && <Alumni />}
          {selectedTab == "Pendidik dan Tenaga Kependidikan" && <TenagaPendidik />}
          {selectedTab == "Pentaru" && <Pentaru />}
        </div>
      </div>
    </MapProvider>
  );
};

export default NFTMarketPlacePage;
