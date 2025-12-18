'use client'

import SidebarProvider, { useSidebarContext } from "@/providers/SidebarProvider";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import Footer from "@/components/footer/Footer";
import { PendidikanProvider } from "@/components/contexts/PendidikanContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PendidikanProvider>
      <SidebarProvider>
        <section className="flex h-screen w-full">
          <Sidebar />
          <MainContent>{children}</MainContent>
        </section>
      </SidebarProvider>
    </PendidikanProvider>
  );
}

function MainContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebarContext();
  const [queryClient] = React.useState(() => new QueryClient())


  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen w-full bg-navy-900 transition-all overflow-y-scroll">
        <main
          className={`mx-[12px] flex-none transition-all md:pr-2`}
        >
          <div className="">

            <Navbar />
            <div className="pt-5 mx-auto mb-auto h-full p-2 md:pr-2">
              {children}
              <div className="p-3">
                {/* <Footer /> */}
              </div>
            </div>

          </div>
        </main>
      </div>
    </QueryClientProvider>

  );
}
