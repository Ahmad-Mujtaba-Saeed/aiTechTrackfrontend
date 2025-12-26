import axios from 'axios';

// http://localhost:8000
// Create axios instance with base URL

// const baseURL = 'https://13.53.164.183';
const baseURL = 'https://api.mypathfinder.uk';
// const baseURL = 'https://deepskyblue-donkey-692108.hostingersite.com';
// const baseURL = 'http://127.0.0.1:8000';

// const stripe_pub_key = "pk_test_51SGKV9RuRqBB6Uo7RFntsqpgXeeLXkiNz3eGUk3wBjyH74RUT0ANQcksH9RVQu4VlTYdhcl1wdrdOOzDx7Ard4v600ycCSFkEa"

const stripe_pub_key = "pk_live_51SGKUzRsDMWvnk1JRPvPMqDUenPSYHKNAoCRKPiuGmcEnTLVgBicJ22OaAMtiJXlrSJA3mE9CNJOjEzWixyPvlZ000YhO6ZDRD"

// const baseURL = 'https://deepskyblue-donkey-692108.hostingersite.com';
// const baseURL = 'http://localhost:8000';

const instance = axios.create({
    baseURL: baseURL,
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
        // Don't set Content-Type for FormData, let the browser set it with the correct boundary
        if (!(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        } else {
            delete config.headers['Content-Type'];
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
        if (error.response?.status === 401) {
            localStorage.removeItem('access_token');
        }
        return Promise.reject(error);
    }
);

export const baseUrl = baseURL;
export const stripe_public_key = stripe_pub_key;
export default instance;
