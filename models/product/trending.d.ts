interface TrendingCardProduct {
    product: TrendingProducts;
    index: number;
}

interface TrendingProducts {
    searchTerm: string;
    product_id : number;
    name : string;
    pictureUrl : string;
    count: number;
}