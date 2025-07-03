import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { BasketItem, CustomerBasket } from "@/models/basket/basket";
import { getBasket, updateBasket } from "@/controllers/basket/basketController";

interface BasketContextType {
    basket: CustomerBasket | null;
    addItem: (item: BasketItem) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    isInBasket: (productId: number) => boolean;
}

const BasketContext = createContext<BasketContextType | null>(null);

export const useBasket = (): BasketContextType => {
    const context = useContext(BasketContext);
    if (!context) {
        throw new Error('useBasket must be used within a BasketProvider');
    }
    return context;
};

export const BasketProvider = ({ children }: { children: ReactNode }) => {
    const [basket, setBasket] = useState<CustomerBasket | null>(null);
    const [basketId, setBasketId] = useState<string | null>(null);

    useEffect(() => {
        const loadBasket = async () => {
            const id = await SecureStore.getItemAsync('basket_id');
            if (id) {
                setBasketId(id);
                const basketData = await getBasket(id);
                setBasket(basketData);
            }
        };
        loadBasket();
    }, []);

    const addItem = async (item: BasketItem) => {
        let current = basket ?? { id: basketId ?? generateId(), items: [], shippingPrice: 0 };

        const exists = current.items.find(i => i.id === item.id);
        if (exists) {
            return;
        }

        current.items.push(item);

        const updated = await updateBasket(current);
        setBasket(updated);
        await SecureStore.setItemAsync('basket_id', updated.id);
        setBasketId(updated.id);
    };

    const removeItem = async (productId: number) => {
        if (!basket) return;

        const updatedItems = basket.items.filter(item => item.id !== productId);
        const updatedBasket = { ...basket, items: updatedItems };
        const saved = await updateBasket(updatedBasket);
        setBasket(saved);
    };

    const updateQuantity = async (productId: number, quantity: number) => {
        if (!basket) return;

        const updatedItems = basket.items
            .map(item => item.id === productId ? { ...item, quantity } : item)
            .filter(item => item.quantity > 0);

        const updatedBasket = { ...basket, items: updatedItems };
        const saved = await updateBasket(updatedBasket);
        setBasket(saved);
    };

    const isInBasket = (productId: number) => {
        return basket?.items.some(i => i.id === productId) ?? false;
    };

    const generateId = () => {
        return Math.random().toString(36).substring(2, 15);
    };

    return (
        <BasketContext.Provider value={{ basket, addItem, removeItem, updateQuantity, isInBasket }}>
            {children}
        </BasketContext.Provider>
    );
};