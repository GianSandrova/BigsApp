"use client";
import React, { useState, useEffect } from "react";
import { useGetAllFaskes } from "@/service/klinik.service";
import { useRouter } from "next/navigation";
import { useKlinikLogin } from "@/service/auth.service";
import { toast } from "sonner";
import { MapPin } from "lucide-react";

export default function DaftarKlinik({ searchQuery = "" }) {
  const { data, isLoading, error } = useGetAllFaskes();
  const [clinics, setClinics] = useState([]);
  const [filteredClinics, setFilteredClinics] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  // const [userAddress, setUserAddress] = useState(" ");
  // const [isLoadingLocation, setIsLoadingLocation] = useState(true);
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

  // const getAddressFromCoordinates = async (latitude, longitude) => {
  //   try {
  //     const response = await fetch(
  //       `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=id`
  //     );
  //     const data = await response.json();

  //     if (data.display_name) {
  //       const addressParts = data.address;
  //       const relevantAddress = [
  //         addressParts.suburb,
  //         addressParts.city_district,
  //         addressParts.city,
  //       ]
  //         .filter(Boolean)
  //         .join(", ");

  //       setUserAddress(relevantAddress);
  //     }
  //   } catch (error) {
  //     console.error("Error getting address:", error);
  //   }
  // };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          // getAddressFromCoordinates(latitude, longitude);
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
      let processedClinics = data.data;

      if (userLocation) {
        processedClinics = processedClinics.map((clinic) => {
          if (clinic.latitude && clinic.longitude) {
            const distance = calculateDistance(userLocation, {
              latitude: parseFloat(clinic.latitude),
              longitude: parseFloat(clinic.longitude),
            });
            return { ...clinic, distance };
          }
          return { ...clinic, distance: null };
        });

        processedClinics = processedClinics.sort((a, b) => {
          if (a.distance === null) return 1;
          if (b.distance === null) return -1;
          return a.distance - b.distance;
        });
      }

      setClinics(processedClinics);
    }
  }, [data, userLocation]);

  useEffect(() => {
    if (clinics.length > 0) {
      const filtered = clinics.filter((clinic) =>
        clinic.nama_faskes.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredClinics(filtered);
    }
  }, [searchQuery, clinics]);

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

  const handleSelectClinic = (clinicId) => {
    if (isLoggingIn) return;

    setIsLoggingIn(true);
    localStorage.setItem("selectedFaskesId", clinicId);

    try {
      klinikLoginMutation.mutate({ faskes_id: clinicId });
    } catch (error) {
      setIsLoggingIn(false);
      toast.error("Login Gagal", {
        description: "Terjadi kesalahan saat mencoba login",
        duration: 2000,
        position: "top-center",
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="px-1 sm:px-1">
      <div className="mt-17 px-1 max-w-lg mx-auto w-full">
        {/* <div className="flex items-center gap-2 text-gray-600 mb-4">
          <div className="p-1">📍</div>
          <span>{userAddress}</span>
        </div> */}

        {/* Faskes List */}
        <div className="space-y-4">
          {filteredClinics.length > 0 ? (
            filteredClinics.map((clinic) => (
              <div
                key={clinic.id}
                className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="flex items-center p-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={clinic.logo}
                      alt={clinic.nama_faskes}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {clinic.nama_faskes}
                      </h3>
                      <div className="flex items-center gap-1 mt-2 text-gray-500 text-sm">
                        <MapPin size={16} />
                        <span>
                          {clinic.distance
                            ? `${clinic.distance.toFixed(2)} km`
                            : "Jarak tidak tersedia"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSelectClinic(clinic.id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                      disabled={isLoggingIn}
                    >
                      {isLoggingIn ? "Memilih..." : "Pilih"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              Tidak ada klinik yang sesuai dengan pencarian
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
