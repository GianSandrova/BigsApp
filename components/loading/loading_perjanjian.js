import { CaretRight } from "@phosphor-icons/react"
import Skeleton from "react-loading-skeleton"

const LoadingPerjanjian = ({ button, icon }) => {
    return (
        <>
            {[...Array(1)].map((item, i) => (
                <div key={i} className='w-full h-full bg-white rounded-[5px] shadow-custom p-2'>
                    <div className='text-sm flex justify-between items-center'>
                        <div className='font-medium'>{<Skeleton width={200} />}</div>
                        <div className='p-1 sm:mr-3 fold:mr-1 text-green-800 font-semibold rounded-[10px]'>{<Skeleton width={60} />}</div>
                    </div>
                    <div className='text-sm font-medium'>
                        {<Skeleton width={105} />}
                    </div>
                    <div className='text-sedang text-abuabu'>
                        {<Skeleton width={150} />}
                    </div>
                    <div className='text-sedang text-abuabu'>
                        {<Skeleton width={200} />}
                    </div>
                    <div className="flex items-center justify-between text-abuabu">
                        <div className='font-normal text-xs'>{<Skeleton width={140} />}</div>
                        <div className={`bg-primary1 p-1  ${icon ? "flex justify-between w-[6rem]" : "w-[5rem]"} transition text-center rounded-[5px] font-normal text-[12px] text-white`}>{button} {icon}</div>
                    </div>
                </div>
            ))}
        </>
    )
}
export default LoadingPerjanjian