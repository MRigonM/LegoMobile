import {FlatList, Image, Text, View} from "react-native";
import {images} from "@/constants/images";
import ProductCard from "@/components/ProductCard";
import {useRouter} from "expo-router";
import {useEffect, useState} from "react";
import {Product} from "@/services/models/product";
import {getAllProducts} from "@/services/product/productService";
import {icons} from "@/constants/icons";
import SearchBar from "@/components/searchBar";

const Search = () => {
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
                   className={"flex-1 absolute w-full z-0"}
                   resizeMode={"cover"}
                   />
            <FlatList 
                data={products}
                renderItem={({ item }) => (
                    <ProductCard { ...item} />
                )}
                keyExtractor={(item) => item.id.toString()}
                className={"px-5"}
                numColumns={2}
                columnWrapperStyle={{
                    justifyContent: 'center',
                    gap: 16,
                    marginVertical: 16
                }}
                contentContainerStyle={{ paddingBottom: 100}}
                ListHeaderComponent={
                <>
                    <View className={"w-full flex-row justify-self-center mt-20 items-center"}>
                        <Image source={icons.logo}
                               className={"w-12 h-10"}
                        />
                    </View>
                    <View className={"my-5"}>
                        <SearchBar placeholder={"Search legos..."} />
                    </View>
                    {!loading && 'SEARCH TERM'.trim() && products?.length >0
                    && (
                        <Text className={"text-xl text-white font-bold"}>
                            Search Results for {' '}
                            <Text className={"text-accent"}>SEARCH TERM</Text>
                        </Text>
                        )}
                </>
                }
                />
        </View>
    )
}
export default Search
