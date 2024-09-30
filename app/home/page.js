'use client';
import { useEffect, useState } from "react";
import Logo from '@/components/logo';
import Image from "next/image";
import Menu from '@/components/menu';
import Slider from '@/components/slider';
import { UseGetAllDoctor } from "@/service/pendukung.service";
import Avatar from '@/public/assets/images/5s.png';
import { CaretRight } from "@phosphor-icons/react";
import LoadingDokter from "@/components/loading/loading_dokter";
import { UseGetIsUser } from "@/service/auth.service";
import { RegisterSW, RequestNotification } from "@/lib";
import Offline from "@/components/offline";

export default function Home() {
  const { data, isLoading, isError } = UseGetAllDoctor();
  const response = data?.data; 
  const idUser = UseGetIsUser();

  useEffect(() => {
    const requestNotificationPermission = RequestNotification()
    const registerServiceWorker = RegisterSW(idUser);

    requestNotificationPermission();
    registerServiceWorker();
  }, [idUser]);

  // const [time, setTime] = useState(new Date());

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTime(new Date());
  //   }, 1000);

  //   return () => clearInterval(interval); // Bersihkan interval saat komponen dibongkar
  // }, []);

  // if (!time) {
  //   return null; // Tidak merender apa pun hingga waktu diperbarui di klien
  // }

  // const formatTime = (date) => {
  //   const hours = date.getHours().toString().padStart(2, '0');
  //   const minutes = date.getMinutes().toString().padStart(2, '0');
  //   const seconds = date.getSeconds().toString().padStart(2, '0');
  //   return `${hours}:${minutes}:${seconds}`;
  // };



  return (
    <>
      <Offline />
      <div className='px-4'>
        <section className='pt-10'>
          <Logo />
         
          <Slider />
        </section>
        <section>
          <div className='py-2'>
            <div className='text-lg font-medium pb-1'>Menu</div>
            <div className='grid grid-cols-2 gap-3 place-items-center justify-center py-[9px] px-2 sm:px-2 bg-white h-[213px] w-full shadow-custom rounded-[5px]'>
              <Menu style={'bg-pink1 h-full w-full'} link={"/poliklinik"}>Poliklinik</Menu>
              <Menu style={'bg-pink2 h-full w-full'} link={"/info-layanan"}>Info Layanan</Menu>
              <Menu style={'bg-primary h-full w-full'} link={"/bmi"}>BMI</Menu>
              <Menu style={'bg-ungu1 h-full w-full'} link={"/kritik-saran"}>Kritik & Saran</Menu>
            </div>
          </div>
        </section>
        <section className='mb-14'>
          <div className='py-2'>
            <div className='text-lg font-medium pb-1'>Dokter Tersedia</div>
            <div className='grid grid-cols-1 gap-3 overflow-y-auto scrollbar-hide h-full' style={{ maxHeight: 'calc(100vh)' }} >
              {isLoading && <LoadingDokter />}
              {!isLoading && !isError && response && response.length > 0 ? (
                response.map((item, index) => (
                  <div key={index} className={`bg-white h-full w-full items-center p-2 transition-all shadow-custom rounded-[5px]`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="rounded-full overflow-hidden h-10 w-10 bg-center bg-cover flex justify-center">
                          {/* Image component here if needed */}
                        </div>
                        <div className='items-center ml-2'>
                          <div className='font-medium text-sm capitalize'>{item.nama_lengkap}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                !isLoading && !isError && (
                  <div className='w-full h-full bg-white rounded-[5px] shadow-custom p-4'>
                    <div className='text-base font-medium text-center'>
                      Tidak ada dokter yang tersedia hari ini.
                    </div>
                  </div>
                )
              )}
              {isError && (
                <div className='w-full h-full bg-white rounded-[5px] shadow-custom p-2'>
                  <div className='text-sm font-medium text-center'>
                    Terjadi Kesalahan dalam mengambil data!
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
