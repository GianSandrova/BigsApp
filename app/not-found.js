import Image from 'next/image'
import Link from 'next/link'
import notfoundimg from '@/public/assets/images/404.svg'

export default function NotFound() {
    return (
        <>
            <div className='flex flex-col items-center justify-center w-full h-screen'>
                <Image src={notfoundimg} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt="Not Found Image" />
                <h2 className='text-base sm:text-lg text-center font-bold mt-4'>Oops! Halaman Tidak Ditemukan</h2>
                <p className='text-gray-600 text-kecil sm:text-sm md:text-base text-center mb-4'>Maaf, kami tidak bisa menemukan resource yang diminta.</p>
                <Link href="/home" className='bg-primary1 text-sm p-1 rounded text-white'>Kembali ke Beranda</Link>
            </div>
        </>
    )
}