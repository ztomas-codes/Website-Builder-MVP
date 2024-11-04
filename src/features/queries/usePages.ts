import { useQuery } from '@tanstack/react-query';

export type Page = {
    description: string;
    html: string;
    slug: string;
    name: string;
    id: number;
}

export type PagesRequest = {
    pages: Page[];
    success: boolean;
    domain: string;
    session: string;
}

export const usePages = () =>
    useQuery({
        queryKey: ['pagesInfo'],
        staleTime: Infinity,
        queryFn: async ()  => {
            const data = await fetch('/api/shop/pages', {
                method: 'GET',
            })
                .then((response) => response.json())
                .then((data) => {
                return data as PagesRequest;
            });
            return data as PagesRequest;
        },
        enabled: true,
    });
