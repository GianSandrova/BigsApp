'use client'
import { useState, useEffect } from 'react';

const NetworkStatus = () => {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const updateNetworkStatus = () => {
                setIsOffline(!navigator.onLine);
            };

            setIsOffline(!navigator.onLine); // Initial check

            window.addEventListener('online', updateNetworkStatus);
            window.addEventListener('offline', updateNetworkStatus);

            return () => {
                window.removeEventListener('online', updateNetworkStatus);
                window.removeEventListener('offline', updateNetworkStatus);
            };
        }
    }, []);

    return isOffline;
};
export default NetworkStatus