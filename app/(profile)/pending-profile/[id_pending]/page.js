"use client";
import { LoadingPage } from "@/components/loading";
import Offline from "@/components/offline";
import {
  checkUserAuthentication,
  useAuthenticatedRequest,
} from "@/service/auth.service";
import {
  useCheckStatusPasien,
  useUpdateStatusPasien,
} from "@/service/pasien.service";
import { CaretLeft } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const PendingProfileDetail = ({ params }) => {
  const router = useRouter();
  const { isValid } = checkUserAuthentication();
  useAuthenticatedRequest(isValid);

  const { data, isLoading, isError, error } = useCheckStatusPasien(
    params?.id_pending
  );

  const updateStatusMutation = useUpdateStatusPasien({
    onSuccess: () => {
      toast.success("Status berhasil diperbarui!");
      router.push("/profile");
    },
    onError: (error) => {
      // Tampilkan pesan error
      console.error("Failed to update status:", error);
      toast.error(
        "Gagal Menautkan profile: " + error ||
          "Gagal mengupdate status. Silakan coba lagi."
      );
    },
  });

  const handleTautkanProfile = () => {
    updateStatusMutation.mutate(params?.id_pending);
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const profileData = data?.data;
  return (
    <>
      <Offline />
      <div className="bg-primary1 w-full h-[200px] -z-10 absolute top-0 left-0 right-0"></div>
      <div className="px-2">
        <section className="mt-5">
          <Link
            href={"/profile"}
            className="flex items-center p-1 font-bold text-lg gap-1 text-white"
          >
            <CaretLeft size={18} weight="bold" />
            <div className="">Detail Pasien Pending</div>
          </Link>
        </section>
        <section className="m-2 mt-4">
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 gap-1 text-sm">
              <div className="border p-2 grid gap-2 bg-white rounded">
                <div className="border-b font-medium">Nama Pasien :</div>
                <div className="text-kecil">{profileData?.nama_lengkap}</div>
              </div>
              <div className="border p-2 grid gap-2 bg-white rounded">
                <div className="border-b font-medium">Identitas Personal :</div>
                <div className="grid grid-cols-1 gap-1 text-kecil">
                  <div className="pb-1">
                    No Identitas :<div>{profileData?.nik}</div>
                  </div>
                  <div className="pb-1">
                    Jenis Kelamin
                    <div>{profileData?.jenis_kelamin}</div>
                  </div>
                  <div className="pb-1">
                    Tempat dan Tanggal Lahir
                    <div>
                      {profileData?.tempat_lahir} , {profileData?.tanggal_lahir}
                    </div>
                  </div>
                  <div className="pb-1">
                    Alamat
                    <div>{profileData?.alamat}</div>
                  </div>
                  <div className="pb-1">
                    Nomor Rekam Medis
                    <div>{profileData?.no_rm}</div>
                  </div>
                  <div className="pb-1">
                    Status
                    <div>{profileData?.status}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="m-2 mt-4">
          <div className="w-full h-full bg-white rounded-[5px] items-center shadow-custom">
            <div className="w-full p-2">
              <button
                onClick={handleTautkanProfile}
                className="p-1 text-sm text-center bg-primary1 w-full rounded-lg text-white"
                disabled={updateStatusMutation.isLoading}
              >
                {updateStatusMutation.isLoading
                  ? "Memproses..."
                  : "Tautkan Profile"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PendingProfileDetail;
