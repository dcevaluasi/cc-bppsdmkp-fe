import { type Metadata } from "next";
import "./globals.css";
import "@/components/calendar/MiniCalendar.css";
import ThemeProvider from "@/providers/ThemeProvider";

import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BPPSDM KP - Dashboard Command Center",
  applicationName: "BPPSDM KP - Dashboard Command Center",
  themeColor: "#422AFB",
  icons: {
    icon: "/logo-kkp-white.png", // favicon
    shortcut: "/logo-kkp-white.png", // optional
    apple: "/logo-kkp-white.png", // for iOS
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body className={`${plusJakartaSans.className} bg-navy-900`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
