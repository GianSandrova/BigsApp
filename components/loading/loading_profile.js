import { CaretRight } from "@phosphor-icons/react"
import Skeleton from "react-loading-skeleton"

const LoadingProfile = () => {
    return (
        <>
            {[...Array(5)].map((item, index) => (
                <div className='w-full h-full bg-white rounded-[5px] shadow-custom p-2' key={index}>
                    <div className='text-sm flex justify-between items-center'>
                        <div className="">
                            <div className='font-medium'>{<Skeleton width={200} />}</div>
                            <div className='text-kecil font-normal'>{<Skeleton width={200} />}</div>
                        </div>
                        <div className='p-1'>
                            <div className="rounded-full p-1 bg-abuabu/20 cursor-pointer">
                                <CaretRight size={16} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}
export default LoadingProfile