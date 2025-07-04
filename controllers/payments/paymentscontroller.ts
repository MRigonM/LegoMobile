import { api } from '@/controllers/api';
import { CustomerBasket } from '@/models/basket/basket';

export async function createOrUpdatePaymentIntent(basketId: string): Promise<CustomerBasket> {
    try {
        const response = await api.post<CustomerBasket>(`/payments/${basketId}`);
        return response.data;
    } catch (error: any) {
        console.error('Error in createOrUpdatePaymentIntent:', error);
        throw error;
    }
}
