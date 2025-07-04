import React, {useState, useEffect, useMemo} from 'react';
import {
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    View
} from 'react-native';
import {useBasket} from '@/context/basketContext';
import {createOrder, getDeliveryMethods} from '@/controllers/orders/ordersController';
import {DeliveryMethod} from '@/models/orders/deliveryMethods';
import {Address} from '@/models/orders/adress';
import {OrderDto} from '@/models/orders/order';
import {Stack, useRouter} from 'expo-router';
import {useStripe} from '@stripe/stripe-react-native';
import {createOrUpdatePaymentIntent} from '@/controllers/payments/paymentscontroller';

export default function CheckoutScreen() {
    const {basket} = useBasket();
    const router = useRouter();
    const {initPaymentSheet, presentPaymentSheet} = useStripe();

    const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethod[]>([]);
    const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<number | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const [address, setAddress] = useState<Address>({
        firstName: '',
        lastName: '',
        street: '',
        city: '',
        zipcode: '',
    });

    useEffect(() => {
        (async () => {
            try {
                const methods = await getDeliveryMethods();
                setDeliveryMethods(methods);
                if (methods.length) setSelectedDeliveryMethod(methods[0].id);
            } catch {
                Alert.alert('Error', 'Could not load delivery methods');
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (!basket?.id || clientSecret) return;

            try {
                const updatedBasket = await createOrUpdatePaymentIntent(basket.id);
                if (updatedBasket.clientSecret) {
                    setClientSecret(updatedBasket.clientSecret);
                    const { error } = await initPaymentSheet({
                        paymentIntentClientSecret: updatedBasket.clientSecret,
                        merchantDisplayName: 'My Shop',
                    });
                    if (error) throw error;
                }
            } catch {
                Alert.alert('Error', 'Failed to initialize payment');
            }
        })();
    }, [basket]);

    const subtotal = useMemo(
        () => basket?.items.reduce((sum, i) => sum + i.price * i.quantity, 0) ?? 0,
        [basket]
    );

    const deliveryPrice = useMemo(() => {
        const method = deliveryMethods.find(m => m.id === selectedDeliveryMethod);
        return method ? method.price : 0;
    }, [deliveryMethods, selectedDeliveryMethod]);

    const total = useMemo(() => subtotal + deliveryPrice, [subtotal, deliveryPrice]);

    const validateAddress = () => {
        if (
            !address.firstName ||
            !address.lastName ||
            !address.street ||
            !address.city ||
            !address.zipcode
        ) {
            Alert.alert('Validation Error', 'Please fill out all address fields.');
            return false;
        }
        return true;
    };

    const handleCheckout = async () => {
        if (!basket?.id || !clientSecret) {
            Alert.alert('Error', 'Unable to process payment');
            return;
        }
        if (!selectedDeliveryMethod) {
            Alert.alert('Error', 'Please select a delivery method');
            return;
        }
        if (!validateAddress()) return;

        const { error } = await presentPaymentSheet();
        if (error) {
            Alert.alert('Payment Error', error.message);
            return;
        }

        const orderDto: OrderDto = {
            basketId: basket.id,
            deliveryMethodId: selectedDeliveryMethod,
            shipToAddress: address,
        };

        try {
            await createOrder(orderDto);
            Alert.alert('Success', 'Order Created and Paid Successfully!');
            router.push('/orders');
        } catch {
            Alert.alert('Error', 'There was a problem creating your order');
        }
    };

    return (
        <>
            <Stack.Screen options={{headerShown: false}}/>
            <KeyboardAvoidingView
                className="flex-1 bg-primary"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'center',
                        paddingHorizontal: 12,
                        paddingVertical: 14
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text className="text-white text-4xl font-bold my-6 text-center">Checkout</Text>

                    <Text className="text-white text-xl font-semibold mb-3">Shipping Address</Text>
                    {['firstName','lastName','street','city','zipcode'].map(field => (
                        <TextInput
                            key={field}
                            placeholder={field[0].toUpperCase() + field.slice(1)}
                            placeholderTextColor="#aaa"
                            value={address[field as keyof Address]}
                            onChangeText={t => setAddress({...address, [field]: t})}
                            className="bg-[#1c1c1e] text-white rounded-lg px-4 py-3 mb-5"
                        />
                    ))}

                    <Text className="text-white text-lg font-semibold my-3">Choose Delivery Method</Text>
                    <View className="mb-5">
                        {deliveryMethods.map(item => (
                            <TouchableOpacity
                                key={item.id}
                                className={`rounded-lg px-4 py-4 mb-3 ${
                                    selectedDeliveryMethod === item.id
                                        ? 'border-2 border-accent bg-dark-200'
                                        : 'bg-dark-200'
                                }`}
                                onPress={() => setSelectedDeliveryMethod(item.id)}
                                activeOpacity={0.8}
                            >
                                <Text className="text-white text-base font-bold">{item.shortName}</Text>
                                <Text className="text-gray-400 text-sm">{item.description}</Text>
                                <Text className="text-accent text-lg font-bold mt-1">
                                    ${item.price.toFixed(2)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View className="bg-dark-200 p-4 rounded-lg mb-24">
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-white">Subtotal</Text>
                            <Text className="text-white">${subtotal.toFixed(2)}</Text>
                        </View>
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-white">Delivery</Text>
                            <Text className="text-white">${deliveryPrice.toFixed(2)}</Text>
                        </View>
                        <View className="flex-row justify-between mt-2 border-t border-gray-700 pt-2">
                            <Text className="text-white font-bold">Total</Text>
                            <Text className="text-white font-bold">${total.toFixed(2)}</Text>
                        </View>
                    </View>
                </ScrollView>

                <View className="bg-primary px-5 py-4 border-t bottom-16 border-gray-700">
                    <TouchableOpacity
                        onPress={handleCheckout}
                        className="bg-accent rounded-xl py-4 items-center"
                    >
                        <Text className="text-white text-lg font-bold">Pay & Place Order</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </>
    );
}
