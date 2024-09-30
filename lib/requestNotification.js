const RequestNotification = () => {
    return async () => {
        try {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                throw new Error('Permission not granted for Notification');
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
        }
    };
}

export default RequestNotification;