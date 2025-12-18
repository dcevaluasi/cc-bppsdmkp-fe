'use client'

import {
    BarChart,
    Bar,
    XAxis,
    CartesianGrid,
    Tooltip,
    Cell,
    LabelList,
    YAxis,
} from 'recharts'
import { Label } from 'recharts'
import { ChartContainer, ChartLegendContent } from '../ui/chart'
import { formatToShortRupiah, simplifySatkerName } from '@/utils/text'
import CardComponent from '../CardComponent'

interface RealisasiKeuanganChartProps {
    data: { label: string; desktop: number }[]
    arialChartConfig?: any
    title: string
}

export const RealisasiKeuanganChart = ({
    data,
    arialChartConfig,
    title
}: RealisasiKeuanganChartProps) => {
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const { label, desktop, mobile } = payload[0].payload

            return (
                <div className="p-2 bg-white border rounded shadow-md text-xs z-[99999]">
                    <strong className="text-sm text-gray-900">{label}</strong>
                    <div className="text-gray-700">Realisasi: Rp. {desktop.toLocaleString()}</div>
                    {
                        (title == 'Grafik Capaian PNBP' || title == 'Grafik Capaian PNBP - Satker PNBP') && <div className="text-gray-700">Target: Rp. {mobile.toLocaleString()}</div>
                    }
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

    return (
        <CardComponent title={title}>
            <div className="overflow-x-auto pt-0 scrollbar-hide">
                <div className={`${title == 'Grafik Capaian PNBP' || title == 'Grafik Capaian PNBP - Satker PNBP' ? 'w-[3500px]' : title == 'Grafik Realisasi Belanja' ? 'w-[2800px]' : arialChartConfig}`}>
                    <ChartContainer config={arialChartConfig} className="aspect-auto h-[550px] w-full">
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 10, bottom: 100, left: 10 }}
                            barCategoryGap={60}
                            barGap={5}
                            barSize={300}>
                            <Tooltip content={<CustomTooltip />} cursor={<CustomBarCursor />} />
                            <CartesianGrid vertical={false} horizontal={false} />
                            <YAxis
                                domain={[0, 'auto']}
                                tickFormatter={(value) => formatToShortRupiah(value)}
                            />
                            <XAxis
                                type="category"
                                dataKey="label"
                                tickLine={false}
                                angle={-45}
                                textAnchor="end"
                                minTickGap={32}
                                tickMargin={8}
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
                            >
                                <Label
                                    value=""
                                    offset={10}
                                    position="insideBottom"
                                    style={{ fill: '#666', fontSize: 14 }}
                                />
                            </XAxis>

                            {/* {
                                title == 'Grafik Capaian PNBP' && (
                                    <Bar stackId="a" className='mr-1' dataKey="mobile" radius={[5, 5, 0, 0]}>
                                        <LabelList
                                            dataKey="mobile"
                                            position="top"
                                            offset={10}
                                            formatter={formatToShortRupiah}
                                            style={{ fill: '#fff', fontSize: 12 }}
                                        />
                                        {data.map((entry, index) => {
                                            const hue = (200 + index * 25) % 360
                                            const fill = `hsl(${hue}, 70%, 80%)`
                                            return <Cell key={`cell-mobile-${index}`} fill={fill} />
                                        })}
                                    </Bar>
                                )
                            } */}

                            <Bar stackId="b" dataKey="desktop" radius={[5, 5, 0, 0]}>
                                <LabelList
                                    dataKey="desktop"
                                    position="top"
                                    offset={10}
                                    formatter={formatToShortRupiah}
                                    style={{ fill: '#fff', fontSize: 12 }}
                                />
                                {data.map((entry, index) => {
                                    const hue = (200 + index * 25) % 360
                                    const fill = `hsl(${hue}, 70%, 50%)`
                                    return <Cell key={`cell-desktop-${index}`} fill={fill} />
                                })}
                            </Bar>

                            <ChartLegendContent />
                        </BarChart>
                    </ChartContainer>
                </div>
            </div>
        </CardComponent >
    )
}

