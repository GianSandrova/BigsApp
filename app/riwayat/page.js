'use client';
import { checkUserAuthentication, useAuthenticatedRequest } from "@/service/auth.service";
import { ArrowRight, X, LockSimple } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { UseGetProfileByFaskes } from "@/service/pasien.service";
import { UseGetRiwayatByProfile } from "@/service/riwayat.service";
import { LoadingPerjanjian } from '@/components/loading';
import Offline from "@/components/offline";
import { toast } from "sonner";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function Riwayat() {
    const { isUser, isValid } = checkUserAuthentication();
    const [showAuthMessage, setShowAuthMessage] = useState(false);
    const [noRm, setNoRm] = useState(null);

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const fullPath = `${pathname}${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;

    useEffect(() => {
        if (!isValid) {
            setShowAuthMessage(true);
        }
    }, [isValid]);

    const { data, isLoading, isError, isSuccess } = UseGetProfileByFaskes(isUser);
    const response = data?.data;
    useEffect(() => {
        toast.dismiss();
    }, [isSuccess]);

    const { data: dataRiwayat, isLoading: isLoadingRiwayat, isError: isErrorRiwayat, refetch } = UseGetRiwayatByProfile(noRm);
    let responseGetRiwayat = dataRiwayat?.data?.data;

    useEffect(() => {
        if (noRm !== null) {
            refetch();
        }
    }, [noRm, refetch]);

    const onSubmit = (values) => {
        if (values.profil !== "--") {
            setNoRm(values.profil);
        }
    };

    let setResponseGetRiwayat = responseGetRiwayat;

    setResponseGetRiwayat?.forEach((perjanjian) => {
        if (perjanjian.dokter) {
            perjanjian.status = perjanjian.status_registrasi === "Tutup Kunjungan" ? "Selesai" : "Berlangsung";
            perjanjian.tombol = "Bisa";
        } else {
            perjanjian.status = "Menunggu Pemeriksaan Dokter";
        }
    });

    const renderContent = () => {
        if (showAuthMessage) {
            return (
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-4 rounded-md shadow-md max-w-md w-full">
                        <div className="flex items-center mb-2">
                            <LockSimple size={24} className="mr-2" />
                            <p className="font-bold">Anda harus login untuk melihat riwayat appointment.</p>
                        </div>
                        <p>Silakan login untuk melanjutkan.</p>
                    </div>
                    <Link href={`/login?redirect=${encodeURIComponent(fullPath)}`}>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                            Login Sekarang
                        </button>
                    </Link>
                </div>
            );
        }

        return (
            <>
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
                                                <option value={item.no_rm} key={i}>{item.nama_lengkap}</option>
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
                        {isErrorRiwayat &&
                            <div className='w-full h-full bg-white rounded-[5px] shadow-custom p-2'>
                                <div className='text-base font-medium text-center'>
                                    Terjadi Kesalahan saat Mengambil Data.
                                </div>
                            </div>}
                        {isLoadingRiwayat && <LoadingPerjanjian button={"Lihat Detail"} icon={<ArrowRight size={19} />} />}

                        {setResponseGetRiwayat?.length === 0 && !isLoadingRiwayat && !isErrorRiwayat && (
                            <div className='w-full h-full bg-white rounded-[5px] shadow-custom p-2'>
                                <div className='text-base font-medium text-center'>
                                    Belum memiliki Riwayat Kunjungan.
                                </div>
                            </div>
                        )}

                        {
                            setResponseGetRiwayat?.map((item, i) => (
                                <div key={i} className='w-full h-full bg-white rounded-[5px] shadow-custom p-2'>
                                    <div className='text-sm flex justify-between items-center'>
                                        <div className='font-medium'>No. Registrasi : {item?.no_registrasi}</div>
                                        <div className={`p-1 sm:mr-3 fold:mr-1 font-semibold rounded-[10px] ${item?.status == "Selesai" ? "text-green-800" : item?.status == "Berlangsung" ? "text-yellow-400" : "text-yellow-800"}`}>{item?.status}</div>
                                    </div>
                                    <div className='text-sm font-medium'>
                                        No. Antrian   : {item?.no_antrian}
                                    </div>
                                    <div className='text-sedang text-abuabu'>
                                        {item?.waktu_registrasi}
                                    </div>
                                    <div className='text-sedang text-abuabu'>
                                        {item?.dokter}
                                    </div>
                                    <div className="flex items-center justify-between text-abuabu">
                                        <div className='font-normal text-xs'>{item?.poli}</div>
                                        {item?.tombol && <Link href={`/riwayat/${item?.no_registrasi}`} className='bg-primary1 p-1 w-[6rem] flex justify-between items-center transition text-center rounded-[5px] font-normal text-[12px] text-white'>
                                            Lihat Detail
                                            <ArrowRight size={19} />
                                        </Link>}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </section>
            </>
        );
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
                {renderContent()}
            </div>
        </>
    )
}