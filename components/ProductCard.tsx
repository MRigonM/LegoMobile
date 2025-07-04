import { Product } from "@/models/product/product";
import { Link } from "expo-router";
import {Image, Text, TouchableOpacity, View} from "react-native";
import {icons} from "@/constants/icons";

const ProductCard = ({
                         id,
                         name,
                         description,
                         price,
                         pictureUrl,
                         productType,
                         productBrand,
                     }: Product) => {
    return (
        // @ts-ignore
        <Link href={`products/${id}`} asChild>
            <TouchableOpacity className="w-[48%] mb-3 mt-2">
                <Image
                    source={{ uri: pictureUrl }}
                    className="w-full rounded-lg"
                    style={{ aspectRatio: 1 }}
                    resizeMode="cover"
                />
                <Text className="text-sm font-bold text-white mt-2"
                        numberOfLines={1}>
                    {name}
                </Text>
                <View className={"flex-row items-center justify-between"}>
                    <Text className={"text-sm text-white font-medium mt-1"}>
                        {price}$
                    </Text>
                    <Text className={"text-xs font-medium text-light-300 uppercase"}>
                        {productBrand} • {productType}
                    </Text>
                </View>
            </TouchableOpacity>
        </Link>
    );
};

export default ProductCard;
