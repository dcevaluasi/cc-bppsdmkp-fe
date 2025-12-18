"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import routes from "@/data/routes";
import { useSidebarContext } from "@/providers/SidebarProvider";
import { useThemeContext } from "@/providers/ThemeProvider";
import { usePendidikanContext } from "../contexts/PendidikanContext";
import { getSatuanPendidikanById } from "@/data/satuanPendidikan";

type Props = {};

const Navbar = ({ }: Props) => {
  const { idSatdikSelected } = usePendidikanContext();
  console.log({ idSatdikSelected });
  const [currentRoute, setCurrentRoute] = useState("Main Dashboard");

  const pathname = usePathname();
  const { setOpenSidebar } = useSidebarContext();
  const { theme, setTheme } = useThemeContext();

  useEffect(() => {
    getActiveRoute(routes);
  }, [pathname]);

  const getActiveRoute = (routes: any) => {
    let activeRoute = "Main Dashboard";
    for (let i = 0; i < routes.length; i++) {
      if (window.location.href.indexOf(routes[i].path) !== -1) {
        setCurrentRoute(routes[i].name);
      }
    }
    return activeRoute;
  };

  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl  p-2 backdrop-blur-xl bg-[#0b14374d]">
      <div className="ml-[6px]">
        <div className="h-6 w-full pt-1">
          <Link
            className="text-sm font-normal hover:underline text-white hover:text-white"
            href=" "
          >
            Pages
            <span className="mx-1 text-sm  text-white">
              {" "}
              /{" "}
            </span>
          </Link>
          <Link
            className="text-sm font-normal capitalize hover:underline text-white hover:text-white"
            href="#"
          >
            {currentRoute}
          </Link>

        </div>
        <p className="shrink text-[33px] capitalize text-white">
          <Link
            href="#"
            className="font-bold capitalize  hover:text-white"
          >
            {currentRoute}
          </Link>
        </p>
      </div>
    </nav>
  );
};

export default Navbar;
