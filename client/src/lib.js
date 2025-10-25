import axios from 'axios'
const API = 'https://mern-food-delivery-app-u315.onrender.com/api';

export const api = axios.create({ baseURL: API })

export const getToken = () => localStorage.getItem('token')
export const setToken = (t) => localStorage.setItem('token', t)
export const clearToken = () => localStorage.removeItem('token')

api.interceptors.request.use(cfg => {
  const t = getToken()
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})
