import React, { useState, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Dimensions,
} from "react-native";

type Option = { id: number; name: string };

interface DropdownProps {
    options: Option[];
    selectedId: number;
    onSelect: (id: number) => void;
    placeholder: string;
}

export default function Dropdown({
                                     options,
                                     selectedId,
                                     onSelect,
                                     placeholder,
                                 }: DropdownProps) {
    const [expanded, setExpanded] = useState(false);
    const [buttonY, setButtonY] = useState(0);

    const selectedOption = options.find((opt) => opt.id === selectedId);

    return (
        <View
            className="mb-2"
            onLayout={(e) => {
                const { y } = e.nativeEvent.layout;
                setButtonY(y);
            }}
        >
            <TouchableOpacity
                onPress={() => setExpanded(!expanded)}
                className="bg-gray-700 px-3 py-2 rounded-md flex-row justify-between items-center"
                activeOpacity={0.8}
            >
                <Text className="text-white text-sm">
                    {selectedOption ? selectedOption.name : placeholder}
                </Text>
                <Text className="text-white text-sm">{expanded ? "↑" : "↓"}</Text>
            </TouchableOpacity>

            {expanded && (
                <View
                    style={[
                        styles.dropdown,
                    ]}
                >
                    <ScrollView
                        style={{ maxHeight: 160 }}
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                    >
                        {options.map((item, index) => (
                            <TouchableOpacity
                                key={item.id.toString()}
                                onPress={() => {
                                    onSelect(item.id);
                                    setExpanded(false);
                                }}
                                className={`px-3 py-2 ${
                                    item.id === selectedId ? "bg-accent" : "bg-gray-800"
                                }`}
                            >
                                <Text
                                    className={`text-sm ${
                                        item.id === selectedId ? "text-white" : "text-gray-300"
                                    }`}
                                >
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    dropdown: {
        position: "absolute",
        left: 0,
        right: 0,
        backgroundColor: "#1f2937", // tailwind bg-gray-800
        borderRadius: 12, // Increased for more rounded corners
        zIndex: 9999,
        elevation: 5,
        overflow: 'hidden', // This ensures the rounded corners are respected
    },
});