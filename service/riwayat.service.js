import { authHeader } from '@/lib';
import { api } from "@/lib/axios";
import { useQuery } from '@tanstack/react-query';

// menampilkan riwayat
export const UseGetRiwayatByProfile = (no_rm) => {
    return useQuery({
        queryKey: ['appointmentHistory', no_rm],
        queryFn: async () => {
          const id_faskes = JSON.parse(localStorage.getItem('selectedFaskesId'));
          const username = localStorage.getItem('username');
          const token_mobile = localStorage.getItem('tokenmobile');
          const token_core = localStorage.getItem('token');
    
          // Remove double quotes if present
          const cleanTokenMobile = token_mobile ? token_mobile.replace(/^"|"$/g, '') : null;
          const cleanTokenCore = token_core ? token_core.replace(/^"|"$/g, '') : null;
    
          const requestBody = {
            username: username,
            token: cleanTokenMobile,
            no_rm: no_rm,
            id_faskes: id_faskes
          };
    
          const response = await api.post("appointment/riwayat-perjanjian", requestBody, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${cleanTokenCore}`,
            },
          });
          return response.data;
        },
        enabled: !!no_rm,
      });
    };

export const UseGetDetailRiwayatKunjunganByIdRegistrasi = (no_registrasi) => {
    return useQuery({
        queryKey: ['detail_riwayat', no_registrasi],
        queryFn: async () => {
            const id_faskes = JSON.parse(localStorage.getItem('selectedFaskesId'));
            const username = localStorage.getItem('username');
            const token_mobile = localStorage.getItem('tokenmobile');
            const token_core = localStorage.getItem('token');
            
            // Remove double quotes if present
            const cleanTokenMobile = token_mobile ? token_mobile.replace(/^"|"$/g, '') : null;
            const cleanTokenCore = token_core ? token_core.replace(/^"|"$/g, '') : null;
      
            const requestBody = {
              username: username,
              token: cleanTokenMobile,
              no_registrasi: no_registrasi,
              id_faskes: id_faskes
            };
      
            const response = await api.post("appointment/detail-riwayat", requestBody, {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cleanTokenCore}`,
              },
            });
            return response.data;
        },
    });
};