import { View, TextInput, Image, TouchableOpacity } from "react-native";
import { icons } from "@/constants/icons";

interface Props {
    placeholder: string;
    value?: string;
    onChangeText?: (text: string) => void;
    onPress?: () => void;
    onSubmitEditing?: () => void;
}

const SearchBar = ({ placeholder, value, onChangeText, onPress, onSubmitEditing }: Props) => {
    const Input = (
        <TextInput
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitEditing}
            editable={!onPress}
            className="flex-1 ml-2 text-white"
            placeholderTextColor="#A8B5DB"
        />
    );

    return (
        <TouchableOpacity
            disabled={!onPress}
            activeOpacity={onPress ? 0.8 : 1}
            onPress={onPress}
        >
            <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">
                <Image
                    source={icons.search}
                    className="w-5 h-5"
                    resizeMode="contain"
                    tintColor="#AB8BFF"
                />
                {Input}
            </View>
        </TouchableOpacity>
    );
};

export default SearchBar;
