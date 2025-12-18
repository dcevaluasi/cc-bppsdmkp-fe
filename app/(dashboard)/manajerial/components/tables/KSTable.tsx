'use client'

import { DotLoader } from 'react-spinners';
import CardComponent from '@/components/CardComponent';
import { PbjItem } from '@/types/managerial/pbj';
import React from 'react';
import { KerjaSamaItem } from '@/types/managerial/kerjasama';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { MdModeEditOutline, MdOutlineFileUpload, MdOutlineInfo } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog';
import axios from 'axios';
import { baseUrl } from '@/urls/urls';
import Toast from '@/components/toast/Toast';
import { useRincianKS } from '@/hooks/managerials/ks/useRincianKS';
import { getColorClass, getYearColor, isYearColor } from '@/utils/time';
import { usePathname } from 'next/navigation';

interface Props {
    loading: boolean;
    tahun: string;
    tahunSelesai: string
    dataRincianKS: any
    search: string;
    setSearchData: React.Dispatch<React.SetStateAction<string>>;
    refetch: () => void;
}

const KSTable: React.FC<Props> = ({ loading, tahun, tahunSelesai, dataRincianKS, search, setSearchData, refetch }) => {
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = React.useState<number>(10);
    const [selectedItem, setSelectedItem] = React.useState<KerjaSamaItem | null>(null);
    const [open, setOpen] = React.useState<boolean>(false);


    const filteredData = dataRincianKS?.filter((item: any) =>
        item.Judul_Kerja_Sama.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const route = usePathname()

    const handleExportExcel = () => {
        const dataToExport = filteredData.map((item: any) => ({
            "Judul Kegiatan": item.Judul_Kerja_Sama,
            "Jenis Dokumen": item.Jenis_Dokumen,
            "Pihak KKP": item.Pihak_KKP,
            "Pihak Mitra": item.Pihak_Mitra,
            "Informasi Penandatangan": item.Informasi_Penandatanganan,
            "Mulai": item.Mulai,
            "Selesai": item.Selesai,
            "Pemrakarsa": item.Pemrakarsa,
            "Lingkup": item.Lingkup,
            "Ruang Lingkup": item.Ruang_Lingkup,
            "Pembiayaan": item.Pembiayaan,
            "Substansi": item.Substansi,
            "Keterangan": item.Keterangan,
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Kerja Sama");

        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        saveAs(blob, `Data_Kerja_Sama_${tahun}${tahunSelesai ? `-${tahunSelesai}` : ''}.xlsx`);
    };


    if (loading) {
        return (
            <div className="flex w-full h-[25vh] py-10 items-center justify-center">
                <DotLoader color="#2152ff" size={50} />
            </div>
        );
    }

    return (
        <CardComponent title={`Rincian Data Kerja Sama Tahun ${tahun} ${tahunSelesai != '' ? `- Tahun ${tahunSelesai}` : ''}`}>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent className="text-gray-200 max-h-[90vh] overflow-y-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg">Detail Kerja Sama</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-gray-300">
                            Berikut adalah informasi lengkap dari kegiatan kerja sama.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    {selectedItem && (
                        <div className="space-y-2 mt-4 text-sm">
                            <div><strong>Judul Kegiatan:</strong> {selectedItem.Judul_Kerja_Sama}</div>
                            <div><strong>Jenis Dokumen:</strong> {selectedItem.Jenis_Dokumen}</div>
                            <div><strong>Pihak KKP:</strong> {selectedItem.Pihak_KKP}</div>
                            <div><strong>Pihak Mitra:</strong> {selectedItem.Pihak_Mitra}</div>
                            <div><strong>Informasi Penandatangan:</strong> {selectedItem.Informasi_Penandatanganan}</div>
                            <div><strong>Waktu Mulai:</strong> {selectedItem.Mulai}</div>
                            <div><strong>Waktu Selesai:</strong> {selectedItem.Selesai}</div>
                            <div><strong>Pemrakarsa:</strong> {selectedItem.Pemrakarsa}</div>
                            <div><strong>Lingkup:</strong> {selectedItem.Lingkup}</div>
                            <div><strong>Ruang Lingkup:</strong> {selectedItem.Ruang_Lingkup}</div>
                            <div><strong>Pembiayaan:</strong> {selectedItem.Pembiayaan}</div>
                            <div><strong>Substansi:</strong> {selectedItem.Substansi}</div>
                            <div><strong>Keterangan:</strong> {selectedItem.Keterangan}</div>
                            <div className="mb-3 text-sm text-gray-600 w-full">
                                <p className="text-xs mb-2 text-gray-400">Preview Dokumen:</p>
                                <iframe
                                    src={`${baseUrl}${selectedItem.File_Dokumen}`}
                                    width="100%"
                                    height="500px"
                                    className="border border-gray-500 rounded"
                                ></iframe>
                            </div>
                        </div>
                    )}
                    <AlertDialogFooter>
                        <AlertDialogCancel className="mt-4">Tutup</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="overflow-x-auto rounded-lg flex flex-col gap-6">
                <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <button
                        onClick={handleExportExcel}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm hover:bg-emerald-700 transition"
                    >
                        📥 Export to Excel
                    </button>
                    <div className="w-full md:w-auto">
                        <label className="block mb-1 text-sm text-gray-300">Search </label>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearchData(e.target.value)}
                            placeholder="Cari berdasarkan judul..."
                            className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 bg-navy-700 text-gray-300"
                        />
                    </div>
                </div>

                <table className="min-w-full text-sm text-gray-200 border border-gray-700 !bg-navy-700">
                    <thead className="bg-navy-800 text-gray-100 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-2 text-center">No</th>
                            <th className="px-4 py-2 text-center">Judul Kegiatan</th>
                            <th className="px-4 py-2 text-center">Jenis Dokumen</th>
                            <th className="px-1 py-2 text-center">Pihak KKP</th>
                            <th className="px-1 py-1 text-center">Pihak Mitra</th>
                            {/* <th className="px-4 py-2 text-center">Informasi Penandatangan</th> */}
                            <th className="px-4 py-2 text-center">Mulai</th>
                            <th className="px-4 py-2 text-center">Selesai</th>
                            {!route.includes('public') && (
                                <th className="px-4 py-2 text-center min-w-[220px]">Action</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData?.map((item: any, index: number) => (
                            <tr key={item.ID} className="border-t border-gray-700 hover:bg-navy-600">
                                <td className="px-4 py-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                <td className="px-4 py-2 uppercase">{item.Judul_Kerja_Sama}</td>
                                <td className="px-4 py-2 text-left">{item.Jenis_Dokumen}</td>
                                <td className="px-1 py-2 text-center">{item.Pihak_KKP}</td>
                                <td className="px-1 py-1 text-center">{item.Pihak_Mitra}</td>
                                {/* <td className="px-4 py-2 text-left">{item.Informasi_Penandatanganan}</td> */}
                                <td className="px-4 py-2 text-left">{item.Mulai}</td>
                                <td
                                    className={`px-4 py-2 text-center font-bold  animate-pulse duration-700 text-base ${isYearColor(item.Selesai) == null
                                        ? 'bg-red-0 text-red-500'
                                        : isYearColor(item.Selesai)
                                            ? 'bg-yellow-0 text-yellow-400'
                                            : 'bg-green-0 text-green-500'
                                        } ${getColorClass(item.Selesai)}`}
                                >
                                    {item.Selesai}
                                </td>

                                {!route.includes('public') && (
                                    <td className="px-4 py-2 text-left whitespace-nowrap">
                                        <div className="flex gap-2">
                                            <UploadDialog
                                                item={item}
                                                onSuccess={() => {
                                                    setOpen(false);
                                                    refetch();
                                                }}
                                            />

                                            <EditDialog
                                                item={item}
                                                onSuccess={() => {
                                                    setOpen(false);
                                                    refetch();
                                                }}
                                            />

                                            <button
                                                onClick={() => {
                                                    setSelectedItem(item);
                                                    setOpen(true);
                                                }}
                                                className="bg-blue-600 flex gap-1 items-center justify-center hover:bg-blue-700 text-white px-2 py-1 text-xs rounded"
                                            >
                                                <MdOutlineInfo />
                                                Detail
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>

                </table>

                <div className="flex justify-between items-center mt-4">
                    <div className="text-gray-400 text-sm">
                        Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="px-3 py-1 bg-navy-800 text-gray-300 rounded disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className="px-3 py-1 bg-navy-800 text-gray-300 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>

            </div>
        </CardComponent>
    );
};

interface EditDialogProps {
    item: KerjaSamaItem;
    onSuccess: () => void;
}

const EditDialog: React.FC<EditDialogProps> = ({ item, onSuccess }) => {
    const [form, setForm] = React.useState<Partial<KerjaSamaItem>>({});
    const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

    React.useEffect(() => {
        setForm(item); // Pre-fill the form with item data
    }, [item]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const FIELD_LABELS: { [key in keyof Partial<KerjaSamaItem>]: string } = {
        Judul_Kerja_Sama: "Judul Kegiatan",
        Jenis_Dokumen: "Jenis Dokumen",
        Pihak_KKP: "Pihak KKP",
        Pihak_Mitra: "Pihak Mitra",
        Informasi_Penandatanganan: "Informasi Penandatangan",
        Mulai: "Tahun Mulai",
        Selesai: "Tahun Selesai",
        Pemrakarsa: "Pemrakarsa",
        Lingkup: "Lingkup",
        Ruang_Lingkup: "Ruang Lingkup",
        Pembiayaan: "Pembiayaan",
        Substansi: "Substansi",
        Keterangan: "Keterangan",
    };


    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();

            Object.entries(form).forEach(([key, val]) => {
                if (val !== null && val !== undefined && key !== "File_Dokumen") {
                    formData.append(key, String(val));
                }
            });

            const response = await axios.post(
                `${baseUrl}/api/kerja-sama/${item.ID}/postDocumentKSDataOnly`,
                formData
            );

            Toast.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Data kerja sama berhasil diperbarui.",
            });
            onSuccess();
            console.log({ response })
        } catch (err) {
            console.error(err);
            Toast.fire({
                icon: "error",
                title: "Gagal!",
                text: "Terjadi kesalahan saat menyimpan data.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600 flex gap-1 items-center">
                    <MdModeEditOutline /> Edit Data
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="text-gray-200 max-h-[90vh] overflow-y-auto">
                <AlertDialogHeader>
                    <AlertDialogTitle>Edit Kerja Sama</AlertDialogTitle>
                </AlertDialogHeader>

                <div className="grid gap-3 text-sm mt-2">
                    {Object.entries(FIELD_LABELS).map(([key, label]) => {
                        const isTextarea =
                            key === "Ruang_Lingkup" || key === "Keterangan";

                        return (
                            <div key={key} className="flex flex-col gap-1">
                                <label htmlFor={key} className="text-xs text-gray-400">
                                    {label}
                                </label>
                                {isTextarea ? (
                                    <textarea
                                        id={key}
                                        name={key}
                                        value={form[key as keyof KerjaSamaItem] || ""}
                                        onChange={handleChange}
                                        placeholder={label}
                                        className="border border-gray-600 bg-navy-800 text-white px-3 py-2 rounded w-full placeholder:text-gray-400"
                                    />
                                ) : (
                                    <input
                                        id={key}
                                        name={key}
                                        value={form[key as keyof KerjaSamaItem] || ""}
                                        onChange={handleChange}
                                        placeholder={label}
                                        className="border border-gray-600 bg-navy-800 text-white px-3 py-2 rounded w-full placeholder:text-gray-400"
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                <AlertDialogFooter className="mt-4">
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Menyimpan..." : "Simpan"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

function UploadDialog({ item, onSuccess }: { item: { File_Dokumen: string | null, ID: number }, onSuccess: () => void }) {
    const [file, setFile] = React.useState<File | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== "application/pdf") {
                setError("Only PDF files are allowed.");
                setFile(null);
                Toast.fire({
                    icon: "error",
                    title: `Ooopsss!`,
                    text: `Only PDF files are allowed!`,
                });
            } else {
                setError(null);
                setFile(selectedFile);
            }
        }
    };

    const handleUpload = async () => {
        setIsLoading(true)
        if (!file) {
            setError("Please upload a PDF file.");
            Toast.fire({
                icon: "error",
                title: `Ooopsss!`,
                text: `Please upload a PDF file!`,
            });
            setIsLoading(false)
            return;
        }

        try {
            const formData = new FormData();
            formData.append("document", file);

            const response = await axios.post(`${baseUrl}/api/kerja-sama/${item.ID}/postDocumentKS`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log({ response })
            setIsLoading(false)
            onSuccess();
            Toast.fire({
                icon: "success",
                title: `Yeaayyyy!`,
                text: `Successfully uploaded document!`,
            });
        } catch (err: any) {
            console.error(err);
            Toast.fire({
                icon: "error",
                title: `Ooopsss!`,
                text: `Failed to upload file. Please try again!`,
            });
            setIsLoading(false)
            setError("Failed to upload file. Please try again.");
        }
    };

    return (
        <AlertDialog >
            <AlertDialogTrigger asChild>
                <button className="bg-gray-600 flex gap-1 items-center justify-center hover:bg-gray-700 text-white px-2 py-1 text-xs rounded">
                    <span className="flex gap-1 items-center">
                        {item.File_Dokumen == null ? <MdOutlineFileUpload /> : <MdModeEditOutline />}
                        {item.File_Dokumen == null ? "Upload" : "Update"} File
                    </span>
                </button>
            </AlertDialogTrigger>

            <AlertDialogContent className='text-gray-200'>
                <AlertDialogHeader>
                    <AlertDialogTitle>{item.File_Dokumen ? "Update File" : "Upload File"}</AlertDialogTitle>
                </AlertDialogHeader>

                {item.File_Dokumen && (
                    <div className="mb-3 text-sm text-gray-600 w-full">
                        <p className="text-xs mb-2 text-gray-400">Preview Dokumen:</p>
                        <iframe
                            src={`${baseUrl}${item.File_Dokumen}`}
                            width="100%"
                            height="500px"
                            className="border border-gray-500 rounded"
                        ></iframe>
                    </div>
                )}


                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold border border-gray-200 rounded file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    {
                        isLoading ? <Button disabled className='animate-pulse duration-700'>
                            Uploading...
                        </Button> : <Button onClick={handleUpload} disabled={!file || !!error}>
                            Save
                        </Button>
                    }
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default KSTable;
