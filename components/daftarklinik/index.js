"use client";
import React, { useState, useEffect } from "react";
import { useGetAllFaskes } from "@/service/klinik.service";
import { useRouter } from "next/navigation";
import { useKlinikLogin } from "@/service/auth.service";
import { toast } from "sonner";

export default function DaftarKlinik() {
  const { data, isLoading, error } = useGetAllFaskes();
  const [clinics, setClinics] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [userAddress, setUserAddress] = useState("Mendapatkan lokasi...");
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const router = useRouter();

  const klinikLoginMutation = useKlinikLogin({
    onSuccess: (data) => {
      console.log("Login successful:", data);
      setIsLoggingIn(false);
      router.push("/home");
    },
    onError: (error) => {
      console.error("Login failed:", error);
      setIsLoggingIn(false);
      let errorMessage = "Terjadi kesalahan pada server";

      try {
        if (error.response) {
          const status = error.response.status;
          const responseData = error.response.data;

          if (status === 500) {
            errorMessage =
              responseData.message ||
              "Internal Server Error: Terjadi kesalahan pada server";
            if (responseData.error) {
              errorMessage = `${responseData.error}: ${responseData.message}`;
            }
          } else {
            errorMessage =
              responseData.message ||
              responseData.error ||
              `Error ${status}: ${error.response.statusText}`;
          }
        } else if (error.request) {
          errorMessage =
            "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
        } else {
          errorMessage =
            error.message || "Terjadi kesalahan yang tidak diketahui";
        }
      } catch (e) {
        errorMessage = "Terjadi kesalahan dalam memproses response error";
        console.error("Error while processing error response:", e);
      }

      toast.error("Login Gagal", {
        description: errorMessage,
        duration: 6000,
        position: "top-center",
      });
    },
  });

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=id`
      );
      const data = await response.json();

      if (data.display_name) {
        const addressParts = data.address;
        const relevantAddress = [
          addressParts.suburb,
          addressParts.city_district,
          addressParts.city,
        ]
          .filter(Boolean)
          .join(", ");

        setUserAddress(relevantAddress);
      }
    } catch (error) {
      console.error("Error getting address:", error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          getAddressFromCoordinates(latitude, longitude);
        },
        (error) => {
          console.error("Error getting user location:", error);
          setLocationError(
            "Failed to get your location. Distances won't be shown."
          );
          setUserLocation(null);
        }
      );
    } else {
      setLocationError(
        "Geolocation is not supported by your browser. Distances won't be shown."
      );
      setUserLocation(null);
    }
  }, []);

  useEffect(() => {
    if (data && Array.isArray(data.data)) {
      console.log("Raw data:", data.data); // Debugging line
      if (userLocation) {
        const clinicsWithDistance = data.data.map((clinic) => {
          if (clinic.latitude && clinic.longitude) {
            const distance = calculateDistance(userLocation, {
              latitude: parseFloat(clinic.latitude),
              longitude: parseFloat(clinic.longitude),
            });
            return { ...clinic, distance };
          }
          return { ...clinic, distance: null };
        });

        const sortedClinics = clinicsWithDistance.sort((a, b) => {
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

  const handleLogoClick = (clinicId) => {
    if (isLoggingIn) return;

    setIsLoggingIn(true);
    localStorage.setItem("selectedFaskesId", clinicId);

    try {
      klinikLoginMutation.mutate({ faskes_id: clinicId });
    } catch (error) {
      setIsLoggingIn(false);
      toast.error("Login Gagal", {
        description: "Terjadi kesalahan saat mencoba login",
        duration: 4000,
        position: "top-center",
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="px-4 sm:px-10">
      {locationError && (
        <div
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4"
          role="alert"
        >
          <p>{locationError}</p>
        </div>
      )}

      <div className="mt-15 px-4 max-w-lg mx-auto w-full">
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <div className="p-1">📍</div>
          <span>{userAddress}</span>
        </div>

        {/* Faskes List */}
        <div className="space-y-4">
          {clinics.map((clinic) => (
            <div
              key={clinic.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer"
              onClick={() => handleLogoClick(clinic.id)}
            >
              <div className="flex items-center p-3">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={clinic.logo}
                    alt={clinic.nama_faskes}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-medium text-gray-900">
                    {clinic.nama_faskes}
                  </h3>
                  <div className="flex items-center gap-1 mt-2 text-gray-500 text-sm">
                    <span>📍</span>
                    <span>
                      {clinic.distance
                        ? `${clinic.distance.toFixed(2)} km`
                        : " "}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
