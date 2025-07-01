import {View, TextInput, Text, Alert, TouchableOpacity} from "react-native";
import { useState } from "react";
import {Stack, useRouter} from "expo-router";
import {register} from "@/services/auth/authService";

export default function Register() {
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!displayName || !email || !password) {
            return Alert.alert("Validation", "Please fill in all fields.");
        }
        if (password.length < 6) {
            return Alert.alert("Validation", "Password must be at least 6 characters.");
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return Alert.alert("Validation", "Please enter a valid email.");
        }
        setLoading(true);
        try {
            const user = await register({displayName, email, password });
            router.replace("/(tabs)/profile");
        } catch (err: any) {
            Alert.alert("Register Failed", err.response?.data?.errors?.[0] || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />

            <View className="flex-1 bg-primary px-8 justify-center">
                <Text className="text-white text-3xl font-bold mb-8 text-center">
                    Register
                </Text>

                <TextInput
                    placeholder="Display name"
                    placeholderTextColor="#aaa"
                    value={displayName}
                    onChangeText={setDisplayName}
                    className="bg-[#1c1c1e] text-white rounded-lg px-4 py-3 mb-5"
                    autoCapitalize="none"
                />

                <TextInput
                    placeholder="Email"
                    placeholderTextColor="#aaa"
                    value={email}
                    onChangeText={setEmail}
                    className="bg-[#1c1c1e] text-white rounded-lg px-4 py-3 mb-5"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    placeholder="Password"
                    placeholderTextColor="#aaa"
                    value={password}
                    onChangeText={setPassword}
                    className="bg-[#1c1c1e] text-white rounded-lg px-4 py-3 mb-8"
                    secureTextEntry
                />

                <TouchableOpacity
                    onPress={handleRegister}
                    className="bg-accent rounded-xl py-4 items-center"
                    disabled={loading}
                >
                    <Text className="text-white text-lg font-bold">
                        {loading ? "Registering…" : "Register"}
                    </Text>
                </TouchableOpacity>
            </View>
        </>
    );
}
