'use client';
import { Search } from '@/components/search';
import { CaretLeft } from '@phosphor-icons/react';
import Link from 'next/link';
import React from 'react'

const DokterById = ({ params }) => {


    return (
        <>
            <div className='bg-primary w-full h-[200px] -z-10 absolute top-0 left-0 right-0'></div>
            <div className='px-2'>
                <section className='mt-5'>
                    <Link href={'/beranda/poliklinik'} className='flex items-center p-1 font-medium text-lg gap-1 text-white'>
                        <CaretLeft size={18} weight='bold' />
                        <div className=''>
                            Dokter
                        </div>
                    </Link>
                </section>
                <section className='m-2 mt-4'>
                    <Search>
                        <input
                            type="text"
                            className="w-full border border-abuabu rounded-md p-1 focus:outline-none focus:border-primary1"
                            placeholder="Cari Dokter"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </Search>
                </section>
                <section className='px-2'>
                    <div className='grid grid-cols-1 gap-3 overflow-y-auto scrollbar-hide mt-5 h-full' style={{ maxHeight: 'calc(100vh - 24vh)' }} >
                    </div>
                </section>
            </div>
        </>
    )
}

export default DokterById
