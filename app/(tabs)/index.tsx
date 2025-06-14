import {ActivityIndicator, FlatList, Image, ScrollView, Text, View, Keyboard} from "react-native";
import {useCallback, useEffect, useState} from "react";
import {useFocusEffect, useNavigation, useRouter} from "expo-router";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import SearchBar from "@/components/searchBar";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/services/product/models/product";
import { getAllProducts, searchProducts } from "@/services/product/productService";
import {getTrendingProducts, updataeSearchCount} from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import TrendingCard from "@/components/TrendingCard";

export default function Index() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState<null | Error>(null);
    const [submittedQuery, setSubmittedQuery] = useState("");
    const navigation = useNavigation();

    const handleRefresh = async () => {
        setLoading(true);
        try {
            const result = await getAllProducts();
            setProducts(result);
            setSubmittedQuery("");
            setSearchQuery("");
            setFilteredProducts([]);
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            // @ts-ignore
            const unsubscribe = navigation.addListener("tabPress", (e) => {
                if (navigation.isFocused()) {
                    handleRefresh();
                }
            });

            return unsubscribe;
        }, [navigation])
    );
    const {
        data: trendingProducts,
        loading: trendingLoading,
        error: trendingError,
    } = useFetch(getTrendingProducts)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await getAllProducts();
                setProducts(result);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!submittedQuery.trim()) {
                setFilteredProducts([]);
                return;
            }

            setSearching(true);
            try {
                const results = await searchProducts({ query: submittedQuery });
                setFilteredProducts(results);

                if (results?.length > 0) {
                    updataeSearchCount(submittedQuery, results[0]).catch(console.error);
                }
            } catch (err: any) {
                console.error("Search failed:", err.message);
            } finally {
                setSearching(false);
            }
        };

        fetchSearchResults();
    }, [submittedQuery]);

    const handleSearchSubmit = () => {
        Keyboard.dismiss();
        setSubmittedQuery(searchQuery);
    };


    return (
        <View className="flex-1 bg-primary">
            <Image source={images.bg} className="absolute w-full z-0" resizeMode="cover" />
            <ScrollView
                className="flex-1 px-5"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
            >
                <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" />
                ) : error ? (
                    <Text className="text-red-500 mt-10 text-center">Error: {error.message}</Text>
                ) : (
                    <View className="flex-1 mt-5">
                        <SearchBar
                            placeholder="Search for legos"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearchSubmit}

                        />

                        {submittedQuery.trim() && (
                            <Text className="text-white text-base mt-4">
                                Search Results for <Text className="text-accent">{submittedQuery}</Text>
                            </Text>
                        )}

                        {!submittedQuery && (
                            <View>
                                {trendingProducts && (
                                    <View className="mt-10">
                                        <Text className="text-lg text-white font-bold mb-3">
                                            Trending Legos
                                        </Text>
                                    </View>
                                )}

                                {Array.isArray(trendingProducts) && trendingProducts.length > 0 && (
                                    <FlatList
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        className="mb-4 mt-3"
                                        data={trendingProducts}
                                        contentContainerStyle={{
                                            paddingHorizontal: 4,
                                        }
                                        }
                                        keyExtractor={(item) =>
                                            item.id?.toString()
                                        }
                                        ItemSeparatorComponent={() => <View className={"w-2"} />}
                                        renderItem={({ item, index }) => (
                                            <TrendingCard key={item.id ?? index}  product={item} index={index} />
                                        )}
                                    />
                                )}

                                <Text className="text-lg text-white font-bold mt-5 mb-3">
                                    Latest Legos
                                </Text>
                            </View>
                        )}

                        {searching ? (
                            <ActivityIndicator size="small" color="#00f" className="mt-4" />
                        ) : (
                            <FlatList
                                data={submittedQuery.trim() ? filteredProducts : products}
                                renderItem={({ item }) => <ProductCard {...item} />}
                                keyExtractor={(item) => item.id.toString()}
                                numColumns={2}
                                columnWrapperStyle={{
                                    justifyContent: "flex-start",
                                    gap: 20,
                                    paddingRight: 5,
                                    marginBottom: 10,
                                }}
                                className="mt-4 pb-32"
                                scrollEnabled={false}
                            />
                        )}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
