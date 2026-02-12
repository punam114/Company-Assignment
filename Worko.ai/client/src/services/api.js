import axios from "axios";

const API = axios.create({
  baseURL: "https://company-assignment-1-mf6q.onrender.com/api"
});

API.interceptors.request.use(req => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;