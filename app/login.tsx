import { View, TextInput, Button, Text, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import {login} from "@/services/auth/authService";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            return Alert.alert("Validation", "Please enter email and password.");
        }
        setLoading(true);
        try {
            const user = await login({ email, password });
            console.log("Logged in:", user.displayName);
            router.replace("/(tabs)/profile");
        } catch (err: any) {
            console.error(err);
            Alert.alert("Login Failed", err.response?.data?.errors?.[0] || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-primary px-6 justify-center">
            <Text className="text-white text-2xl mb-6 text-center">Login</Text>
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
            <Button title={loading ? "Logging in…" : "Login"} onPress={handleLogin} />
        </View>
    );
}
