import { OrderDto } from '@/models/orders/order';
import api from '../api';

export const createOrder = async (orderDto: OrderDto) => {
    const response = await api.post('/orders', orderDto);
    return response.data;
};

export const getUserOrders = async () => {
    const response = await api.get('/orders');
    return response.data;
};

export const getDeliveryMethods = async () => {
    const response = await api.get('/orders/deliveryMethods');
    return response.data;
};

