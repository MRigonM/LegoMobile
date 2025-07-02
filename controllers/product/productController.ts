import { api } from "@/controllers/api";
import {Product} from "@/models/product/product";

const LOCAL_IP = "http://192.168.0.29:5000";
const API_URL = process.env.API_URL || 'http://192.168.0.29:5000/api';

interface ProductQueryParams {
    pageIndex?: number;
    pageSize?: number;
    brandId?: number;
    typeId?: number;
    sort?: string;
    search?: string;
}

export const getAllProducts = async (params: ProductQueryParams = {}) => {
    try {
        const response = await api.get("/products", { params });

        const pagination = response.data;

        const updatedData = pagination.data.map((product: any) => ({
            ...product,
            pictureUrl: product.pictureUrl.replace("https://localhost:5001", LOCAL_IP),
        }));

        return {
            ...pagination,
            data: updatedData,
        };
    } catch (error: any) {
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
        throw error;
    }
};

export const fetchProductDetails = async (id: string): Promise<Product> => {
    try {
        const response = await fetch(`${API_URL}/products/${id}`);
        if (!response.ok) throw new Error("No product found");

        const data = await response.json();

        if (data.pictureUrl) {
            data.pictureUrl = data.pictureUrl.replace("https://localhost:5001", "http://192.168.0.29:5000");
        }

        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const getProductBrands = async () => {
    const response = await api.get("/products/brands");
    return response.data;
};

export const getProductTypes = async () => {
    const response = await api.get("/products/types");
    return response.data;
};

