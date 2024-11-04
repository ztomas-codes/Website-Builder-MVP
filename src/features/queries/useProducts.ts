import { useQuery } from '@tanstack/react-query';

export type Product = {
    category_id: number;
    name: string;
    cost: number;
    visible: boolean;
    image: string;
    description: string;
    id: number;
}

export type Category = {
    name: string;
    id: number;
}

export type ProductRequest = {
    products: Product[];
    success: boolean;
    categories: Category[];
}

export const useProducts = () =>
    useQuery({
        queryKey: ['productsInfo'],
        staleTime: Infinity,
        queryFn: async ()  => {
            const data = await fetch('/api/shop/products', {
                method: 'GET',
            })
                .then((response) => response.json())
                .then((data) => {
                return data as ProductRequest;
            });
            return data as ProductRequest;
        },
        enabled: true,
    });
