import React from "react";
import axios from "axios";
import { baseUrl } from "@/urls/urls";
import { LemdiklatMap } from "@/components/map/LemdiklatMap";
import { useRekapSatker } from "@/hooks/managerials/useRekapPerSatker";
import { useRekapPendapatanPerDay } from "@/hooks/managerials/useRekapPendapatanPerDay";
import { LemdiklatFinances } from "@/components/dashboard/pelatihan/LemdiklatFinances";

interface LembagaPelatihan {
    RowID: number;
    Nama: string;
    Jenis: string;
    Alamat: string;
    Pimpinan: string;
    Website: string;
    Email: string;
    Telepon: string;
    Jumlah_Instruktur: number;
    Jumlah_Widyaiswara: number;
    Lokasi_Lintang: number;
    Lokasi_Bujur: number;
    Kode_Satker: string;
}

function LembagaPelatihan() {
    const [tahun, setTahun] = React.useState<number>(new Date().getFullYear());

    const [isFetching, setIsFetching] = React.useState<boolean>(false);
    const [lembagaPelatihan, setLembagaPelatihan] = React.useState<LembagaPelatihan[]>([]);

    const { data: dataAnggaran, loading: loadingAnggaran } = useRekapSatker(tahun, '', 'Pelatihan');
    const { data: pendapatanDataGrafik, loading: isLoadingPendapatanGrafik } = useRekapPendapatanPerDay(tahun, "latest", "pelatihan");

    const anggaranData = dataAnggaran?.map((item) => ({
        label: item.nama_satker,
        desktop: item.realisasi_sampai_tanggal,
    })) || [];

    const pendapatanData = pendapatanDataGrafik?.map((item) => ({
        label: item.nama_satker,
        desktop: item.realisasi_amount,
        mobile: item.pagu
    })) ?? [];

    const handleFetchingLembagaPelatihan = async () => {
        setIsFetching(true);
        try {
            const response = await axios.get(`${baseUrl}/api/lembaga-pelatihan`);
            setLembagaPelatihan(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetching(false);
        }
    };

    React.useEffect(() => {
        handleFetchingLembagaPelatihan();
    }, []);

    return (
        <section>
            <div className="flex flex-col gap-2 h-[100vh]">
                <LemdiklatMap lemdiklats={lembagaPelatihan} loading={isFetching} />
                <LemdiklatFinances isLoadingPendapatanGrafik={isLoadingPendapatanGrafik} loadingAnggaran={loadingAnggaran} anggaranData={anggaranData} pendapatanData={pendapatanData} />
            </div>
        </section>
    );
}

export default LembagaPelatihan;