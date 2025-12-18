'use client';

import { useState, useRef } from 'react';
import { Upload, CheckCircle, XCircle, FileText, Loader2 } from 'lucide-react';
import { baseUrl } from '@/urls/urls';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface UploadStats {
    delete: number;
    insert: number;
    update: number;
}

interface UploadResponse {
    success: boolean;
    message: string;
    statistics?: UploadStats;
    total?: number;
}

export default function SqlUploadOmspan() {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<UploadResponse | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.size > 20 * 1024 * 1024) {
                setResponse({
                    success: false,
                    message: 'File terlalu besar! Maksimal 20MB'
                });
                return;
            }
            setFile(selectedFile);
            setResponse(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        setResponse(null);

        try {
            const formData = new FormData();
            formData.append('sql_file', file);

            const res = await fetch(`${baseUrl}/api/omspan/upload-sql`, {
                method: 'POST',
                body: formData,
            });

            const data: UploadResponse = await res.json();
            setResponse(data);

            if (data.success) {
                setFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        } catch (error) {
            setResponse({
                success: false,
                message: 'Network error: ' + (error as Error).message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setOpen(false);
            setTimeout(() => {
                setFile(null);
                setResponse(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }, 200);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-95 active:scale-95 transition-all duration-200 text-center text-sm">
                    <Upload className="w-5 h-5" />
                    Update SQL Omspan
                </button>
            </AlertDialogTrigger>

            <AlertDialogContent className="max-w-md bg-white/95 backdrop-blur-xl border-white/20">
                <AlertDialogHeader>
                    <div className="flex justify-center mb-0">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl">
                            <Upload className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <AlertDialogTitle className="text-2xl font-bold text-center text-gray-200">
                        Upload SQL File
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center text-gray-500">
                        Upload file SQL untuk update database
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-6 mt-0">
                    {/* File Input */}
                    <div>
                        <label className="relative block">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".sql,.txt"
                                onChange={handleFileChange}
                                className="hidden"
                                disabled={loading}
                            />
                            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-300">
                                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-sm text-gray-600 font-medium">
                                    {file ? file.name : 'Pilih file SQL'}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Max 20MB • .sql
                                </p>
                            </div>
                        </label>
                    </div>

                    {/* Upload Button */}
                    <button
                        onClick={handleUpload}
                        disabled={!file || loading}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl py-2 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5" />
                                Upload & Execute
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl py-2 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 -mt-2"
                    >
                        Close
                    </button>

                    {/* Response Message */}
                    {response && (
                        <div
                            className={`p-4 rounded-xl ${response.success
                                ? 'bg-green-50 border border-green-200'
                                : 'bg-red-50 border border-red-200'
                                } animate-fadeIn`}
                        >
                            <div className="flex items-start gap-3">
                                {response.success ? (
                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                )}
                                <div className="flex-1">
                                    <p
                                        className={`text-sm font-medium ${response.success ? 'text-green-800' : 'text-red-800'
                                            }`}
                                    >
                                        {response.message}
                                    </p>

                                    {/* Statistics */}
                                    {response.success && response.statistics && (
                                        <div className="mt-3 grid grid-cols-3 gap-2">
                                            <div className="bg-none rounded-lg p-2 text-center">
                                                <p className="text-xs text-gray-500 mb-1">DELETE</p>
                                                <p className="text-lg font-bold text-red-600">
                                                    {response.statistics.delete}
                                                </p>
                                            </div>
                                            <div className="bg-none rounded-lg p-2 text-center">
                                                <p className="text-xs text-gray-500 mb-1">INSERT</p>
                                                <p className="text-lg font-bold text-green-600">
                                                    {response.statistics.insert}
                                                </p>
                                            </div>
                                            <div className="bg-none rounded-lg p-2 text-center">
                                                <p className="text-xs text-gray-500 mb-1">UPDATE</p>
                                                <p className="text-lg font-bold text-blue-600">
                                                    {response.statistics.update}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Info Footer */}
                    <div className="text-center">
                        <p className="text-xs text-gray-500">
                            Pastikan file SQL hanya berisi query DELETE, INSERT, atau UPDATE
                        </p>
                    </div>
                </div>

                <style jsx>{`
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(-10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    .animate-fadeIn {
                        animation: fadeIn 0.3s ease-out;
                    }
                `}</style>
            </AlertDialogContent>
        </AlertDialog>
    );
}