'use client';
import { checkUserAuthentication, useAuthenticatedRequest } from "@/service/auth.service";
import { ArrowRight, X } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import Offline from "@/components/offline";
import { toast } from "sonner";

// Data statis untuk profil
const staticProfiles = [
    { no_identitas: '12345', nama_lengkap: 'John Doe' },
    { no_identitas: '67890', nama_lengkap: 'Jane Smith' }
];

// Data statis untuk riwayat
const staticRiwayat = [
    {
        no_identitas: '12345',
        kode_booking: 'BK001',
        no_antrian_perjanjian: 'A01',
        tanggal_perjanjian: '2024-08-01',
        estimasi_pelayanan: '09:00',
        nama_dokter: 'Dr. Ahmad',
        poli: 'Umum',
        status: 'Selesai',
        id_registrasi: 'REG001',
        tombol: true
    },
    {
        no_identitas: '12345',
        kode_booking: 'BK002',
        no_antrian_perjanjian: 'A02',
        tanggal_perjanjian: '2024-08-02',
        estimasi_pelayanan: '10:00',
        nama_dokter: 'Dr. Budi',
        poli: 'Gigi',
        status: 'Berlangsung',
        id_registrasi: 'REG002',
        tombol: false
    },
    {
        no_identitas: '67890',
        kode_booking: 'BK003',
        no_antrian_perjanjian: 'A03',
        tanggal_perjanjian: '2024-08-03',
        estimasi_pelayanan: '11:00',
        nama_dokter: 'Dr. Chandra',
        poli: 'Anak',
        status: 'Menunggu Pemeriksaan Dokter',
        id_registrasi: 'REG003',
        tombol: false
    }
];

export default function Riwayat() {
    const { isUser, isValid } = checkUserAuthentication();
    useAuthenticatedRequest(isValid);

    const [noIdentitas, setNoIdentitas] = useState(null);
    const [response, setResponse] = useState(staticProfiles);
    const [responseGetRiwayat, setResponseGetRiwayat] = useState(staticRiwayat);

    useEffect(() => {
        toast.dismiss();
    }, []);

    useEffect(() => {
        if (noIdentitas !== null) {
            const filteredRiwayat = staticRiwayat.filter(item => item.no_identitas === noIdentitas);
            setResponseGetRiwayat(filteredRiwayat);
        }
    }, [noIdentitas]);

    const onSubmit = (values) => {
        if (values.profil !== "--") {
            setNoIdentitas(values.profil);
        }
    };

    return (
        <>
            <Offline />
            <div className='bg-primary1 w-full h-[200px] -z-10 absolute top-0 left-0 right-0'></div>
            <div className='px-2'>
                <section className='mt-5'>
                    <div className='flex items-center p-1 font-bold text-lg gap-1 text-white'>
                        <div className='ml-1'>
                            Riwayat Appointment
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
                        {responseGetRiwayat.length === 0 && (
                            <div className='w-full h-full bg-white rounded-[5px] shadow-custom p-2'>
                                <div className='text-base font-medium text-center'>
                                    Belum memiliki Riwayat Kunjungan.
                                </div>
                            </div>
                        )}

                        {
                            responseGetRiwayat?.map((item, i) => (
                                <div key={i} className='w-full h-full bg-white rounded-[5px] shadow-custom p-2'>
                                    <div className='text-sm flex justify-between items-center'>
                                        <div className='font-medium'>No. Booking : {item?.kode_booking}</div>
                                        <div className={`p-1 sm:mr-3 fold:mr-1 font-semibold rounded-[10px] ${item?.status == "Selesai" ? "text-green-800" : item?.status == "Berlangsung" ? "text-yellow-400" : item?.status == "Dibatalkan" ? "text-red-800" : "text-yellow-800"}`}>{item?.status == "Selesai" ? "Selesai" : item?.status == "Berlangsung" ? "Pemeriksaan Dimulai" : item?.status == "Dibatalkan" ? "Dibatalkan" : "Menunggu Pemeriksaan Dokter"}</div>
                                    </div>
                                    <div className='text-sm font-medium'>
                                        No. Antrian   : {item?.no_antrian_perjanjian}
                                    </div>
                                    <div className='text-sedang text-abuabu'>
                                        {item?.tanggal_perjanjian} | {item?.estimasi_pelayanan ? item?.estimasi_pelayanan : ""}
                                    </div>
                                    <div className='text-sedang text-abuabu'>
                                        {item?.nama_dokter}
                                    </div>
                                    <div className="flex items-center justify-between text-abuabu">
                                        <div className='font-normal text-xs'>Dokter {item?.poli}</div>
                                        {item?.tombol ? <Link href={`/riwayat/${item?.id_registrasi}`} className='bg-primary1 p-1 w-[6rem] flex justify-between items-center transition text-center rounded-[5px] font-normal text-[12px] text-white'>
                                            Lihat Detail
                                            <ArrowRight size={19} />
                                        </Link> : " "}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </section >
            </div >
        </>
    )
}
