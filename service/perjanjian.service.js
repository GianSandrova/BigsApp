import { authHeader } from "@/lib";
import { api } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const UseGetPerjanjianByProfile = (no_identitas) => {
  return useQuery({
    queryKey: ["perjanjian", no_identitas],
    queryFn: async () =>
      await api.get(`appointment/get-perjanjian?no_identitas=${no_identitas}`, {
        headers: authHeader(),
      }),
    enabled: false,
  });
};

// export const UsePostPerjanjianByProfile = ({ onSuccess, onError }) => {
//     return useMutation({
//         mutationFn: async (body) => {
//             const id_faskes = JSON.parse(localStorage.getItem('selectedFaskesId'));
//             const no_telepon = localStorage.getItem('no_telepon');
//             // const id_pasien =
//             const token_mobile = localStorage.getItem('tokenmobile');
//             const token_core = localStorage.getItem('token');
//             const no_rm = norm;
//             // Hapus tanda kutip ganda jika ada
//             const cleanNoTelepon = no_telepon ? no_telepon.replace(/^"|"$/g, '') : null;
//             const cleanTokenMobile = token_mobile ? token_mobile.replace(/^"|"$/g, '') : null;
//             const cleanTokenCore = token_core ? token_core.replace(/^"|"$/g, '') : null;

//             const requestBody = {
//                 no_handphone: cleanNoTelepon,
//                 no_rm : no_rm,
//                 token: cleanTokenMobile,
//                 token_core: cleanTokenCore,
//                 id_jadwal_praktek: body.id_jadwal_praktek,
//                 waktu_registrasi_perjanjian: body.waktu_registrasi_perjanjian,
//                 id_faskes: id_faskes
//             };

//             const response = await api.post("appointment/add", requestBody, {
//                 headers: authHeader(),
//             });
//             return response.data;
//         },
//         onSuccess,
//         onError
//     });
// };

export const UsePostPerjanjianByProfile = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: async (body) => {
      const id_faskes = JSON.parse(localStorage.getItem("selectedFaskesId"));
      const username = localStorage.getItem("username");
      const token_mobile = localStorage.getItem("tokenmobile");
      const token_core = localStorage.getItem("token");

      // Hapus tanda kutip ganda jika ada
      const cleanTokenMobile = token_mobile
        ? token_mobile.replace(/^"|"$/g, "")
        : null;
      const cleanTokenCore = token_core
        ? token_core.replace(/^"|"$/g, "")
        : null;

      const requestBody = {
        username: username,
        no_rm: body.no_rm,
        token: cleanTokenMobile,
        id_jadwal_praktek: body.id_jadwal_praktek,
        waktu_registrasi_perjanjian: body.waktu_registrasi_perjanjian,
        id_faskes: id_faskes,
      };

      const response = await api.post("appointment/add", requestBody, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${cleanTokenCore}`,
        },
      });
      
      // Tambahkan pengecekan tambahan di sini
      if (response.data.data.metadata && response.data.data.metadata.code !== 200) {
        throw new Error(response.data.data.metadata.message);
      }
      
      return response.data;
    },
    onSuccess,
    onError,
  });
};

export const UseDeletePerjanjianByProfile = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: async ({ no_identitas, id }) => {
      const user = await api.delete(
        `appointment/delete-perjanjian?no_identitas=${no_identitas}&id=${id}`,
        {
          headers: authHeader(),
        }
      );
      return user.data;
    },
    onSuccess,
    onError,
  });
};

export const useGetAppointmentStatus = (no_rm) => {
  return useQuery({
    queryKey: ["statusPerjanjian", no_rm],
    queryFn: async () => {
      const id_faskes = JSON.parse(localStorage.getItem("selectedFaskesId"));
      const username = localStorage.getItem("username");
      const token_mobile = localStorage.getItem("tokenmobile");
      const token_core = localStorage.getItem("token");

      // Hapus tanda kutip ganda jika ada
      const cleanTokenMobile = token_mobile
        ? token_mobile.replace(/^"|"$/g, "")
        : null;
      const cleanTokenCore = token_core
        ? token_core.replace(/^"|"$/g, "")
        : null;

      const requestBody = {
        username: username,
        token: cleanTokenMobile,
        no_rm: no_rm,
        id_faskes: id_faskes,
      };

      const response = await api.post(
        "appointment/status-perjanjian",
        requestBody,
        {
          headers: authHeader(),
        }
      );
      return response.data;
    },
    enabled: !!no_rm,
    refetchInterval: 5000,
  });
};

export const useBatalPerjanjian = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const id_faskes = JSON.parse(localStorage.getItem("selectedFaskesId"));
      const username = localStorage.getItem("username");
      const token_mobile = localStorage.getItem("tokenmobile");
      const token_core = localStorage.getItem("token");

      // Remove double quotes if present
      const cleanTokenMobile = token_mobile
        ? token_mobile.replace(/^"|"$/g, "")
        : null;
      const cleanTokenCore = token_core
        ? token_core.replace(/^"|"$/g, "")
        : null;

      const requestBody = {
        username: username,
        id_perjanjian: data.id_perjanjian,
        token: cleanTokenMobile,
        token_core: cleanTokenCore,
        id_faskes: id_faskes,
      };

      const response = await api.post(
        "appointment/batal-perjanjian",
        requestBody,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${cleanTokenCore}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["appointmentStatus"]);
    },
  });
};
