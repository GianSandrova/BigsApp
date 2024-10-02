'use client';
import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Link,
  Image,
} from "@nextui-org/react";
import { Button } from "@material-tailwind/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { useGetAllFaskes } from "@/service/klinik.service";
import { useRouter } from "next/navigation";
import { useKlinikLogin } from "@/service/auth.service";

export default function DaftarKlinik() {
  const [active, setActive] = useState(1);
  const { data, isLoading, error } = useGetAllFaskes();
  const [clinics, setClinics] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const router = useRouter();

  const klinikLoginMutation = useKlinikLogin({
    onSuccess: (data) => {
      console.log("Login successful:", data);
      router.push("/home");
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          console.log("User location:", latitude, longitude);
        },
        (error) => {
          console.error("Error getting user location:", error);
          setLocationError("Failed to get your location. Distances won't be shown.");
          setUserLocation(null);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser. Distances won't be shown.");
      setUserLocation(null);
    }
  }, []);

  useEffect(() => {
    if (data && Array.isArray(data.data)) {
      if (userLocation) {
        const clinicsWithDistance = data.data.map((clinic) => {
          // Pastikan latitude dan longitude ada dan valid
          if (clinic.latitude && clinic.longitude) {
            const distance = calculateDistance(userLocation, {
              latitude: parseFloat(clinic.latitude),
              longitude: parseFloat(clinic.longitude),
            });
            return { ...clinic, distance };
          }
          // Jika tidak ada koordinat, set distance ke null
          return { ...clinic, distance: null };
        });

        const sortedClinics = clinicsWithDistance.sort((a, b) => {
          // Handle kasus dimana distance bisa null
          if (a.distance === null) return 1;
          if (b.distance === null) return -1;
          return a.distance - b.distance;
        });
        setClinics(sortedClinics);
      } else {
        setClinics(data.data);
      }
    }
  }, [data, userLocation]);

  function calculateDistance(point1, point2) {
    if (!point1 || !point2) return null;
    const R = 6371;
    const dLat = deg2rad(point2.latitude - point1.latitude);
    const dLon = deg2rad(point2.longitude - point1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(point1.latitude)) *
        Math.cos(deg2rad(point2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  const totalPages = clinics.length;

  const next = () => {
    if (active === totalPages) return;
    setActive(active + 1);
  };

  const prev = () => {
    if (active === 1) return;
    setActive(active - 1);
  };

  const handleLogoClick = (clinicId) => {
    localStorage.setItem("selectedFaskesId", clinicId);
    const loginBody = {
      faskes_id: clinicId,
    };
    klinikLoginMutation.mutate(loginBody);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="px-4 sm:px-10">
      {locationError && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p>{locationError}</p>
        </div>
      )}
      {clinics.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          <Card className="py-4 mx-auto max-w-sm">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h4 className="font-bold text-large">
                {clinics[active - 1].nama_faskes}
              </h4>
              {userLocation && clinics[active - 1].distance !== null && (
                <p className="text-small text-default-500">
                  Jarak: {clinics[active - 1].distance?.toFixed(2)} km
                </p>
              )}
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <Image
                alt="Card background"
                className="object-cover rounded-xl w-full h-64 cursor-pointer"
                src={clinics[active - 1].logo}
                width={270}
                onClick={() => handleLogoClick(clinics[active - 1].id)}
              />
            </CardBody>
            <CardFooter>
              <Link
                isExternal
                showAnchorIcon
                href={`https://www.google.com/maps/search/?api=1&query=${
                  clinics[active - 1].latitude
                },${clinics[active - 1].longitude}`}
              >
                Lihat Lokasi
              </Link>
            </CardFooter>
          </Card>
        </div>
      )}

      <div className="flex items-center justify-center gap-4 mt-4">
        <Button
          variant="text"
          className="flex items-center gap-2"
          onClick={prev}
          disabled={active === 1}
        >
          <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>
        <div className="flex items-center">
          {clinics.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 mx-1 rounded-full ${
                active === index + 1 ? "bg-gray-900" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
        <Button
          variant="text"
          className="flex items-center gap-2"
          onClick={next}
          disabled={active === totalPages}
        >
          <span className="hidden sm:inline">Next</span>
          <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-center mt-2 text-sm text-gray-500">
        Page {active} of {totalPages}
      </p>
    </div>
  );
}