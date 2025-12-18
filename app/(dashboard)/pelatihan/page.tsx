'use client'

import Widget from "@/components/widget/Widget";
import Cookies from "js-cookie";
import { LucideSchool } from "lucide-react";
import React from "react";
import { GiBookmarklet } from "react-icons/gi";
import { HiUserGroup } from "react-icons/hi2";
import { MdOutlineWork } from "react-icons/md";
import MasyarakatDilatih from "./components/MasyarakatDilatih";
import InstrukturPelatih from "./components/InstrukturPelatih";
import ModulPelatihan from "./components/ModulPelatihan";
import { RiSchoolFill } from "react-icons/ri";
import LembagaPelatihan from "./components/LembagaPelatihan";


const Page = () => {
  const [selectedTab, setSelectedTab] =
    React.useState<string>("Lembaga Pelatihan");
  const tabs = [
    {
      id: 1,
      name: "Lembaga Pelatihan",
      icon: <RiSchoolFill className="h-6 w-6" />,
    },
    {
      id: 2,
      name: "Masyarakat Dilatih",
      icon: <HiUserGroup className="h-6 w-6" />,
    },
    {
      id: 3,
      name: "Instruktur/Widyaiswara",
      icon: <MdOutlineWork className="h-6 w-6" />,
    },
    {
      id: 4,
      name: "Modul Pelatihan",
      icon: <GiBookmarklet className="h-6 w-6" />,
    },
  ];


  return (
    <div className="mt-3 flex flex-col h-full grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-2">
      <div
        className={`mt-2 mb-3 grid grid-cols-1 md:grid-cols-4 gap-5 
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
        {selectedTab == "Lembaga Pelatihan" && <LembagaPelatihan />}
        {selectedTab == "Masyarakat Dilatih" && <MasyarakatDilatih />}
        {selectedTab == "Instruktur/Widyaiswara" && <InstrukturPelatih />}
        {selectedTab == "Modul Pelatihan" && <ModulPelatihan />}
      </div>
    </div>
  );
};

export default Page;
