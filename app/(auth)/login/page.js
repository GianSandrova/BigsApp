'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react'
import Ilustrasi from '@/public/assets/images/login.png'
import Logo from '@/components/logo';
import Link from 'next/link';
import { useAuthLogin } from '@/service/auth.service';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { FormRow } from '@/components/FormRow';

function Login() {
    const [isClient, setIsClient] = useState(false);
    const [redirect, setRedirect] = useState(null);
    const [loadingToastId, setLoadingToastId] = useState(null);

    useEffect(() => {
        setIsClient(true);
        const searchParams = new URLSearchParams(window.location.search);
        const redirectParam = searchParams.get('redirect');
        if (redirectParam) {
            setRedirect(decodeURIComponent(redirectParam));
        }
    }, []);

    const router = isClient ? useRouter() : null;

    const handleSuccessfulLogin = () => {
        if (redirect) {
            router.push(redirect);
        } else {
            router.push('/');
        }
    };

    const { mutate: userLogin, isLoading: loginIsLoading } = useAuthLogin({
        onSuccess: async (response) => {
            toast.dismiss(loadingToastId);

            if (response.status === "success" && response.data) {
                const userData = response.data;
                if (userData.access_token) {
                    localStorage.setItem('token', JSON.stringify(userData.access_token));
                    localStorage.setItem('username', userData.username);
                    toast.success('Anda berhasil login!')
                    handleSuccessfulLogin();
                } else {
                    console.error('Token tidak ditemukan dalam respons:', userData);
                    toast.error('Terjadi kesalahan saat menyimpan token');
                }
            } else {
                console.error('Unexpected login response structure:', response);
                toast.error('Terjadi kesalahan saat login');
            }
        },
        onError: (error) => {
            toast.dismiss(loadingToastId);
            toast.error(error.message || 'Terjadi Kesalahan!');
        }
    });
    
    const onSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        
        if (password.length < 6) {
            toast.error('Password harus terdiri dari minimal 6 karakter!');
            return;
        }
        
        setLoadingToastId(toast.loading('Loading...'));
        
        userLogin({ email, password });
    };

    if (!isClient) {
        return <div>Loading...</div>; // or any loading indicator
    }

    return (
        <div className="min-h-screen flex items-center w-full bg-white justify-center">
            <div className="flex flex-col items-center">
                <Logo />
                <Image src={Ilustrasi} alt='ilustrasi' height={200} width={200} priority className="w-full h-auto" />
                <div className='px-8 w-full'>
                    <div className='text-base font-medium text-center text-gray my-3'>Masuk Untuk Menggunakan BigsGo</div>
                    <form onSubmit={onSubmit}>
                        <FormRow type="email" name="email" labelText="Email" style={"mb-2"} />
                        <FormRow type="password" name="password" labelText="Password" style={"mb-2"} />
                        <div className='text-kecil cursor-pointer text-right underline text-sky-600'>
                            <Link href={'forgot-password'}>
                                Lupa Password?
                            </Link>
                        </div>
                        <div className="mt-3">
                            <button
                                type="submit"
                                className="w-full bg-primary1 text-white p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                                disabled={loginIsLoading}
                            >
                                {loginIsLoading ? 'Loading...' : 'Masuk'}
                            </button>
                        </div>
                        <div className="flex space-x-2 ml-6">
                            <div className='text-center text-kecil cursor-pointer underline text-sky-600 p-3'>
                                <Link href={'/'}>Lewati</Link>
                            </div>
                            <div className='text-center text-kecil cursor-pointer underline text-sky-600 p-3'>
                                <Link href={'/register'}>Belum Punya Akun? Daftar!</Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;