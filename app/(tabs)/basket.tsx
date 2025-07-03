import {
    FlatList,
    Image,
    Text,
    View,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { icons } from "@/constants/icons";
import { useBasket } from "@/context/basketContext";
import { BasketItem } from "@/models/basket/basket";
import { useRouter } from "expo-router";
import Icon from 'react-native-vector-icons/MaterialIcons';

const BasketItemCard = ({ item }: { item: BasketItem }) => {
    const { removeItem, updateQuantity } = useBasket();

    const confirmDelete = () => {
        Alert.alert("Remove item", "Are you sure you want to remove this item?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Remove",
                style: "destructive",
                onPress: () => removeItem(item.id),
            },
        ]);
    };

    return (
        <View className="flex-row items-center p-4 mb-4 rounded-xl" style={{ backgroundColor: "#151312" }}>
            <Image
                source={{ uri: item.pictureUrl }}
                className="w-36 h-36 rounded-lg"
                resizeMode="cover"
            />
            <View className="flex-1 ml-4">
                <Text className="text-white font-bold text-2xl">{item.productName}</Text>
                <Text className="text-gray-400 text-xs">{item.brand} • {item.type}</Text>
                <Text className="text-white font-semibold text-xl mt-1">
                    {item.price}$
                </Text>

                <View className="flex-row mt-3 items-center space-x-2">
                    <TouchableOpacity
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                        className="bg-accent w-9 h-9 rounded-lg justify-center items-center"
                    >
                        <Text className="text-white text-lg font-bold">+</Text>
                    </TouchableOpacity>

                    <View className="w-12 h-12 rounded-lg justify-center items-center">
                        <Text className="text-white text-xl font-bold">{item.quantity}</Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                        className="bg-accent w-9 h-9 rounded-lg justify-center items-center"
                    >
                        <Text className="text-white text-lg font-bold">−</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={confirmDelete}
                        className="ml-auto px-4 py-3 flex-row items-center"
                    >
                        <Icon name="delete" size={29} color="red" style={{ marginRight: 6 }} />
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
};

const Basket = () => {
    const { basket } = useBasket();
    const router = useRouter();

    const total = basket?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;

    return (
        <KeyboardAvoidingView
            className="bg-primary flex-1"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View className="flex-1 px-5 pt-10">
                <Text className="text-white text-2xl font-bold mb-5">Cart</Text>


                {basket?.items.length ? (
                    <>
                        <FlatList
                            data={basket.items}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => <BasketItemCard item={item} />}
                            contentContainerStyle={{ paddingBottom: 200 }}
                            showsVerticalScrollIndicator={false}
                        />
                    </>
                ) : (
                    <View className="flex justify-center items-center flex-1">
                        <Image source={icons.basket} className="size-10 mb-3" tintColor="#fff" />
                        <Text className="text-gray-500 text-base">Your basket is empty</Text>
                    </View>
                )}
            </View>

            {basket?.items && basket.items.length > 0 && (
                <View className="bg-primary px-5 py-4 border-t bottom-24 border-gray-700">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-white text-lg font-semibold">Total:</Text>
                        <Text className="text-white text-xl font-bold">{total.toFixed(2)}$</Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => router.push("/checkout")}
                        className="bg-accent rounded-lg py-4 flex items-center mb-3"
                    >
                        <Text className="text-white font-bold text-xl">Go to Checkout</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push("/")}
                        className="flex items-center my-2"
                    >
                        <Text className="text-gray-400 text-base underline">Continue Shopping</Text>
                    </TouchableOpacity>

                </View>
            )}
        </KeyboardAvoidingView>
    );
};

export default Basket;