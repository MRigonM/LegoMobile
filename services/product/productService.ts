import { api } from "@/services/api";

const LOCAL_IP = "http://192.168.0.28:5000";

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
