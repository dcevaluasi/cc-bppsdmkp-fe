'use client'

import Widget from "@/components/widget/Widget";
import Cookies from "js-cookie";
import React from "react";
import { HiBadgeCheck } from "react-icons/hi";
import { IoFileTrayStacked } from "react-icons/io5";
import Sertifikasi from "./components/Sertifikasi";


const Page = () => {

  const [selectedTab, setSelectedTab] =
    React.useState<string>("Sertifikasi");
  const tabs = [
    {
      id: 1,
      name:
        "Standarisasi",
      icon: <IoFileTrayStacked className="h-7 w-7" />,
    },
    {
      id: 2,
      name: "Sertifikasi",
      icon: <HiBadgeCheck className="h-6 w-6" />,
    },
  ];


  return (
    <div className="mt-3 flex flex-col h-full grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-2">
      <div
        className={`mt-2 mb-3 grid grid-cols-2 gap-5 
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
        {selectedTab == "Standarisasi" && <>STANDARISASI</>}
        {selectedTab == "Sertifikasi" && <Sertifikasi />}

      </div>
    </div>
  );
};

export default Page;
