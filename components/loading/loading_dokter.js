import { CaretRight } from "@phosphor-icons/react"
import Skeleton from "react-loading-skeleton"

const LoadingDokter = () => {
    return (
        <>
            {[...Array(5)].map((item, i) => (
                <div key={i} className={`bg-white h-full w-full items-center p-2 transition-all shadow-custom rounded-[5px]`}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="h-10">
                                <Skeleton width={40} height={40} circle="true" className="flex justify-center text-center" />
                            </div>
                            <div className='items-center ml-2'>
                                <div className='font-medium text-sm capitalize'>{<Skeleton width={150} />}</div>
                                <div className='text-abutext font-normal text-kecil flex'>{<Skeleton width={100} />}</div>
                                <div className='text-abutext font-normal text-kecil'>
                                    <span className='capitalize'>
                                        {<Skeleton width={75} />}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* <div className="rounded-full bg-abutext/20 p-1 cursor-pointer">
                            <CaretRight size={20} className="text-center" />
                        </div> */}
                        <div className={`rounded-full text-end font-normal text-kecil`}>
                            <Skeleton width={60} />
                        </div>
                    </div>
                </div >
            ))}
        </>
    )
}
export default LoadingDokter