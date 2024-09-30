"use client";
import React, { useEffect, useState } from "react";
import { LoadingPerjanjian } from "@/components/loading";
import Offline from "@/components/offline";
import {
  checkUserAuthentication,
  useAuthenticatedRequest,
} from "@/service/auth.service";
import { UseGetProfileByFaskes } from "@/service/pasien.service";
import {
  useGetAppointmentStatus,
  useBatalPerjanjian,
} from "@/service/perjanjian.service";
import { Form, Field } from "react-final-form";
import { Modal } from "@/components/modal";
import { X, LockSimple } from "@phosphor-icons/react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function StatusLayanan() {
  const { isUser, isValid } = checkUserAuthentication();
  const [selectedNoRm, setSelectedNoRm] = useState(null);
  const [idPerjanjian, setIdPerjanjian] = useState("");
  const [loadingToastId, setLoadingToastId] = useState(null);
  const [show, setShow] = useState(false);
  const [showAuthMessage, setShowAuthMessage] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fullPath = `${pathname}${
    searchParams.toString() ? `?${searchParams.toString()}` : ""
  }`;

  const { data, isLoading, isError, isSuccess } = UseGetProfileByFaskes(isUser);
  const response = data?.data;
  const router = useRouter();

  useEffect(() => {
    if (!isValid) {
      setShowAuthMessage(true);
    }
  }, [isValid]);

  useEffect(() => {
    toast.dismiss();
  }, [isSuccess]);

  const {
    data: appointmentStatusData,
    isLoading: appointmentStatusLoading,
    isError: appointmentStatusError,
    refetch: refetchAppointmentStatus,
  } = useGetAppointmentStatus(selectedNoRm);

  const handleCloseJadwal = () => setShow(false);

  const onSubmit = (e) => {
    if (e.profil !== "--") {
      setSelectedNoRm(e.profil);
    } else {
      setSelectedNoRm(null);
    }
  };

  const { mutate: batalPerjanjian, isPending: pendingBatalPerjanjian } =
    useBatalPerjanjian({
      onSuccess: (data) => {
        toast.dismiss(loadingToastId);
        toast.success("Anda berhasil membuat perjanjian!");
      },
      onError: (error) => {
        toast.dismiss(loadingToastId);
        const errorMessage =
          error.response?.data?.message || "Terjadi Kesalahan!";
        toast.error(`Error: ${errorMessage}`);
      },
    });

  const onBatal = (e) => {
    e.preventDefault();
    const data_perjanjian = { id_perjanjian: e.target.id.value };
    setLoadingToastId(toast.loading("Melakukan Pembatalan..."));
    batalPerjanjian(data_perjanjian, {
      onSuccess: () => {
        toast.dismiss(loadingToastId);
        toast.success("Anda berhasil membatalkan perjanjian!");
        refetchAppointmentStatus();
        setTimeout(() => {
          setShow(false);
        }, 3000);
      },
      onError: (error) => {
        toast.dismiss(loadingToastId);
        let errorMessage;
        if (error.response?.data?.metadata) {
          errorMessage = error.response.data.metadata.message;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = error.message || "Terjadi Kesalahan!";
        }
        toast.error(`Error: ${errorMessage}`);
        return error;
      },
    });
  };

  useEffect(() => {
    if (selectedNoRm) {
      refetchAppointmentStatus();
    }
  }, [selectedNoRm, refetchAppointmentStatus]);

  const renderContent = () => {
    if (showAuthMessage) {
      return (
        <div className="flex flex-col items-center justify-center h-full mt-8">
          <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-4 rounded-md shadow-md max-w-md w-full">
            <div className="flex items-center mb-2">
              <LockSimple size={24} className="mr-2" />
              <p className="font-bold">
                Anda harus login untuk melihat status perjanjian.
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

    return (
      <>
        <section className="m-2 mt-4">
          <Form
            onSubmit={onSubmit}
            render={({ handleSubmit }) => (
              <div className="w-full">
                <div className="flex w-full h-[53px] bg-white rounded-[5px] items-center shadow-custom">
                  <form
                    onChange={handleSubmit}
                    className="w-full mx-2 text-abuabu font-normal text-sm"
                  >
                    <Field
                      name="profil"
                      component="select"
                      validate={""}
                      className="w-full border border-abuabu rounded-md p-2 focus:outline-none focus:border-primary1 bg-white"
                    >
                      <option value="--" defaultValue="true">
                        -- Pilih Profil --
                      </option>
                      {response?.map((item, i) => (
                        <option value={item.no_rm} key={i}>
                          {item.nama_lengkap}
                        </option>
                      ))}
                    </Field>
                  </form>
                </div>
              </div>
            )}
          />
        </section>
        <section className="px-2">
          <div
            className="grid grid-cols-1 gap-3 overflow-y-auto scrollbar-hide mt-5"
            style={{ maxHeight: "calc(100vh - 210px)" }}
          >
            {appointmentStatusError && (
              <div className="w-full h-full bg-white rounded-[5px] shadow-custom p-2">
                <div className="text-base font-medium text-center">
                  Terjadi Kesalahan saat Mengambil Data.
                </div>
              </div>
            )}
            {appointmentStatusLoading && (
              <LoadingPerjanjian button="Batalkan" />
            )}

            {appointmentStatusData?.data?.data?.length === 0 &&
              !appointmentStatusLoading &&
              !appointmentStatusError && (
                <div className="w-full h-full bg-white rounded-[5px] shadow-custom p-2">
                  <div className="text-base font-medium text-center">
                    Belum memiliki perjanjian.
                  </div>
                </div>
              )}

            {appointmentStatusData?.data?.data?.map((item, i) => (
              <div key={i}>
                <div className="w-full h-full bg-white rounded-[5px] shadow-custom p-2">
                  <div className="text-sm flex justify-between items-center">
                    <div className="font-medium">Nama: {item.nama_lengkap}</div>
                    <div
                      className={`p-1 text-end ${
                        item.status_perjanjian === "Belum"
                          ? "text-yellow-600"
                          : item.status_perjanjian === "Batal"
                          ? "text-red-600"
                          : ""
                      }  font-semibold grid justify-items-end`}
                    >
                      {item.status_perjanjian}
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    Poli: {item.poli_perjanjian}
                  </div>
                  <div className="text-sedang text-abuabu">
                    Tanggal: {item.tanggal_perjanjian}
                  </div>
                  <div className="text-sedang text-abuabu">
                    Dokter: {item.dokter}
                  </div>
                  <div className="flex items-center justify-between text-abuabu">
                    <div className="font-normal text-xs">
                      Jam: {item.jam_praktek}
                    </div>
                    {item.status_perjanjian === "Belum" && (
                      <div
                        onClick={() => {
                          setShow(true);
                          setIdPerjanjian(item.id_perjanjian);
                        }}
                        className="bg-primary1 p-1 text-center rounded-[5px] w-[5rem] font-normal text-[12px] text-white"
                      >
                        Batalkan
                      </div>
                    )}
                  </div>
                </div>
                <Modal open={show} onClose={() => setShow(false)}>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center pb-2 border-b-2">
                      <div className="text-base">Konfirmasi</div>
                      <X onClick={handleCloseJadwal} size={24} weight="bold" />
                    </div>
                    <form onSubmit={onBatal}>
                      <div className="grid grid-cols-1 gap-2 justify-between items-center">
                        <div className="grid grid-cols-1 gap-1 text-sm">
                          <input type="hidden" value={idPerjanjian} name="id" />
                          <p>Apakah anda yakin ingin membatalkan perjanjian?</p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 items-center pt-3">
                        <button
                          type="button"
                          disabled={pendingBatalPerjanjian}
                          onClick={handleCloseJadwal}
                          className="bg-primary1 p-1 w-[4rem] transition text-center rounded-[5px] font-normal text-[12px] text-white"
                        >
                          Tidak
                        </button>
                        <button
                          type="submit"
                          disabled={batalPerjanjian}
                          className="bg-primary1 p-1 w-[7rem] transition text-center rounded-[5px] font-normal text-[12px] text-white"
                        >
                          Ya, Batalkan!
                        </button>
                      </div>
                    </form>
                  </div>
                </Modal>
              </div>
            ))}
          </div>
        </section>
      </>
    );
  };

  return (
    <>
      <Offline />
      <div className="bg-primary1 w-full h-[200px] -z-10 absolute top-0 left-0 right-0"></div>
      <div className="px-2">
        <section className="mt-5">
          <div className="flex items-center p-1 font-bold text-lg gap-1 text-white">
            <div className="ml-1">Status Perjanjian</div>
          </div>
        </section>
        {renderContent()}
      </div>
    </>
  );
}
