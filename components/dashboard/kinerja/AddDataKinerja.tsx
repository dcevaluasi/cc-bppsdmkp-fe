'use client';
import React, { useState, useEffect } from 'react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddSasaran, useAddIku, useAddOutput } from '@/hooks/managerials/kinerja/useAddKinerja';
import { useGetSasaran } from '@/hooks/managerials/kinerja/useGetSasaran';
import { useGetIku } from '@/hooks/managerials/kinerja/useGetIku';

interface AddDataModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'sasaran' | 'iku' | 'output';
    defaultTahun: string;
    defaultTw: string;
}

const AddDataModal: React.FC<AddDataModalProps> = ({ isOpen, onClose, type, defaultTahun, defaultTw }) => {
    const [formData, setFormData] = useState<any>({});

    const { data: sasaranList } = useGetSasaran(defaultTahun);
    const { data: ikuList } = useGetIku(defaultTahun);

    const { addSasaran, loading: loadingSasaran } = useAddSasaran();
    const { addIku, loading: loadingIku } = useAddIku();
    const { addOutput, loading: loadingOutput } = useAddOutput();

    useEffect(() => {
        if (type === 'sasaran') {
            setFormData({ nama: '', tahun: defaultTahun });
        } else if (type === 'iku') {
            setFormData({ id_sasaran: '', nama: '', unit_pj: '', tahun: defaultTahun });
        } else if (type === 'output') {
            setFormData({
                id_iku: '',
                nama: '',
                kode: '',
                alokasi_anggaran: 0,
                realisasi_anggaran: 0,
                satuan_target: '',
                t_tw: 0,
                r_tw: 0,
                tw: defaultTw,
                tahun: defaultTahun,
            });
        }
    }, [isOpen, type, defaultTahun, defaultTw]);

    const handleSubmit = async () => {
        try {
            if (type === 'sasaran') {
                await addSasaran(formData);
            } else if (type === 'iku') {
                await addIku(formData);
            } else if (type === 'output') {
                await addOutput(formData);
            }
            onClose();
        } catch (error) {
            console.error('Error adding data:', error);
        }
    };

    const handleChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const loading = loadingSasaran || loadingIku || loadingOutput;

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="bg-gray-800 text-gray-100 max-w-2xl max-h-[90vh] overflow-y-auto">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold">
                        Tambah {type === 'sasaran' ? 'Sasaran' : type === 'iku' ? 'IKU' : 'Output'}
                    </AlertDialogTitle>
                </AlertDialogHeader>

                <div className="space-y-4 py-4">
                    {type === 'sasaran' && (
                        <>
                            <div>
                                <label htmlFor="nama" className="block text-sm font-medium mb-1">
                                    Nama Sasaran
                                </label>
                                <input
                                    id="nama"
                                    type="text"
                                    value={formData.nama || ''}
                                    onChange={(e) => handleChange('nama', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="tahun" className="block text-sm font-medium mb-1">
                                    Tahun
                                </label>
                                <input
                                    id="tahun"
                                    type="text"
                                    value={formData.tahun || ''}
                                    onChange={(e) => handleChange('tahun', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </>
                    )}

                    {type === 'iku' && (
                        <>
                            <div>
                                <label htmlFor="id_sasaran" className="block text-sm font-medium mb-1">
                                    Sasaran
                                </label>
                                <Select
                                    value={formData.id_sasaran?.toString() || ''}
                                    onValueChange={(val) => handleChange('id_sasaran', parseInt(val))}
                                >
                                    <SelectTrigger className="bg-gray-700 text-gray-100">
                                        <SelectValue placeholder="Pilih Sasaran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sasaranList?.map((s: any) => (
                                            <SelectItem key={s.id} value={s.id.toString()}>
                                                {s.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label htmlFor="nama" className="block text-sm font-medium mb-1">
                                    Nama IKU
                                </label>
                                <input
                                    id="nama"
                                    type="text"
                                    value={formData.nama || ''}
                                    onChange={(e) => handleChange('nama', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="unit_pj" className="block text-sm font-medium mb-1">
                                    Unit Penanggung Jawab
                                </label>
                                <input
                                    id="unit_pj"
                                    type="text"
                                    value={formData.unit_pj || ''}
                                    onChange={(e) => handleChange('unit_pj', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="tahun" className="block text-sm font-medium mb-1">
                                    Tahun
                                </label>
                                <input
                                    id="tahun"
                                    type="text"
                                    value={formData.tahun || ''}
                                    onChange={(e) => handleChange('tahun', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </>
                    )}

                    {type === 'output' && (
                        <>
                            <div>
                                <label htmlFor="id_iku" className="block text-sm font-medium mb-1">
                                    IKU
                                </label>
                                <Select
                                    value={formData.id_iku?.toString() || ''}
                                    onValueChange={(val) => handleChange('id_iku', parseInt(val))}
                                >
                                    <SelectTrigger className="bg-gray-700 text-gray-100">
                                        <SelectValue placeholder="Pilih IKU" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ikuList?.map((iku: any) => (
                                            <SelectItem key={iku.id} value={iku.id.toString()}>
                                                {iku.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="nama" className="block text-sm font-medium mb-1">
                                        Nama Output
                                    </label>
                                    <input
                                        id="nama"
                                        type="text"
                                        value={formData.nama || ''}
                                        onChange={(e) => handleChange('nama', e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="kode" className="block text-sm font-medium mb-1">
                                        Kode
                                    </label>
                                    <input
                                        id="kode"
                                        type="text"
                                        value={formData.kode || ''}
                                        onChange={(e) => handleChange('kode', e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="alokasi_anggaran" className="block text-sm font-medium mb-1">
                                        Alokasi Anggaran
                                    </label>
                                    <input
                                        id="alokasi_anggaran"
                                        type="number"
                                        step="0.01"
                                        value={formData.alokasi_anggaran || 0}
                                        onChange={(e) => handleChange('alokasi_anggaran', parseFloat(e.target.value))}
                                        className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="realisasi_anggaran" className="block text-sm font-medium mb-1">
                                        Realisasi Anggaran
                                    </label>
                                    <input
                                        id="realisasi_anggaran"
                                        type="number"
                                        step="0.01"
                                        value={formData.realisasi_anggaran || 0}
                                        onChange={(e) => handleChange('realisasi_anggaran', parseFloat(e.target.value))}
                                        className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="satuan_target" className="block text-sm font-medium mb-1">
                                        Satuan Target
                                    </label>
                                    <input
                                        id="satuan_target"
                                        type="text"
                                        value={formData.satuan_target || ''}
                                        onChange={(e) => handleChange('satuan_target', e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="t_tw" className="block text-sm font-medium mb-1">
                                        Target TW
                                    </label>
                                    <input
                                        id="t_tw"
                                        type="number"
                                        step="0.01"
                                        value={formData.t_tw || 0}
                                        onChange={(e) => handleChange('t_tw', parseFloat(e.target.value))}
                                        className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="r_tw" className="block text-sm font-medium mb-1">
                                        Realisasi TW
                                    </label>
                                    <input
                                        id="r_tw"
                                        type="number"
                                        step="0.01"
                                        value={formData.r_tw || 0}
                                        onChange={(e) => handleChange('r_tw', parseFloat(e.target.value))}
                                        className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="tw" className="block text-sm font-medium mb-1">
                                        Triwulan
                                    </label>
                                    <Select
                                        value={formData.tw || ''}
                                        onValueChange={(val) => handleChange('tw', val)}
                                    >
                                        <SelectTrigger className="bg-gray-700 text-gray-100">
                                            <SelectValue placeholder="Pilih TW" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="TW I">TW I</SelectItem>
                                            <SelectItem value="TW II">TW II</SelectItem>
                                            <SelectItem value="TW III">TW III</SelectItem>
                                            <SelectItem value="TW IV">TW IV</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label htmlFor="tahun" className="block text-sm font-medium mb-1">
                                        Tahun
                                    </label>
                                    <input
                                        id="tahun"
                                        type="text"
                                        value={formData.tahun || ''}
                                        onChange={(e) => handleChange('tahun', e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-gray-700 text-gray-100 hover:bg-gray-600">
                        Batal
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {loading ? 'Menyimpan...' : 'Simpan'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AddDataModal;