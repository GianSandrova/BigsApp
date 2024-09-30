import { authHeader } from '@/lib';
import { api } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';

// export const UseGetPoly = () => {
//     const id_faskes = JSON.parse(localStorage.getItem('selectedFaskesId'));
//     const no_telepon = localStorage.getItem('no_telepon');
//     const tokenmobile = localStorage.getItem('tokenmobile');   
//     return useQuery({
//         queryKey: ['poliklinik', id_faskes, no_telepon, tokenmobile],
//         queryFn: async () => {
//             if (!id_faskes) {
//                 throw new Error('Faskes ID is required');
//             }
//             const response = await api.get(`get-poli?faskes_id=${id_faskes}&no_telepon=${no_telepon}&tokenmobile=${tokenmobile}`);
//             return response.data;
//         },
//     });
// };
export const UseGetPoly = () => {
    const id_faskes = JSON.parse(localStorage.getItem('selectedFaskesId'));
    // const no_telepon = localStorage.getItem('no_telepon');
    // const token_mobile = localStorage.getItem('tokenmobile');

    // Hapus tanda kutip ganda jika ada
    // const cleanNoTelepon = no_telepon ? no_telepon.replace(/^"|"$/g, '') : null;
    // const cleanTokenMobile = token_mobile ? token_mobile.replace(/^"|"$/g, '') : null;

    return useQuery({
        queryKey: ['poliklinik', id_faskes],
        queryFn: async () => {
            if (!id_faskes) {
                throw new Error('Faskes ID is required');
            }
            // if (!cleanNoTelepon) {
            //     throw new Error('Phone number is required');
            // }
            // if (!cleanTokenMobile) {
            //     throw new Error('Token is required');
            // }
            const response = await api.post('akun/poli', {
                faskes_id: id_faskes,
                // no_telepon: cleanNoTelepon,
                // tokenmobile: cleanTokenMobile
            });
            return response.data;
        },
    });
};


export const UseGetDoctor = (id_poli) => {
    const id_faskes = JSON.parse(localStorage.getItem('selectedFaskesId'));

    return useQuery({
        queryKey: ['dokter', id_faskes, id_poli],
        queryFn: async () => {
            const response = await api.get('jadwal/get-jadwal/jadwal', {
                params: {
                    id_faskes: id_faskes,
                    id_departemen: id_poli,
                }
            });
            return response.data;
        }
    });
};


export const UseGetAllDoctor = () => {
    const id_faskes = JSON.parse(localStorage.getItem('selectedFaskesId'));

    return useQuery({
        queryKey: ['all-dokter', id_faskes],
        queryFn: async () => {
            if (!id_faskes) {
                throw new Error('Faskes ID is required');
            }
            const response = await api.get(`jadwal/get-jadwal/alldoctors?faskes_id=${id_faskes}`);
            return response.data;
        },
    });
};
export const UseGetJadwalDoctor = (id_dokter) => {
    return useQuery({
        queryKey: ['jadwaldokter', id_dokter],
        queryFn: async () =>
            await api.get(
                `dokter/get-jadwal-dokter?id=${id_dokter}`
            ),
        enabled: false
    });
};

export const UseGetJadwalDoctorByDay = (id_dokter, tanggal) => {
    return useQuery({
        queryKey: ['haripraktek', id_dokter, tanggal],
        queryFn: async () =>
            await api.get(
                `dokter/get-jadwal-by-day?id=${id_dokter}&tanggal=${tanggal}`
            ),
        enabled: false
    });
};

export const UseGetProfilePasienByNik = ({ onSuccess, onError }) => {
    return useMutation({
        mutationFn: async (body) => {
            const user = await api.post("pasien/cek-pasien", body, {
                headers: authHeader(),
            });
            return user.data;
        },
        onSuccess,
        onError
    });
};

export const GetLayanan = () => {
    return useQuery({
        queryKey: ['info_layanan'],
        queryFn: async () =>
            await api.get(
                `/layanan/get-layanan`
            ),
    });
};
