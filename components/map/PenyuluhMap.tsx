import React from "react";
import { GoogleMap } from "@react-google-maps/api";

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
import { PenyuluhDetailResponse, PenyuluhLocationResponse } from "@/types/penyuluhan/summary";
import { usePenyuluhDetail } from "@/hooks/penyuluhan/useSummaryPenyuluhData";
import { cn } from "@/lib/utils";

export const defaultMapContainerStyle = {
    width: "100%",
    height: "700px",
    borderRadius: "15px 0px 0px 15px",
};

interface PenyuluhMapProp {
    penyuluhs: PenyuluhLocationResponse[]
    focusCoords?: { lat: number; lng: number } | null
}

export const PenyuluhMap = ({ penyuluhs, focusCoords }: PenyuluhMapProp) => {
    const markerMap = React.useRef<Record<string, google.maps.Marker>>({});
    const mapContainerRef = React.useRef(null);
    const mapInstanceRef = React.useRef<google.maps.Map | null>(null);
    const [isOpen, setIsOpen] = React.useState(false);
    const [isFetching, setIsFetching] = React.useState<boolean>(false);

    const [selectedPenyuluh, setSelectedPenyuluh] = React.useState<PenyuluhDetailResponse | null>(null);
    const [selectedId, setSelectedId] = React.useState<number | null>(null);
    const { data: detailPenyuluh, isLoading } = usePenyuluhDetail(selectedId!);

    console.log({ detailPenyuluh })

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
        if (!penyuluhs || penyuluhs.length === 0) return;

        const seenCoordinates = new Map<string, number>();

        const markers = penyuluhs
            .filter((penyuluh) => {
                // Hide if lat or lng is missing, null, 0, or not a number
                const lat = parseFloat(penyuluh.latitude || "");
                const lng = parseFloat(penyuluh.longitude || "");
                return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
            })
            .map((penyuluh, index) => {
                let lat = parseFloat(penyuluh.latitude!);
                let lng = parseFloat(penyuluh.longitude!);

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
                    title: penyuluh.nama,
                });

                markerMap.current[index.toString()] = marker;

                marker.addListener("click", () => {
                    setSelectedId(penyuluh.no);
                    setIsOpen(true);
                })

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
    }, [penyuluhs]);



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
        mapTypeId: "hybrid",
        gestureHandling: "auto",
    };

    React.useEffect(() => {
        if (!isLoading && detailPenyuluh) setSelectedPenyuluh(detailPenyuluh!);
    }, [isLoading, detailPenyuluh]);

    return (
        <div className="w-full font-plusJakartaSans">
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl text-gray-100 z-[9999999999]">
                    <AlertDialogHeader className="flex flex-row justify-between items-start">
                        <div>
                            <AlertDialogTitle className="text-2xl font-semibold">Detail Penyuluh</AlertDialogTitle>
                            <AlertDialogDescription className="text-muted-foreground">
                                Informasi lengkap tentang penyuluh perikanan
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
                            isLoading ? <div className="flex w-full h-[25vh] py-10 items-center justify-center">
                                <DotLoader color="#2152ff" size={50} />
                            </div> : (
                                <div className="grid grid-cols-2 gap-4 text-sm">

                                    <Detail label="Nama" value={detailPenyuluh?.nama!} />
                                    <Detail label="Jabatan" value={detailPenyuluh?.jabatan!} />
                                    <Detail label="Usia" value={`${detailPenyuluh?.usia!} Tahun`} />
                                    <Detail label="Status" value={detailPenyuluh?.status!} />
                                    <Detail label="Pendidikan/Prodi" value={`${detailPenyuluh?.pendidikan} - ${detailPenyuluh?.prodi}`} />
                                    <Detail label="Satminkal" value={detailPenyuluh?.satminkal!} />
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
    value: string
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