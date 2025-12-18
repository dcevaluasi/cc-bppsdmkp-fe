import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Users, BadgeCheck, UserCheck, UserCircle } from "lucide-react"

interface StatsPenyuluhProps {
    data?: {
        total_penyuluh: number
        total_pns: number
        total_pppk: number
        total_ppb: number
    } | null
}

export function StatsPenyuluh({ data }: StatsPenyuluhProps) {
    const metrics = [
        {
            key: "total_penyuluh",
            label: "Total Penyuluh",
            value: data?.total_penyuluh ?? 0,
            icon: Users,
            color: "from-blue-500 to-blue-700",
        },
        {
            key: "total_pns",
            label: "PNS",
            value: data?.total_pns ?? 0,
            icon: BadgeCheck,
            color: "from-indigo-500 to-indigo-700",
        },
        {
            key: "total_pppk",
            label: "PPPK",
            value: data?.total_pppk ?? 0,
            icon: UserCheck,
            color: "from-teal-500 to-teal-700",
        },
        {
            key: "total_ppb",
            label: "PPB",
            value: data?.total_ppb ?? 0,
            icon: UserCircle,
            color: "from-purple-500 to-purple-700",
        },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((m) => (
                <Card
                    key={m.key}
                    className="flex flex-col items-center justify-center rounded-2xl shadow-lg bg-gradient-to-br 
          from-slate-900 to-slate-800 !bg-navy-800 px-6 py-4 text-white"
                >
                    <CardHeader className="flex flex-col items-center pb-2">
                        <div
                            className={`w-14 h-14 rounded-full flex items-center justify-center 
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
