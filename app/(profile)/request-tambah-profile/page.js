"use client";
import { FormRow } from "@/components/FormRow";
import Offline from "@/components/offline";
import {
  checkUserAuthentication,
  useAuthenticatedRequest,
} from "@/service/auth.service";
import { CaretLeft } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useTambahPasienBaru } from "@/service/pasien.service";
import { toast } from "sonner";

function RequestTambahProfile() {
  const router = useRouter();
  const { isUser, isValid } = checkUserAuthentication();
  const [loadingToastId, setLoadingToastId] = useState(null);

  const [formData, setFormData] = useState({
    nik: "",
    nama_lengkap: "",
    jenis_kelamin: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    alamat: "",
    ktp: "",
  });
  useAuthenticatedRequest(isValid);

  const mutation = useTambahPasienBaru({
    onSuccess: (response) => {
      if (response.success && response.data.message) {
        console.log(
          "Profil pasien berhasil ditambahkan:",
          response.data.message
        );
        toast.dismiss(loadingToastId);
        toast.success("Berhasil mengajukan penambahan profil pasien");
        router.push("/profile");
      } else {
        toast.error("Gagal menambahkan profil pasien. Silakan coba lagi.");
        console.log("Profil Gagal di Tambahkan");
        router.push("/profile");
      }
    },
    onError: (error) => {
      toast.error("Terjadi kesalahan. Silakan coba lagi " + error);
      toast.dismiss(loadingToastId); // dismiss toast saat error
    },
  });

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setFormData((prev) => ({ ...prev, ktp: base64 }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "nik" && value.length > 16) {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.nik.length !== 16) {
      toast.error("NIK Tidak Valid");
      return;
    }
    setLoadingToastId(toast.loading("Menambahkan data..."));
    mutation.mutate(formData);
  };

  return (
    <>
      <Offline />
      <div>
        <div className="bg-primary1 w-full h-[200px] -z-10 absolute top-0 left-0 right-0"></div>
        <div className="px-2">
          <section className="mt-5">
            <Link
              href={"/profile"}
              className="flex items-center p-1 font-bold text-lg gap-1 text-white"
            >
              <CaretLeft size={18} weight="bold" />
              <div className="">Tambahkan Profil Pasien</div>
            </Link>
          </section>
          <section className="m-2 mt-4">
            <div className="w-full bg-white rounded-[5px] shadow-custom p-3 mt-5">
              <div className="flex flex-col gap-2">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-3">
                    <FormRow
                      type="file"
                      name="ktp"
                      labelText="Upload KTP"
                      style={"mb-2"}
                      onChange={handleFileChange}
                    />
                    <FormRow
                      type="number"
                      name="nik"
                      labelText="No.Identitas"
                      style={"mb-2"}
                      value={formData.nik}
                      onChange={handleInputChange}
                    />
                    <FormRow
                      type="text"
                      name="nama_lengkap"
                      labelText="Nama Lengkap"
                      style={"mb-2"}
                      value={formData.nama_lengkap}
                      onChange={handleInputChange}
                    />
                    <FormRow
                      type="text"
                      name="tempat_lahir"
                      labelText="Tempat Lahir"
                      style={"mb-2"}
                      value={formData.tempat_lahir}
                      onChange={handleInputChange}
                    />
                    <FormRow
                      type="date"
                      name="tanggal_lahir"
                      labelText="Tanggal Lahir"
                      style={"mb-2"}
                      value={formData.tanggal_lahir}
                      onChange={handleInputChange}
                    />
                    <FormRow
                      type="text"
                      name="alamat"
                      labelText="Alamat"
                      style={"mb-2"}
                      value={formData.alamat}
                      onChange={handleInputChange}
                    />
                    <FormRow
                      type="select"
                      name="jenis_kelamin"
                      labelText="Jenis Kelamin"
                      style={"mb-2"}
                      value={formData.jenis_kelamin}
                      onChange={handleInputChange}
                      options={[
                        { value: "", label: "Pilih Jenis Kelamin" }, 
                        { value: "Laki-laki", label: "Laki-laki" },
                        { value: "Perempuan", label: "Perempuan" },
                      ]}
                    />
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="bg-primary1 p-2 w-full transition text-center rounded-[5px] font-normal text-xs sm:text-sm text-white"
                        disabled={mutation.isLoading}
                      >
                        {mutation.isLoading ? "Mengirim..." : "Kirim"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default RequestTambahProfile;
