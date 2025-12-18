import { HiMiniUserGroup } from "react-icons/hi2";
import { IoBook, IoSchoolSharp } from "react-icons/io5";
import {
  MdWork,
} from "react-icons/md";
import { RiVerifiedBadgeFill } from "react-icons/ri";

const routes = [
  {
    name: "Manajerial",
    layout: "/dashboard",
    path: "manajerial",
    icon: <MdWork className="h-6 w-6" />,
  },
  {
    name: "Pendidikan",
    layout: "/dashboard",
    path: "pendidikan",
    icon: <IoSchoolSharp className="h-6 w-6" />,
    secondary: true,
  },
  {
    name: "Penyuluhan",
    layout: "/dashboard",
    path: "penyuluhan",
    icon: <HiMiniUserGroup className="h-6 w-6" />,
  },
  {
    name: "Pelatihan",
    layout: "/dashboard",
    icon: <IoBook className="h-6 w-6" />,
    path: "pelatihan",
  },
  {
    name: "Standarisasi dan Sertifikasi SDM KP",
    layout: "/dashboard",
    path: "standarisasi-sertifikasi",
    icon: <RiVerifiedBadgeFill className="h-6 w-6" />,
  },
];

export default routes;


