import React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SATUAN_PENDIDIKAN, SatuanPendidikan } from "@/data/satuanPendidikan";
import Image from "next/image";
import Cookies from "js-cookie";
import { usePendidikanContext } from "../contexts/PendidikanContext";
import { baseUrl } from "@/urls/urls";
import axios from "axios";
import { Alumnis } from "@/types/alumnis";

import { Loader } from "@googlemaps/js-api-loader";
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

// Map's styling
export const defaultMapContainerStyle = {
  width: "100%",
  height: "60vh",
  borderRadius: "15px 0px 0px 15px",
};

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

// Navy palette styles for the map
const navyModeStyles = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#111c44", // Navy 800
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#aac0fe", // Navy 100
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#0b1437", // Navy 900
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [
      {
        color: "#728fea", // Navy 300
      },
    ],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#3652ba", // Navy 400
      },
    ],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#aac0fe", // Navy 100
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#aac0fe", // Navy 100
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#24388a", // Navy 600
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#aac0fe", // Navy 100
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#1b3bbb", // Navy 500
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#3652ba", // Navy 400
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#1B254B", // Navy 700
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d0dcfb", // Navy 50
      },
    ],
  },
];

export const Map = ({ selectedTab }: { selectedTab: string }) => {
  const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API!, // replace with your key
    version: "weekly",
  });

  const markerMap = React.useRef<Record<string, google.maps.Marker>>({});

  const handleMapLoad = (map: google.maps.Map) => {
    if (!alumnis || alumnis.length === 0) return;

    const markers = alumnis.map((alumni) => {
      const marker = new google.maps.Marker({
        position: {
          lat: parseFloat(alumni.latitude || "0"),
          lng: parseFloat(alumni.longitude || "0"),
        },
        map,
        title: alumni.name,
        icon: {
          url: "https://i.postimg.cc/Fs2CF16v/high-school.png",
          scaledSize: new google.maps.Size(50, 50),
        },
      });

      // Store the marker in markerMap using alumni ID or unique identifier
      if (alumni.id) {
        markerMap.current[alumni.id.toString()] = marker;
      }

      marker.addListener("click", () => {
        setSelectedAlumni(alumni);
        setIsOpen(true);
        map.setTilt(45);
        map.setHeading(90);
        map.setCenter(marker.getPosition() as google.maps.LatLng);
        map.setZoom(17); // More zoom
        handleMarkerClickAlumni(alumni)
      });

      return marker;
    });

    // Create cluster
    new MarkerClusterer({ markers, map });
  };

  const handleMapLoadSatdik = (map: google.maps.Map) => {
    const markers = SATUAN_PENDIDIKAN.map((location) => {
      const marker = new google.maps.Marker({
        position: {
          lat: location.lat,
          lng: location.lng,
        },
        map,
        title: location.satuan_pendidikan,
        icon: {
          url: "https://i.postimg.cc/ZnN3wYxP/school.png", // Custom icon
          scaledSize: new google.maps.Size(60, 60),
        },
      });

      marker.addListener("click", () => {
        handleMarkerClick(location); // Your existing click handler
        map.setCenter(marker.getPosition() as google.maps.LatLng);
        map.setZoom(14);
      });

      return marker;
    });

    new MarkerClusterer({ markers, map });
  };



  const handleMarkerClickAlumni = (alumni: any) => {
    setSelectedAlumni(alumni);
    setIsOpen(true);

    const marker = markerMap.current[alumni.id?.toString() ?? ""];

    if (marker && mapRef.current) {
      mapRef.current.setCenter(marker.getPosition() as google.maps.LatLng);
      mapRef.current.setZoom(17);
    }
  };




  const defaultMapCenter = {
    lat: -0.5572709591052816,
    lng: 119.6669279254379,
  };

  const defaultMapOptions = {
    zoomControl: true,
    tilt: 45,
    heading: 90,
    mapTypeId: 'roadmap',
    gestureHandling: "auto",
  };

  const [selectedLocation, setSelectedLocation] =
    React.useState<SatuanPendidikan | null>(null);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const mapRef = React.useRef<any>(null);
  const mapRefSatdik = React.useRef<any>(null);

  const { setIdSatdikSelected } = usePendidikanContext();

  const handleMarkerClick = (location: any) => {
    Cookies.set("IdSatdikSelected", location.id);
    setIdSatdikSelected(location.id);
    setSelectedLocation(location);

    if (mapRef.current) {
      mapRef.current!.setCenter({ lat: location.lat, lng: location.lng });
      setZoom(mapRef.current!.setZoom(100)); // You can set the desired zoom level here
    }
  };

  const [isFetching, setIsFetching] = React.useState<boolean>(false);
  const { idSatdikSelected } = usePendidikanContext();
  const [alumnis, setAlumnis] = React.useState<Alumnis[]>([]);
  const handleFetchingAlumni = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(
        idSatdikSelected == null
          ? `${baseUrl}/api/alumnis`
          : `${baseUrl}/api/alumnis?satdik_id=${idSatdikSelected}`
      );
      setAlumnis(response.data);
      console.log("ALUMNI BASED ON SATDIK ID", response);
      setIsFetching(false);
    } catch (error) {
      console.error("ALUMNI BASED ON SATDIK ID", error);
      setIsFetching(true);
    }
  };

  React.useEffect(() => {
    if (idSatdikSelected) {
      handleFetchingAlumni();
    } else {
      handleFetchingAlumni();
    }
  }, [idSatdikSelected]);

  const [selectedAlumni, setSelectedAlumni] = React.useState<Alumnis | null>(
    null
  ); // State to hold the selected alumni
  const [isOpen, setIsOpen] = React.useState(false); // State to control the sheet visibility

  const [zoom, setZoom] = React.useState<number>(5.2);

  const handleZoomChanged = () => {
    if (mapRef.current) {
      setZoom(mapRef.current.getZoom());
    }
  };

  return (
    <div className={`${plusJakartaSans.className} w-full`}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="z-[1000000] text-white">
          {selectedAlumni && (
            <div>
              <div className="flex flex-col items-center justify-center text-center">
                <Image
                  className="relative"
                  src={selectedAlumni.gender == 'L' ? '/img/avatars/male_profile.png' : '/img/avatars/female_profile.png'}
                  alt={selectedAlumni.name}
                  width={100}
                  height={100}
                  priority
                />

                <h2 className="font-semibold text-2xl">{selectedAlumni.name}</h2>
              </div>
              <div className={`mt-2 mb-7 h-px bg-gray-300 dark:bg-white/30`} />

              <div>
                <p><strong>NIK:</strong> {selectedAlumni.nik}</p>
                <p><strong>Avatar:</strong> {selectedAlumni.avatar}</p>
                <p><strong>Gender:</strong> {selectedAlumni.gender}</p>
                <p><strong>Origin:</strong> {selectedAlumni.origin}</p>
                <p><strong>Year:</strong> {selectedAlumni.year}</p>
                <p><strong>NIS:</strong> {selectedAlumni.nis}</p>
                <p><strong>Study Program:</strong> {selectedAlumni.study_program}</p>
                <p><strong>Address:</strong> {selectedAlumni.address}</p>
                <p><strong>Village:</strong> {selectedAlumni.village}</p>
                <p><strong>District Name:</strong> {selectedAlumni.district_name}</p>
                <p><strong>City Name:</strong> {selectedAlumni.city_name}</p>
                <p><strong>Zipcode:</strong> {selectedAlumni.zipcode}</p>
                <p><strong>Email:</strong> {selectedAlumni.email}</p>
                <p><strong>Phone:</strong> {selectedAlumni.phone}</p>
                <p><strong>Certificate:</strong> {selectedAlumni.certificate}</p>
                <p><strong>Work Status:</strong> {selectedAlumni.work_status}</p>
                <p><strong>Occupation:</strong> {selectedAlumni.occupation}</p>
                <p><strong>Absorption:</strong> {selectedAlumni.absorption}</p>
                <p><strong>Job Field:</strong> {selectedAlumni.job_field}</p>
                <p><strong>Job Title:</strong> {selectedAlumni.job_title}</p>
                <p><strong>Company Name:</strong> {selectedAlumni.company_name}</p>
                <p><strong>Company Address:</strong> {selectedAlumni.company_address}</p>
                <p><strong>Company Phone:</strong> {selectedAlumni.company_phone}</p>
                <p><strong>Company Country:</strong> {selectedAlumni.company_country}</p>
                <p><strong>Company State:</strong> {selectedAlumni.company_state}</p>
                <p><strong>Company District:</strong> {selectedAlumni.company_district}</p>
                <p><strong>Income Range:</strong> {selectedAlumni.income_range}</p>
                <p><strong>Company Province:</strong> {selectedAlumni.company_province}</p>
                <p><strong>Company City:</strong> {selectedAlumni.company_city}</p>
                <p><strong>Pesdik Ref:</strong> {selectedAlumni.pesdik_ref}</p>
                <p><strong>Elatar Profil ID:</strong> {selectedAlumni.elatar_profil_id}</p>
              </div>

            </div>
          )}
        </SheetContent>
      </Sheet>



      <GoogleMap
        ref={(map) => (mapRefSatdik.current = map)}
        mapContainerStyle={defaultMapContainerStyle}
        center={
          selectedLocation == null
            ? defaultMapCenter
            : { lat: selectedLocation!.lat!, lng: selectedLocation!.lng! }
        }
        zoom={zoom}
        onLoad={handleMapLoadSatdik}
        onZoomChanged={handleZoomChanged}
        options={defaultMapOptions}
      />
    </div >
  );
};
