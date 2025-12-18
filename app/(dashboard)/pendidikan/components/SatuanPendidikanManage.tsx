'use client'

import React, { useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, Save, MapPin, User, Building2, Hash, Award, PlusCircle, Upload, Image as ImageIcon } from 'lucide-react';
import { baseUrl } from '@/urls/urls';

interface ProdiAkreditasi {
    nama: string;
    akreditasi: string;
}

const SatuanPendidikanManage = () => {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isEdit, setIsEdit] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState<any>(null);
    const [uploadingImage, setUploadingImage] = React.useState(false);
    const [imagePreview, setImagePreview] = React.useState<string>('');

    const [formData, setFormData] = React.useState({
        Nama: '',
        Jenjang: 'tinggi',
        Alamat: '',
        Pimpinan: '',
        Website: '',
        Jumlah_Peserta_Didik: 0,
        Jumlah_Alumni: 0,
        Jumlah_Pendidik: 0,
        Jumlah_Tenaga_Kependidikan: 0,
        Lokasi_Lintang: '',
        Lokasi_Bujur: '',
        Akreditasi_Lembaga: '',
        Akreditasi_Prodi: '',
        Kode_Satker: ''
    });

    const [prodiList, setProdiList] = React.useState<ProdiAkreditasi[]>([
        { nama: '', akreditasi: '' }
    ]);

    const akreditasiOptions = ['A', 'B', 'C', 'Unggul', 'Baik Sekali', 'Baik', 'Cukup'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/api/satuan-pendidikan`);
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    const generateProdiHTML = (prodiList: ProdiAkreditasi[]) => {
        const validProdis = prodiList.filter(p => p.nama.trim() !== '' && p.akreditasi.trim() !== '');
        if (validProdis.length === 0) return '';

        const rows = validProdis.map(p => `<tr><td>${p.nama}</td><td>${p.akreditasi}</td></tr>`).join('');
        return `<table dir="ltr" border="1" cellspacing="0" cellpadding="0" data-sheets-root="1" data-sheets-baot="1"><colgroup><col width="280" /><col width="535" /></colgroup><tbody>${rows}</tbody></table>`;
    };

    const parseProdiHTML = (html: string): ProdiAkreditasi[] => {
        if (!html || html.trim() === '') return [{ nama: '', akreditasi: '' }];

        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const rows = doc.querySelectorAll('tr');

            const prodis: ProdiAkreditasi[] = [];
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length === 2) {
                    prodis.push({
                        nama: cells[0].textContent?.trim() || '',
                        akreditasi: cells[1].textContent?.trim() || ''
                    });
                }
            });

            return prodis.length > 0 ? prodis : [{ nama: '', akreditasi: '' }];
        } catch (error) {
            console.error('Error parsing HTML:', error);
            return [{ nama: '', akreditasi: '' }];
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validasi ukuran file (max 20MB)
        if (file.size > 20 * 1024 * 1024) {
            alert('Ukuran file terlalu besar! Maksimal 20MB');
            return;
        }

        // Preview image
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload image jika sedang edit
        if (isEdit && selectedItem?.RowID) {
            setUploadingImage(true);
            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await fetch(`${baseUrl}/api/satuan-pendidikan/${selectedItem.RowID}/upload-website`, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const result = await response.json();
                    setFormData(prev => ({ ...prev, Website: result.data.Website }));
                    alert('Image berhasil diupload!');
                    fetchData(); // Refresh data
                } else {
                    alert('Gagal upload image');
                    setImagePreview('');
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                alert('Gagal upload image');
                setImagePreview('');
            }
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            const prodiHTML = generateProdiHTML(prodiList);
            const submitData = {
                ...formData,
                Akreditasi_Prodi: prodiHTML
            };

            const url = isEdit
                ? `${baseUrl}/api/satuan-pendidikan/${selectedItem?.RowID}`
                : `${baseUrl}/api/satuan-pendidikan`;

            const response = await fetch(url, {
                method: isEdit ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submitData)
            });

            if (response.ok) {
                fetchData();
                closeModal();
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    const handleDelete = async (rowId: any) => {
        if (!confirm('Hapus data ini?')) return;

        setLoading(true);
        try {
            await fetch(`${baseUrl}/api/satuan-pendidikan/${rowId}`, { method: 'DELETE' });
            fetchData();
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    const openModal = (item: any = null) => {
        if (item) {
            setIsEdit(true);
            setSelectedItem(item);
            setFormData(item);
            setProdiList(parseProdiHTML(item.Akreditasi_Prodi));
            setImagePreview(item.Website ? `${baseUrl}${item.Website}` : '');
        } else {
            setIsEdit(false);
            setSelectedItem(null);
            setFormData({
                Nama: '',
                Jenjang: 'tinggi',
                Alamat: '',
                Pimpinan: '',
                Website: '',
                Jumlah_Peserta_Didik: 0,
                Jumlah_Alumni: 0,
                Jumlah_Pendidik: 0,
                Jumlah_Tenaga_Kependidikan: 0,
                Lokasi_Lintang: '',
                Lokasi_Bujur: '',
                Akreditasi_Lembaga: '',
                Akreditasi_Prodi: '',
                Kode_Satker: ''
            });
            setProdiList([{ nama: '', akreditasi: '' }]);
            setImagePreview('');
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEdit(false);
        setSelectedItem(null);
        setImagePreview('');
    };

    const addProdi = () => {
        setProdiList([...prodiList, { nama: '', akreditasi: '' }]);
    };

    const removeProdi = (index: number) => {
        if (prodiList.length > 1) {
            setProdiList(prodiList.filter((_, i) => i !== index));
        }
    };

    const updateProdi = (index: number, field: 'nama' | 'akreditasi', value: string) => {
        const newProdiList = [...prodiList];
        newProdiList[index][field] = value;
        setProdiList(newProdiList);
    };

    const filteredData = data.filter((item: any) =>
        item.Nama?.toLowerCase().includes(search.toLowerCase()) ||
        item.Jenjang?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-navy-800/40 backdrop-blur-md rounded-xl p-6 mb-6 border border-gray-700/30 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <Building2 className="text-blue-400" size={32} />
                        <h1 className="text-2xl font-bold text-gray-100">Manajemen Data Satuan Pendidikan KP</h1>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Cari nama atau jenjang..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-navy-700/50 border border-gray-600/30 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            />
                        </div>

                        <button
                            onClick={() => openModal()}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 font-medium"
                        >
                            <Plus size={20} />
                            Tambah Data
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-navy-800/40 backdrop-blur-md rounded-xl border border-gray-700/30 overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-navy-700/50 border-b border-gray-700/50">
                                    <th className="px-6 py-4 text-left text-gray-200 font-semibold">
                                        <div className="flex items-center gap-2">
                                            <Building2 size={18} className="text-blue-400" />
                                            Nama
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-gray-200 font-semibold">Jenjang</th>
                                    <th className="px-6 py-4 text-left text-gray-200 font-semibold">
                                        <div className="flex items-center gap-2">
                                            <User size={18} className="text-blue-400" />
                                            Pimpinan
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-gray-200 font-semibold">
                                        <div className="flex items-center gap-2">
                                            <Award size={18} className="text-blue-400" />
                                            Akreditasi
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-gray-200 font-semibold">
                                        <div className="flex items-center gap-2">
                                            <Hash size={18} className="text-blue-400" />
                                            Kode Satker
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-center text-gray-200 font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                                                <span className="text-gray-300">Memuat data...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                            <Building2 size={48} className="mx-auto mb-3 opacity-50" />
                                            <p>Tidak ada data ditemukan</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((item: any, index: number) => (
                                        <tr
                                            key={item.RowID}
                                            className="border-b border-gray-700/30 hover:bg-navy-700/30 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-gray-100 font-medium">{item.Nama}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 capitalize">
                                                    {item.Jenjang}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-200">{item.Pimpinan || '-'}</td>
                                            <td className="px-6 py-4">
                                                {item.Akreditasi_Lembaga ? (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                                                        {item.Akreditasi_Lembaga}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-200 font-mono">{item.Kode_Satker || '-'}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => openModal(item)}
                                                        className="p-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg transition-all border border-amber-500/30 hover:border-amber-500/50"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.RowID)}
                                                        className="p-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all border border-red-500/30 hover:border-red-500/50"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                        <div className="bg-navy-800 rounded-2xl border border-gray-700/50 w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
                            <div className="sticky top-0 bg-navy-800 border-b border-gray-700/50 p-6 flex justify-between items-center z-10">
                                <div className="flex items-center gap-3">
                                    <Building2 className="text-blue-400" size={24} />
                                    <h2 className="text-2xl font-bold text-gray-100">
                                        {isEdit ? 'Edit' : 'Tambah'} Satuan Pendidikan
                                    </h2>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-200 p-2 hover:bg-gray-700/50 rounded-lg transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-80px)]">
                                {/* Image Upload */}
                                <div className="border border-gray-700/50 rounded-xl p-4 bg-navy-900/30">
                                    <label className="flex items-center gap-2 text-gray-200 mb-3 font-medium">
                                        <ImageIcon size={16} className="text-blue-400" />
                                        Foto/Logo Satuan Pendidikan
                                    </label>

                                    <div className="flex gap-4 items-start">
                                        {imagePreview && (
                                            <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-600/50 flex-shrink-0">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}

                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={uploadingImage || (!isEdit && !selectedItem)}
                                                className="hidden"
                                                id="image-upload"
                                            />
                                            <label
                                                htmlFor="image-upload"
                                                className={`flex items-center justify-center gap-2 px-4 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg transition-all border border-blue-500/30 cursor-pointer ${uploadingImage || (!isEdit && !selectedItem) ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                            >
                                                <Upload size={18} />
                                                {uploadingImage ? 'Mengupload...' : 'Upload Gambar'}
                                            </label>
                                            <p className="text-xs text-gray-400 mt-2">
                                                {isEdit ? 'Max 20MB. Format: JPG, PNG, GIF' : 'Simpan data terlebih dahulu untuk upload gambar'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-gray-200 mb-2 font-medium">
                                        <Building2 size={16} className="text-blue-400" />
                                        Nama *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.Nama}
                                        onChange={(e) => setFormData({ ...formData, Nama: e.target.value })}
                                        className="w-full px-4 py-3 bg-navy-700/50 border border-gray-600/50 rounded-xl text-gray-100 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        placeholder="Masukkan nama satuan pendidikan"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-200 mb-2 font-medium">Jenjang *</label>
                                        <select
                                            required
                                            value={formData.Jenjang}
                                            onChange={(e) => setFormData({ ...formData, Jenjang: e.target.value })}
                                            className="w-full px-4 py-3 bg-navy-700/50 border border-gray-600/50 rounded-xl text-gray-100 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        >
                                            <option value="tinggi">Tinggi</option>
                                            <option value="menengah">Menengah</option>
                                            <option value="pascasarjana">Pascasarjana</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2 text-gray-200 mb-2 font-medium">
                                            <Award size={16} className="text-blue-400" />
                                            Akreditasi Lembaga
                                        </label>
                                        <select
                                            value={formData.Akreditasi_Lembaga}
                                            onChange={(e) => setFormData({ ...formData, Akreditasi_Lembaga: e.target.value })}
                                            className="w-full px-4 py-3 bg-navy-700/50 border border-gray-600/50 rounded-xl text-gray-100 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        >
                                            <option value="">Pilih Akreditasi</option>
                                            {akreditasiOptions.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-gray-200 mb-2 font-medium">
                                        <MapPin size={16} className="text-blue-400" />
                                        Alamat
                                    </label>
                                    <textarea
                                        value={formData.Alamat}
                                        onChange={(e) => setFormData({ ...formData, Alamat: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-navy-700/50 border border-gray-600/50 rounded-xl text-gray-100 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                                        placeholder="Masukkan alamat lengkap"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-gray-200 mb-2 font-medium">
                                        <User size={16} className="text-blue-400" />
                                        Pimpinan
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.Pimpinan}
                                        onChange={(e) => setFormData({ ...formData, Pimpinan: e.target.value })}
                                        className="w-full px-4 py-3 bg-navy-700/50 border border-gray-600/50 rounded-xl text-gray-100 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        placeholder="Nama pimpinan"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="flex items-center gap-2 text-gray-200 mb-2 font-medium">
                                            <MapPin size={16} className="text-blue-400" />
                                            Lintang
                                        </label>
                                        <input
                                            type="number"
                                            step="any"
                                            value={formData.Lokasi_Lintang}
                                            onChange={(e) => setFormData({ ...formData, Lokasi_Lintang: e.target.value })}
                                            className="w-full px-4 py-3 bg-navy-700/50 border border-gray-600/50 rounded-xl text-gray-100 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                            placeholder="-6.2088"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 text-gray-200 mb-2 font-medium">
                                            <MapPin size={16} className="text-blue-400" />
                                            Bujur
                                        </label>
                                        <input
                                            type="number"
                                            step="any"
                                            value={formData.Lokasi_Bujur}
                                            onChange={(e) => setFormData({ ...formData, Lokasi_Bujur: e.target.value })}
                                            className="w-full px-4 py-3 bg-navy-700/50 border border-gray-600/50 rounded-xl text-gray-100 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                            placeholder="106.8456"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-gray-200 mb-2 font-medium">
                                        <Hash size={16} className="text-blue-400" />
                                        Kode Satker
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.Kode_Satker}
                                        onChange={(e) => setFormData({ ...formData, Kode_Satker: e.target.value })}
                                        className="w-full px-4 py-3 bg-navy-700/50 border border-gray-600/50 rounded-xl text-gray-100 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all font-mono"
                                        placeholder="123456"
                                    />
                                </div>

                                {/* Akreditasi Prodi Section */}
                                <div className="border border-gray-700/50 rounded-xl p-4 bg-navy-900/30">
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="flex items-center gap-2 text-gray-200 font-medium">
                                            <Award size={16} className="text-blue-400" />
                                            Akreditasi Program Studi
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addProdi}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg transition-all text-sm border border-blue-500/30"
                                        >
                                            <PlusCircle size={16} />
                                            Tambah Prodi
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {prodiList.map((prodi, index) => (
                                            <div key={index} className="flex gap-3 items-start">
                                                <div className="flex-1">
                                                    <input
                                                        type="text"
                                                        value={prodi.nama}
                                                        onChange={(e) => updateProdi(index, 'nama', e.target.value)}
                                                        className="w-full px-4 py-2.5 bg-navy-700/50 border border-gray-600/50 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all text-sm"
                                                        placeholder="Nama Program Studi"
                                                    />
                                                </div>
                                                <div className="w-48">
                                                    <select
                                                        value={prodi.akreditasi}
                                                        onChange={(e) => updateProdi(index, 'akreditasi', e.target.value)}
                                                        className="w-full px-4 py-2.5 bg-navy-700/50 border border-gray-600/50 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all text-sm"
                                                    >
                                                        <option value="">Pilih Akreditasi</option>
                                                        {akreditasiOptions.map(opt => (
                                                            <option key={opt} value={opt}>{opt}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                {prodiList.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeProdi(index)}
                                                        className="p-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all border border-red-500/30"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-gray-700/50">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25 font-medium"
                                    >
                                        <Save size={20} />
                                        {loading ? 'Menyimpan...' : 'Simpan Data'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-6 py-3.5 bg-gray-700/50 hover:bg-gray-700/70 text-gray-200 rounded-xl transition-all border border-gray-600/50 font-medium"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SatuanPendidikanManage;