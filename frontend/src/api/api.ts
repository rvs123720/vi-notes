import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://vi-notes-4-7ic7.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (req) => {
    // Check both common naming conventions to be safe
    const token = localStorage.getItem("token");
    const profile = localStorage.getItem("profile");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    } else if (profile) {
      const parsed = JSON.parse(profile);
      req.headers.Authorization = `Bearer ${parsed.token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

export default API;
