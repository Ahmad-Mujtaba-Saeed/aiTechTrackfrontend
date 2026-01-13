import axios from 'axios';

// const baseURLAPI = 'https://slateblue-snake-907020.hostingersite.com/api';

// const baseURL = 'https://13.53.164.183';
// const baseURLAPI = 'https://slateblue-snake-907020.hostingersite.com/api';

const baseURL = 'http://72.62.194.87:8080';

const baseURLAPI = 'http://72.62.194.87:8080/api';

// const baseURL = 'http://127.0.0.1:8085';
// const baseURLAPI = 'http://127.0.0.1:8085/api';

// const baseURLAPI = 'http://localhost:8000/api';
// const baseURL = 'http://localhost:8000';






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
