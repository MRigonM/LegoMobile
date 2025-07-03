import {Stack} from "expo-router";
import './global.css'
import {StatusBar} from "react-native";
import {BasketProvider} from "@/context/basketContext";
import {GestureHandlerRootView} from "react-native-gesture-handler";

export default function RootLayout() {
    return (
        <>
            <GestureHandlerRootView style={{flex: 1}}>
                <BasketProvider>
                    <StatusBar hidden={true}/>
                    <Stack>
                        <Stack.Screen
                            name="(tabs)"
                            options={{headerShown: false}}
                        />
                        <Stack.Screen
                            name="products/[id]"
                            options={{headerShown: false}}
                        />
                    </Stack>
                </BasketProvider>
            </GestureHandlerRootView>
        </>
    )
}
