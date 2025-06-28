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
            console.log('Token from SecureStore:', token ? 'exists' : 'not found');

            if (token) {
                setIsAuthenticated(true);

                try {
                    const userJson = await SecureStore.getItemAsync('user_info');
                    if (userJson) {
                        const userObj = JSON.parse(userJson);
                        console.log('Loaded user from SecureStore:', userObj);
                        setUserName(userObj.displayName);
                    } else {
                        console.log('No user_info found in SecureStore');
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
        <View className="bg-primary flex-1 px-10">
            <View className="flex justify-center items-center flex-1 flex-col gap-5">
                <Image
                    source={icons.person}
                    className="size-10"
                    tintColor="#fff"
                />

                {isAuthenticated ? (
                    <>
                        <Text className="text-white text-lg">
                            Welcome {userName}!
                        </Text>

                        <TouchableOpacity
                            onPress={handleLogout}
                            className="bg-red-500 px-6 py-2 rounded-lg"
                        >
                            <Text className="text-white font-semibold">Logout</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <Text className="text-white text-lg text-center">
                            You are not logged in
                        </Text>

                        <TouchableOpacity
                            //@ts-ignore
                            onPress={() => router.push("login")}
                            className="bg-accent px-6 py-2 rounded-lg"
                        >
                            <Text className="text-white font-semibold">Login</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            //@ts-ignore
                            onPress={() => router.push("register")}
                            className="border border-white px-6 py-2 rounded-lg"
                        >
                            <Text className="text-white font-semibold">Register</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
};

export default Profile;
