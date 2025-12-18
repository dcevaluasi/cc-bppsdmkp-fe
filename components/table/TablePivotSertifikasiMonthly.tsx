import React, { useMemo } from "react";
import { SummaryMonthly } from "@/hooks/sertifikasi/akp/useSummaryMonthly";

interface Props {
    data: SummaryMonthly[];
}

const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
];

export default function TablePivotSertifikasiMonthly({ data }: Props) {
    const jenisList = useMemo(() => {
        return Array.from(new Set(data.map((d) => d.s_jenis_sertifikat)));
    }, [data]);

    const lookup = useMemo(() => {
        const result: Record<string, Record<string, number>> = {};
        data.forEach((item) => {
            if (!result[item.bulan]) result[item.bulan] = {};
            result[item.bulan][item.s_jenis_sertifikat] = Number(item.jumlah);
        });
        return result;
    }, [data]);

    const colTotals = useMemo(() => {
        const totals: Record<string, number> = {};
        data.forEach((item) => {
            const j = item.s_jenis_sertifikat;
            totals[j] = (totals[j] || 0) + Number(item.jumlah);
        });
        return totals;
    }, [data]);

    const grandTotal = Object.values(colTotals).reduce((a, b) => a + b, 0);

    return (
        <div className="overflow-x-auto border border-navy-700 rounded-xl shadow-md bg-navy-800">
            <table className="min-w-full border-collapse text-sm text-white">
                <thead className="bg-navy-700 text-gray-100">
                    <tr>
                        <th className="border border-navy-600 p-2">Bulan</th>
                        {jenisList.map((jenis) => (
                            <th
                                key={jenis}
                                className="border border-navy-600 p-2 text-center"
                            >
                                {jenis}
                            </th>
                        ))}
                        <th className="border border-navy-600 p-2 text-center bg-navy-600">
                            Total
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {months.map((bulan, idx) => {
                        const rowTotal = jenisList.reduce(
                            (sum, jenis) => sum + (lookup[bulan]?.[jenis] ?? 0),
                            0
                        );
                        return (
                            <tr
                                key={bulan}
                                className={idx % 2 === 0 ? "bg-navy-900" : "bg-navy-800"}
                            >
                                <td className="border border-navy-700 p-2 font-medium">
                                    {bulan}
                                </td>
                                {jenisList.map((jenis) => (
                                    <td
                                        key={jenis}
                                        className="border border-navy-700 p-2 text-center"
                                    >
                                        {lookup[bulan]?.[jenis] ?? 0}
                                    </td>
                                ))}
                                <td className="border border-navy-700 p-2 text-center font-semibold bg-navy-700">
                                    {rowTotal}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot>
                    <tr className="bg-navy-600 font-bold text-gray-100">
                        <td className="border border-navy-700 p-2">Total</td>
                        {jenisList.map((jenis) => (
                            <td
                                key={jenis}
                                className="border border-navy-700 p-2 text-center"
                            >
                                {colTotals[jenis] ?? 0}
                            </td>
                        ))}
                        <td className="border border-navy-700 p-2 text-center">
                            {grandTotal}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}
