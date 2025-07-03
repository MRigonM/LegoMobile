import {ActivityIndicator, FlatList, Image, ScrollView, Text, View, Keyboard, TouchableOpacity} from "react-native";
import {useCallback, useEffect, useState} from "react";
import {useFocusEffect, useNavigation, useRouter} from "expo-router";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import SearchBar from "@/components/searchBar";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/models/product/product";
import {getAllProducts, getProductBrands, getProductTypes, searchProducts} from "@/controllers/product/productController";
import {getTrendingProducts, updataeSearchCount} from "@/controllers/appwrite";
import useFetch from "@/controllers/useFetch";
import TrendingCard from "@/components/TrendingCard";
import Dropdown from "@/components/Dropdown";
import * as Notifications from "expo-notifications";

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
    const sortOptions = [
        { value: "name", label: "Name" },
        { value: "priceAsc", label: "Price ↑" },
        { value: "priceDesc", label: "Price ↓" },
    ];

    const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
    const [types, setTypes] = useState<{ id: number; name: string }[]>([]);

    const [selectedBrand, setSelectedBrand] = useState<number>(0);
    const [selectedType, setSelectedType] = useState<number>(0);
    const [selectedSort, setSelectedSort] = useState<string>("name");

    const handleRefresh = async () => {
        setLoading(true);
        try {
            const result = await getAllProducts({
                pageIndex: 1,
                pageSize,
                sort: selectedSort,
                brandId: selectedBrand === 0 ? undefined : selectedBrand,
                typeId: selectedType === 0 ? undefined : selectedType,
            });
            setProducts(result.data);
            setTotalCount(result.count);
            setPageIndex(1);
            setSubmittedQuery("");
            setSearchQuery("");
            setFilteredProducts([]);
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (Array.isArray(trendingProducts) && trendingProducts.length > 0) {

            Notifications.scheduleNotificationAsync({
                content: {
                    title: "Trending Legos!",
                    body: `There are ${trendingProducts.length} hot items right now. Check them out!`,
                },
                // @ts-ignore
                trigger: { seconds: 1 },
            });
        }
        // @ts-ignore
    }, [trendingProducts]);


    useFocusEffect(
        useCallback(() => {
            // @ts-ignore
            const unsubscribe = navigation.addListener("tabPress", (e) => {
                if (navigation.isFocused()) {
                    handleRefresh();
                }
            });

            return unsubscribe;
        }, [navigation, selectedBrand, selectedType, selectedSort])
    );

    const {
        data: trendingProducts,
        loading: trendingLoading,
        error: trendingError,
    } = useFetch(getTrendingProducts);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const result = await getAllProducts({
                    pageIndex,
                    pageSize,
                    brandId: selectedBrand === 0 ? undefined : selectedBrand,
                    typeId: selectedType === 0 ? undefined : selectedType,
                    sort: selectedSort,
                });
                setProducts(result.data);
                setTotalCount(result.count);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        if (!submittedQuery.trim()) {
            fetchProducts();
        }
    }, [pageIndex, selectedBrand, selectedType, selectedSort]);

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

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [brandsData, typesData] = await Promise.all([
                    getProductBrands(),
                    getProductTypes(),
                ]);

                setBrands([{ id: 0, name: 'All Brands' }, ...brandsData]);
                setTypes([{ id: 0, name: 'All Types' }, ...typesData]);
            } catch (error: any) {
                throw error;
            }
        };

        fetchFilters();
    }, []);

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
                                        }}
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

                                <Text className="text-lg text-white font-bold mt-3 mb-3">
                                    All Legos
                                </Text>
                            </View>
                        )}

                        {!submittedQuery && (
                            <View className="my-3 flex-row justify-between gap-3">
                                {/* Left: Sort Dropdown */}
                                <View className="flex-1">
                                    <Dropdown
                                        options={sortOptions.map((s, i) => ({ id: i, name: s.label }))}
                                        selectedId={sortOptions.findIndex((s) => s.value === selectedSort)}
                                        onSelect={(id: any) => {
                                            setSelectedSort(sortOptions[id].value);
                                            setPageIndex(1);
                                        }}
                                        placeholder="Sort"
                                    />
                                </View>

                                {/* Right: Brand & Type Dropdowns stacked vertically */}
                                <View className="flex-1">
                                    <Dropdown
                                        options={brands}
                                        selectedId={selectedBrand}
                                        onSelect={(id: any) => {
                                            setSelectedBrand(id);
                                            setPageIndex(1);
                                        }}
                                        placeholder="Brand"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Dropdown
                                        options={types}
                                        selectedId={selectedType}
                                        onSelect={(id: any) => {
                                            setSelectedType(id);
                                            setPageIndex(1);
                                        }}
                                        placeholder="Type"
                                    />
                                </View>
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
                                nestedScrollEnabled={true}
                                ListFooterComponent={
                                    <View className="mb-28 mt-5 flex-row justify-center items-center px-5">
                                        <TouchableOpacity
                                            disabled={pageIndex === 1}
                                            onPress={() => setPageIndex(pageIndex - 1)}
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
                                                <Text className="text-white font-bold text-base">
                                                    {i + 1}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}

                                        <TouchableOpacity
                                            disabled={pageIndex === totalPages}
                                            onPress={() => setPageIndex(pageIndex + 1)}
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
