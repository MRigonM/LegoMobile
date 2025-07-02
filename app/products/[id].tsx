import { Image, ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import useFetch from "@/controllers/useFetch";
import { fetchProductDetails } from "@/controllers/product/productController";
import { useCallback } from "react";
import * as Notifications from "expo-notifications";

interface ProductInfo {
    description: string;
    price: number;
}

const Info = ({ description, price }: ProductInfo) => (
    <View className={"flex-col items-start justify-center mt-5 px-5 pb-20"}>
        <Text className={"text-white font-bold text-4xl mb-3"}>
            {price}$
        </Text>
        <Text className={"text-white font-bold text-xs mb-1"}>
            Description:
        </Text>
        <Text className={"text-light-200 font-normal text-sm mb-10"}>
            {description}
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          className="bg-accent absolute bottom-5 left-0 right-0 mx-5 rounded-lg py-3.5 flex flex-row items-center justify-center"
          onPress={() => {
            Notifications.scheduleNotificationAsync({
              content: {
                title: "Purchase Started",
                body: "You clicked Buy Now!",
              },
              trigger: null,
            });
          }}
        >
          <Text className="text-white font-bold text-xl text-center">
            Buy Now
          </Text>
        </TouchableOpacity>
    </View>
);

const ProductDetails = () => {
    const { id } = useLocalSearchParams();

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

    return (
        <View className={"bg-primary flex-1"}>
            <ScrollView
                contentContainerStyle={{
                    paddingBottom: 80,
                }}
            >
                <View>
                    <Image
                        source={{ uri: product.pictureUrl }}
                        className={"w-full h-[450px] mt-20 px-5"}
                        resizeMode="contain"
                    />
                </View>
                <View className={"flex-col items-start justify-center px-5"}>
                    <Text className={"text-white font-bold text-xl"}>{product?.name}</Text>
                    <Text className={"text-light-200 text-sm"}>
                        {product?.productType} • {product?.productBrand}
                    </Text>
                </View>
                <MovieInfo description={product.description} price={product.price} />
            </ScrollView>
        </View>
    );
};

export default ProductDetails;
