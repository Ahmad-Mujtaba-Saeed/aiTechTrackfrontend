import axios from 'axios';

const baseURL = 'https://cv-api.wasimdev.com';
const baseURLAPI = 'https://cv-api.wasimdev.com/api';

// const baseURL = 'http://localhost:8000';
// const baseURLAPI = 'http://localhost:8000/api';

const stripe_pub_key = "pk_live_51SGKUzRsDMWvnk1JRPvPMqDUenPSYHKNAoCRKPiuGmcEnTLVgBicJ22OaAMtiJXlrSJA3mE9CNJOjEzWixyPvlZ000YhO6ZDRD"
const instance = axios.create({
    baseURL: baseURLAPI,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status == 401) {
            localStorage.removeItem('access_token');
        }
        return Promise.reject(error);
    }
);

export const baseUrl = baseURL;
export const stripe_public_key = stripe_pub_key;
export default instance;
