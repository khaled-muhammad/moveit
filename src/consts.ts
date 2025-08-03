import axios from "axios";
import toast from "react-hot-toast";

export const API_BASE_URL = "/api";

// http instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log("From interceptor:")
    console.log(error.response.data)
    console.log("=============")
    if (error.response?.status === 401 && !originalRequest._retry && error.response?.data.detail != "Invalid credentials.") {
      originalRequest._retry = true;
      
      try {
        const refreshResponse = await api.post('/auth/refresh/', {}, {
          withCredentials: true,
          headers: { ...originalRequest.headers }
        });

        if (refreshResponse.data.success) {
          try {
            const userResponse = await api.get('/auth/me', {
              withCredentials: true
            });
            
            if (userResponse.data.user) {
              window.dispatchEvent(new CustomEvent('tokenRefreshed', {
                detail: { user: userResponse.data.user }
              }));
            }
          } catch (userError) {
            console.error('Failed to fetch user data after token refresh:', userError);
          }
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        if (originalRequest.url !== '/auth/me') {
          window.dispatchEvent(new CustomEvent('authLogout'));
          toast.error('Session expired. Please login again.');
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;