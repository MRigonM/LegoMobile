import {
    TextInput,
    Text,
    Alert,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { useState } from "react";
import {Stack, useRouter } from "expo-router";
import {login} from "@/controllers/auth/authController";
import { showLocalNotification } from "@/controllers/notification";

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

            await showLocalNotification("Login Successful", `Welcome back, ${user.displayName}!`);

            router.replace("/(tabs)/profile");
        } catch (err: any) {
            console.error(err);
            Alert.alert("Login Failed", err.response?.data?.errors?.[0] || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />

            <KeyboardAvoidingView
                className="flex-1 bg-primary"
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 12, paddingVertical: 14 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text className="text-white text-3xl font-bold mb-8 text-center">
                        Login to Your Account
                    </Text>

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
                        onPress={handleLogin}
                        className="bg-accent rounded-xl py-4 items-center"
                        disabled={loading}
                    >
                        <Text className="text-white text-lg font-bold">
                            {loading ? "Logging in…" : "Login"}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
}
