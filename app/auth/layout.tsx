import { type Metadata } from "next";

export const metadata: Metadata = {
    title: 'BPPSDM KP - Dashboard Command Center',
}

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="bg-navy-900">
            {children}
        </main>
    );
}