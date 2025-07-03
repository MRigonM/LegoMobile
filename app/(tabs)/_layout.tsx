import { Tabs } from "expo-router";
import { icons } from "@/constants/icons";
import { Image, ImageBackground, Text, View } from "react-native";
import { images } from "@/constants/images";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


const TabIcon = ({ focused, icon, title }: any) => {
    if (focused) {
        return (
            <ImageBackground
                source={images.highlight}
                className="flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden"
            >

            <Image source={icon} tintColor={"#151312"} className={"size-5"} />
                <Text className={"text-secondary text-base font-semibold ml-2"}>{title}</Text>
            </ImageBackground>
        );
    }
    return (
        <View className={"size-full justify-center items-center rounded-[50px] mt-4"}>
            <Image source={icon} tintColor={"#A8B5DB"} className={"size-5"} />
        </View>
    );
};

const _Layout = () => {
    useEffect(() => {
        const setupNotifications = async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== "granted") {
                console.log("Notification permissions not granted");
            }
        };

        setupNotifications();
    }, []);

    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarItemStyle: {
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                },
                tabBarStyle: {
                    backgroundColor: "#0f0D23",
                    borderRadius: 100,
                    marginHorizontal: 45,
                    marginBottom: 30,
                    height: 52,
                    position: "absolute",
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "#0f0D23",
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.home} title="Home" />
                    ),
                }}
            />
            <Tabs.Screen
                name="basket"
                options={{
                    title: "Cart",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.basket} title="Cart" />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.person} title="Profile" />
                    ),
                }}
            />
        </Tabs>
    );
};

export default _Layout;