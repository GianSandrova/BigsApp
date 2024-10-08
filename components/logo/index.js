import Image from 'next/image'
import React from 'react'
import logo from "@/public/assets/logo/logo.png"


const Logo = () => {
    return (
        <>
            <div className='flex justify-start'>
                <Image src={logo} loading='lazy' height={100} width={100} alt='logo' />
            </div>
        </>
    )
}

export default Logo
