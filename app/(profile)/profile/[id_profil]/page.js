'use client';
import { LoadingPage } from '@/components/loading';
import Offline from '@/components/offline';
import { UseGetIsUser, checkUserAuthentication, useAuthenticatedRequest } from '@/service/auth.service';
import { UseDeleteProfile, UseDetailProfile } from '@/service/pasien.service';
import { CaretLeft } from '@phosphor-icons/react';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'sonner';

const ProfilById = ({ params }) => {
    const router = useRouter();

    const [loadingToastId, setLoadingToastId] = useState(null);

    const { isUser, isValid } = checkUserAuthentication();
    useAuthenticatedRequest(isValid);


    const { data: profile, isLoading, isError, error } = UseDetailProfile(params.id_profil);
    console.log("response: profile "+profile);

    const { mutate: deleteProfile, isPending: isPendingDeleteProfile } = UseDeleteProfile({
        onSuccess: (data) => {
          console.log("Delete success in component:", data);
          toast.dismiss(loadingToastId);
          toast.success('Anda berhasil menghapus profile!');
          router.push('/profile');
        },
        onError: (error) => {
          console.error("Delete error in component:", error);
          toast.dismiss(loadingToastId);
          toast.error(error.message || "Gagal menghapus profil");
        }
      });
      
      const onDelete = (e) => {
        console.log("Deleting profile with id:", e);
        const data = { id: e };
        setLoadingToastId(toast.loading('Menghapus Profil...'));
        deleteProfile(data);
      };

    if (isLoading) {
        return <LoadingPage />
    }
    return (
        <>
            <Offline />
            <div className='bg-primary1 w-full h-[200px] -z-10 absolute top-0 left-0 right-0'></div>
            <div className='px-2'>
                <section className='mt-5'>
                    <Link href={'/profile'} className='flex items-center p-1 font-bold text-lg gap-1 text-white'>
                        <CaretLeft size={18} weight='bold' />
                        <div className=''>
                            Detail Pasien
                        </div>
                    </Link>
                </section>
                <section className='m-2 mt-4'>
                    <div className="flex flex-col gap-2">
                        <div className="grid grid-cols-1 gap-1 text-sm">
                            <div className="border p-2 grid gap-2 bg-white rounded">
                                <div className="border-b font-medium">
                                    Nama Pasien :
                                </div>
                                <div className='text-kecil'>
                                    {profile.nama_lengkap}
                                </div>
                            </div>
                            <div className="border p-2 grid gap-2 bg-white rounded">
                                <div className="border-b font-medium">
                                    Identitas Personal :
                                </div>
                                <div className="grid grid-cols-1 gap-1 text-kecil">
                                    <div className="pb-1">No Identitas :
                                        <div>
                                            {profile.nik}
                                        </div>
                                    </div>
                                    <div className="pb-1">
                                        Jenis Kelamin
                                        <div>
                                            {profile.jenis_kelamin}
                                        </div>
                                    </div>
                                    <div className="pb-1">
                                        Tempat dan Tanggal Lahir
                                        <div>
                                            {profile.tempat_lahir} , {profile.tanggal_lahir}
                                        </div>
                                    </div>
                                    <div className="pb-1">
                                        No. HP
                                        <div>
                                            {profile.no_hp}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className='m-2 mt-4'>
                    <div className='w-full h-full bg-white rounded-[5px] items-center shadow-custom'>
                        <div className="w-full p-2">
                            <div onClick={() => onDelete(params.id_profil)} className="p-1 text-sm text-center bg-primary1 w-full rounded-lg text-white">
                                Hapus Profile
                            </div>
                        </div>
                    </div>
                </section>
            </div >
        </>
    )
}

export default ProfilById
