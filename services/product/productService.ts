import { api } from "@/services/api";
import {Product} from "@/services/product/models/product";

const LOCAL_IP = "http://192.168.0.28:5000";
const API_URL = process.env.API_URL || 'http://192.168.0.28:5000/api';

export const getAllProducts = async () => {
    try {
        const response = await api.get("/products");

        const updated = response.data.data.map((product: any) => ({
            ...product,
            pictureUrl: product.pictureUrl.replace("https://localhost:5001", LOCAL_IP),
        }));

        return updated;
    } catch (error: any) {
        console.error("Error fetching all products:", error.message);
        throw error;
    }
};

export const searchProducts = async ({ query }: { query: string }) => {
    try {
        const response = await api.get("/products", {
            params: { search: query },
        });

        const updated = response.data.data.map((product: any) => ({
            ...product,
            pictureUrl: product.pictureUrl.replace("https://localhost:5001", LOCAL_IP),
        }));

        return updated;
    } catch (error: any) {
        console.error("Error searching products:", error.message);
        throw error;
    }
};

export const fetchProductDetails = async (id: string): Promise<Product> => {
    try {
        const response = await fetch(`${API_URL}/products/${id}`);
        if (!response.ok) throw new Error("No product found");

        const data = await response.json();

        if (data.pictureUrl) {
            data.pictureUrl = data.pictureUrl.replace("https://localhost:5001", "http://192.168.0.28:5000");
        }

        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};
