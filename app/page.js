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
import { Search } from "@/components/search";
import { LoadingPage } from "@/components/loading";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const token = useAuthToken();
  const { data, isLoading, error } = useGetAllFaskes();
  const [selectedFaskes, setSelectedFaskes] = useState(null);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (data && Array.isArray(data.data) && data.data.length > 0) {
      setSelectedFaskes(data.data[0]);
      if (isClient) {
        localStorage.setItem("selectedFaskesId", data.data[0].id);
      }
    }
  }, [data, isClient]);

  const handleFaskesChange = (faskes) => {
    setSelectedFaskes(faskes);
    if (isClient && faskes && faskes.id) {
      localStorage.setItem("selectedFaskesId", faskes.id);
    }
  };

  const faskesOptions = useMemo(() => {
    return data?.data || [];
  }, [data]);

  function handleClick() {
    if (selectedFaskes) {
      if (isClient) {
        localStorage.setItem("selectedFaskesId", selectedFaskes.id);
      }
      router.push("/home");
    } else {
      alert("Silakan pilih klinik terlebih dahulu");
    }
  }

  if (isLoading) return <LoadingPage />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Listbox value={selectedFaskes} onChange={handleFaskesChange}>
      {({ open }) => (
        <>
          <div className="bg-primary1 w-full h-[185px] -z-10 absolute top-0 left-0 right-0"></div>
          <div className="px-2 h-screen flex flex-col">
            <section className="mt-5 mb-10">
              <div className="flex flex-row items-center justify-between px-4">
                <div className="w-1/4">
                  <Logo />
                </div>
                <div className="w-1/2 text-center">
                  <p className="text-md font-semibold text-white">
                    Pilihan Faskes Kami
                  </p>
                </div>
                <div className="w-1/4"></div>
              </div>
            </section>
            <section className="mb-6">
              <Search
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                placeholder="Cari Faskes"
              />
            </section>

            <section className="px-2 mt-15 flex-1 overflow-y-auto">
              <DaftarKlinik searchQuery={search} />
            </section>
          </div>
        </>
      )}
    </Listbox>
  );
}
