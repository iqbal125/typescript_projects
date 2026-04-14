import axios from 'axios';
import { config } from '@/lib/config';

const axiosBase = axios.create({
    baseURL: config.apiUrl,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosBase.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error)) {
            console.error('API request failed', {
                method: error.config?.method?.toUpperCase(),
                url: `${error.config?.baseURL ?? ''}${error.config?.url ?? ''}`,
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
        } else {
            console.error('Unexpected API error', error);
        }

        return Promise.reject(error);
    },
);


export default axiosBase;