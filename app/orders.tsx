import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    Image,
    Platform,
    KeyboardAvoidingView,
    TouchableOpacity,
} from 'react-native';
import { getUserOrders } from '@/controllers/orders/ordersController';
import { Stack, useRouter } from 'expo-router';
import { OrderDtoSimple } from '@/ViewModels/orders/orderToReturn';

export default function OrdersScreen() {
    const [orders, setOrders] = useState<OrderDtoSimple[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            try {
                const data = await getUserOrders();
                setOrders(data);
            } catch {
                // Handle error (e.g., show alert)
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-primary">
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <KeyboardAvoidingView
                className="relative flex-1 bg-primary"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    className="flex-1 bg-primary p-4 pt-5 pb-32 mb-6"
                    keyboardShouldPersistTaps="handled"
                >
                    <Text className="text-white text-3xl font-bold my-6">My Orders</Text>

                    {orders.length === 0 && (
                        <Text className="text-white text-center mb-8">You have no orders.</Text>
                    )}

                    {orders.map(order => {
                        const total = order.orderItems.reduce(
                            (sum, item) => sum + item.price * item.quantity,
                            0
                        );

                        return (
                            <View
                                key={order.id}
                                className="bg-dark-200 rounded-xl mb-5 p-4 border border-gray-700"
                            >
                                <Text className="text-accent font-bold text-lg mb-1">
                                    Order #{order.id}
                                </Text>

                                {order.orderItems.map((item, index) => (
                                    <View key={index} className="flex-row items-center mt-2">
                                        <Image
                                            source={{ uri: item.pictureUrl }}
                                            className="w-12 h-12 rounded mr-3"
                                        />
                                        <View className="flex-1">
                                            <Text className="text-white font-semibold">
                                                {item.productName}
                                            </Text>
                                            <Text className="text-gray-400 text-sm">
                                                ${item.price.toFixed(2)} × {item.quantity}
                                            </Text>
                                        </View>
                                    </View>
                                ))}

                                <View className="mt-3 border-t border-gray-700 pt-2">
                                    <Text className="text-white font-bold">
                                        Total: ${total.toFixed(2)}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>

                <View className="bg-primary px-5 py-4 border-t bottom-8 mt-4 border-gray-700">
                    <TouchableOpacity
                        onPress={() => router.push('/profile')}
                        className="bg-accent px-6 py-3 rounded-xl mt-4"
                    >
                        <Text className="text-white text-center text-lg font-bold">
                            Go to Profile
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </>
    );
}