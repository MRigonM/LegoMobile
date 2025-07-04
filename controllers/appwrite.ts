//track searches made by a user

import {Product} from "@/models/product/product";
import {Client, Databases, ID, Query} from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)

const database = new Databases(client)


export const updataeSearchCount = async (query: string, product: Product) => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', query),
            Query.equal('product_id', product.id)
        ])

        if (result.documents.length > 0) {
            const existingProduct = result.documents[0];

            await database.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                existingProduct.$id,
                {
                    count: existingProduct.count + 1,
                }
            )
        } else {
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm: query,
                product_id: product.id,
                count: 1,
                name: product.name,
                pictureUrl: product.pictureUrl,
            })
        }
    } catch (error) {
        throw error;
    }
}
export const getTrendingProducts = async (): Promise<{ id: any; name: any; pictureUrl: any }[]> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc("count"),
        ]);

        return result.documents.map((doc) => ({
          id: doc.$id,
          name: doc.name,
          pictureUrl: doc.pictureUrl,
          product_id: doc.product_id,
        }));

    } catch (error) {
        throw error;
    }
};
