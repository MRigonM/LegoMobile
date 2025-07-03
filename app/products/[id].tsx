import { Image, ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import useFetch from "@/controllers/useFetch";
import { fetchProductDetails } from "@/controllers/product/productController";
import { useCallback } from "react";
import * as Notifications from "expo-notifications";
import { useBasket } from "@/context/basketContext";

interface ProductInfo {
    description: string;
    price: number;
    onToggleCart: () => void;
    alreadyInBasket: boolean;
}

const Info = ({ description, price, onToggleCart, alreadyInBasket }: ProductInfo) => (
    <View className={"flex-col items-start justify-center mt-5 px-5 pb-20"}>
        <Text className={"text-white font-bold text-3xl mb-3"}>{price}$</Text>
        <Text className={"text-white font-bold text-xs mb-1"}>Description:</Text>
        <Text className={"text-light-200 font-normal text-sm mb-10"}>{description}</Text>

        <TouchableOpacity
            activeOpacity={0.8}
            className={`${
                alreadyInBasket ? 'bg-red-600' : 'bg-accent'
            } absolute bottom-5 left-0 right-0 mx-5 rounded-lg py-3.5 flex flex-row items-center justify-center`}
            onPress={onToggleCart}
        >
            <Text className="text-white font-bold text-xl text-center">
                {alreadyInBasket ? 'Remove from Cart' : 'Add to Cart'}
            </Text>
        </TouchableOpacity>
    </View>
);

const ProductDetails = () => {
    const { id } = useLocalSearchParams();
    const { addItem, removeItem, isInBasket } = useBasket();

    const fetchFn = useCallback(() => {
        return fetchProductDetails(id as string);
    }, [id]);

    const { data: product, loading, error } = useFetch(fetchFn);

    if (loading) {
        return (
            <View className="bg-primary flex-1 justify-center items-center">
                <Text className="text-white">Loading product...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="bg-primary flex-1 justify-center items-center">
                <Text className="text-red-500">Error loading product.</Text>
            </View>
        );
    }

    if (!product) {
        return (
            <View className="bg-primary flex-1 justify-center items-center">
                <Text className="text-white">No product found.</Text>
            </View>
        );
    }

    const alreadyInBasket = isInBasket(product.id);

    const handleToggleCart = () => {
        if (alreadyInBasket) {
            Alert.alert(
                "Remove from Cart",
                `Are you sure you want to remove ${product.name} from your Cart?`,
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Remove",
                        style: "destructive",
                        onPress: () => {
                            removeItem(product.id);
                            Notifications.scheduleNotificationAsync({
                                content: {
                                    title: "Removed from Basket 🛒",
                                    body: `${product.name} was removed from your basket.`,
                                },
                                trigger: null,
                            });
                        },
                    },
                ]
            );
        } else {
            addItem({
                id: product.id,
                productName: product.name,
                price: product.price,
                quantity: 1,
                pictureUrl: product.pictureUrl,
                brand: product.productBrand,
                type: product.productType,
            });

            Notifications.scheduleNotificationAsync({
                content: {
                    title: "Added to Basket 🛒",
                    body: `${product.name} has been added to your basket.`,
                },
                trigger: null,
            });
        }
    };

    return (
        <View className={"bg-primary flex-1"}>
            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                <View>
                    <Image
                        source={{ uri: product.pictureUrl }}
                        className={"w-full h-[450px] mt-20 px-5 mx-3"}
                        resizeMode="contain"
                    />
                </View>

                <View className={"flex-col items-start justify-center px-5"}>
                    <Text className={"text-white font-bold text-4xl"}>{product.name}</Text>
                    <Text className={"text-light-200 text-sm"}>
                        {product.productType} • {product.productBrand}
                    </Text>
                </View>

                <Info
                    description={product.description}
                    price={product.price}
                    onToggleCart={handleToggleCart}
                    alreadyInBasket={alreadyInBasket}
                />
            </ScrollView>
        </View>
    );
};

export default ProductDetails;