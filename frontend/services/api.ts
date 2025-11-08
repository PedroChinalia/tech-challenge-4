import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000" // ou o IP da máquina, se testar no celular físico
});

export default api;
