import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export const useAuthLogin = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: async (body) => {
      try {
        const response = await api.post("akun/login/login", body);
        console.log("Login response:", response);

        const { status, message, data } = response.data;

        if (status === "success" && data) {
          const { access_token, username } = data;
          console.log("Username:", username);

          if (access_token) {
            localStorage.setItem("token", access_token);
          }

          return { status, message, data };
        } else {
          throw new Error(message || "Login gagal");
        }
      } catch (error) {
        console.error("Login error:", error.response || error);
        throw error;
      }
    },
    onSuccess,
    onError: (error) => {
      console.error("Mutation error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Terjadi Kesalahan!";
      onError(errorMessage);
    },
  });
};

export const useKlinikLogin = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: async (body) => {
      try {
        const response = await api.post("akun/login/klinik-login", body);
        console.log("Klinik login response:", response);

        const { status, message, data } = response.data;

        if (status === "success" && data && data.response) {
          const token = data.response.token;
          console.log("Token:", token);

          if (token) {
            localStorage.setItem("tokenmobile", token);
          }

          return { status, message, data };
        } else {
          throw new Error(message || "Klinik login gagal");
        }
      } catch (error) {
        console.error("Klinik login error:", error.response || error);
        throw error;
      }
    },
    onSuccess,
    onError: (error) => {
      console.error("Mutation error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Terjadi Kesalahan!";
      onError(errorMessage);
    },
  });
};

export const UseAuthRegister = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: async (body) => {
      const user = await api.post("akun/registrasi/create", body);
      return user.data;
    },
    onSuccess,
    onError,
  });
};

export const UseAuthForgotPassword = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: async (body) => {
      const response = await api.post(
        "akun/forget-password/request-password-reset",
        body
      );
      return response.data;
    },
    onSuccess,
    onError,
  });
};

export const UseAuthResetPassword = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: async (body) => {
      const response = await api.post(
        "akun/forget-password/reset-password",
        JSON.stringify(body),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess,
    onError,
  });
};

export const UseGetIsUser = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    // console.log("ini token" + token);
    return token;
  }
};

export const isTokenValid = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      // console.log("token ada");

      return true;
    }
    // console.log("gada token");
    return false;
  }
};

export const useAuthenticatedRequest = (isValid) => {
  const router = useRouter();
  useEffect(() => {
    if (!isValid) {
      console.log("is valid: " + isValid);
      // Tampilkan toast error
      toast.error("Anda harus login terlebih dahulu.", {
        position: "top-center",
        autoClose: 3000, // Toast akan muncul selama 3 detik
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
  }, [isValid, router]);
};

export const checkUserAuthentication = () => {
  const isUser = UseGetIsUser();
  const isValidToken = isTokenValid();
  const isAuthenticated = { isUser: isUser, isValid: isValidToken };
  return isAuthenticated;
};

export const useLogoutUser = () => {
  const router = useRouter();
  useEffect(() => {
    localStorage.removeItem("token");
    toast.success("Anda berhasil keluar dari aplikasi.");
    router.push("/login");
  }, []);
};
