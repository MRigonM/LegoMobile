import {ActivityIndicator, FlatList, Image, ScrollView, Text, View} from "react-native";
import {images} from "@/constants/images";
import {icons} from "@/constants/icons";
import SearchBar from "@/components/searchBar";
import { useRouter } from "expo-router";
import {useEffect, useState} from "react";
import {getAllProducts} from "@/services/product/productService";
import {Product} from "@/services/models/product";
import ProductCard from "@/components/ProductCard";

export default function Index() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllProducts()
            .then((res) => {
                console.log("Fetched products:", res);
                setProducts(res);
            })
            .catch((err) => {
                console.error("Error fetching products:", err);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <View className={"flex-1 bg-primary"}>
            <Image source={images.bg}
                   className={"absolute w-full z-0"}/>
            <ScrollView className={"flex-1 px-5"}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            minHeight: '100%',
                            paddingBottom: 10
                        }}>
                <Image source={icons.logo}
                       className={"w-12 h-10 mt-20 mb-5 mx-auto"}/>

                {loading ? (
                        <ActivityIndicator
                            size="large"
                            color="#0000ff"
                            className="mt-10 self-center"
                        />
                    ) : (
                <View className={"flex-1 mt-5"}>
                    <SearchBar
                        onPress={() => router.push("/search")}
                        placeholder = "Search for legos"
                    />

                    <>
                        <Text className={"text-lg text-white font-bold mt-5 mb-3"}>
                            Latest Legos
                        </Text>
                        <FlatList
                            data={products}
                            renderItem={({ item }) => (
                                <ProductCard
                                    {...item}
                                />
                            )}
                            keyExtractor={(item) => item.id.toString()}
                            numColumns={2}
                            columnWrapperStyle={{
                                justifyContent: 'flex-start',
                                gap: 20,
                                paddingRight: 5,
                                paddingBottom: 10
                            }}
                            className={"mt-2 pb-32"}
                            scrollEnabled={false}
                            />
                    </>
                </View>
                    )}
            </ScrollView>
        </View>
    );
}
