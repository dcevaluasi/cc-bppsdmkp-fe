"use client";

import React from "react";
import ReactDOMServer from 'react-dom/server';
import { GoogleMap, MarkerF, InfoWindowF, useLoadScript } from "@react-google-maps/api";
import { Plus_Jakarta_Sans } from "next/font/google";
import Image from "next/image";
import { baseUrl } from "@/urls/urls";
import { RiEdit2Line, RiMapPin2Fill } from "react-icons/ri";
import { Building2, Mail, Phone, User, MapPin } from "lucide-react";
import Link from "next/link";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

interface LembagaPelatihan {
    RowID: number;
    Nama: string;
    Jenis: string;
    Alamat: string;
    Pimpinan: string;
    Website: string;
    Email: string;
    Telepon: string;
    Jumlah_Instruktur: number;
    Jumlah_Widyaiswara: number;
    Lokasi_Lintang: number;
    Lokasi_Bujur: number;
    Kode_Satker: string;
}

const mapCenter = {
    lat: -0.5572709591052816,
    lng: 119.6669279254379,
};

const mapZoom = 5.2;

const mapOptions = {
    zoomControl: true,
    tilt: 45,
    heading: 90,
    mapTypeId: "hybrid",
    gestureHandling: "auto",
};

export const LemdiklatMap = ({
    lemdiklats,
    loading
}: {
    lemdiklats: LembagaPelatihan[];
    loading?: boolean;
}) => {
    console.log({ lemdiklats })
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API!,
    });

    const [selectedLemdiklat, setSelectedLemdiklat] = React.useState<LembagaPelatihan | null>(null);
    const [markerPosition, setMarkerPosition] = React.useState<{ lat: number; lng: number } | null>(null);

    const mapContainerStyle = {
        width: '100%',
        height: selectedLemdiklat == null ? "700px" : '1050px',
    };

    const mapRef = React.useRef<google.maps.Map | null>(null);

    const handleMapLoad = (map: google.maps.Map) => {
        mapRef.current = map;
    };

    const handleMarkerClick = (lemdiklat: LembagaPelatihan) => {
        const lat = parseFloat(lemdiklat.Lokasi_Lintang as any);
        const lng = parseFloat(lemdiklat.Lokasi_Bujur as any);

        setSelectedLemdiklat(lemdiklat);
        setMarkerPosition({ lat, lng });

        if (mapRef.current) {
            mapRef.current.setCenter({ lat, lng });
            mapRef.current.setZoom(10);
        }
    };

    const handleCloseInfoWindow = () => {
        setSelectedLemdiklat(null);
    };

    const handleResetView = () => {
        if (mapRef.current) {
            mapRef.current.panTo(mapCenter);
            mapRef.current.setZoom(mapZoom);
        }
        setSelectedLemdiklat(null);
        setMarkerPosition(null);
    };

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded || loading) return <div>Loading map...</div>;

    const makeMarkerIcon = (color: string, size = 40) => {
        const svgString = ReactDOMServer.renderToStaticMarkup(
            <RiMapPin2Fill size={size} color={color} />
        );
        return {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgString)}`,
            scaledSize: new google.maps.Size(size, size),
        };
    };

    return (
        <div className={`${plusJakartaSans.className} w-full mb-5 rounded-[20px]`}>
            <div className="relative rounded-[20px]">
                <div className="flex gap-1 w-fit absolute z-[999999999999] bottom-5 left-5">
                    <Link
                        href='/pelatihan/lembaga-pelatihan/manage'
                        className="text-gray-200 outline-none p-3 bg-navy-500/50 hover:bg-navy-500/50 rounded-full transition-all border border-navy-500/40 hover:border-navy-500/50 flex items-center justify-center gap-2"
                    >
                        <RiEdit2Line /> Edit
                    </Link>
                    <button
                        onClick={handleResetView}
                        className="text-gray-200 outline-none p-3 bg-navy-500/50 hover:bg-navy-500/50 rounded-full transition-all border border-navy-500/40 hover:border-navy-500/50"
                    >
                        Reset Zoom & Position
                    </button>
                    <button
                        disabled
                        className="text-gray-200 outline-none p-3 flex gap-2 bg-navy-500/50 hover:bg-navy-500/50 rounded-full transition-all border border-navy-500/40 hover:border-navy-500/50 items-center"
                    >
                        <span className='text-base flex gap-1 items-center text-green-500'>
                            <RiMapPin2Fill /> Lembaga Pelatihan
                        </span>
                    </button>
                </div>

                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={markerPosition || mapCenter}
                    zoom={markerPosition ? 10 : mapZoom}
                    options={mapOptions}
                    onLoad={handleMapLoad}
                >
                    {lemdiklats.map((lemdiklat) => {
                        if (!lemdiklat?.Lokasi_Lintang || !lemdiklat?.Lokasi_Bujur) return null;

                        const lat = parseFloat(lemdiklat.Lokasi_Lintang as any);
                        const lng = parseFloat(lemdiklat.Lokasi_Bujur as any);

                        if (isNaN(lat) || isNaN(lng)) return null;

                        const icon = makeMarkerIcon('#10b981', 40);

                        return (
                            <MarkerF
                                key={lemdiklat.RowID}
                                position={{ lat, lng }}
                                title={lemdiklat.Nama}
                                onClick={() => handleMarkerClick(lemdiklat)}
                                icon={icon}
                            />
                        );
                    })}

                    {selectedLemdiklat && markerPosition && (
                        <InfoWindowF
                            position={markerPosition}
                            onCloseClick={handleCloseInfoWindow}
                        >
                            <div className={`text-sm w-[550px] ${plusJakartaSans.className}`}>
                                {selectedLemdiklat.Website && (
                                    <div className="relative h-[250px] w-full mb-3">
                                        <Image
                                            src={baseUrl + selectedLemdiklat.Website}
                                            alt={selectedLemdiklat.Nama}
                                            width={550}
                                            height={250}
                                            className='w-full h-[250px] object-cover rounded-md'
                                        />
                                        <h2 className="font-semibold text-sm mb-1 bg-white px-2 py-1 absolute top-0 mt-3 ml-2 left-2 rounded-md flex items-center justify-center gap-1 animate-pulse duration-700">
                                            <Building2 className="text-xs" />
                                            <span>{selectedLemdiklat.Nama}</span>
                                        </h2>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                        <Building2 size={16} className="text-gray-800 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold text-gray-900">Jenis</p>
                                            <p className="text-gray-800">{selectedLemdiklat.Jenis}</p>
                                        </div>
                                    </div>

                                    {selectedLemdiklat.Pimpinan && (
                                        <div className="flex items-start gap-2">
                                            <User size={16} className="text-gray-800 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-gray-900">Pimpinan</p>
                                                <p className="text-gray-800">{selectedLemdiklat.Pimpinan}</p>
                                            </div>
                                        </div>
                                    )}

                                    {selectedLemdiklat.Alamat && (
                                        <div className="flex items-start gap-2">
                                            <MapPin size={16} className="text-gray-800 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-gray-900">Alamat</p>
                                                <p className="text-gray-800">{selectedLemdiklat.Alamat}</p>
                                            </div>
                                        </div>
                                    )}

                                    {selectedLemdiklat.Email && (
                                        <div className="flex items-start gap-2">
                                            <Mail size={16} className="text-gray-800 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-gray-900">Email</p>
                                                <p className="text-gray-800">{selectedLemdiklat.Email}</p>
                                            </div>
                                        </div>
                                    )}

                                    {selectedLemdiklat.Telepon && (
                                        <div className="flex items-start gap-2">
                                            <Phone size={16} className="text-gray-800 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-gray-900">Telepon</p>
                                                <p className="text-gray-800">{selectedLemdiklat.Telepon}</p>
                                            </div>
                                        </div>
                                    )}

                                    {selectedLemdiklat.Kode_Satker && (
                                        <div className="pt-2 border-t">
                                            <p className="font-semibold text-gray-900">Kode Satker</p>
                                            <p className="text-gray-800 font-mono">{selectedLemdiklat.Kode_Satker}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </InfoWindowF>
                    )}
                </GoogleMap>
            </div>
        </div>
    );
};