import { Image, Text, View, TouchableOpacity } from "react-native";
import { icons } from "@/constants/icons";
import { useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';
import { useRouter } from "expo-router";
import {logout as logoutService} from "@/services/auth/authService";

const Profile = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = await SecureStore.getItemAsync('jwt_token');

            if (token) {
                setIsAuthenticated(true);

                try {
                    const userJson = await SecureStore.getItemAsync('user_info');
                    if (userJson) {
                        const userObj = JSON.parse(userJson);
                        setUserName(userObj.displayName);
                    } else {
                        setUserName(null);
                    }

                } catch (error) {
                    console.error("Error fetching user from store:", error);
                    setIsAuthenticated(false);
                    setUserName(null);
                }
            } else {
                setIsAuthenticated(false);
                setUserName(null);
            }
        };

        checkAuth();
    }, []);


    const handleLogout = async () => {
        await logoutService();
        setIsAuthenticated(false);
        setUserName(null);
    };

    return (
        <View className="flex-1 bg-primary px-8 py-12">
            <View className="flex-1 justify-center items-center">
                {!isAuthenticated ? (
                    <View className="w-full items-center">
                        <Text className="text-white text-2xl font-bold text-center mb-8">
                            Already a member? Sign in!
                        </Text>

                        <View className="w-full">
                            <TouchableOpacity
                                //@ts-ignore
                                onPress={() => router.push("login")}
                                className="bg-accent w-full py-4 rounded-xl items-center mb-4"
                            >
                                <Text className="text-white text-lg font-bold">Login</Text>
                            </TouchableOpacity>

                            <Text className="text-white text-lg text-center mb-4">or</Text>

                            <TouchableOpacity
                                //@ts-ignore
                                onPress={() => router.push("register")}
                                className="border border-white w-full py-4 rounded-xl items-center"
                            >
                                <Text className="text-white text-lg font-bold">Register</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View className="w-full items-center">
                        <Text className="text-white text-2xl font-bold text-center mb-4">
                            Welcome, {userName}!
                        </Text>
                        <Text className="text-white text-base text-center opacity-80 mb-8">
                            Manage your account settings and preferences.
                        </Text>

                        <TouchableOpacity
                            onPress={handleLogout}
                            className="bg-red-500 w-full py-4 rounded-xl items-center"
                        >
                            <Text className="text-white text-lg font-bold">Logout</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

export default Profile;
