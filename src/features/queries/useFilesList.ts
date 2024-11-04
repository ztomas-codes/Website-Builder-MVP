import { CustomerResponse } from '@/app/api/account/customers/route';
import { Order } from '@/app/api/account/orders/route';
import { useQuery } from '@tanstack/react-query';

type FileResponse = {
    success: boolean;
    files: File[];
};

export type File = {
    name: string;
    type: string;
    content: string;
    id: number;
    order: number;
}

export const useFilesList = () =>
    useQuery({
        queryKey: ['filesList'],
        staleTime: Infinity,
        queryFn: async ()  => {
            const data = await fetch('/api/shop/files', {
                method: 'GET',
            })
                .then((response) => response.json())
                .then((data) => {
                return data as FileResponse;
            });
            return data as FileResponse;
        },
        enabled: true,
    });
