import { NetworkStatus } from "@/lib";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

const Offline = () => {
    const isOffline = NetworkStatus();
    const pathName = usePathname()

    isOffline && pathName !== "/" && toast.warning("Anda sedang offline. Beberapa fitur mungkin tidak tersedia.")

    return (
        isOffline && (pathName == "/" &&
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 fixed z-10">
                <div className="flex">
                    <div className="flex-shrink-0 absolute">
                        <svg className="h-5 w-5 text-yellow-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true">
                            <path fillRule="evenodd"
                                d="M8.257 3.099c" />
                        </svg>
                    </div>
                    <div className="">
                        <p className="text-sm text-yellow-700">
                            Anda sedang offline. Beberapa fitur mungkin tidak tersedia.
                        </p>
                    </div>
                </div>
            </div>
        )
    )
}
export default Offline