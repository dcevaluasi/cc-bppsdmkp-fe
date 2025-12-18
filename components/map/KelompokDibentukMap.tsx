import React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Plus_Jakarta_Sans } from "next/font/google";

import { MarkerClusterer } from "@googlemaps/markerclusterer";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from "@/components/ui/alert-dialog"

import { DotLoader } from "react-spinners";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { KelompokDibentukDetailResponse, KelompokLocationResponse } from "@/types/penyuluhan/summary";
import { useKelompokDibentukDetail } from "@/hooks/penyuluhan/useSummaryKelompokDibentukData";

export const defaultMapContainerStyle = {
    width: "100%",
    height: "700px",
    borderRadius: "15px 0px 0px 15px",
};

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

interface KelompokDisuluhMapProp {
    kelompokDibentuks: KelompokLocationResponse[]
    focusCoords?: { lat: number; lng: number } | null
}

export const KelompokDibentukMap = ({ kelompokDibentuks, focusCoords }: KelompokDisuluhMapProp) => {
    const markerMap = React.useRef<Record<string, google.maps.Marker>>({});
    const mapContainerRef = React.useRef(null);
    const mapInstanceRef = React.useRef<google.maps.Map | null>(null);
    const [isOpen, setIsOpen] = React.useState(false);
    const [zoom, setZoom] = React.useState<number>(5.2);
    const [isFetching, setIsFetching] = React.useState<boolean>(false);

    const [selectedKelompokDibentuk, setSelectedKelompokDibentuk] = React.useState<KelompokDibentukDetailResponse | null>(null);
    const [selectedId, setSelectedId] = React.useState<string | null>(null);
    const { data: detailKelompokDibentuk } = useKelompokDibentukDetail(selectedId!);

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
        if (!kelompokDibentuks || kelompokDibentuks.length === 0) return;

        const seenCoordinates = new Map<string, number>();

        const markers = kelompokDibentuks
            .filter((kelompokDibentuk) => {
                // Hide if lat or lng is missing, null, 0, or not a number
                const lat = parseFloat(kelompokDibentuk.latitude || "");
                const lng = parseFloat(kelompokDibentuk.longitude || "");
                return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
            })
            .map((kelompokDibentuk, index) => {
                let lat = parseFloat(kelompokDibentuk.latitude!);
                let lng = parseFloat(kelompokDibentuk.longitude!);

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
                    title: kelompokDibentuk.nama_kelompok,
                });

                markerMap.current[index.toString()] = marker;

                marker.addListener("click", () => {
                    setSelectedId(kelompokDibentuk.no_ba_pembentukan);
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

    React.useEffect(() => {
        if (!mapInstanceRef.current) return;

        // Clear old markers
        Object.values(markerMap.current).forEach((marker) => marker.setMap(null));
        markerMap.current = {};

        // Re-add markers with the latest data
        handleMapLoad(mapInstanceRef.current);
    }, [kelompokDibentuks]);



    const handleResetView = () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.panTo(defaultCenter);
            mapInstanceRef.current.setZoom(defaultZoom);
        }
    };

    const defaultMapOptions: google.maps.MapOptions = {
        zoomControl: true,
        tilt: 45,
        heading: 90,
        mapTypeId: "hybrid", // <- ini agar satelit + label default
        gestureHandling: "auto",
    };

    React.useEffect(() => {
        if (detailKelompokDibentuk) {
            setSelectedKelompokDibentuk(detailKelompokDibentuk);
        }
    }, [detailKelompokDibentuk]);

    return (
        <div className="w-full font-plusJakartaSans">
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl text-gray-100 z-[9999999999]">
                    <AlertDialogHeader className="flex flex-row justify-between items-start">
                        <div>
                            <AlertDialogTitle className="text-2xl font-semibold">Detail Kelompok Dibentuk</AlertDialogTitle>
                            <AlertDialogDescription className="text-muted-foreground">
                                Informasi lengkap tentang kelompok penyuluh perikanan
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
                        {
                            detailKelompokDibentuk && (
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <Detail label="No" value={detailKelompokDibentuk.no.toString()} />
                                    <Detail label="Satminkal" value={detailKelompokDibentuk.satminkal} />
                                    <Detail label="Provinsi" value={detailKelompokDibentuk.provinsi} />
                                    <Detail label="Kab/Kota" value={detailKelompokDibentuk.kab_kota} />
                                    <Detail label="Nama Kelompok" value={detailKelompokDibentuk.nama_kelompok} />
                                    <Detail label="Jumlah Laki-laki" value={detailKelompokDibentuk.jumlah_laki.toString()} />
                                    <Detail label="Jumlah Perempuan" value={detailKelompokDibentuk.jumlah_perempuan.toString()} />
                                    <Detail label="Jumlah Total" value={detailKelompokDibentuk.jumlah_total.toString()} />
                                    <Detail label="No BA Pembentukan" value={detailKelompokDibentuk.no_ba_pembentukan} />
                                    <Detail label="Tanggal Pembentukan" value={detailKelompokDibentuk.tanggal_pembentukan} />
                                    <Detail
                                        label="Link BA"
                                        value={
                                            <a
                                                href={detailKelompokDibentuk.link_ba}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 underline"
                                            >
                                                Lihat Dokumen
                                            </a>
                                        }
                                    />
                                    <Detail label="Alamat Kelompok" value={detailKelompokDibentuk.alamat_kelompok} />
                                    <Detail label="Bidang Usaha" value={detailKelompokDibentuk.bidang_usaha} />
                                    <Detail label="Nama Penyuluh" value={detailKelompokDibentuk.nama_penyuluh} />
                                    <Detail label="Status Penyuluh" value={detailKelompokDibentuk.status_penyuluh} />
                                    <Detail label="No Telp Penyuluh" value={detailKelompokDibentuk.no_telp_penyuluh} />
                                    <Detail label="Kode Provinsi" value={detailKelompokDibentuk.kode_provinsi} />
                                    <Detail label="Kode Kab/Kota" value={detailKelompokDibentuk.kode_kab_kota} />
                                    <Detail label="Triwulan" value={detailKelompokDibentuk.triwulan} />
                                    <Detail label="Latitude" value={detailKelompokDibentuk.latitude} />
                                    <Detail label="Longitude" value={detailKelompokDibentuk.longitude} />
                                </div>
                            )
                        }
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
                        className="text-navy-800 absolute z-[999999999999] bottom-5 left-5 p-3 bg-white rounded-full"
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
                            mapInstanceRef.current = map;
                            handleMapLoad(map);
                        }}
                    />
                </div>
            )}
        </div>
    );
};


interface DetailProps {
    label: string
    value: any
    className?: string
}

export function Detail({ label, value, className }: DetailProps) {
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