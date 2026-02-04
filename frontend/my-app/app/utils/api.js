import axios from "axios";

const API = axios.create({
  baseURL: "https://event-management-905w.onrender.com",
  withCredentials: true, // IMPORTANT (sends cookies)
});

// ❌ Remove token interceptor (you don't use Bearer tokens)
export default API;
