import { api } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authHeader } from "@/lib";
import { useState, useEffect } from "react";

export const UseAllProfile = () => {
  const username = localStorage.getItem("username");
  const token_core = localStorage.getItem("token");

  const cleanTokenCore = token_core ? token_core.replace(/^"|"$/g, "") : null;

  return useQuery({
    queryKey: ["all-profile", username, cleanTokenCore],
    queryFn: async () => {
      try {
        const response = await api.post("profile/get-all", {
          username: username,
          token_core: cleanTokenCore,
        });
        if (!response.data.success) {
          throw new Error(response.data.message);
        }
        return response.data;
      } catch (error) {
        console.error("Error fetching profiles:", error);
        throw error;
      }
    },
  });
};

export const UseGetProfileByFaskes = () => {
  const [userData, setUserData] = useState({
    username: null,
    token_core: null,
    id_faskes: null,
  });

  useEffect(() => {
    const updateUserData = () => {
      setUserData({
        username: localStorage.getItem("username"),
        token_core: localStorage.getItem("token"),
        id_faskes: JSON.parse(localStorage.getItem("selectedFaskesId")),
      });
    };

    updateUserData();

    window.addEventListener("storage", updateUserData);

    return () => {
      window.removeEventListener("storage", updateUserData);
    };
  }, []);

  const cleanTokenCore = userData.token_core
    ? userData.token_core.replace(/^"|"$/g, "")
    : null;

  const query = useQuery({
    queryKey: [
      "Profil-By-Faskes",
      userData.username,
      cleanTokenCore,
      userData.id_faskes,
    ],
    queryFn: async () => {
      if (!userData.username || !cleanTokenCore || !userData.id_faskes) {
        throw new Error("Missing required data");
      }

      try {
        const response = await api.post(
          `profile/get-by-faskes?faskes_id=${userData.id_faskes}`,
          {
            username: userData.username,
          },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${cleanTokenCore}`,
            },
          }
        );

        if (response.data.code !== 200) {
          throw new Error(response.data.message || "Failed to fetch profiles");
        }

        console.log("Response:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching profiles:", error);
        throw error;
      }
    },
    enabled: false, // This prevents the query from running automatically
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return {
    ...query,
    refetch: query.refetch,
  };
};

export const usePendingApproval = () => {
  const [userData, setUserData] = useState({
    username: null,
    token_core: null,
  });

  useEffect(() => {
    const updateUserData = () => {
      setUserData({
        username: localStorage.getItem("username"),
        token_core: localStorage.getItem("token"),
      });
    };

    updateUserData();

    window.addEventListener("storage", updateUserData);

    return () => {
      window.removeEventListener("storage", updateUserData);
    };
  }, []);

  const cleanTokenCore = userData.token_core
    ? userData.token_core.replace(/^"|"$/g, "")
    : null;

  const query = useQuery({
    queryKey: ["PendingApproval", userData.username, cleanTokenCore],
    queryFn: async () => {
      if (!userData.username || !cleanTokenCore) {
        throw new Error("Missing required data");
      }

      try {
        const response = await api.post(
          "profile/get-all/pending-approval",
          {
            username: userData.username,
          },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${cleanTokenCore}`,
            },
          }
        );
        if (response.data.code !== 200) {
          throw new Error(response.data.message);
        }
        return response.data;
      } catch (error) {
        console.error("Error fetching profiles:", error);
        throw error;
      }
    },
    enabled: false, // This prevents the query from running automatically
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return {
    ...query,
    refetch: query.refetch,
  };
};

export const UseDetailProfile = (id) => {
  const username = localStorage.getItem("username");
  const token_core = localStorage.getItem("token");

  const cleanTokenCore = token_core ? token_core.replace(/^"|"$/g, "") : null;

  return useQuery({
    queryKey: ["detail-profile", id, username, cleanTokenCore],
    queryFn: async () => {
      if (!id) {
        throw new Error("Profile ID is required");
      }
      if (!username) {
        throw new Error("Authentication data is missing");
      }
      try {
        const response = await api.post(
          `profile/get-by-id?id=${id}`,
          {
            username: username,
          },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${cleanTokenCore}`,
            },
          }
        );
        if (!response.data || response.data.code !== 200) {
          throw new Error(
            response.data?.message || "Failed to fetch profile data"
          );
        }
        return response.data.data; // Langsung mengembalikan data profil
      } catch (error) {
        console.error("Error fetching profile:", error);
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "An error occurred while fetching the profile"
        );
      }
    },
  });
};

export const UseGetProfilePasienByNik = (nik, type) => {
  const [userData, setUserData] = useState({
    username: null,
    token_core: null,
    id_faskes: null,
  });

  useEffect(() => {
    // Access localStorage only on the client side
    setUserData({
      username: localStorage.getItem("username"),
      token_core: localStorage.getItem("token"),
      id_faskes: JSON.parse(localStorage.getItem("selectedFaskesId")),
    });
  }, []);

  const cleanTokenCore = userData.token_core
    ? userData.token_core.replace(/^"|"$/g, "")
    : null;

  return useQuery({
    queryKey: ["get-by-nik", nik, type, userData.username, cleanTokenCore],
    queryFn: async () => {
      try {
        const response = await api.post(
          `profile/tautkan/cari-pasien?nik=${nik}&type=${type}`,
          {
            faskes_id: userData.id_faskes,
            username: userData.username,
            token_core: cleanTokenCore,
          },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${cleanTokenCore}`,
            },
          }
        );
        if (!response.data.success) {
          throw new Error(response.data.message);
        }
        return response.data;
      } catch (error) {
        console.error("Error fetching profiles:", error);
        throw error;
      }
    },
    enabled:
      !!nik && !!userData.username && !!cleanTokenCore && !!userData.id_faskes,
  });
};

export const UsePostProfilePasien = (nik, type, options = {}) => {
  const [userData, setUserData] = useState({
    token_core: null,
    id_faskes: null,
  });

  useEffect(() => {
    // Access localStorage only on the client side
    setUserData({
      token_core: localStorage.getItem("token"),
      id_faskes: JSON.parse(localStorage.getItem("selectedFaskesId")),
    });
  }, []);

  const cleanTokenCore = userData.token_core
    ? userData.token_core.replace(/^"|"$/g, "")
    : null;

  return useMutation({
    mutationFn: async () => {
      try {
        const body = {
          faskes_id: userData.id_faskes,
          nik: nik,
          type: type,
          token_core: cleanTokenCore,
        };

        const response = await api.post("profile/tautkan", body, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${cleanTokenCore}`,
          },
        });

        if (response.data && response.data.success) {
          return response.data;
        } else {
          throw new Error(
            response.data.message || "Gagal menambahkan profil pasien"
          );
        }
      } catch (error) {
        throw (
          error.response?.data ||
          error.message ||
          "Terjadi kesalahan saat menambahkan profil pasien"
        );
      }
    },
    onSuccess: (data) => {
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      if (options.onError) {
        options.onError(error);
      }
    },
  });
};

export const useCheckStatusPasien = (nik) => {
  const [userData, setUserData] = useState({
    username: null,
    token_core: null,
    id_faskes: null,
  });

  useEffect(() => {
    // Access localStorage only on the client side
    setUserData({
      username: localStorage.getItem("username"),
      token_core: localStorage.getItem("token"),
      id_faskes: JSON.parse(localStorage.getItem("selectedFaskesId")),
    });
  }, []);

  const cleanTokenCore = userData.token_core
    ? userData.token_core.replace(/^"|"$/g, "")
    : null;

  return useQuery({
    queryKey: [
      "check-status-pasien",
      nik,
      userData.id_faskes,
      userData.username,
      cleanTokenCore,
    ],
    queryFn: async () => {
      try {
        const response = await api.post(
          "profile/tautkan/check-status-pasien",
          {
            faskes_id: userData.id_faskes,
            nik: nik,
            username: userData.username,
          },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${cleanTokenCore}`,
            },
          }
        );

        if (!response.data.success) {
          throw new Error(
            response.data.data.message || "Error checking patient status"
          );
        }

        return response.data.data;
      } catch (error) {
        console.error("Error checking patient status:", error);
        throw error;
      }
    },
    enabled:
      !!nik && !!userData.id_faskes && !!userData.username && !!cleanTokenCore,
  });
};

export const useTambahPasienBaru = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (patientData) => {
      const faskesId = localStorage.getItem("selectedFaskesId");
      const token_core = localStorage.getItem("token");
      const cleanTokenCore = token_core
        ? token_core.replace(/^"|"$/g, "")
        : null;

      const payload = {
        faskes_id: faskesId,
        nik: patientData.nik,
        nama_lengkap: patientData.nama_lengkap,
        jenis_kelamin: patientData.jenis_kelamin,
        tempat_lahir: patientData.tempat_lahir,
        tanggal_lahir: patientData.tanggal_lahir,
        alamat: patientData.alamat,
        ktp: patientData.ktp,
      };

      try {
        const response = await api.post(
          "profile/tautkan/tambah-pasien-baru",
          payload,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${cleanTokenCore}`,
            },
          }
        );

        console.log("testing gila" + response.data);

        if (response.data.error) {
          throw new Error(
            response.data.details.metadata.message ||
              "Failed to add new patient"
          );
        }

        return response.data;
      } catch (error) {
        console.error("Error adding new patient:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Add patient success:", data);
      queryClient.invalidateQueries("patients"); // Adjust this to your query key
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      console.error("Add patient error:", error);
      if (options.onError) {
        options.onError(error.message || "Failed to add new patient");
      }
    },
  });
};

export const useUpdateStatusPasien = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nik) => {
      const token_core = localStorage.getItem("token");
      const faskes_id = localStorage.getItem("selectedFaskesId");
      const username = localStorage.getItem("username");

      console.log("Token from localStorage:", token_core);
      console.log("Faskes ID:", faskes_id);
      console.log("Username:", username);

      const cleanTokenCore = token_core
        ? token_core.replace(/^"|"$/g, "")
        : null;
      console.log("Cleaned token:", cleanTokenCore);

      const payload = {
        faskes_id: faskes_id,
        username: username,
        nik: nik,
      };

      try {
        console.log("Sending update status request with headers:", {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${cleanTokenCore}`,
        });

        const response = await api.post(
          "profile/tautkan/update-status-pasien",
          payload,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${cleanTokenCore}`,
            },
          }
        );

        console.log("Update status response:", response);

        if (!response.data.success) {
          throw new Error(
            response.data.message || "Failed to update patient status"
          );
        }

        return response.data;
      } catch (error) {
        console.error(
          "Error details:",
          error.response ? error.response.data : error
        );
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Update patient status success:", data);
      queryClient.invalidateQueries("patients");
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      console.error("Update patient status error:", error);
      if (options.onError) {
        options.onError(error.message || "Failed to update patient status");
      }
    },
  });
};

export const UseOneProfile = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: async (body) => {
      const user = await api.post("auth/register", body);
      return user.data;
    },
    onSuccess,
    onError,
  });
};

export const UseDeleteProfile = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }) => {
      const username = localStorage.getItem("username");
      const token_core = localStorage.getItem("token");

      const cleanTokenCore = token_core
        ? token_core.replace(/^"|"$/g, "")
        : null;

      try {
        const response = await api.post(
          "profile/remove",
          {
            username: username,
            id: id,
          },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${cleanTokenCore}`,
            },
          }
        );

        if (!response.data.success && response.data.code !== 200) {
          throw new Error(response.data.message);
        }

        return response.data;
      } catch (error) {
        console.error("Error removing profile:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Delete success:", data);
      queryClient.invalidateQueries("all-profile");
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      console.error("Delete error:", error);
      if (options.onError) {
        options.onError(error.message || "Gagal menghapus profil");
      }
    },
  });
};
