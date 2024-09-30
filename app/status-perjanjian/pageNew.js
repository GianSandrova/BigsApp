'use client';
import { LoadingPerjanjian } from '@/components/loading';
import Offline from '@/components/offline';
import { checkUserAuthentication, useAuthenticatedRequest } from '@/service/auth.service';
import { UseAllProfile } from '@/service/pasien.service';
import { UseDeletePerjanjianByProfile, UseGetPerjanjianByProfile } from '@/service/perjanjian.service';
import Swal from 'sweetalert2'
import React, { useEffect, useState } from 'react'
import { Form, Field } from 'react-final-form'
import { Modal } from '@/components/modal';
import { X } from '@phosphor-icons/react';
import { toast } from 'sonner';

export default function StatusLayanan() {
    const { isUser, isValid } = checkUserAuthentication();
    useAuthenticatedRequest(isValid);

    const [noIdentitas, setNoIdentitas] = useState(null)
    const [idPerjanjian, setIdPerjanjian] = useState('')
    const [loadingToastId, setLoadingToastId] = useState(null);
    const [show, setShow] = useState(false);

    const { data, isLoading, isError, isSuccess } = UseAllProfile(isUser)
    const response = data?.data?.data;
    useEffect(() => {
        toast.dismiss();
    }, [isSuccess]);

    const { data: getPerjanjian, isLoading: getPerjanjianLoading, refetch, isError: getPerjanjianError } = UseGetPerjanjianByProfile(noIdentitas);
    const responseGetPerjanjian = getPerjanjian?.data;


    // console.log(responseGetPerjanjian);


    const { mutate: deletePerjanjian, isPending: pendingDeletePerjanjian } = UseDeletePerjanjianByProfile({
        onSuccess: (data) => {
            toast.dismiss(loadingToastId);
            toast.success('Anda berhasil membatalkan perjanjian!')
            refetch()
            setTimeout(() => {
                setShow(false)
            }, 3000);
        },
        onError: (data) => {
            toast.dismiss(loadingToastId);
            toast.error('Terjadi Kesalahan!')
        }
    })

    const handleCloseJadwal = () => setShow(false);

    useEffect(() => {
        if (noIdentitas !== null) {
            refetch();
        }
    }, [noIdentitas, refetch]);

    const onSubmit = (e) => {
        if (e.profil !== "--") {
            setNoIdentitas(e.profil)
        }
    };

    const onDelete = (e) => {
        e.preventDefault();
        const data = { no_identitas: noIdentitas, id: e.target.id.value }
        deletePerjanjian(data)
        setLoadingToastId(toast.loading('Melakukan Pembatalan...'));
        // console.log(data);
    };

    return (
        <>
            {isError && toast.error("Terjadi Kesalahan!.")}
            <Offline />
            <div className='bg-primary1 w-full h-[200px] -z-10 absolute top-0 left-0 right-0'></div>
            <div className='px-2'>
                <section className='mt-5'>
                    <div className='flex items-center p-1 font-bold text-lg gap-1 text-white'>
                        <div className='ml-1'>
                            Status Perjanjian
                        </div>
                    </div>
                </section>
                <section className='m-2 mt-4'>
                    <Form onSubmit={onSubmit} render={({ handleSubmit }) => (
                        <div className='w-full'>
                            <div className='flex w-full h-[53px] bg-white rounded-[5px] items-center shadow-custom'>
                                <form onChange={handleSubmit} className='w-full mx-2 text-abuabu font-normal text-sm'>
                                    <Field name='profil' component="select" validate={''}
                                        className="w-full border border-abuabu rounded-md p-2 focus:outline-none focus:border-primary1 bg-white">
                                        <option value="--" defaultValue="true">-- Pilih Profil --</option>
                                        {
                                            response?.map((item, i) => (
                                                <option value={item.no_identitas} key={i}>{item.nama_lengkap}</option>
                                            ))
                                        }
                                    </Field>
                                </form>
                            </div>
                        </div>
                    )} />
                </section>
                <section className='px-2'>
                    <div className='grid grid-cols-1 gap-3 overflow-y-auto scrollbar-hide mt-5' style={{ maxHeight: 'calc(100vh - 210px)' }}>

                        {getPerjanjianError &&
                            <div className='w-full h-full bg-white rounded-[5px] shadow-custom p-2'>
                                <div className='text-base font-medium text-center'>
                                    Terjadi Kesalahan saat Mengambil Data.
                                </div>
                            </div>}
                        {getPerjanjianLoading && <LoadingPerjanjian button="Batalkan" />}

                        {responseGetPerjanjian?.length === 0 && !getPerjanjianLoading && !getPerjanjianError && (
                            <div className='w-full h-full bg-white rounded-[5px] shadow-custom p-2'>
                                <div className='text-base font-medium text-center'>
                                    Belum memiliki perjanjian.
                                </div>
                            </div>
                        )}

                        {
                            responseGetPerjanjian?.map((item, i) => (
                                <div key={i}>
                                    <div className='w-full h-full bg-white rounded-[5px] shadow-custom p-2'>
                                        <div className='text-sm flex justify-between items-center'>
                                            <div className='font-medium'>No. Booking : {item.kode_booking}</div>
                                            <div className={`p-1 text-end ${item.status_perjanjian === "Belum" ? "text-yellow-600" : item.status_perjanjian === "Konfirmasi" ? "text-green-600" : ""}  font-semibold grid justify-items-end`}>{item.status_perjanjian === "Belum" ? "Menunggu Konfirmasi" : item.status_perjanjian === "Konfirmasi" ? "Menunggu DiRegistrasi" : ""}</div>
                                        </div>
                                        <div className='text-sm font-medium'>
                                            No. Antrian   : {item.no_antrian}
                                        </div>
                                        <div className='text-sedang text-abuabu'>
                                            {item.tanggal_perjanjian}
                                        </div>
                                        <div className='text-sedang text-abuabu'>
                                            {item?.nama_dokter}
                                        </div>
                                        <div className="flex items-center justify-between text-abuabu">
                                            <div className='font-normal text-xs'>Dokter {item.poli}</div>
                                            {item.status_perjanjian === "Belum" && <div onClick={() => {
                                                setShow(true);
                                                setIdPerjanjian(item?.id_perjanjian);
                                            }} className='bg-primary1 p-1 text-center rounded-[5px] w-[5rem] font-normal text-[12px] text-white'>Batalkan</div>}
                                        </div>
                                    </div>
                                    <Modal open={show} onClose={() => setShow(false)}>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between items-center pb-2 border-b-2">
                                                <div className="text-base">Konfirmasi</div>
                                                <X onClick={handleCloseJadwal} size={24} weight="bold" />
                                            </div>
                                            <form onSubmit={onDelete}>
                                                <div className="grid grid-cols-1 gap-2 justify-between items-center">
                                                    <div className="grid grid-cols-1 gap-1 text-sm">
                                                        <input type="hidden" value={idPerjanjian} name="id" />
                                                        <p>Apakah anda yakin ingin membatalkan perjanjian?</p>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end gap-2 items-center pt-3">
                                                    <button type='button' disabled={pendingDeletePerjanjian} onClick={handleCloseJadwal} className='bg-primary1 p-1 w-[4rem] transition text-center rounded-[5px] font-normal text-[12px] text-white'>Tidak</button>
                                                    <button type='submit' disabled={pendingDeletePerjanjian} className='bg-primary1 p-1 w-[7rem] transition text-center rounded-[5px] font-normal text-[12px] text-white'>Ya, Batalkan!</button>
                                                </div>
                                            </form>
                                        </div>
                                    </Modal>
                                </div>
                            ))
                        }
                    </div>
                </section >
            </div >
        </>
    )
}

// 'use client';
// import { LoadingPerjanjian } from '@/components/loading';
// import Offline from '@/components/offline';
// import { checkUserAuthentication, useAuthenticatedRequest } from '@/service/auth.service';
// import Swal from 'sweetalert2';
// import React, { useEffect, useState } from 'react';
// import { Form, Field } from 'react-final-form';
// import { Modal } from '@/components/modal';
// import { X } from '@phosphor-icons/react';
// import { toast } from 'sonner';

// // Data statis untuk profile dan perjanjian
// const staticProfiles = [
//   { no_identitas: '1234567890', nama_lengkap: 'John Doe' },
//   { no_identitas: '0987654321', nama_lengkap: 'Jane Smith' },
// ];

// const staticPerjanjian = {
//   '1234567890': [
//     {
//       kode_booking: 'BK001',
//       status_perjanjian: 'Belum',
//       no_antrian: '001',
//       tanggal_perjanjian: '2024-08-01',
//       nama_dokter: 'Dr. A',
//       poli: 'Umum',
//       id_perjanjian: 'REG001'
//     }
//   ],
//   '0987654321': [
//     {
//       kode_booking: 'BK002',
//       status_perjanjian: 'Konfirmasi',
//       no_antrian: '002',
//       tanggal_perjanjian: '2024-08-02',
//       nama_dokter: 'Dr. B',
//       poli: 'Gigi',
//       id_perjanjian: 'REG002'
//     }
//   ]
// };

// export default function StatusLayanan() {
//     const { isUser, isValid } = checkUserAuthentication();
//     useAuthenticatedRequest(isValid);

//     const [noIdentitas, setNoIdentitas] = useState(null);
//     const [idPerjanjian, setIdPerjanjian] = useState('');
//     const [loadingToastId, setLoadingToastId] = useState(null);
//     const [show, setShow] = useState(false);

//     useEffect(() => {
//         toast.dismiss();
//     }, []);

//     const response = staticProfiles;
//     const responseGetPerjanjian = staticPerjanjian[noIdentitas];

//     const handleCloseJadwal = () => setShow(false);

//     useEffect(() => {
//         if (noIdentitas !== null) {
//             // Refetch logic if needed
//         }
//     }, [noIdentitas]);

//     const onSubmit = (e) => {
//         if (e.profil !== "--") {
//             setNoIdentitas(e.profil);
//         }
//     };

//     const onDelete = (e) => {
//         e.preventDefault();
//         const data = { no_identitas: noIdentitas, id: e.target.id.value };
//         // Simulate delete action
//         toast.dismiss(loadingToastId);
//         toast.success('Anda berhasil membatalkan perjanjian!');
//         setTimeout(() => {
//             setShow(false);
//         }, 3000);
//     };

//     return (
//         <>
//             <Offline />
//             <div className='bg-primary1 w-full h-[200px] -z-10 absolute top-0 left-0 right-0'></div>
//             <div className='px-2'>
//                 <section className='mt-5'>
//                     <div className='flex items-center p-1 font-bold text-lg gap-1 text-white'>
//                         <div className='ml-1'>
//                             Status Perjanjian
//                         </div>
//                     </div>
//                 </section>
//                 <section className='m-2 mt-4'>
//                     <Form onSubmit={onSubmit} render={({ handleSubmit }) => (
//                         <div className='w-full'>
//                             <div className='flex w-full h-[53px] bg-white rounded-[5px] items-center shadow-custom'>
//                                 <form onChange={handleSubmit} className='w-full mx-2 text-abuabu font-normal text-sm'>
//                                     <Field name='profil' component="select" validate={''}
//                                         className="w-full border border-abuabu rounded-md p-2 focus:outline-none focus:border-primary1 bg-white">
//                                         <option value="--" defaultValue="true">-- Pilih Profil --</option>
//                                         {
//                                             response?.map((item, i) => (
//                                                 <option value={item.no_identitas} key={i}>{item.nama_lengkap}</option>
//                                             ))
//                                         }
//                                     </Field>
//                                 </form>
//                             </div>
//                         </div>
//                     )} />
//                 </section>
//                 <section className='px-2'>
//                     <div className='grid grid-cols-1 gap-3 overflow-y-auto scrollbar-hide mt-5' style={{ maxHeight: 'calc(100vh - 210px)' }}>
//                         {!responseGetPerjanjian && (
//                             <div className='w-full h-full bg-white rounded-[5px] shadow-custom p-2'>
//                                 <div className='text-base font-medium text-center'>
//                                     Belum memiliki perjanjian.
//                                 </div>
//                             </div>
//                         )}

//                         {
//                             responseGetPerjanjian?.map((item, i) => (
//                                 <div key={i}>
//                                     <div className='w-full h-full bg-white rounded-[5px] shadow-custom p-2'>
//                                         <div className='text-sm flex justify-between items-center'>
//                                             <div className='font-medium'>No. Booking : {item.kode_booking}</div>
//                                             <div className={`p-1 text-end ${item.status_perjanjian === "Belum" ? "text-yellow-600" : item.status_perjanjian === "Konfirmasi" ? "text-green-600" : ""}  font-semibold grid justify-items-end`}>{item.status_perjanjian === "Belum" ? "Menunggu Konfirmasi" : item.status_perjanjian === "Konfirmasi" ? "Menunggu DiRegistrasi" : ""}</div>
//                                         </div>
//                                         <div className='text-sm font-medium'>
//                                             No. Antrian   : {item.no_antrian}
//                                         </div>
//                                         <div className='text-sedang text-abuabu'>
//                                             {item.tanggal_perjanjian}
//                                         </div>
//                                         <div className='text-sedang text-abuabu'>
//                                             {item?.nama_dokter}
//                                         </div>
//                                         <div className="flex items-center justify-between text-abuabu">
//                                             <div className='font-normal text-xs'>Dokter {item.poli}</div>
//                                             {item.status_perjanjian === "Belum" && <div onClick={() => {
//                                                 setShow(true);
//                                                 setIdPerjanjian(item?.id_perjanjian);
//                                             }} className='bg-primary1 p-1 text-center rounded-[5px] w-[5rem] font-normal text-[12px] text-white'>Batalkan</div>}
//                                         </div>
//                                     </div>
//                                     <Modal open={show} onClose={() => setShow(false)}>
//                                         <div className="flex flex-col gap-2">
//                                             <div className="flex justify-between items-center pb-2 border-b-2">
//                                                 <div className="text-base">Konfirmasi</div>
//                                                 <X onClick={handleCloseJadwal} size={24} weight="bold" />
//                                             </div>
//                                             <form onSubmit={onDelete}>
//                                                 <div className="grid grid-cols-1 gap-2 justify-between items-center">
//                                                     <div className="grid grid-cols-1 gap-1 text-sm">
//                                                         <input type="hidden" value={idPerjanjian} name="id" />
//                                                         <p>Apakah anda yakin ingin membatalkan perjanjian?</p>
//                                                     </div>
//                                                 </div>
//                                                 <div className="flex justify-end gap-2 items-center pt-3">
//                                                     <button type='button' onClick={handleCloseJadwal} className='bg-primary1 p-1 w-[4rem] transition text-center rounded-[5px] font-normal text-[12px] text-white'>Tidak</button>
//                                                     <button type='submit' className='bg-primary1 p-1 w-[7rem] transition text-center rounded-[5px] font-normal text-[12px] text-white'>Ya, Batalkan!</button>
//                                                 </div>
//                                             </form>
//                                         </div>
//                                     </Modal>
//                                 </div>
//                             ))
//                         }
//                     </div>
//                 </section >
//             </div >
//         </>
//     )
// }
