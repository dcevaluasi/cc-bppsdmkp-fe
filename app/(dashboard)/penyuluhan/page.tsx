"use client";

import Widget from "@/components/widget/Widget";

import { IoPieChart } from "react-icons/io5";

import { FaChalkboardTeacher, FaHandsHelping } from "react-icons/fa";
import { HiMiniUserGroup } from "react-icons/hi2";
import { TbArrowBigUpLinesFilled } from "react-icons/tb";

import { MapProvider } from "@/providers";
import React from "react";
import Cookies from "js-cookie";
import Penyuluh from "./components/Penyuluh";
import KelompokDisuluh from "./components/KelompokDisuluh";
import KelompokDitingkatkan from "./components/KelompokDitingkatkan";
import KelompokDibentuk from "./components/KelompokDibentuk";
import Gapokkan from "./components/Gapokkan";
import { usePenyuluhTotal } from "@/hooks/penyuluhan/useSummaryPenyuluhData";

const PenyuluhanPage = () => {
  const [selectedTab, setSelectedTab] =
    React.useState<string>("Penyuluh");
  const tabs = [
    {
      id: 1,
      name:
        "Penyuluh",
      icon: <HiMiniUserGroup className="h-7 w-7" />,
    },
    {
      id: 2,
      name: "Kelompok Disuluh",
      icon: <FaChalkboardTeacher className="h-6 w-6" />,
    },
    {
      id: 3,
      name: "Kelompok Ditingkatkan",
      icon: <TbArrowBigUpLinesFilled className="h-7 w-7" />,
    },
    {
      id: 4,
      name: "Kelompok Dibentuk",
      icon: <FaHandsHelping className="h-6 w-6" />,
    },
    {
      id: 5,
      name: "Gapokkan",
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
          {selectedTab == "Penyuluh" && <Penyuluh />}
          {selectedTab == "Kelompok Disuluh" && <KelompokDisuluh />}
          {selectedTab == "Kelompok Ditingkatkan" && <KelompokDitingkatkan />}
          {selectedTab == "Kelompok Dibentuk" && <KelompokDibentuk />}
          {selectedTab == "Gapokkan" && <Gapokkan />}
        </div>
      </div>
    </MapProvider>
  );
};

export default PenyuluhanPage;
