import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useState, useEffect } from 'react';
import { authHeader } from '@/lib';
import {useAuthToken} from '@/hooks/useAuthToken'

// export const useGetAllFaskes = () => {
//     // const token = useAuthToken();
  
//     // return useQuery({
//     //   queryKey: ['getAllFaskes'],
//     //   queryFn: async () => {
//     //     if (!token) throw new Error('No token available');
//     //     const response = await api.get('faskes/get', {
//     //       headers: authHeader(),
//     //     });
//     //     console.log(response.data);
//     //     return response.data;
//     //   },
//     //   enabled: !!token, // Hanya jalankan query jika token tersedia
//     // });
//     // const id_faskes = JSON.parse(localStorage.getItem('selectedFaskesId'));
//     const no_telepon = localStorage.getItem('no_telepon');
//     const token_mobile = localStorage.getItem('tokenmobile');
//     const token_core = localStorage.getItem('token');

//     // Hapus tanda kutip ganda jika ada
//     const cleanNoTelepon = no_telepon ? no_telepon.replace(/^"|"$/g, '') : null;
//     const cleanTokenMobile = token_mobile ? token_mobile.replace(/^"|"$/g, '') : null;
//     return useQuery({
//         queryKey: ['dokter',cleanNoTelepon, cleanTokenMobile],
          
//         queryFn: async () =>{
//             const response = await api.post('faskes/get', {
//                 no_telepon: cleanNoTelepon,
//                 tokenmobile: cleanTokenMobile,
//                 token_core:token_core
//             });
//             return response.data;
//         }
         
//     });
//   };

export const useGetAllFaskes = () => {
  const [userData, setUserData] = useState({
    no_telepon: null,
    token_core: null,
    token_mobile: null,
  });

  useEffect(() => {
    // Access localStorage only on the client side
    setUserData({
      no_telepon: localStorage.getItem('no_telepon'),
      token_core: localStorage.getItem('token'),
      token_mobile: localStorage.getItem('tokenmobile'),
    });
  }, []);

  const cleanNoTelepon = userData.no_telepon ? userData.no_telepon.replace(/^"|"$/g, '') : null;
  const cleanTokenCore = userData.token_core ? userData.token_core.replace(/^"|"$/g, '') : null;
  const cleanTokenMobile = userData.token_mobile ? userData.token_mobile.replace(/^"|"$/g, '') : null;

  return useQuery({
    queryKey: ['dokter', cleanNoTelepon, cleanTokenMobile],
    queryFn: async () => {
      const response = await api.post('faskes/get', {
        no_telepon: cleanNoTelepon,
        tokenmobile: cleanTokenMobile,
        token_core: cleanTokenCore
      });
      return response.data;
    },
    enabled: !!cleanNoTelepon && !!cleanTokenMobile && !!cleanTokenCore,
  });
};
  