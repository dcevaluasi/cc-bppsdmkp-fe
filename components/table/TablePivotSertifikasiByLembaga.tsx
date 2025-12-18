import React, { useMemo } from "react";
import { SummaryByLembaga } from "@/hooks/sertifikasi/akp/useSummaryByLemdiklat";

interface Props {
    data: SummaryByLembaga[];
}

export default function TablePivotSertifikasiByLembaga({ data }: Props) {
    const jenisList = useMemo(() => {
        return Array.from(new Set(data.map((d) => d.s_jenis_sertifikat)));
    }, [data]);

    const lembagaList = useMemo(() => {
        const raw = Array.from(new Set(data.map((d) => d.uk_nama)));

        const priority = ["BPPP", "Politeknik", "SUPM", "Pembaharuan"];

        return raw.sort((a, b) => {
            const aIndex = priority.findIndex((p) => a.includes(p));
            const bIndex = priority.findIndex((p) => b.includes(p));

            // jika keduanya ada di priority → urut sesuai index
            if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;

            // jika hanya a yang ada di priority → a dulu
            if (aIndex !== -1) return -1;

            // jika hanya b yang ada di priority → b dulu
            if (bIndex !== -1) return 1;

            // kalau keduanya tidak ada → urut alfabetis
            return a.localeCompare(b);
        });
    }, [data]);


    const lookup = useMemo(() => {
        const result: Record<string, Record<string, number>> = {};
        data.forEach((item) => {
            if (!result[item.uk_nama]) result[item.uk_nama] = {};
            result[item.uk_nama][item.s_jenis_sertifikat] =
                Number(item.jumlah);
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

    const rowTotals = useMemo(() => {
        const totals: Record<string, number> = {};
        data.forEach((item) => {
            const l = item.uk_nama;
            totals[l] = (totals[l] || 0) + Number(item.jumlah);
        });
        return totals;
    }, [data]);

    const grandTotal = Object.values(colTotals).reduce((a, b) => a + b, 0);

    return (
        <div className="overflow-x-auto border border-navy-700 rounded-xl shadow-md bg-navy-800">
            <table className="min-w-full border-collapse text-sm text-white">
                <thead className="bg-navy-700 text-gray-100">
                    <tr>
                        <th className="border border-navy-600 p-2">Lembaga</th>
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
                    {lembagaList.map((lembaga, idx) => (
                        <tr
                            key={lembaga}
                            className={idx % 2 === 0 ? "bg-navy-900" : "bg-navy-800"}
                        >
                            <td className="border border-navy-700 p-2 font-medium">
                                {lembaga}
                            </td>
                            {jenisList.map((jenis) => (
                                <td
                                    key={jenis}
                                    className="border border-navy-700 p-2 text-center"
                                >
                                    {lookup[lembaga]?.[jenis] ?? 0}
                                </td>
                            ))}
                            <td className="border border-navy-700 p-2 text-center font-semibold bg-navy-700">
                                {rowTotals[lembaga] ?? 0}
                            </td>
                        </tr>
                    ))}
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
