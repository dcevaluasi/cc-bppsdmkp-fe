'use client'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList, Legend } from "recharts"
import { useState } from "react"

type SatdikChartsProps = {
    name: string
    pesertaDidik: number
    alumni: number
    pendidik: number
    tenagaPendidik: number
}

export function SatdikCharts({ data }: { data: SatdikChartsProps[] }) {
    const [filterPesertaDidik, setFilterPesertaDidik] = useState<'Semua' | 'Tinggi' | 'Menengah'>('Semua')
    const [filterAlumni, setFilterAlumni] = useState<'Semua' | 'Tinggi' | 'Menengah'>('Semua')
    const [filterPendidikTenaga, setFilterPendidikTenaga] = useState<'Semua' | 'Tinggi' | 'Menengah'>('Semua')

    // Normalize name function
    const normalizeName = (name: string) => {
        return name
            .replace(/Sekolah Usaha Perikanan Menengah \(SUPM\)/gi, 'SUPM')
            .replace(/Politeknik/gi, 'Poltek')
    }

    // Check jenjang based on name
    const getJenjang = (name: string): 'Tinggi' | 'Menengah' => {
        if (name.match(/Politeknik|Akademi/gi)) {
            return 'Tinggi'
        }
        if (name.match(/Sekolah|SUPM/gi)) {
            return 'Menengah'
        }
        return 'Tinggi' // default
    }

    // Generate colors using HSL
    const generateColors = (count: number) => {
        return Array.from({ length: count }, (_, i) => {
            const hue = (i * 360) / count
            return `hsl(${hue}, 70%, 50%)`
        })
    }

    const filterData = (filterValue: 'Semua' | 'Tinggi' | 'Menengah') => {
        if (filterValue === 'Semua') return data
        return data.filter(item => getJenjang(item.name) === filterValue)
    }

    const filteredPesertaDidik = filterData(filterPesertaDidik)
    const filteredAlumni = filterData(filterAlumni)
    const filteredPendidikTenaga = filterData(filterPendidikTenaga)

    const colorsPesertaDidik = generateColors(filteredPesertaDidik.length)
    const colorsAlumni = generateColors(filteredAlumni.length)

    const pesertaDidikData = [...filteredPesertaDidik]
        .sort((a, b) => b.pesertaDidik - a.pesertaDidik)
        .map((item, index) => ({
            name: normalizeName(item.name),
            value: item.pesertaDidik,
            fill: colorsPesertaDidik[index]
        }))

    const alumniData = [...filteredAlumni]
        .sort((a, b) => b.alumni - a.alumni)
        .map((item, index) => ({
            name: normalizeName(item.name),
            value: item.alumni,
            fill: colorsAlumni[index]
        }))

    const pendidikTenagaData = [...filteredPendidikTenaga]
        .sort((a, b) => (b.pendidik + b.tenagaPendidik) - (a.pendidik + a.tenagaPendidik))
        .map((item) => ({
            name: normalizeName(item.name),
            pendidik: item.pendidik,
            tenagaPendidik: item.tenagaPendidik
        }))

    const CustomTooltip = ({ active, payload, total }: any) => {
        if (active && payload && payload.length) {
            const { name, value } = payload[0].payload

            return (
                <div className="p-2 bg-white border rounded shadow-md text-xs z-[99999]">
                    <strong className="text-sm text-gray-900">{name}</strong>
                    <div className="text-gray-700">Jumlah: {value}</div>
                    <div className="text-gray-700">Persentase: {((value / total) * 100).toLocaleString()}%</div>
                </div>
            )
        }
        return null
    }

    const CustomTooltipPendidikTenaga = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload

            return (
                <div className="p-2 bg-white border rounded shadow-md text-xs z-[99999]">
                    <strong className="text-sm text-gray-900">{data.name}</strong>
                    <div className="text-gray-700">Pendidik: {data.pendidik}</div>
                    <div className="text-gray-700">Tenaga Kependidikan: {data.tenagaPendidik}</div>
                </div>
            )
        }
        return null
    }

    const CustomBarCursor = (props: any) => {
        const { x, y, width, height } = props
        return (
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                rx={8}
                ry={8}
                fill="rgba(0, 0, 0, 0.1)"
            />
        )
    }

    const FilterSelect = ({ value, onChange }: { value: string, onChange: (val: 'Semua' | 'Tinggi' | 'Menengah') => void }) => (
        <div className="w-40 mb-4">
            <label className="block mb-1 text-sm text-gray-300">Jenjang</label>
            <Select value={value} onValueChange={(val) => onChange(val as 'Semua' | 'Tinggi' | 'Menengah')}>
                <SelectTrigger className="w-full text-gray-300">
                    <SelectValue placeholder="Pilih Jenjang" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Semua" className="text-gray-300">Semua</SelectItem>
                    <SelectItem value="Tinggi" className="text-gray-300">Tinggi</SelectItem>
                    <SelectItem value="Menengah" className="text-gray-300">Menengah</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )

    const renderChart = (chartData: any[], title: string, filterValue: string, onFilterChange: (val: 'Semua' | 'Tinggi' | 'Menengah') => void) => {
        const total = chartData.reduce((acc, item) => acc + item.value, 0)

        return (
            <Card className="flex flex-col w-full">
                <CardHeader className="items-center pb-0 relative w-full flex-row flex px-20 justify-between">
                    <CardTitle className="text-white text-center">{title}</CardTitle>
                    <FilterSelect value={filterValue} onChange={onFilterChange} />
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <ResponsiveContainer width="100%" height={450}>
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 10, bottom: 70, left: 10 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip
                                content={(props) => <CustomTooltip {...props} total={total} />}
                                cursor={<CustomBarCursor />}
                            />
                            <YAxis type="number" />
                            <XAxis
                                type="category"
                                dataKey="name"
                                tickLine={false}
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                                tick={(props) => {
                                    const { x, y, payload } = props
                                    return (
                                        <text
                                            x={x}
                                            y={y}
                                            dy={16}
                                            textAnchor="end"
                                            transform={`rotate(-45, ${x}, ${y})`}
                                            fill="#888"
                                            fontSize={12}
                                        >
                                            {payload.value.toUpperCase()}
                                        </text>
                                    )
                                }}
                            />
                            <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                                <LabelList
                                    dataKey="value"
                                    position="top"
                                    offset={10}
                                    style={{ fill: "#fff", fontSize: 12 }}
                                />
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        )
    }

    const renderPendidikTenagaChart = () => {
        return (
            <Card className="flex flex-col w-full">
                <CardHeader className="items-center pb-0 relative w-full flex-row flex px-6 sm:px-20 justify-between gap-4">
                    <CardTitle className="text-white text-center">Pendidik dan Tenaga Kependidikan</CardTitle>
                    <FilterSelect value={filterPendidikTenaga} onChange={setFilterPendidikTenaga} />
                </CardHeader>
                <CardContent className="flex-1 pb-0 px-2 pt-4 sm:px-6 sm:pt-6">
                    <div className="overflow-x-auto scrollbar-hide">
                        <div className="w-[2800px]">
                            <ResponsiveContainer width="100%" height={500}>
                                <BarChart
                                    data={pendidikTenagaData}
                                    margin={{ top: 20, right: 10, bottom: 100, left: 20 }}
                                    barCategoryGap={20}
                                    barGap={8}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip
                                        content={<CustomTooltipPendidikTenaga />}
                                        cursor={<CustomBarCursor />}
                                    />
                                    <Legend
                                        verticalAlign="top"
                                        height={36}
                                        iconType="rect"
                                        wrapperStyle={{ paddingBottom: '20px' }}
                                    />
                                    <YAxis type="number" />
                                    <XAxis
                                        type="category"
                                        dataKey="name"
                                        tickLine={false}
                                        angle={-45}
                                        textAnchor="end"
                                        interval={0}
                                        tick={(props) => {
                                            const { x, y, payload } = props
                                            return (
                                                <text
                                                    x={x}
                                                    y={y}
                                                    dy={16}
                                                    textAnchor="end"
                                                    transform={`rotate(-45, ${x}, ${y})`}
                                                    fill="#888"
                                                    fontSize={12}
                                                >
                                                    {payload.value.toUpperCase()}
                                                </text>
                                            )
                                        }}
                                    />
                                    <Bar dataKey="pendidik" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Pendidik">
                                        <LabelList
                                            dataKey="pendidik"
                                            position="top"
                                            offset={10}
                                            style={{ fill: "#fff", fontSize: 12 }}
                                        />
                                    </Bar>
                                    <Bar dataKey="tenagaPendidik" fill="#10b981" radius={[8, 8, 0, 0]} name="Tenaga Kependidikan">
                                        <LabelList
                                            dataKey="tenagaPendidik"
                                            position="top"
                                            offset={10}
                                            style={{ fill: "#fff", fontSize: 12 }}
                                        />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            {renderChart(pesertaDidikData, "Peserta Didik", filterPesertaDidik, setFilterPesertaDidik)}
            {renderChart(alumniData, "Alumni", filterAlumni, setFilterAlumni)}
            {renderPendidikTenagaChart()}
        </div>
    )
}