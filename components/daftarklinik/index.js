'use client';
import React, { useState, useEffect, useRef } from "react";
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
import { Toaster, toast } from 'sonner';

export default function DaftarKlinik() {
  const [active, setActive] = useState(1);
  const { data, isLoading, error } = useGetAllFaskes();
  const [clinics, setClinics] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  // Minimum swipe distance for detection (in pixels)
  const minSwipeDistance = 50;

  const klinikLoginMutation = useKlinikLogin({
    onSuccess: (data) => {
      console.log("Login successful:", data);
      setIsLoggingIn(false);
      toast.success('Login berhasil');
      router.push("/home");
    },
    onError: (error) => {
      console.error("Login failed:", error);
      setIsLoggingIn(false);
      
      // Extract error message from response
      let errorMessage = 'Gagal login ke klinik';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      // Show error toast
      toast.error('Login Gagal', {
        description: errorMessage,
        duration: 3000, // Toast will show for 3 seconds
        position: 'top-center',
      });
    },
  });

  const handleLogoClick = (clinicId) => {
    setIsLoggingIn(true); // Set loading state
    localStorage.setItem("selectedFaskesId", clinicId);
    const loginBody = {
      faskes_id: clinicId,
    };
    klinikLoginMutation.mutate(loginBody);
  };

  return (
    <div className="px-4 sm:px-10">
      <Toaster richColors position="top-center" expand={true} />
      {locationError && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p>{locationError}</p>
        </div>
      )}
      
      {clinics.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          <div
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className="w-full"
          >
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
              <CardBody className="overflow-visible py-2 relative">
                <Image
                  alt="Card background"
                  className={`object-cover rounded-xl w-full h-64 ${
                    isLoggingIn ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
                  }`}
                  src={clinics[active - 1].logo}
                  width={270}
                  onClick={() => handleLogoClick(clinics[active - 1].id)}
                />
                {isLoggingIn && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                )}
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