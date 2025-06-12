﻿import axios from 'axios';

const API_URL = process.env.API_URL || 'http://192.168.0.28:5000/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
