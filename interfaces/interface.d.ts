interface TrendingCardProduct {
    product: TrendingProducts;
    index: number;
}

interface TrendingProducts {
    searchTerm: string;
    id : number;
    name : string;
    pictureUrl : string;
    count: number;
}