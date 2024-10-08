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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-teal-600 pb-6">
        <div className="container mx-auto px-4 pt-6">
          <div className="flex items-center justify-between">
            <Logo className="w-24" />
            <h1 className="text-xl font-semibold text-white">
              Pilihan Faskes Kami
            </h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>
      
      <div className="sticky top-0 bg-white shadow-md z-10">
        <div className="container mx-auto px-4 py-4">
          <Search
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder="Cari Faskes"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <DaftarKlinik searchQuery={search} />
      </div>
    </div>
  );
}
