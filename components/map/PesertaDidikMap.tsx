import React from "react";
import { GoogleMap } from "@react-google-maps/api";
import { Plus_Jakarta_Sans } from "next/font/google";
import { PesertaDidikDetail } from "@/types/peserta-didik";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { forwardRef, useImperativeHandle } from 'react';

import { User, Hash, Users, GraduationCap, BookOpen, Mail, Home, MapPin, Building, Tag, X, Loader2, LucideIcon } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { DotLoader } from "react-spinners";
import { useFetchDataPesertaDidikDetail } from "@/hooks/pendidikan/peserta-didik/useFetchDataPesertaDidikDetail";
import { Button } from "../ui/button";
import { FaMap } from "react-icons/fa6";
import { cn } from "@/lib/utils";

export const defaultMapContainerStyle = {
    width: "100%",
    height: "700px",
    borderRadius: "15px 0px 0px 15px",
};

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

interface SectionProps {
    icon: any;
    title: string;
    children: React.ReactNode;
}

interface PesertaDidikMapProps {
    pesertaDidiks: PesertaDidikDetail[]
    focusCoords?: { lat: number; lng: number } | null
}

export interface PesertaDidikMapRef {
    resetView: () => void
}

export const PesertaDidikMap = forwardRef<PesertaDidikMapRef, PesertaDidikMapProps>(
    ({ pesertaDidiks, focusCoords }, ref) => {
        const markerMap = React.useRef<Record<string, google.maps.Marker>>({});
        const mapContainerRef = React.useRef(null);
        const mapInstanceRef = React.useRef<google.maps.Map | null>(null);
        const [isOpen, setIsOpen] = React.useState(false);
        const [isFetching, setIsFetching] = React.useState<boolean>(false);
        const [selectedPesertaDidik, setSelectedPesertaDidik] = React.useState<PesertaDidikDetail | null>(null);
        const [selectedId, setSelectedId] = React.useState<number | null>(null);

        const { data: detailPesertaDidik, loading } = useFetchDataPesertaDidikDetail(selectedId, {
            enabled: !!selectedId
        });

        const defaultCenter = { lat: -2.5489, lng: 118.0149 };
        const defaultZoom = 5;

        const mapCenter = focusCoords || defaultCenter
        const mapZoom = focusCoords ? 8 : defaultZoom

        React.useEffect(() => {
            if (focusCoords && mapInstanceRef.current) {
                mapInstanceRef.current.panTo(focusCoords)
                mapInstanceRef.current.setZoom(10)
            }
        }, [focusCoords])


        const handleMapLoad = (map: google.maps.Map) => {
            if (!pesertaDidiks || pesertaDidiks.length === 0) return;

            const seenCoordinates = new Map<string, number>();

            const markers = pesertaDidiks
                .filter((pd) => {
                    const lat = parseFloat(pd.latitude || "");
                    const lng = parseFloat(pd.longitude || "");
                    return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
                })
                .map((pd, index) => {
                    let lat = parseFloat(pd.latitude!);
                    let lng = parseFloat(pd.longitude!);

                    const key = `${lat.toFixed(5)}_${lng.toFixed(5)}`;
                    const count = seenCoordinates.get(key) || 0;

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
                        title: pd.nama_lengkap,
                    });

                    markerMap.current[index.toString()] = marker;

                    marker.addListener("click", () => {
                        const position = marker.getPosition() as google.maps.LatLng;
                        setSelectedPesertaDidik(pd);
                        setSelectedId(pd.id_peserta_didik);

                        map.panTo(position);
                        map.setZoom(18);

                        setTimeout(() => {
                            map.setTilt(45);
                            map.setHeading(90);
                            setIsOpen(true);
                        }, 300);
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

        useImperativeHandle(ref, () => ({
            resetView: handleResetView
        }));

        const defaultMapOptions = {
            zoomControl: true,
            tilt: 45,
            heading: 90,
            mapTypeId: "hybrid",
            gestureHandling: "auto",
        };

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
        return (
            <div className="w-full font-plusJakartaSans">
                <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                    <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl text-gray-100 z-[9999999999]">

                        <AlertDialogHeader className="flex flex-row justify-between items-start">
                            <div>
                                <AlertDialogTitle className="text-2xl font-semibold">Detail Peserta Didik</AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground">
                                    Informasi lengkap peserta didik
                                </AlertDialogDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full hover:bg-muted"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </AlertDialogHeader>

                        <div className="mt-4 space-y-2 overflow-y-auto pr-2 max-h-[65vh]">
                            {loading ? (
                                <div className="flex w-full h-[25vh] py-10 items-center justify-center">
                                    <DotLoader color="#2152ff" size={50} />
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <DetailData label="Nama Lengkap" value={detailPesertaDidik?.nama_lengkap} />
                                    <DetailData label="NIT" value={detailPesertaDidik?.nit} />
                                    <DetailData label="Jenis Kelamin" value={detailPesertaDidik?.gender} />
                                    <DetailData label="Program Studi" value={detailPesertaDidik?.program_studi} />
                                    <DetailData label="Alamat" value={detailPesertaDidik?.alamat} />
                                    <DetailData label="Kecamatan" value={detailPesertaDidik?.kecamatan} />
                                    <DetailData label="Kab/Kota" value={detailPesertaDidik?.kabupaten} />
                                    <DetailData label="Provinsi" value={detailPesertaDidik?.provinsi} />
                                </div>
                            )}
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
                            className="text-gray-200 outline-none p-3 absolute z-[999999999999] bottom-5 left-5 bg-navy-500/50 hover:bg-navy-500/50 rounded-full transition-all border border-navy-500/40 hover:border-navy-500/50"
                        >
                            Reset Zoom & Position
                        </button>

                        <GoogleMap
                            ref={mapContainerRef}
                            mapContainerStyle={{ height: "700px", width: "100%" }}
                            center={mapCenter}
                            zoom={mapZoom}
                            options={defaultMapOptions}
                            onLoad={(map) => {
                                mapInstanceRef.current = map
                                handleMapLoad(map)
                            }}
                        />
                    </div>
                )}
            </div>
        );
    }
);

PesertaDidikMap.displayName = 'PesertaDidikMap';

interface DetailProps {
    label: string
    value: string | null | undefined
    className?: string
}


export function DetailData({ label, value, className }: DetailProps) {
    return (
        <div
            className={cn(
                "flex flex-col p-3 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-200",
                className
            )}
        >
            <span className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                {label}
            </span>
            <span className="text-base font-semibold text-foreground mt-1">
                {value}
            </span>
        </div>
    )
}
