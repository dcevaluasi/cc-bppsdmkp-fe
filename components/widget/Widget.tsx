import { FC, ReactNode } from "react";
import Card from "@/components/card";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";

type Props = {
  icon?: ReactNode | string;
  title?: string;
  subtitle?: string;
  selected?: string;
  onClick?: () => void;
  total?: any
};

const Widget: FC<Props> = ({ icon, title, subtitle, onClick, total }) => {
  const selectedTab = Cookies.get("SelectedTab");

  return (
    <Card
      className={`
        
          !flex-row flex-grow items-center ${usePathname().includes('public') && 'justify-center'} 
       rounded-[20px] ${selectedTab == title && "!bg-navy-700 scale-105  border border-white"
        }`}
      onClick={onClick}
    >

      <div
        className={`ml-[15px] flex h-[70px] w-auto flex-row items-center ${usePathname().includes('public') && 'justify-center'} group-hover:scale-150 duration-700 group-hover:-rotate-[20deg] ${selectedTab == title ? "-rotate-[20deg] scale-150" : ""
          }`}
      >
        <div className="rounded-full bg-navy-700 p-2">
          <span className="flex items-center text-white">
            {icon}
          </span>
        </div>
      </div>

      <div className={`h-50 ml-2 flex w-full items-center  justify-beetween z-30`}>
        <p
          className={`font-dm text-sm font-medium ${selectedTab === title ? "text-white" : "text-gray-600"
            } group-hover:text-white w-full`}
        >
          {title}
        </p>
        {
          total && <div className="rounded-full mr-2 bg-navy-700 p-2 items-end w-full">
            <span className="flex items-center justify-center text-white text-center">
              {total}
            </span>
          </div>
        }
      </div>


    </Card>
  );
};

export default Widget;
