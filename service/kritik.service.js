import { api } from "@/lib/axios";
import { useMutation } from '@tanstack/react-query';

export const UsePostKritik = ({ onSuccess, onError }) => {
    return useMutation({
        mutationFn: async (body) => {
            const user = await api.post("kritik/store-kritik", body);
            return user.data;
        },
        onSuccess,
        onError
    });
};