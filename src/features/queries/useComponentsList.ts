import { useQuery } from "@tanstack/react-query";

export type Component = {
    id: number;
    siteid: number;
    categories: string;
    html: string;
    name: string;
    type: "Product" | "Element";
}

export type Category = {
    id: number;
    siteid: number;
    name: string;
}

export type ComponentsResponse = {
    success: boolean;
    components: Component[];
    session: string;
    domain: string;
    categories: Category[];
}

export const useComponentsList = () =>
    useQuery({
        queryKey: ['componentsList'],
        staleTime: Infinity,
        queryFn: async ()  => {
            const data = await fetch('/api/shop/components', {
                method: 'GET',
            })
                .then((response) => response.json())
                .then((data) => {
                return data as ComponentsResponse;
            });
            return data as ComponentsResponse;
        },
        enabled: true,
    });
