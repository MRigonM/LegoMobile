import {OrderItemDto} from "@/ViewModels/orders/orderItem";

export interface OrderDtoSimple {
    id: number;
    orderDate: string;
    orderItems: OrderItemDto[];
}