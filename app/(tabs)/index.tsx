import {ActivityIndicator, FlatList, Image, ScrollView, Text, View, Keyboard, TouchableOpacity} from "react-native";
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

    const [pageIndex, setPageIndex] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 6;
    const totalPages = Math.ceil(totalCount / pageSize);

    const [selectedBrand, setSelectedBrand] = useState<number | undefined>();
    const [selectedType, setSelectedType] = useState<number | undefined>();
    const [selectedSort, setSelectedSort] = useState<string>("name");

    const handleRefresh = async () => {
        setLoading(true);
        try {
            const result = await getAllProducts({
                pageIndex,
                pageSize,
                sort: "priceAsc", // or "priceDesc", "name", etc.
                brandId: undefined,
                typeId: undefined,
            });
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
                setLoading(true);
                const result = await getAllProducts({ pageIndex, pageSize });
                setProducts(result.data);
                setTotalCount(result.count);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [pageIndex]);

    const fetchNextPage = async () => {
        if (products.length >= totalCount) return; // No more products

        try {
            const nextPage = pageIndex + 1;
            const result = await getAllProducts({ pageIndex: nextPage, pageSize });
            setProducts((prev) => [...prev, ...result.data]);
            setPageIndex(nextPage);
        } catch (err) {
            console.error("Pagination fetch failed:", err);
        }
    };

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


    // @ts-ignore
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
                                            //@ts-ignore
                                            <TrendingCard product={item} index={index} />
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
                                className="mt-4"
                                scrollEnabled={false}
                                ListFooterComponent={
                                    <View className="mb-28 mt-5 flex-row justify-center items-center px-5">
                                        <TouchableOpacity
                                            disabled={pageIndex === 1}
                                            onPress={() => pageIndex > 1 && setPageIndex(pageIndex - 1)}
                                            activeOpacity={0.8}
                                            className={`rounded-lg px-4 py-2 mr-3 ${
                                                pageIndex === 1 ? "bg-gray-500" : "bg-accent"
                                            }`}
                                        >
                                            <Text className="text-white font-bold text-base">{'←'}</Text>
                                        </TouchableOpacity>

                                        {Array.from({ length: totalPages }, (_, i) => (
                                            <TouchableOpacity
                                                key={i}
                                                onPress={() => setPageIndex(i + 1)}
                                                activeOpacity={0.8}
                                                className={`rounded-lg px-4 py-2 mr-3 ${
                                                    pageIndex === i + 1 ? "bg-accent" : "bg-gray-700"
                                                }`}
                                            >
                                                <Text
                                                    className={`font-bold text-base ${
                                                        pageIndex === i + 1 ? "text-white" : "text-white"
                                                    }`}
                                                >
                                                    {i + 1}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}

                                        <TouchableOpacity
                                            disabled={pageIndex === totalPages}
                                            onPress={() => pageIndex < totalPages && setPageIndex(pageIndex + 1)}
                                            activeOpacity={0.8}
                                            className={`rounded-lg px-4 py-2 ${
                                                pageIndex === totalPages ? "bg-gray-500" : "bg-accent"
                                            }`}
                                        >
                                            <Text className="text-white font-bold text-base">{'→'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                            />
                        )}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
