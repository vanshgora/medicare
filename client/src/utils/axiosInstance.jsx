import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.REACT_APP_API_URL || "http://localhost:5000/api/v1"}`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export default axiosInstance;
