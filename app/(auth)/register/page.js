'use client';
import Logo from '@/components/logo';
import Image from 'next/image';
import React, { useState } from 'react'
import Ilustrasi from '@/public/assets/images/daftar.png'
import Link from 'next/link';
import { UseAuthRegister } from '@/service/auth.service';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FormRow } from '@/components/FormRow';

function Register() {
    const [loadingToastId, setLoadingToastId] = useState(null);
    const router = useRouter();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        no_telepon: '',
        // repeatPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        
        // if (formData.password !== formData.repeatPassword) {
        //     toast.error('Password tidak sama!');
        //     return;
        // }
        
        if (formData.password.length < 6) {
            toast.error('Password harus terdiri dari minimal 6 karakter!');
            return;
        }
        
        const formSubmitData = new FormData(e.target);
        userRegister(formSubmitData);
        setLoadingToastId(toast.loading('Mengirim data...'));
    };

    const { mutate: userRegister, isPending: loginIsPending } = UseAuthRegister({
        onSuccess: (data) => {
            toast.dismiss(loadingToastId);
            if (data.ret === 404) {
                toast.warning(data.msg)
                return
            }
            // localStorage.setItem('token', JSON.stringify(data));
            toast.success('Anda berhasil mendaftar!')
            router.push('/login')
        },
        onError: (data) => {
            toast.error('Terjadi Kesalahan!')
        }
    });


    return (
        <div className="min-h-screen py-14 flex items-center w-full bg-white justify-center">
            <div className="flex flex-col items-center">
                <Logo />
                <Image src={Ilustrasi} alt='ilustrasi' height={200} width={200} priority className="w-full h-auto" />
                <div className='px-8'>
                    <div className='text-base font-medium text-center text-gray my-3'>Daftar Untuk Menggunakan BigsGo</div>
                    <form onSubmit={onSubmit}>
                        <FormRow type="username" name="username" labelText="Username" value={formData.username} onChange={handleChange} style={"mb-2"} />
                        <FormRow type="email" name="email" labelText="Email" value={formData.email} onChange={handleChange} style={"mb-2"} />
                        <FormRow type="password" name="password" labelText="Password" value={formData.password} onChange={handleChange} style={"mb-2"} />
                        <FormRow type="no_telepon" name="no_telepon" labelText="No Telepon" value={formData.no_telepon} onChange={handleChange} style={"mb-2"} />
                        {/* <FormRow type="password" name="repeatPassword" labelText="Repeat Password" value={formData.repeatPassword} onChange={handleChange} style={"mb-2"} /> */}
                        <div className="mt-3">
                            <button
                                type="submit"
                                className="w-full bg-primary1 text-white p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                                defaultValue={loginIsPending}
                            >
                                Daftar
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

export default Register
