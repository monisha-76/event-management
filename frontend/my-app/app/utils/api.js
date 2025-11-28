import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // IMPORTANT (sends cookies)
});

// ❌ Remove token interceptor (you don't use Bearer tokens)
export default API;
