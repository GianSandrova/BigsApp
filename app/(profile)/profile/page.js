'use client';
import { LoadingProfile } from "@/components/loading";
import Offline from "@/components/offline";
import {
  checkUserAuthentication,
  useAuthenticatedRequest,
} from "@/service/auth.service";
import {
  UseAllProfile,
  UseGetProfileByFaskes,
  usePendingApproval,
} from "@/service/pasien.service";
import { CaretRight, LockSimple } from "@phosphor-icons/react";
import IconTabs from "@/components/navtabs";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function Profile() {
  const [tabValue, setTabValue] = useState(0);
  const { isUser, isValid } = checkUserAuthentication();
  const [showAuthMessage, setShowAuthMessage] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fullPath = `${pathname}${
    searchParams.toString() ? `?${searchParams.toString()}` : ""
  }`;

  useEffect(() => {
    if (!isValid) {
      setShowAuthMessage(true);
    }
  }, [isValid]);

  const { 
    data: profileData, 
    isLoading: profileLoading, 
    refetch: refetchProfile 
  } = UseGetProfileByFaskes();
  
  const { 
    data: pendingData, 
    isLoading: pendingLoading,
    refetch: refetchPending
  } = usePendingApproval();
  
  

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (isValid) {
      refetchProfile();
    }
  }, [isValid, refetchProfile]);

  useEffect(() => {
    if (tabValue === 1) {
      refetchPending();
    }
  }, [tabValue, refetchPending]);

  const renderContent = () => {
    if (showAuthMessage) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-4 rounded-md shadow-md max-w-md w-full">
            <div className="flex items-center mb-2">
              <LockSimple size={24} className="mr-2" />
              <p className="font-bold">
                Anda harus login untuk mengakses data pasien.
              </p>
            </div>
            <p>Silakan login untuk melanjutkan.</p>
          </div>
          <Link href={`/login?redirect=${encodeURIComponent(fullPath)}`}>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Login Sekarang
            </button>
          </Link>
        </div>
      );
    }

    if (tabValue === 0) {
      if (profileLoading) {
        return <div>Loading profiles...</div>;
      }
      if (!profileData || !profileData.data || profileData.data.length === 0) {
        return <div>No profile data available</div>;
      }
      return profileData.data.map((item, i) => (
        <Link href={`/profile/${item.id}`} key={i}>
          <div className="w-full h-full bg-white rounded-[5px] shadow-custom p-2">
            <div className="text-sm flex justify-between items-center">
              <div className="">
                <div className="font-medium">{item.nama_lengkap}</div>
                <div className="text-kecil font-normal">{item.nik}</div>
              </div>
              <div className="p-1">
                <div className="rounded-full p-1 bg-abuabu/20 cursor-pointer">
                  <CaretRight size={16} />
                </div>
              </div>
            </div>
          </div>
        </Link>
      ));
    } else {
      if (pendingLoading) {
        return <div>Loading pending approvals...</div>;
      }
      if (!pendingData || !pendingData.data || pendingData.data.length === 0) {
        return <div>No pending approvals available</div>;
      }
      return pendingData?.data?.map((item, i) => (
        <Link href={`/pending-profile/${item.nik}`} key={i}>
          <div className="w-full h-full bg-white rounded-[5px] shadow-custom p-2">
            <div className="text-sm flex justify-between items-center">
              <div className="">
                <div className="font-medium">{item.nama_lengkap}</div>
                <div className="text-kecil font-normal">{item.status}</div>
              </div>
              <div className="p-1">
                <div className="rounded-full p-1 bg-abuabu/20 cursor-pointer">
                  <CaretRight size={16} />
                </div>
              </div>
            </div>
          </div>
        </Link>
      ));
    }
  };

  return (
    <>
      <Offline />
      <div className="bg-primary1 w-full h-[200px] -z-10 absolute top-0 left-0 right-0"></div>
      <div className="px-2">
        <section className="mt-5">
          <Link
            href={"/beranda"}
            className="flex items-center p-1 font-bold text-lg gap-1 text-white"
          >
            <div className="ml-1">Profile Pasien</div>
          </Link>
        </section>
        {!showAuthMessage && (
          <>
            <section className="m-2 mt-4">
              <div className="w-full h-full bg-white rounded-[5px] items-center shadow-custom">
                <div className="w-full p-2">
                  <div className="">
                    <p className="text-kecil text-abuabu mb-2">
                      Tekan tombol berikut untuk menambahkan atau menautkan
                      profil :{" "}
                    </p>
                    <div className="flex space-x-2">
                      <Link href={"/tambah-profil"} className="w-1/2">
                        <div className="p-2 text-sm text-center bg-primary1 rounded-lg text-white">
                          Tautkan Profil
                        </div>
                      </Link>
                      <Link href={"/request-tambah-profile"} className="w-1/2">
                        <div className="p-2 text-sm text-center bg-primary1 rounded-lg text-white">
                          Tambah Profil
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="px-2">
              <div
                className="grid grid-cols-1 gap-2 overflow-y-auto scrollbar-hide mt-5 bg-white p-2"
                style={{ maxHeight: "calc(100vh - 210px)" }}
              >
                <IconTabs value={tabValue} handleChange={handleTabChange} />
              </div>
            </section>
          </>
        )}
        <section className="px-2">
          <div
            className="grid grid-cols-1 gap-2 overflow-y-auto scrollbar-hide mt-5 bg-white p-2"
            style={{ maxHeight: "calc(100vh - 210px)" }}
          >
            {(tabValue === 0 && profileLoading) ||
            (tabValue === 1 && pendingLoading) ? (
              <LoadingProfile />
            ) : (
              renderContent()
            )}
          </div>
        </section>
      </div>
      {!showAuthMessage && (
        <div className="fixed bottom-16 inset-x-0 flex justify-center m-2 bg-white rounded-[5px] items-center shadow-custom p-2">
          <Link
            href="/log-out"
            className="bg-primary1 w-full text-white p-1 rounded-lg text-center"
          >
            Log Out
          </Link>
        </div>
      )}
    </>
  );
}