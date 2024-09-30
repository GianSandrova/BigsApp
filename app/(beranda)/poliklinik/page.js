"use client";
import { LoadingPage } from "@/components/loading";
import { Search } from "@/components/search";
import { CaretLeft } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
// import data from '@/service/data.json'
import Avatar from "@/public/assets/images/information.png";
import { UseGetPoly } from "@/service/pendukung.service";
import Offline from "@/components/offline";

const Poliklinik = () => {
  const [search, setSearch] = useState("");
  const { data, isLoading } = UseGetPoly();

  const filterData = () => {
    return data?.data.filter((item) => {
      return item.nama_departemen.toLowerCase().includes(search.toLowerCase());
    });
  };
  console.log(data?.data);

  const saveDepartmentToLocalStorage = (id, name) => {
    localStorage.setItem("selectedDepartmentId", id);
    localStorage.setItem("selectedDepartmentName", name);
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <>
      <Offline />
      <div className="bg-primary1 w-full h-[200px] -z-10 absolute top-0 left-0 right-0"></div>
      <div className="px-2">
        <section className="mt-5">
          <Link
            href={"/home"}
            className="flex items-center p-1 font-medium text-lg gap-1 text-white"
          >
            <CaretLeft size={18} weight="bold" />
            <div className="">Poliklinik</div>
          </Link>
        </section>
        <section className="m-2 mt-4">
          <Search
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder="Cari Poliklinik"
          />
        </section>

        <section className="px-2">
          <div className="w-full h-full bg-white rounded-[5px] shadow-custom p-2 mt-5">
            <div
              className="grid grid-cols-2 gap-3 place-items-center justify-center overflow-y-auto scrollbar-hide"
              style={{ maxHeight: "calc(100vh - 25.5vh)" }}
            >
              {filterData()?.map((item, index) => (
                <div
                  onClick={() => {
                    saveDepartmentToLocalStorage(
                      item.id_departemen,
                      item.nama_departemen
                    );
                    window.location.href = `/poliklinik/dokter/${item.id_departemen}`;
                  }}
                  className="w-full cursor-pointer"
                  key={index}
                >
                  <div className="flex w-full h-[156px] p-2 bg-white/20 rounded-[5px] items-center justify-center border-[2px]">
                    <div className="flex flex-col items-center">
                      <Image
                        src={item.gambar ? `${item.gambar}` : Avatar}
                        alt="Logo Poliklinik"
                        loading="eager"
                        height={80}
                        width={80}
                        className=""
                      />
                      <div className="mt-2 text-center text-sm font-medium text-zinc-900">
                        <span className="capitalize">
                          {(item?.nama_departemen).toLowerCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Poliklinik;
