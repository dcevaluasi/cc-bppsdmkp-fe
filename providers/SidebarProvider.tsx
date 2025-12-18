// 'use client';
// import { createContext, ReactNode, useState, useContext, useEffect } from 'react';


// export interface SidebarContextInterface {
//     openSidebar: boolean,
//     setOpenSidebar: (state: boolean) => any
// }

// export const SidebarContext = createContext({} as SidebarContextInterface);


// type Props = {
//     children: ReactNode
// };

// export default function SidebarProvider({ children }: Props) {
//     const [openSidebar, setOpenSidebar] = useState<boolean>(true);

//     useEffect(() => {
//         window.addEventListener("resize", () =>
//             window.innerWidth < 1200 ? setOpenSidebar(false) : setOpenSidebar(true)
//         );

//         return () => {
//             window.removeEventListener('resize', () => { });
//         }
//     }, []);

//     return (
//         <SidebarContext.Provider
//             value={{
//                 openSidebar, setOpenSidebar,
//             }}
//         >
//             {children}
//         </SidebarContext.Provider>
//     );
// }

// export function useSidebarContext() {
//     return useContext(SidebarContext)
// }  

// SidebarProvider.tsx

'use client'

import React, { createContext, useContext, useState } from "react";

const SidebarContext = createContext<any>(null);

export default function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [openSidebar, setOpenSidebar] = useState(false);
    const [collapsed, setCollapsed] = useState(false); // 🔥

    return (
        <SidebarContext.Provider value={{ openSidebar, setOpenSidebar, collapsed, setCollapsed }}>
            {children}
        </SidebarContext.Provider>
    );
}

export const useSidebarContext = () => useContext(SidebarContext);
