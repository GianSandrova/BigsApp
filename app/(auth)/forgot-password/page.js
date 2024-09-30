'use client';
import Logo from '@/components/logo';
import Image from 'next/image';
import React, { useState } from 'react'
import Ilustrasi from '@/public/assets/images/forgot-password.svg'
import Link from 'next/link';
import { FormRow } from '@/components/FormRow';
import { useRouter } from 'next/navigation';
import { UseAuthForgotPassword } from '@/service/auth.service';
import { toast } from 'sonner';

function ForgotPassword() {
    const router = useRouter();

    const [loadingToastId, setLoadingToastId] = useState(null);

    const { mutate: storeForgotPassword, isLoading: forgotPasswordLoading } = UseAuthForgotPassword({
        onSuccess: (data) => {
            toast.dismiss(loadingToastId);
            // console.log(data);
            toast.success(data.message)
            router.push('/login')
        },
        onError: (data) => {
            toast.dismiss(loadingToastId);
            toast.error(data.message)
        }
    });

    const onSubmit = (e) => {
        e.preventDefault();
        setLoadingToastId(toast.loading('Loading...'));
        const formData = new FormData(e.target)
        storeForgotPassword(formData)
    };

    return (
        <div className="min-h-screen flex items-center w-full bg-white justify-center">
            <div className="flex flex-col items-center">
                <Logo />
                <Image src={Ilustrasi} alt='ilustrasi' height={200} width={200} priority className="w-full h-auto mt-3 px-6" />
                <div className='px-8 w-full'>
                    <div className='text-base font-medium text-center text-gray my-3'>Lupa Password</div>
                    <form onSubmit={onSubmit}>
                        <FormRow type="email" name="email" labelText="Email" style={"mb-2"} />
                        <div className="mt-3">
                            <button
                                type="submit"
                                className="w-full bg-primary1 text-white p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            >
                                Kirim Tautan
                            </button>
                        </div>
                        <div className='text-center text-kecil cursor-pointer underline text-sky-600 p-3'>
                            <Link href={'/login'}>Sudah Punya Akun? Masuk!</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword
