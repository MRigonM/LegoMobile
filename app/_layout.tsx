import {Stack} from "expo-router";
import './global.css'
import {LogBox, StatusBar} from "react-native";
import {BasketProvider} from "@/context/basketContext";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {StripeProvider} from "@stripe/stripe-react-native";

LogBox.ignoreLogs([
    'No task registered for key StripeKeepJsAwakeTask'
]);
export default function RootLayout() {
    return (
        <>
        <StripeProvider publishableKey="pk_test_51PwlxeLW43tbnmFgwZDOPzXWjAOquKvIk5bmzSmb17jpE3B0oDGa2WCdBtSCMrxcxYxDZzwVdfrUHTv0S5BS1Bvx00x9gjRjdf">
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
        </StripeProvider>
        </>
    )
}
