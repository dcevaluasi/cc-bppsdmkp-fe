"use client";

import { FC } from "react";
import { HiX } from "react-icons/hi";
import { useSidebarContext } from "@/providers/SidebarProvider";
import useMobileView from "@/hooks/useMobileView";
import Links from "./components/Links";
import SidebarCard from "./components/SidebarCard";
import Image from "next/image";

type Props = {};
// Sidebar.tsx
import { FiChevronsLeft, FiChevronsRight, FiLogOut } from "react-icons/fi";
import axios from "axios";
import { baseUrl } from "@/urls/urls";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Toast from "../toast/Toast";

const Sidebar: FC<Props> = () => {
  const router = useRouter()
  const { isMobile } = useMobileView();
  const { openSidebar, setOpenSidebar, collapsed, setCollapsed } = useSidebarContext();


  const handleLogout = async () => {
    try {
      await axios.post(`${baseUrl}/api/logout`, {}, {
        headers: {
          Authorization: `Bearer ${Cookies.get('USR_SSN')}`
        }
      })
      Cookies.remove('USR_SSN')
      Cookies.remove('USR_SSN_ELAUT')
      Toast.fire({
        icon: "success",
        title: "Yeayyy!",
        text: "Berhasil logout dari Command Center!",
      });
      router.push('/')
    } catch (err) {
      console.error({ err })
      Toast.fire({
        icon: "error",
        title: "Oopsss!",
        text: "Gagal logout dari Command Center!",
      });
    }
  }

  return (
    <>
      <div
        className={`bg-[#000] bg-opacity-70 absolute inset-0 z-50 ${openSidebar && isMobile ? "block w-screen h-full" : "hidden"
          }`}
        onClick={() => setOpenSidebar(false)}
      />
      <div
        className={`
    duration-175 linear  fixed z-50 flex min-h-screen flex-col
    bg-navy-900 backdrop-blur-3xl shadow-custom shadow-white/5 transition-all
    dark:text-white xl:static xl:translate-x-0 xl:z-0 
    ${openSidebar ? "translate-x-0" : "-translate-x-96"}
  `}
      >

        <span
          className="absolute top-4 right-4 block cursor-pointer xl:hidden"
          onClick={() => setOpenSidebar(false)}
        >
          <Image
            src="/logo-kkp-white.png"
            alt="Logo BPPSDM KP"
            width={0}
            height={0}
            className="w-[65px] h-[60px]"
          />
        </span>


        <div className={`mx-[12px] w-fit mt-6 flex flex-col items-center`}>
          <Image
            src="/logo-kkp-white.png"
            alt="Logo BPPSDM KP"
            width={0}
            height={0}
            className={`${collapsed ? 'w-[55px] h-[50px]' : 'w-[65px] h-[60px] mb-3'} `}
          />
          <div className={` font-poppins text-center leading-[110%] text-[16px] font-bold uppercase  text-gray-200 ${collapsed ? 'hidden' : 'block mt-1 ml-1  h-2.5'}`}>
            Integrated Human <br />
            <span className="font-medium">Resources Intelligent Platform</span>
          </div>
        </div>


        <div className={`${collapsed ? 'mt-2' : 'mt-[58px]'} mb-7 h-px bg-gray-300 dark:bg-white/30`} />

        <ul className="mb-auto pt-1">
          <Links onClickRoute={isMobile ? () => setOpenSidebar(false) : undefined} />
        </ul>

        <div className="flex justify-center mt-auto">
          {!collapsed && <SidebarCard />}
        </div>

        <button
          onClick={() => setCollapsed((prev: any) => !prev)}
          className="absolute -right-4 top-10 bg-navy-700 p-1.5 rounded-full text-white shadow-md border z-[999999999] border-white/10"
        >
          {collapsed ? <FiChevronsRight size={20} /> : <FiChevronsLeft size={20} />}
        </button>

        <div className="p-6 border-t border-gray-700 flex items-center justify-center">
          <button
            onClick={handleLogout}
            className="flex items-center  gap-3 w-full text-gray-200 rounded-md"
          >
            <FiLogOut className='h-5 w-5' />
            {
              !collapsed && <span>Logout</span>
            }
          </button>
        </div>
      </div >
    </>
  );
};

export default Sidebar
