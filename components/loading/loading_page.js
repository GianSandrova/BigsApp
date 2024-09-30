import React from 'react'
import Logo from '../logo'


export default function LoadingPage() {
    return (
        <div className='animate-pulse'>
            <div className="flex flex-col w-full h-screen items-center justify-center z-10 text-cyan-800">
                <Logo />
            </div>
        </div>
    )
}