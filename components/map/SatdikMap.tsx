"use client";

import React from "react";
import ReactDOMServer from 'react-dom/server';

import { GoogleMap, MarkerF, InfoWindowF, useLoadScript } from "@react-google-maps/api"; // 
import { Plus_Jakarta_Sans } from "next/font/google";
import { Satdik } from "@/types/satdik";
import Image from "next/image";
import { usePendidikanContext } from "../contexts/PendidikanContext";
import { baseUrl } from "@/urls/urls";
import { simplifySatkerName } from "@/utils/text";
import { LucideSchool } from "lucide-react";
import { RiEdit2Line, RiMapPin2Fill } from "react-icons/ri";
import { useSidebarContext } from "@/providers/SidebarProvider";
import Link from "next/link";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });



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

export const SatdikMap = ({ satdiks }: { satdiks: Satdik[] }) => {
    const { idSatdikSelected, setIdSatdikSelected } = usePendidikanContext();

    const { openSidebar, setOpenSidebar, collapsed, setCollapsed } = useSidebarContext();

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API!,
    });

    const [selectedSatdik, setSelectedSatdik] = React.useState<Satdik | null>(null);

    const mapContainerStyle = {
        width: '100%',
        height: idSatdikSelected == null && selectedSatdik == null ? "700px" : '1050px',
    };


    const [markerPosition, setMarkerPosition] = React.useState<{ lat: number; lng: number } | null>(null);

    const mapRef = React.useRef<google.maps.Map | null>(null);

    const handleMapLoad = (map: google.maps.Map) => {
        mapRef.current = map;
    };

    const handleMarkerClick = (satdik: Satdik) => {
        const lat = parseFloat(satdik.Lokasi_Lintang);
        const lng = parseFloat(satdik.Lokasi_Bujur);

        setSelectedSatdik(satdik);
        setCollapsed(true)
        setMarkerPosition({ lat, lng });
        setIdSatdikSelected(satdik.RowID.toString());

        if (mapRef.current) {
            mapRef.current.setCenter({ lat, lng });
            mapRef.current.setZoom(70);
        }
    };

    const handleCloseInfoWindow = () => {
        setSelectedSatdik(null);
    };

    const handleResetView = () => {
        if (mapRef.current) {
            mapRef.current.panTo(mapCenter);
            mapRef.current.setZoom(mapZoom);
        }
        setIdSatdikSelected(null);
        setSelectedSatdik(null);
        setMarkerPosition(null);
    };

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading map...</div>;

    const makeMarkerIcon = (color: string, size = 40) => {
        const svgString = ReactDOMServer.renderToStaticMarkup(
            <RiMapPin2Fill size={size} color={color} />
        );
        return {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgString)}`,
            scaledSize: new google.maps.Size(size, size),
        };
    }


    return (
        <div className={`${plusJakartaSans.className} w-full mb-5 rounded-[20px]`}>
            <div className="relative rounded-[20px]">
                <div className="flex gap-1 w-fit absolute z-[999999999999] bottom-5 left-5">
                    <Link
                        href='/pendidikan/satuan-pendidikan/manage'
                        className="text-gray-200 outline-none p-3 bg-navy-500/50 hover:bg-navy-500/50 rounded-full transition-all border border-navy-500/40 hover:border-navy-500/50 flex items-center justify-center"
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
                        <span className='text-base flex gap-1 items-center text-blue-500'>
                            <RiMapPin2Fill /> Politeknik
                        </span>
                        <span className='text-base flex gap-1 items-center text-red-500'>
                            <RiMapPin2Fill /> SUPM
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
                    {satdiks.map((satdik) => {
                        if (!satdik?.Lokasi_Lintang || !satdik?.Lokasi_Bujur) return null;

                        const lat = parseFloat(satdik.Lokasi_Lintang);
                        const lng = parseFloat(satdik.Lokasi_Bujur);

                        if (isNaN(lat) || isNaN(lng)) return null;

                        const name = satdik.Nama.toLowerCase();

                        if (name.includes("kampus")) return null;

                        const isBlue = /akademi|politeknik/i.test(satdik.Nama);
                        const color = isBlue ? '#3b82f6' : '#ef4444'

                        const icon = makeMarkerIcon(color, 40);

                        return (
                            <MarkerF
                                key={satdik.RowID}
                                position={{ lat, lng }}
                                title={satdik.Nama}
                                onClick={() => handleMarkerClick(satdik)}
                                icon={icon}
                            />

                        );
                    })}

                    {selectedSatdik && markerPosition && (
                        <InfoWindowF
                            position={markerPosition}
                            onCloseClick={handleCloseInfoWindow}

                        >
                            <div className={`text-sm w-[550px] ${plusJakartaSans.className}`}>

                                <div className="relative h-[250px] w-full mb-3">
                                    <Image src={baseUrl + selectedSatdik.Website} alt={'Dummy Gambar'} width={0} height={0} className='w-full h-[250px] object-cover rounded-md' />
                                    <h2 className="font-semibold text-sm mb-1 bg-white px-2 py-1 absolute top-0 mt-3 ml-2 left-2 rounded-md flex items-center justify-center gap-1 animate-pulse duration-700"><LucideSchool className="text-xs" />
                                        <span>{simplifySatkerName(selectedSatdik.Nama)}</span></h2>
                                </div>
                                <div className="">
                                    <p className="mb-1"><span className="font-semibold">Pimpinan</span>: {selectedSatdik.Pimpinan}</p>
                                    <p className="mb-1"><span className="font-semibold">Alamat</span> : {selectedSatdik.Alamat}</p>

                                    <p className="mb-1"><span className="font-semibold">Akreditasi Lembaga</span>: {selectedSatdik.Akreditasi_Lembaga}</p>

                                </div>
                                <p className="mb-1"><span className="font-semibold">Akreditasi Program Studi</span>: </p>
                                <div className="prose max-w-full overflow-x-auto text-sm" dangerouslySetInnerHTML={{ __html: selectedSatdik!.Akreditasi_Prodi }} />


                            </div>
                        </InfoWindowF>
                    )}
                </GoogleMap>
            </div>
        </div>
    );
};
