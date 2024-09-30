'use client';
import { MagnifyingGlass } from "@phosphor-icons/react"

export const Search = ({ onChange, placeholder }) => {
    return (
        <>
            <div className='w-full'>
                <div className='flex w-full h-[45px] bg-white rounded-[5px] items-center shadow-custom'>
                    <div className="relative p-2 w-full text-abuabu font-normal text-sm">
                        <input
                            type="text"
                            className="w-full border border-abuabu rounded-md p-1 focus:outline-none focus:border-primary1"
                            placeholder={placeholder}
                            onChange={onChange}
                        />
                        <span className="absolute inset-y-0 right-0 pr-4 flex items-center top-1/2 transform -translate-y-[12px]">
                            <MagnifyingGlass size={20} className="text-abuabu" />
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}