'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Users, BadgeCheck, UserCheck, UserCircle } from "lucide-react"

type SatdikStatsProps = {
    name: string
    pesertaDidik: number
    alumni: number
    pendidik: number
    tenagaPendidik: number
}

export function SatdikStats({ data }: { data: SatdikStatsProps[] }) {
    const grandTotal = {
        pesertaDidik: data.reduce((sum, d) => sum + d.pesertaDidik, 0),
        alumni: data.reduce((sum, d) => sum + d.alumni, 0),
        pendidik: data.reduce((sum, d) => sum + d.pendidik, 0),
        tenagaPendidik: data.reduce((sum, d) => sum + d.tenagaPendidik, 0),
    }

    const metrics = [
        {
            key: "total_peserta_didik",
            label: "Total Peserta Didik",
            value: grandTotal.pesertaDidik,
            icon: Users,
            color: "from-blue-500 to-blue-700",
        },
        {
            key: "total_alumni",
            label: "Total Alumni",
            value: grandTotal.alumni,
            icon: BadgeCheck,
            color: "from-indigo-500 to-indigo-700",
        },
        {
            key: "total_pendidik",
            label: "Total Pendidik",
            value: grandTotal.pendidik,
            icon: UserCheck,
            color: "from-teal-500 to-teal-700",
        },
        {
            key: "total_tenaga_pendidik",
            label: "Total Tenaga Kependidikan",
            value: grandTotal.tenagaPendidik,
            icon: UserCircle,
            color: "from-purple-500 to-purple-700",
        },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-5">
            {metrics.map((m) => (
                <Card
                    key={m.key}
                    className="flex flex-col items-center justify-center rounded-2xl shadow-lg bg-gradient-to-br 
          from-slate-900 to-slate-800 !bg-navy-800 px-6 py-4 text-white"
                >
                    <CardHeader className="flex flex-col justify-center text-center items-center pb-2">
                        <div
                            className={`w-14 h-14 rounded-full flex items-center justify-center text-center 
              bg-gradient-to-br ${m.color} shadow-md mb-3`}
                        >
                            <m.icon className="h-7 w-7 text-white" />
                        </div>
                        <CardTitle className="text-base text-gray-300">{m.label}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-4xl font-bold tracking-tight">{m.value.toLocaleString()}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}