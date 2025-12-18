import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Users, BadgeCheck, UserCheck, UserCircle } from "lucide-react"

interface StatsKelompokProps {
    total: number
    title: string
}

export function StatsKelompok({ total, title }: StatsKelompokProps) {
    const metrics = [
        {
            key: "total_kelompok",
            label: title,
            value: total ?? 0,
            icon: Users,
            color: "from-blue-500 to-blue-700",
        },
    ]

    return (
        <div className="grid grid-cols-1 gap-6">
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
