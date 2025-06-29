﻿import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.API_URL || 'http://192.168.0.29:5000/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('jwt_token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
