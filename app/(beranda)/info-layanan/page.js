'use client';
import { LoadingPage } from '@/components/loading';
import { GetLayanan } from '@/service/pendukung.service';
import { CaretLeft } from '@phosphor-icons/react'
import Image from 'next/image';
import Link from 'next/link'
import React from 'react'

const InfoLayanan = () => {
  const { data, isLoading } = GetLayanan();

  const response = data?.data;
  // console.log(response);

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <>
      <div className='bg-primary1 w-full h-[200px] -z-10 absolute top-0 left-0 right-0'></div>
      <div className='px-2'>
        <section className='mt-5'>
          <Link href={'/home'} className='flex items-center p-1 font-bold text-lg gap-1 text-white'>
            <CaretLeft size={18} weight='bold' />
            <div className=''>
              Info Layanan Klinik
            </div>
          </Link>
        </section>
        <section className=''>
          <div className='w-full h-full bg-white rounded-[5px] shadow-custom mt-5'>
            <div className="flex flex-col gap-2">
              <div className="relative h-[300px] w-full m-auto rounded-t-[5px] overflow-hidden">
                <Image
                  src={"https://nusalimamedika.com/img/departments/ku.jpeg"}
                  layout='fill'
                  alt='gambar'
                  loading='lazy'
                  className='object-cover'
                />
              </div>
              <div className="grid grid-cols-1 gap-2 justify-between items-center p-3">
                <div className="font-semibold">
                  KLINIK UTAMA NUSALIMA
                </div>
                <div className='text-abutext text-justify mb-2 font-bold"'>
                  VISI : Menjadi penyelenggara jasa pelayanan kesehatan yang mandiri, professional dan mampu memberikan pelayanan kesehatan yang terbaik.
                </div>
                <div className='text-abutext text-justify text-sm'>
                  <ol type='A'>
                    <li>1. Menyediakan fasilitas kesehatan yang ikut berperan dalam penyelenggara sistem jaminan kesehatan nasional.</li>
                    <li>2. Mengembangkan fasilitas kesehatan yang pertama untuk mendukung layanan kesehatan rumah sakit lanjutan khususnya Rumah Sakit Tandun.</li>
                    <li>3. Memberikan kontribusi kepada PT. Perkebunan Nusantara V untuk menghasilkan produk secara berkelanjutan.</li>
                    <li>4. Mengembangkan Sumber Daya Manusia yang loyal dan profesional.</li>
                    <li>5. Mengembangkan sistem tata kelola unit pelayanan kesehatan yang baik.</li>
                    <li>6. Menjalin kerjasama dengan para pihak untuk meningkatkan kinerja dan pengelolaan unit-unit fasilitas kesehatan perusahaan.</li>
                  </ol>
                </div>

                <div className='my-2'>
                  <ol className="space-y-2 text-abutext">
                    {
                      response?.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 bg-abuabu/20 text-neutral-800 rounded-full">{i + 1}</span>
                          <span>{item.nama_departemen}</span>
                        </li>
                      ))
                    }
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default InfoLayanan
