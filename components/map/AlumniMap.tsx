import React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AlumniDetail } from "@/types/alumnis";


import { MarkerClusterer } from "@googlemaps/markerclusterer";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from "@/components/ui/alert-dialog"

import { DotLoader } from "react-spinners";
import { useFetchDataAlumniDetail } from "@/hooks/pendidikan/alumni/useFetchDataAlumniDetail";
import { Button } from "../ui/button";
import {
    User, Hash, GraduationCap, Briefcase, MapPin, Mail, Phone,
    Building2, DollarSign, Calendar, Users, Home, X, Loader2
} from 'lucide-react';

export const defaultMapContainerStyle = {
    width: "100%",
    height: "700px",
    borderRadius: "15px 0px 0px 15px",
};

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

interface SectionProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    children: React.ReactNode;
}

interface DetailProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string | null | undefined;
}

const Section: React.FC<SectionProps> = ({ icon: Icon, title, children }) => (
    <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <Icon className="h-4 w-4" />
            <span>{title}</span>
        </div>
        <div className="grid gap-3 pl-6">
            {children}
        </div>
    </div>
);

const Detail: React.FC<DetailProps> = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 py-2">
        <Icon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-sm font-medium text-gray-100 break-words">
                {value || "-"}
            </p>
        </div>
    </div>
);

export const AlumniMap = ({ alumnis }: { alumnis: AlumniDetail[] }) => {
    const markerMap = React.useRef<Record<string, google.maps.Marker>>({});
    const mapContainerRef = React.useRef(null);
    const mapInstanceRef = React.useRef<google.maps.Map | null>(null);
    const [isOpen, setIsOpen] = React.useState(false);
    const [zoom, setZoom] = React.useState<number>(5.2);
    const [isFetching, setIsFetching] = React.useState<boolean>(false);

    const [selectedAlumni, setSelectedAlumni] = React.useState<AlumniDetail | null>(null);
    const [selectedId, setSelectedId] = React.useState<number | null>(null);
    const { data: detailAlumni, loading } = useFetchDataAlumniDetail(selectedId, {
        enabled: selectedId !== null && isOpen,
    });

    const defaultCenter = { lat: -2.5489, lng: 118.0149 };
    const defaultZoom = 2.3;

    const handleMapLoad = (map: google.maps.Map) => {
        if (!alumnis || alumnis.length === 0) return;

        const seenCoordinates = new Map<string, number>();

        const markers = alumnis
            .filter((alumni) => {
                // Hide if lat or lng is missing, null, 0, or not a number
                const lat = parseFloat(alumni.latitude || "");
                const lng = parseFloat(alumni.longitude || "");
                return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
            })
            .map((alumni, index) => {
                let lat = parseFloat(alumni.latitude!);
                let lng = parseFloat(alumni.longitude!);

                const key = `${lat.toFixed(5)}_${lng.toFixed(5)}`;
                const count = seenCoordinates.get(key) || 0;

                // Apply jitter if already seen
                if (count > 0) {
                    const radius = 0.0005;
                    const angle = Math.random() * 2 * Math.PI;
                    lat += radius * Math.cos(angle);
                    lng += radius * Math.sin(angle);
                }

                seenCoordinates.set(key, count + 1);

                const marker = new google.maps.Marker({
                    position: { lat, lng },
                    map,
                    title: alumni.name,
                });

                markerMap.current[index.toString()] = marker;

                marker.addListener("click", () => {
                    setSelectedAlumni(alumni);
                    setSelectedId(alumni.id_alumni);
                    setIsOpen(true);
                    map.setTilt(45);
                    map.setHeading(90);
                    map.setCenter(marker.getPosition() as google.maps.LatLng);
                    map.setZoom(100);
                });

                return marker;
            });

        new MarkerClusterer({ markers, map });
    };




    const handleResetView = () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.panTo(defaultCenter);
            mapInstanceRef.current.setZoom(defaultZoom);
        }
    };

    const defaultMapOptions = {
        zoomControl: true,
        tilt: 45,
        heading: 90,
        mapTypeId: "hybrid",
        gestureHandling: "auto",
    };

    return (
        <div className="w-full font-plusJakartaSans">
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-hidden rounded-xl border-0 bg-white dark:bg-navy-800 text-gray-900 dark:text-gray-100 z-[9999999999]">

                    {/* Header */}
                    <AlertDialogHeader className="border-b border-gray-700 pb-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-900/30 rounded-lg">
                                    <GraduationCap className="h-5 w-5 text-green-400" />
                                </div>
                                <div>
                                    <AlertDialogTitle className="text-xl font-semibold text-gray-200">Detail Alumni</AlertDialogTitle>
                                    <AlertDialogDescription className="text-sm text-gray-400">
                                        Informasi lengkap alumni yang dipilih
                                    </AlertDialogDescription>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-gray-700"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </AlertDialogHeader>

                    {/* Content */}
                    <div className="py-6 overflow-y-auto max-h-[65vh] px-1">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                            </div>
                        ) : detailAlumni ? (
                            <div className="space-y-6">

                                {/* Personal Info */}
                                <Section icon={User} title="Informasi Personal">
                                    <Detail icon={User} label="Nama" value={detailAlumni.name} />
                                    <Detail icon={Users} label="Jenis Kelamin" value={detailAlumni.jenis_kelamin} />
                                </Section>

                                {/* Academic Info */}
                                <Section icon={GraduationCap} title="Informasi Akademik">
                                    <Detail icon={GraduationCap} label="Program Studi" value={detailAlumni.program_studi} />
                                    <Detail icon={Calendar} label="Tahun Lulus" value={detailAlumni.tahun_lulus} />
                                </Section>

                                {/* Employment Info */}
                                <Section icon={Briefcase} title="Informasi Pekerjaan">
                                    <Detail icon={Briefcase} label="Status Pekerjaan" value={detailAlumni.status_pekerjaan} />
                                    <Detail icon={Briefcase} label="Negara" value={detailAlumni.negara} />
                                    <Detail icon={Building2} label="Nama Perusahaan" value={detailAlumni.nama_perusahaan} />
                                    <Detail icon={MapPin} label="Alamat Perusahaan" value={detailAlumni.alamat_perusahaan} />
                                    <Detail icon={Briefcase} label="Jabatan" value={detailAlumni.jabatan} />
                                    <Detail icon={DollarSign} label="Penghasilan" value={detailAlumni.penghasilan} />
                                </Section>

                                {/* Contact & Location */}
                                <Section icon={MapPin} title="Kontak & Lokasi">
                                    <Detail icon={Mail} label="Email" value={detailAlumni.email} />
                                    <Detail icon={Phone} label="Telepon" value={detailAlumni.phone} />
                                    <Detail icon={Home} label="Alamat" value={detailAlumni.alamat} />
                                    <Detail icon={MapPin} label="Desa" value={detailAlumni.desa} />
                                    <Detail icon={MapPin} label="Kecamatan" value={detailAlumni.kecamatan} />
                                    <Detail icon={Building2} label="Kab/Kota" value={detailAlumni.kota_kabupaten} />
                                    <Detail icon={MapPin} label="Provinsi" value={detailAlumni.provinsi} />
                                    <Detail icon={Hash} label="Kode Pos" value={detailAlumni.kode_pos} />
                                </Section>

                            </div>
                        ) : null}
                    </div>

                </AlertDialogContent>
            </AlertDialog>

            {isFetching ? (
                <div className="flex w-full h-[25vh] py-10 items-center justify-center">
                    <DotLoader color="#2152ff" size={50} />
                </div>
            ) : (
                <div className="relative">
                    <button
                        onClick={handleResetView}
                        className="text-gray-200 absolute z-[999999999999] bottom-5 left-5 outline-none p-3 bg-navy-500/50 hover:bg-navy-500/50 rounded-full transition-all border border-navy-500/40 hover:border-navy-500/50"
                    >
                        Reset Zoom & Position
                    </button>

                    <GoogleMap
                        ref={mapContainerRef}
                        mapContainerStyle={{ height: "700px", width: "100%" }}
                        center={
                            selectedAlumni
                                ? {
                                    lat: parseFloat(selectedAlumni.latitude || "0"),
                                    lng: parseFloat(selectedAlumni.longitude || "0"),
                                }
                                : defaultCenter
                        }
                        zoom={selectedAlumni ? 10 : defaultZoom}
                        options={defaultMapOptions}
                        onLoad={(map) => {
                            mapInstanceRef.current = map;
                            handleMapLoad(map);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

