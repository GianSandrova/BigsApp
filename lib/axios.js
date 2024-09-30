import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_LINK_API_URL,
});