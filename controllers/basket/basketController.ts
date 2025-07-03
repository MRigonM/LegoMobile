import axios from 'axios';

const API_URL = process.env.API_URL || 'http://192.168.0.29:5000/api';
const BASE_URL = `${API_URL}/basket`;

export const getBasket = async (id: string) => {
    const response = await axios.get(`${BASE_URL}?id=${id}`);
    return response.data;
};

export const updateBasket = async (basket: any) => {
    const response = await axios.post(BASE_URL, basket);
    return response.data;
};

export const deleteBasket = async (id: string) => {
    await axios.delete(`${BASE_URL}?id=${id}`);
};
