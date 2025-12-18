'use client';
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useGetKinerjaSummary } from '@/hooks/managerials/kinerja/useGetKinerjaSummary';
import KinerjaTable from './tables/KinerjaTable';
import AddDataKinerja from '@/components/dashboard/kinerja/AddDataKinerja';

const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);

export const Kinerja = () => {
    const [tahun, setTahun] = useState<number>(new Date().getFullYear());
    const [triwulan, setTriwulan] = useState<string>('TW I');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'sasaran' | 'iku' | 'output'>('sasaran');

    const { data: dataKinerja, loading, error } = useGetKinerjaSummary(tahun.toString(), triwulan);

    const handleOpenModal = (type: 'sasaran' | 'iku' | 'output') => {
        setModalType(type);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-4 space-y-6">
            {loading != null ? (
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
                    <div className="flex gap-4">
                        <div className="w-40">
                            <label className="block mb-1 text-sm text-gray-300">Tahun</label>
                            <Select value={tahun.toString()} onValueChange={(val) => setTahun(parseInt(val))}>
                                <SelectTrigger className="w-full text-gray-300">
                                    <SelectValue placeholder="Pilih Tahun" />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map((year) => (
                                        <SelectItem key={year} value={year.toString()} className='text-gray-300'>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-60">
                            <label className="block mb-1 text-sm text-gray-300">Triwulan</label>
                            <Select value={triwulan} onValueChange={(val) => setTriwulan(val)}>
                                <SelectTrigger className="w-full text-gray-300">
                                    <SelectValue placeholder="Pilih Triwulan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="TW I" className="text-gray-300">TW I</SelectItem>
                                    <SelectItem value="TW II" className="text-gray-300">TW II</SelectItem>
                                    <SelectItem value="TW III" className="text-gray-300">TW III</SelectItem>
                                    <SelectItem value="TW IV" className="text-gray-300">TW IV</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Add Data Buttons */}
                    <div className="flex gap-2">
                        <Button
                            onClick={() => handleOpenModal('sasaran')}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Sasaran
                        </Button>
                        <Button
                            onClick={() => handleOpenModal('iku')}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah IKU
                        </Button>
                        <Button
                            onClick={() => handleOpenModal('output')}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Output
                        </Button>
                    </div>
                </div>
            ) : <></>}

            <KinerjaTable
                loading={loading}
                data={dataKinerja}
                tahun={tahun.toString()}
                selectedTw={triwulan}
            />

            <AddDataKinerja
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                type={modalType}
                defaultTahun={tahun.toString()}
                defaultTw={triwulan}
            />
        </div>
    );
};