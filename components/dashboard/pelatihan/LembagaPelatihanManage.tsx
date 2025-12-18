'use client'

import React, { useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, Save, MapPin, User, Building2, Hash, Mail, Phone, Upload, Image as ImageIcon } from 'lucide-react';
import { baseUrl } from '@/urls/urls';

const LembagaPelatihanManage = () => {
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
        Jenis: 'Balai Pelatihan',
        Alamat: '',
        Pimpinan: '',
        Website: '',
        Email: '',
        Telepon: '',
        Jumlah_Instruktur: 0,
        Jumlah_Widyaiswara: 0,
        Lokasi_Lintang: '',
        Lokasi_Bujur: '',
        Kode_Satker: ''
    });

    const jenisOptions = [
        'Balai Pelatihan',
        'Pusat Pelatihan',
        'Unit Pelaksana Teknis',
        'Lembaga Pelatihan Swasta',
        'Lainnya'
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/api/lembaga-pelatihan`);
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 20 * 1024 * 1024) {
            alert('Ukuran file terlalu besar! Maksimal 20MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        if (isEdit && selectedItem?.RowID) {
            setUploadingImage(true);
            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await fetch(`${baseUrl}/api/lembaga-pelatihan/${selectedItem.RowID}/upload-image`, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const result = await response.json();
                    setFormData(prev => ({ ...prev, Website: result.data.Website }));
                    alert('Image berhasil diupload!');
                    fetchData();
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
            const url = isEdit
                ? `${baseUrl}/api/lembaga-pelatihan/${selectedItem?.RowID}`
                : `${baseUrl}/api/lembaga-pelatihan`;

            const response = await fetch(url, {
                method: isEdit ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
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
            await fetch(`${baseUrl}/api/lembaga-pelatihan/${rowId}`, { method: 'DELETE' });
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
            setImagePreview(item.Website ? `${baseUrl}${item.Website}` : '');
        } else {
            setIsEdit(false);
            setSelectedItem(null);
            setFormData({
                Nama: '',
                Jenis: 'Balai Pelatihan',
                Alamat: '',
                Pimpinan: '',
                Website: '',
                Email: '',
                Telepon: '',
                Jumlah_Instruktur: 0,
                Jumlah_Widyaiswara: 0,
                Lokasi_Lintang: '',
                Lokasi_Bujur: '',
                Kode_Satker: ''
            });
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

    const filteredData = data.filter((item: any) =>
        item.Nama?.toLowerCase().includes(search.toLowerCase()) ||
        item.Jenis?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-navy-800/40 backdrop-blur-md rounded-xl p-6 mb-6 border border-gray-700/30 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <Building2 className="text-blue-400" size={32} />
                        <h1 className="text-2xl font-bold text-gray-100">Manajemen Data Lembaga Pelatihan KP</h1>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Cari nama atau jenis..."
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
                                    <th className="px-6 py-4 text-left text-gray-200 font-semibold">Jenis</th>
                                    <th className="px-6 py-4 text-left text-gray-200 font-semibold">
                                        <div className="flex items-center gap-2">
                                            <User size={18} className="text-blue-400" />
                                            Pimpinan
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-gray-200 font-semibold">
                                        <div className="flex items-center gap-2">
                                            <Mail size={18} className="text-blue-400" />
                                            Kontak
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
                                    filteredData.map((item: any) => (
                                        <tr
                                            key={item.RowID}
                                            className="border-b border-gray-700/30 hover:bg-navy-700/30 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-gray-100 font-medium">{item.Nama}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                                    {item.Jenis}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-200">{item.Pimpinan || '-'}</td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    {item.Email && (
                                                        <div className="flex items-center gap-1 text-xs text-gray-300">
                                                            <Mail size={12} />
                                                            {item.Email}
                                                        </div>
                                                    )}
                                                    {item.Telepon && (
                                                        <div className="flex items-center gap-1 text-xs text-gray-300">
                                                            <Phone size={12} />
                                                            {item.Telepon}
                                                        </div>
                                                    )}
                                                    {!item.Email && !item.Telepon && <span className="text-gray-400">-</span>}
                                                </div>
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
                                        {isEdit ? 'Edit' : 'Tambah'} Lembaga Pelatihan
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
                                        Foto/Logo Lembaga
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
                                                className={`flex items-center justify-center gap-2 px-4 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg transition-all border border-blue-500/30 cursor-pointer ${uploadingImage || (!isEdit && !selectedItem) ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                                        Nama Lembaga *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.Nama}
                                        onChange={(e) => setFormData({ ...formData, Nama: e.target.value })}
                                        className="w-full px-4 py-3 bg-navy-700/50 border border-gray-600/50 rounded-xl text-gray-100 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        placeholder="Masukkan nama lembaga pelatihan"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-200 mb-2 font-medium">Jenis Lembaga *</label>
                                    <select
                                        required
                                        value={formData.Jenis}
                                        onChange={(e) => setFormData({ ...formData, Jenis: e.target.value })}
                                        className="w-full px-4 py-3 bg-navy-700/50 border border-gray-600/50 rounded-xl text-gray-100 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    >
                                        {jenisOptions.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
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
                                            <Mail size={16} className="text-blue-400" />
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.Email}
                                            onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                                            className="w-full px-4 py-3 bg-navy-700/50 border border-gray-600/50 rounded-xl text-gray-100 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 text-gray-200 mb-2 font-medium">
                                            <Phone size={16} className="text-blue-400" />
                                            Telepon
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.Telepon}
                                            onChange={(e) => setFormData({ ...formData, Telepon: e.target.value })}
                                            className="w-full px-4 py-3 bg-navy-700/50 border border-gray-600/50 rounded-xl text-gray-100 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                            placeholder="08xx-xxxx-xxxx"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="flex items-center gap-2 text-gray-200 mb-2 font-medium">
                                            <User size={16} className="text-blue-400" />
                                            Jumlah Instruktur
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.Jumlah_Instruktur}
                                            onChange={(e) => setFormData({ ...formData, Jumlah_Instruktur: parseInt(e.target.value) || 0 })}
                                            className="w-full px-4 py-3 bg-navy-700/50 border border-gray-600/50 rounded-xl text-gray-100 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 text-gray-200 mb-2 font-medium">
                                            <User size={16} className="text-blue-400" />
                                            Jumlah Widyaiswara
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.Jumlah_Widyaiswara}
                                            onChange={(e) => setFormData({ ...formData, Jumlah_Widyaiswara: parseInt(e.target.value) || 0 })}
                                            className="w-full px-4 py-3 bg-navy-700/50 border border-gray-600/50 rounded-xl text-gray-100 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        />
                                    </div>
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
                                        maxLength={6}
                                    />
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

export default LembagaPelatihanManage;