import axios from 'axios';

// http://localhost:8000
// Create axios instance with base URL

// const baseURL = 'https://13.53.164.183';
const baseURLAPI = 'https://api.mypathfinder.uk/api';

const baseURL = 'https://api.mypathfinder.uk';

// const baseURL = 'https://deepskyblue-donkey-692108.hostingersite.com';

// const baseURLAPI = 'https://deepskyblue-donkey-692108.hostingersite.com/api';

// const baseURL = 'http://127.0.0.1:8000';
// const baseURLAPI = 'http://127.0.0.1:8000/api';

// const baseURLAPI = 'http://localhost:8000';

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

export default instance;
