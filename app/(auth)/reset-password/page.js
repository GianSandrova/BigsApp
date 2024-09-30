'use client';
import Logo from '@/components/logo';
import Image from 'next/image';
import React, { useState } from 'react'
import Ilustrasi from '@/public/assets/images/reset_password.svg'
import { FormRow } from '@/components/FormRow';
import {  useRouter, useSearchParams } from 'next/navigation';
import { UseAuthResetPassword } from '@/service/auth.service';
import { toast } from 'sonner';

function ResetPassword() {
    const router = useRouter();
    const searchParams = useSearchParams()

    console.log("Parameter lp:", searchParams.get('lp'));

    if (!searchParams.get('lp')) {
        console.log("Parameter lp tidak ditemukan, mengarahkan ke /login");
        router.push('/login');
    }

    const [loadingToastId, setLoadingToastId] = useState(null);

    const { mutate: storeResetPassword, isLoading: resetPasswordLoading } = UseAuthResetPassword({
        onSuccess: (data) => {
            toast.dismiss(loadingToastId);
            console.log(data);
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
        const formData = new FormData(e.target);
        const jsonBody = Object.fromEntries(formData.entries());
        console.log('JSON Body:', jsonBody); // Debugging
        setLoadingToastId(toast.loading('Loading...'));
        storeResetPassword(jsonBody);
    };
    

    return (
        <div className="min-h-screen flex items-center w-full bg-white justify-center">
            <div className="flex flex-col items-center">
                <Logo />
                <Image src={Ilustrasi} alt='ilustrasi' height={200} width={200} priority className="w-full h-auto mt-3 px-6" />
                <div className='px-8 w-full'>
                    <div className='text-base font-medium text-center text-gray my-3'>Reset Password Anda</div>
                    <form onSubmit={onSubmit}>
                        <FormRow type="password" name="newPassword" labelText="Password" style={"mb-2"} />
                        <FormRow type="hidden" name="token" style={"mb-2"} value={searchParams.get('lp')} />
                        <div className="mt-3">
                            <button
                                type="submit"
                                className="w-full bg-primary1 text-white p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            >
                                Simpan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword
