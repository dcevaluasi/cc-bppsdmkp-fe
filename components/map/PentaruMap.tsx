import React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Plus_Jakarta_Sans } from "next/font/google";
import Image from "next/image";
import { baseUrl } from "@/urls/urls";
import axios from "axios";

import { MarkerClusterer } from "@googlemaps/markerclusterer";

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { DotLoader } from "react-spinners";
import { Pendaftar } from "@/types/pentaru";

// Map's styling
export const defaultMapContainerStyle = {
    width: "100%",
    height: "60vh",
    borderRadius: "15px 0px 0px 15px",
};

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });


export const PentaruMap = ({ pendaftars }: { pendaftars: Pendaftar[] }) => {
    const mapContainerRef = React.useRef(null);
    const mapInstanceRef = React.useRef<google.maps.Map | null>(null);
    const markerMap = React.useRef<Record<string, google.maps.Marker>>({});



    const handleMapLoad = (map: google.maps.Map) => {

        mapInstanceRef.current = map;
        if (!pendaftars || pendaftars.length === 0) return;

        const markers = pendaftars.map((pendaftar) => {

            const marker = new google.maps.Marker({
                position: {
                    lat: parseFloat(pendaftar.Register_Lat || "0"),
                    lng: parseFloat(pendaftar.Register_Lon || "0"),
                },
                map,
                title: pendaftar.Nama,
                icon: {
                    url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                    scaledSize: new google.maps.Size(50, 50),
                },
            });


            if (pendaftar.RowID) {
                markerMap.current[pendaftar.RowID?.toString() ?? ""] = marker;
            }

            // Additional code...
            marker.addListener("click", () => {
                setSelectedPendaftar(pendaftar);
                setIsOpen(true);
                map.setTilt(45);
                map.setHeading(90);
                map.setCenter(marker.getPosition() as google.maps.LatLng);
                map.setZoom(17); // More zoom
                handleMarkerClickAlumni(pendaftar)
            });
            return marker;
        });


        // Create cluster
        new MarkerClusterer({ markers, map });
    };

    const [selectedPendaftarData, setSelectedPendaftarData] = React.useState<Pendaftar[]>([])
    const handleFetchingSelectedPendaftar = async (idPendaftar: number) => {
        setIsFetchingSelected(true);
        try {
            const response = await axios.get(`${baseUrl}/api/pentaru/pendaftar/${idPendaftar}`
            );
            setSelectedPendaftarData(response.data);
            setIsFetchingSelected(false);
        } catch (error) {
            setIsFetchingSelected(false);
        }
    };


    const handleMarkerClickAlumni = (pendaftar: any) => {
        setSelectedPendaftar(pendaftar);
        handleFetchingSelectedPendaftar(pendaftar.RowID)
        setIsOpen(true);

        const marker = markerMap.current[pendaftar.RowID?.toString() ?? ""];

        if (marker && mapInstanceRef.current) {
            mapInstanceRef.current.setCenter(marker.getPosition() as google.maps.LatLng);
            mapInstanceRef.current.setZoom(17);
        }
    };

    const defaultMapOptions = {
        zoomControl: true,
        tilt: 45,
        heading: 90,
        mapTypeId: 'roadmap',
        gestureHandling: "auto",
    };



    const [isFetching, setIsFetching] = React.useState<boolean>(false);
    const [isFetchingSelected, setIsFetchingSelected] = React.useState<boolean>(false);

    const [selectedPendaftar, setSelectedPendaftar] = React.useState<Pendaftar | null>(
        null
    ); // State to hold the selected alumni
    const [isOpen, setIsOpen] = React.useState(false); // State to control the sheet visibility

    const [zoom, setZoom] = React.useState<number>(5.2);


    const defaultCenter = {
        lat: -0.5572709591052816,
        lng: 119.6669279254379,
    };
    const defaultZoom = 5.2;

    const handleResetView = () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.panTo(defaultCenter);
            mapInstanceRef.current.setZoom(defaultZoom);
        }
    };


    return (
        <div className={`${plusJakartaSans.className} w-full`}>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent className="z-[100000000000] text-white">
                    {
                        isFetchingSelected ? <div className="flex w-full h-[25vh] py-10 items-center justify-center">
                            <DotLoader color="#2152ff" size={50} />
                        </div> : selectedPendaftarData.length == 1 && (
                            <div>
                                <div className="flex flex-col items-center justify-center text-center">
                                    <Image
                                        className="relative"
                                        src={selectedPendaftarData[0].Jenis_Kelamin == 'L' ? '/img/avatars/male_profile.png' : '/img/avatars/female_profile.png'}
                                        alt={selectedPendaftarData[0].Nama}
                                        width={100}
                                        height={100}
                                        priority
                                    />

                                    <h2 className="font-semibold text-2xl">{selectedPendaftarData[0].Nama}</h2>
                                </div>
                                <div className={`mt-2 mb-7 h-px bg-gray-300 dark:bg-white/30`} />

                                <div>
                                    <p><strong>Nama:</strong> {selectedPendaftarData[0].Nama}</p>
                                    <p><strong>NIK:</strong> {selectedPendaftarData[0].NIK}</p>
                                    <p><strong>No Pendaftaran:</strong> {selectedPendaftarData[0].No_Pendaftaran}</p>
                                    <p><strong>Gelombang:</strong> {selectedPendaftarData[0].Gelombang}</p>
                                    <p><strong>Tanggal Lahir:</strong> {selectedPendaftarData[0].Tanggal_Lahir}</p>
                                    <p><strong>Jenis Kelamin:</strong> {selectedPendaftarData[0].Jenis_Kelamin}</p>
                                    <p><strong>Jalur Pendaftaran:</strong> {selectedPendaftarData[0].Jalur_Pendaftaran}</p>
                                    <p><strong>Jalur:</strong> {selectedPendaftarData[0].Jalur}</p>
                                    <p><strong>Kampus 1:</strong> {selectedPendaftarData[0].Kampus_1}</p>
                                    <p><strong>Prodi 1:</strong> {selectedPendaftarData[0].Prodi_1}</p>
                                    <p><strong>Kampus 2:</strong> {selectedPendaftarData[0].Kampus_2}</p>
                                    <p><strong>Prodi 2:</strong> {selectedPendaftarData[0].Prodi_2}</p>
                                    <p><strong>Kampus 3:</strong> {selectedPendaftarData[0].Kampus_3}</p>
                                    <p><strong>Prodi 3:</strong> {selectedPendaftarData[0].Prodi_3}</p>
                                    <p><strong>Status Lolos:</strong> {selectedPendaftarData[0].Status_Lolos}</p>
                                    <p><strong>Register Lat:</strong> {selectedPendaftarData[0].Register_Lat}</p>
                                    <p><strong>Register Lon:</strong> {selectedPendaftarData[0].Register_Lon}</p>
                                    <p><strong>Provinsi:</strong> {selectedPendaftarData[0].Provinsi}</p>
                                    <p><strong>Kabupaten:</strong> {selectedPendaftarData[0].Kabupaten}</p>
                                    <p><strong>Nomor Kusuka:</strong> {selectedPendaftarData[0].Nomor_Kusuka}</p>
                                    <p><strong>Nomor Kusuka Profesi:</strong> {selectedPendaftarData[0].Nomor_Kusuka_Profesi}</p>
                                </div>


                            </div>
                        )
                    }

                </SheetContent>
            </Sheet>

            {
                isFetching ? (
                    <div className="flex w-full h-[25vh] py-10 items-center justify-center">
                        <DotLoader color="#2152ff" size={50} />
                    </div>
                ) : (
                    <div className="relative">
                        <button onClick={handleResetView} className="text-navy-800 absolute z-[999999999999] bottom-5 left-5 p-3 bg-white rounded-full">
                            Reset Zoom & Position
                        </button>

                        <GoogleMap
                            ref={mapContainerRef}
                            mapContainerStyle={{ height: "700px", width: "100%" }}
                            center={
                                selectedPendaftar == null
                                    ? defaultCenter
                                    : {
                                        lat: parseFloat(selectedPendaftar.Register_Lat),
                                        lng: parseFloat(selectedPendaftar.Register_Lon),
                                    }
                            }
                            zoom={selectedPendaftar == null ? defaultZoom : 10}
                            options={defaultMapOptions}
                            onLoad={handleMapLoad}

                        />

                    </div>

                )
            }

        </div >
    );
};
