import {Link} from "expo-router";
import {View, Text, TouchableOpacity, Image} from "react-native";
import {images} from "@/constants/images";
import {MaskedView} from "@/node_modules/@react-navigation/elements/src/MaskedView";

const TrendingCard = ({product: {id, name, pictureUrl}, index}: TrendingCardProduct) => {

    if (!id) {
        console.warn("TrendingCard received product without ID:");
        return null;
    }

    return (
        // @ts-ignore
        <Link href={`products/${id}`} asChild>
            <TouchableOpacity
                className="items-center"
                style={{
                    width: 160,
                }}
            >
                <Image
                    source={{uri: pictureUrl}}
                    className="rounded-lg"
                    style={{
                        width: 150,
                        height: 150,
                    }}
                    resizeMode="cover"
                />

                <View className="absolute bottom-9 -left-3.5 px-2 py-1 rounded-full">
                    <MaskedView
                        maskElement={
                            <Text className="font-bold text-white text-6xl">{index + 1}</Text>
                        }
                    >
                        <Image
                            source={images.rankingGradient}
                            className="size-14"
                            resizeMode="cover"
                        />
                    </MaskedView>
                </View>

                <Text
                    className="text-sm font-bold mt-2 text-light-200"
                    numberOfLines={2}
                >
                    {name}
                </Text>
            </TouchableOpacity>
        </Link>
    );
};

export default TrendingCard;