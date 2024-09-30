"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import Logo from "@/components/logo";
import DaftarKlinik from "@/components/daftarklinik";
import { useGetAllFaskes } from "@/service/klinik.service";
import { useAuthToken } from "@/hooks/useAuthToken";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const token = useAuthToken();
  const { data, isLoading, error } = useGetAllFaskes();
  const [selectedFaskes, setSelectedFaskes] = useState(null);
  const router = useRouter();

  const saveFaskesId = (faskes) => {
    if (faskes && faskes.id) {
      localStorage.setItem("selectedFaskesId", faskes.id);
    }
  };

  useEffect(() => {
    if (data && Array.isArray(data.data) && data.data.length > 0) {
      setSelectedFaskes(data.data[0]);
      saveFaskesId(data.data[0]);
    }
  }, [data]);

  const handleFaskesChange = (faskes) => {
    setSelectedFaskes(faskes);
    saveFaskesId(faskes);
  };

  function handleClick() {
    if (selectedFaskes) {
      saveFaskesId(selectedFaskes);
      router.push("/");
    } else {
      alert("Silakan pilih klinik terlebih dahulu");
    }
  }

  const faskesOptions = useMemo(() => {
    return data?.data || [];
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Listbox value={selectedFaskes} onChange={handleFaskesChange}>
      {({ open }) => (
        <>
          <section className="pt-5">
            <div className="flex flex-row items-center justify-between px-4">
              <div className="w-1/4">
                <Logo />
              </div>
              <div className="w-1/2 text-center">
                <h2 className="text-xl font-bold">Nusalima Medika</h2>
              </div>
              <div className="w-1/4"></div>
            </div>
          </section>
          <section className="">
            <div className="grid grid-cols-1 gap-2 justify-between items-center p-3 text-center mt-5">
              <h2>Selamat datang di Nusalima Medika</h2>
              <p>
                Sebelum melanjutkan harap pilih dulu klinik yang ingin dituju
              </p>
            </div>
          </section>
          <section className="flex justify-center">
            <div className="p-1 font-bold text-lg text-center text-black">
              Pilih Klinik
            </div>
          </section>

          <section>
            <div className="mt-5 flex justify-center text-center">
              Daftar Klinik Yang Tersedia
            </div>
            <DaftarKlinik />
          </section>
        </>
      )}
    </Listbox>
  );
}
