import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8001";
export const API = `${BACKEND_URL}/api`;

export const generateDream = async (topic) => {
  const { data } = await axios.post(`${API}/generate`, { topic });
  return data;
};

export const fetchHistory = async () => {
  const { data } = await axios.get(`${API}/history`);
  return data;
};

export const deleteDream = async (id) => {
  const { data } = await axios.get(`${API}/history/${id}`);
  return data;
};
