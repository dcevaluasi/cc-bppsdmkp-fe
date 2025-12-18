'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DotLoader } from 'react-spinners'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
    LabelList,
    ResponsiveContainer,
} from 'recharts'
import { formatToShortRupiah, simplifySatkerName } from '@/utils/text'
import { useState } from 'react'

type SatdikFinancesProps = {
    isLoadingPendapatanGrafik: boolean
    loadingAnggaran: boolean
    anggaranData: { label: string; desktop: number }[]
    pendapatanData: { label: string; desktop: number; mobile?: number }[]
}

export function SatdikFinances({
    isLoadingPendapatanGrafik,
    loadingAnggaran,
    anggaranData,
    pendapatanData
}: SatdikFinancesProps) {
    const [filterAnggaran, setFilterAnggaran] = useState<'Semua' | 'Tinggi' | 'Menengah'>('Semua')
    const [filterPendapatan, setFilterPendapatan] = useState<'Semua' | 'Tinggi' | 'Menengah'>('Semua')

    const isLoading = isLoadingPendapatanGrafik || loadingAnggaran || anggaranData.length === 0

    if (isLoading) {
        return (
            <div className="flex w-full h-[25vh] py-10 items-center justify-center">
                <DotLoader color="#2152ff" size={50} />
            </div>
        )
    }

    // Check jenjang based on label
    const getJenjang = (label: string): 'Tinggi' | 'Menengah' => {
        if (label.match(/Politeknik|Akademi/gi)) {
            return 'Tinggi'
        }
        if (label.match(/Sekolah|SUPM/gi)) {
            return 'Menengah'
        }
        return 'Tinggi' // default
    }

    const filterData = (data: any[], filterValue: 'Semua' | 'Tinggi' | 'Menengah') => {
        if (filterValue === 'Semua') return data
        return data.filter(item => getJenjang(item.label) === filterValue)
    }

    const CustomTooltip = ({ active, payload, isPNBP }: any) => {
        if (active && payload && payload.length) {
            const { label, desktop, mobile } = payload[0].payload

            return (
                <div className="p-2 bg-white border rounded shadow-md text-xs z-[99999]">
                    <strong className="text-sm text-gray-900">{label}</strong>
                    <div className="text-gray-700">Realisasi: Rp. {desktop.toLocaleString()}</div>
                    {isPNBP && mobile && (
                        <div className="text-gray-700">Target: Rp. {mobile.toLocaleString()}</div>
                    )}
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

    const renderChart = (data: any[], title: string, isPNBP: boolean = false, filterValue: string, onFilterChange: (val: 'Semua' | 'Tinggi' | 'Menengah') => void) => {
        const filteredData = filterData(data, filterValue as 'Semua' | 'Tinggi' | 'Menengah')

        return (
            <Card className="flex flex-col w-full mt-5">
                <CardHeader className="items-center pb-0 relative w-full flex justify-between flex-row">
                    <CardTitle className="text-white w-full">{title}</CardTitle>
                    <FilterSelect value={filterValue} onChange={onFilterChange} />
                </CardHeader>
                <CardContent className="flex-1 pb-0 px-2 pt-4 sm:px-6 sm:pt-6">
                    <ResponsiveContainer width="100%" height={450}>
                        <BarChart
                            data={filteredData}
                            margin={{ top: 20, right: 10, bottom: 100, left: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip
                                content={(props) => <CustomTooltip {...props} isPNBP={isPNBP} />}
                                cursor={<CustomBarCursor />}
                            />
                            <YAxis
                                type="number"
                                domain={[0, 'auto']}
                                tickFormatter={(value) => formatToShortRupiah(value)}
                            />
                            <XAxis
                                type="category"
                                dataKey="label"
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
                                            {simplifySatkerName(payload.value).toUpperCase()}
                                        </text>
                                    )
                                }}
                            />
                            <Bar dataKey="desktop" radius={[8, 8, 8, 8]}>
                                <LabelList
                                    dataKey="desktop"
                                    position="top"
                                    offset={10}
                                    formatter={formatToShortRupiah}
                                    style={{ fill: '#fff', fontSize: 12 }}
                                />
                                {filteredData.map((entry, index) => {
                                    const hue = (200 + index * 25) % 360
                                    const fill = `hsl(${hue}, 70%, 50%)`
                                    return <Cell key={`cell-${index}`} fill={fill} />
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        )
    }

    return (
        <div>
            {renderChart(anggaranData, "Grafik Realisasi Belanja", false, filterAnggaran, setFilterAnggaran)}
            {renderChart(pendapatanData, "Grafik Capaian PNBP", true, filterPendapatan, setFilterPendapatan)}
        </div>
    )
}