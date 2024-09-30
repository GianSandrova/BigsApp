import axios from "axios";

const RegisterSW = (idUser) => {
    return async () => {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/service-worker.js');
                console.log('Service Worker registered with scope:', registration.scope);

                if (idUser) {
                    const subscription = await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: process.env.NEXT_PUBLIC_PUBLIC_KEY
                    });

                    try {
                        const response = await axios.post(
                            process.env.NEXT_PUBLIC_LINK_API_SUBSCRIBE,
                            { subscription, idUser },
                            {
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }
                        );
                        console.log("Subscribed successfully", response.data);
                    } catch (error) {
                        console.error('Subscription failed:', error);
                    }
                }
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    };
}
export default RegisterSW