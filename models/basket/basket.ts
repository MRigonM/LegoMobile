export interface BasketItem {
    id: number;
    productName: string;
    price: number;
    quantity: number;
    pictureUrl: string;
    brand: string;
    type: string;
}

export interface CustomerBasket {
    id: string;
    items: BasketItem[];
    deliveryMethodId?: number;
    clientSecret?: string;
    paymentIntentId?: string;
    shippingPrice: number;
}
