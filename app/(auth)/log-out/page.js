'use client';
import { useLogoutUser } from "@/service/auth.service";

const LogOut = () => {
    useLogoutUser();
}

export default LogOut;
