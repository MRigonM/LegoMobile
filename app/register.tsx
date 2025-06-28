import { View, TextInput, Button, Text, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
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
            console.log("Logged in:", user.displayName);
            router.replace("/(tabs)/profile");
        } catch (err: any) {
            console.error(err);
            Alert.alert("Register Failed", err.response?.data?.errors?.[0] || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-primary px-6 justify-center">
            <Text className="text-white text-2xl mb-6 text-center">Register</Text>
            <TextInput
                placeholder="Display Name"
                placeholderTextColor="#ccc"
                value={displayName}
                onChangeText={setDisplayName}
                className="bg-white rounded p-3 mb-4"
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Email"
                placeholderTextColor="#ccc"
                value={email}
                onChangeText={setEmail}
                className="bg-white rounded p-3 mb-4"
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Password"
                placeholderTextColor="#ccc"
                value={password}
                onChangeText={setPassword}
                className="bg-white rounded p-3 mb-6"
                secureTextEntry
            />
            <Button title={loading ? "Registering…" : "Register"} onPress={handleRegister} />
        </View>
    );
}
