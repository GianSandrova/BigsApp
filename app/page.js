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
  const [isClient, setIsClient] = useState(false);

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
    <Listbox value={selectedFaskes} onChange={handleFaskesChange}>
      {({ open }) => (
        <>
          <div className="bg-primary1 w-full h-[200px] -z-10 absolute top-0 left-0 right-0"></div>
          <div className="px-2">
            <section className="mt-5">
              <div className="flex flex-row items-center justify-between px-4">
                <div className="w-1/4">
                  <Logo />
                </div>
                <div className="w-1/2 text-center mt-10">
                  <p className="text-md font-bold text-white">Pilih Faskes</p>
                </div>
                <div className="w-1/4"></div>
              </div>
            </section>

            <section className="m-2 mt-4">
              <div className="relative mt-2 flex justify-center">
                <div className="w-1/2 relative">
                  <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                    <span className="flex items-center">
                      <span className="ml-3 block truncate">
                        {selectedFaskes?.nama_faskes || "Pilih Faskes"}
                      </span>
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </ListboxButton>

                  <ListboxOptions className="absolute z-50 mt-1 w-full max-h-56 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {faskesOptions.map((faskes) => (
                      <ListboxOption
                        key={faskes.id}
                        className={({ active }) =>
                          classNames(
                            active
                              ? "bg-indigo-600 text-white"
                              : "text-gray-900",
                            "relative cursor-default select-none py-2 pl-3 pr-9"
                          )
                        }
                        value={faskes}
                      >
                        {({ selected, active }) => (
                          <>
                            <div className="flex items-center">
                              <span
                                className={classNames(
                                  selected ? "font-semibold" : "font-normal",
                                  "ml-3 block truncate"
                                )}
                              >
                                {faskes.nama_faskes}
                              </span>
                            </div>

                            {selected ? (
                              <span
                                className={classNames(
                                  active ? "text-white" : "text-indigo-600",
                                  "absolute inset-y-0 right-0 flex items-center pr-4"
                                )}
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </div>
              </div>
            </section>
            <section>
              <div className="flex justify-center pt-2 w-full">
                <button
                  type="submit"
                  onClick={handleClick}
                  className="bg-green-800 p-1 w-1/2 transition text-center rounded-[5px] font-normal text-[12px] text-white"
                >
                  Next
                </button>
              </div>
            </section>
            {/* <section className="flex justify-center">
            <div className="p-1 font-bold text-lg text-center text-black">
              Pilih Klinik
            </div>
            </section> */}

            <section className="px-2">
              <div className="mt-5 flex justify-center text-center">
                Daftar Klinik Yang Tersedia
              </div>
              <DaftarKlinik />
            </section>
          </div>
        </>
      )}
    </Listbox>
  );
}
