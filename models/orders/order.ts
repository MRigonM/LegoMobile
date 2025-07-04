import {Address} from "@/models/orders/adress";

export interface OrderDto {
    basketId: string;
    deliveryMethodId: number;
    shipToAddress: Address;
}
